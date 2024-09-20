import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../../styles/newCreature.module.scss';

const NewCreature = () => {
  const { data: session, status } = useSession();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('dragón');
  const [nivelDePoder, setNivelDePoder] = useState(1);
  const [entrenada, setEntrenada] = useState<'Sí' | 'No'>('No');  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  
  const router = useRouter();

   
  useEffect(() => {
    console.log("AccessToken: ", session?.accessToken);
  }, [session]);

   
  const userRole = session?.user?.role;
  const backgroundImageClass = userRole === 'Maestro'
    ? styles['teacher-image']
    : styles['caregiver-image'];

  const profilePath = userRole === 'Maestro'
    ? '/roles/teacher'
    : '/roles/caregiver';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  
    setSuccessMessage('');  
    
    if (!session) {
      setError('Sesión no encontrada');
      return;
    }

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      setError('Token de acceso no encontrado');
      return;
    }

    try {
      const response = await fetch('/api/creatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          nombre,
          tipo,
          nivelDePoder,
          entrenada,  
          usuarioId: session.user.id,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Criatura registrada con éxito');  
           
        setTimeout(() => {
          router.push('/creatures');
        }, 3000);  
      } else {
        const data = await response.json();
        setError(data.message || 'Error al crear la criatura');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    }
  };

  if (status === 'loading') return <p>Cargando...</p>;
  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className={styles['new-creature-container']}>
      <div className={backgroundImageClass}></div>
      <div className={styles['caregiver-content']}>
        <div className={styles['nav-container']}>
          <h1 className={styles['title']}>El Santuario</h1>
          <div className={styles['nav-buttons']}>
            <button onClick={() => router.push('/creatures')}>Mis Criaturas</button>
            <button onClick={() => router.push(profilePath)}>Mi Perfil</button>
            <button onClick={() => router.push('/auth/login')}>Cerrar sesión</button>
          </div>
        </div>
        <h2 className={styles['title2']}>Mis Criaturas</h2>
        <p className={styles['text']}>
          Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una tiene habilidades únicas y características especiales.
        </p>
        <h3 className={styles['title3']}>Creador de criaturas mágicas</h3>
        <div className={styles['creature-form-container']}>
          <form onSubmit={handleSubmit} className={styles['creature-form']}>
            <label>
              Nombre mágico de la criatura
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className={styles['input']}
              />
            </label>
            <label>
              Tipo de criatura
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={styles['input']}>
                {['dragón', 'fénix', 'golem', 'vampiro', 'unicornio'].map((creatureType) => (
                  <option key={creatureType} value={creatureType}>
                    {creatureType}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nivel de poder
              <input
                type="number"
                min="1"
                max="100"
                value={nivelDePoder}
                onChange={(e) => setNivelDePoder(Number(e.target.value))}
                required
                className={styles['input']}
              />
            </label>
            <label>
              ¿Entrenada?
              <select 
                value={entrenada} 
                onChange={(e) => setEntrenada(e.target.value as 'Sí' | 'No')}
                className={styles['input']}
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </label>
            <button type="submit" className={styles['submit-button']}>Registrar Criatura</button>
          </form>
        </div>
        {  }
        {successMessage && <div className={styles['success-message']}>{successMessage}</div>}
        {error && <div className={styles['error-message']}>{error}</div>}
      </div>
    </div>
  );
};

export default NewCreature;
