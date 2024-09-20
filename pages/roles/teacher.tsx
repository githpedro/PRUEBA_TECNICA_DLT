 
import { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/teacher.module.scss';  
import dbConnect from '../../lib/mongodb';

interface TeacherDashboardProps {
  user: {
    nombre: string;
    email: string;
    role: string;
  };
}

const TeacherDashboard = ({ user }: TeacherDashboardProps) => {
  const router = useRouter();

  const handleViewCreatures = () => {
    router.push('/creatures');
  };

  return (
    <div className={styles['teacher-container']}>
      {  }
      <div className={styles['teacher-image']}></div>

      {  }
      <div className={styles['teacher-content']}>
        {  }
        <div className={styles['header-container']}>
          <h1 className={styles['title']}>El Santuario</h1>
          <div className={styles['nav-buttons']}>
            <button onClick={handleViewCreatures}>Mis Criaturas</button>
            <button onClick={() => router.push('/roles/teacher')}>Mi Perfil</button> {  }
            <button onClick={() => signOut()}>Cerrar sesión</button>
          </div>
        </div>

        {  }
        <h2 className={styles['title2']}>Mi Perfil</h2>
        <p className={styles['text']}>
          Este es el lugar donde podrás gestionar, actualizar y personalizar la información
          de tu perfil.
        </p>

        <label className={styles['label']}>Nombre Mágico</label>
        <input className={styles['input']} type="text" value={user.nombre} disabled />

        <label className={styles['label']}>Correo Mágico</label>
        <input className={styles['input']} type="text" value={user.email} disabled />

        <label className={styles['label']}>Rol</label>
        <input className={styles['input']} type="text" value={user.role} disabled />

        <label className={styles['label']}>Descripción</label>
        <textarea
          className={styles['textarea']}
          value="Soy Jaime el Valiente, maestro en el arte de invocar y dominar criaturas. En mis partidas, cada criatura tiene una historia, un propósito, y un papel crucial en las épicas aventuras. Desde dragones imponentes hasta criaturas misteriosas de los bosques."
          disabled
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const user = {
    nombre: session.user.name || 'Usuario Anónimo',  
    email: session.user.email,
    role: session.user.role,
  };

  return {
    props: {
      user,  
    },
  };
};

export default TeacherDashboard;
