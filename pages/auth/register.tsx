import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../../styles/register.module.scss';   

export default function Register() {
  const [nombre, setNombre] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Cuidador");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    setSuccessMessage(""); 

     
    if (!nombre || !email || !password || !role) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Formato de correo electrónico no válido");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      const res = await fetch("/api/auth/registerApi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, role }),
      });

      if (res.ok) {
        setSuccessMessage("Usuario registrado correctamente. ¡Bienvenido!");
        setTimeout(() => router.push("/auth/login"), 2000); 
      } else {
        const data = await res.json();
        if (data.message.includes("usuario ya existe")) {
          setError("El correo ya está registrado. Intenta con otro correo.");
        } else {
          setError(data.message || "Error al registrar el usuario");
        }
      }
    } catch (error) {
      setError("Hubo un problema con la conexión al servidor.");
    }
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['register-image']}></div> 
      <div className={styles['register-form-container']}>
        <form className={styles['register-form']} onSubmit={handleRegister}>
          <h1>Únete al Santuario</h1>
          <p>Elige si serás un cuidador o maestro de criaturas. Completa los detalles para comenzar</p>

          <label>Nombre mágico</label>
          <input
            type="text"
            placeholder="Introduce tu nombre mágico"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Correo mágico</label>
          <input
            type="email"
            placeholder="tunombre@bestiario.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Cuidador">Cuidador</option>
            <option value="Maestro">Maestro</option>
          </select>

          <label>Palabra mágica</label>
          <input
            type="password"
            placeholder="Introduce tu palabra mágica"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">Registrarme en el Santuario</button>

          <p className={styles['account']}> 
            ¿Tienes cuenta?{" "} 
            <span onClick={() => router.push("/auth/login")}>Inicia sesión en el refugio</span> 
          </p>
          {error && <div className={styles['error-message']}>{error}</div>}
          {successMessage && <div className={styles['success-message']}>{successMessage}</div>}
        </form>
      </div>
    </div>
  );
}
