import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../../styles/login.module.scss';   
import Link from 'next/link';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");  

    try {
      const res = await signIn("credentials", { 
        redirect: false, 
        email, 
        password 
      });

      if (res?.error) {
        setError(res.error || "Error al iniciar sesión.");
      } else if (res?.ok) {
        const session = await getSession();

        if (!session) {
          setError("Error al obtener la sesión.");
        } else {
           
          if (session.user?.role === "Maestro") {
            router.push("/roles/teacher");
          } else if (session.user?.role === "Cuidador") {
            router.push("/roles/caregiver");
          } else {
            router.push("/creatures");
          }
        }
      } else {
        setError("Error inesperado.");
      }
    } catch (err) {
      setError("Error en la solicitud. Intenta nuevamente.");
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-image']}></div>
      <div className={styles['login-form-container']}>
        <form className={styles['login-form']} onSubmit={handleSubmit}>
          <h1>Inicia sesión</h1>
          <p>Para acceder a la colección de criaturas mágicas. Sólo los maestros y los cuidadores reconocidos pueden entrar</p>

          <label>Correo mágico</label>
          <input
            type="email"
            placeholder="tunombre@santuario.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Palabra mágica</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Acceder al Santuario</button>

          <p className={styles['account']}>
            ¿No tienes cuenta? <Link href="/auth/register">Regístrate como maestro o cuidador</Link>
          </p>

          {  }
          {error && <div className={styles['error-message']}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
