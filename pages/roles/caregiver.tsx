import { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import dbConnect from '../../lib/mongodb';
import Creature from '../../models/creature';
import styles from '../../styles/caregiver.module.scss';  

interface ICreature {
  _id: string;
  nombre: string;
  tipo: string;
  nivelDePoder: number;
  usuarioId: string;
}

interface CaregiverDashboardProps {
  user: {
    nombre: string;
    email: string;
    role: string;
  };
  criaturasDelUsuario: ICreature[];
}

const CaregiverDashboard = ({ user, criaturasDelUsuario }: CaregiverDashboardProps) => {
  const router = useRouter();

  const handleViewCreatures = () => {
    router.push('/creatures');
  };

  return (
    <div className={styles['caregiver-container']}>
      {  }
      <div className={styles['caregiver-image']}></div>

      {  }
      <div className={styles['caregiver-content']}>
        {  }
        <div className={styles['nav-container']}>
          <h1 className={styles['title']}>El Santuario</h1>
          <div className={styles['nav-buttons']}>
            <button onClick={handleViewCreatures}>Mis Criaturas</button>
            <button onClick={() => router.push('/roles/caregiver')}>Mi Perfil</button>
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
          value="Soy un guardián del bosque y protector de criaturas mágicas. Dedico mi vida a cuidar seres fantásticos."
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

  const criaturasDelUsuario = await Creature.find({ usuarioId: session.user.id }).lean();
  
   
  const userRole = session.user.role || 'Cuidador';  

  const user = {
    nombre: session.user.name || 'Usuario Anónimo',
    email: session.user.email || 'Correo no disponible',
    role: userRole,
  };

  const criaturasDelUsuarioSerializadas = criaturasDelUsuario.map((criatura) => ({
    ...criatura,
    _id: criatura._id ? criatura._id.toString() : '',
    usuarioId: criatura.usuarioId ? criatura.usuarioId.toString() : '',
  }));

  return {
    props: {
      user,   
      criaturasDelUsuario: criaturasDelUsuarioSerializadas,
    },
  };
};


export default CaregiverDashboard;
