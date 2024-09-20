import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../lib/mongodb';
import Creature, { ICreature } from '../../models/creature'; 

interface Creature {
  _id: string;
  nombre: string;
  tipo: string;
  nivelDePoder: number;
  entrenada: 'Sí' | 'No';  
  usuarioId: string;
}

const CreatureDetails = ({ creature }: { creature: Creature }) => {
  return (
    <div>
      <h1>{creature.nombre}</h1>
      <p>Tipo: {creature.tipo}</p>
      <p>Nivel de Poder: {creature.nivelDePoder}</p>
      <p>Entrenada: {creature.entrenada}</p> {  }
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

  if (!context.params || !context.params.id) {
    return {
      notFound: true,
    };
  }

  await dbConnect();

  const creature = await Creature.findById(context.params.id).lean().exec() as ICreature | null;

  if (!creature || !creature.usuarioId || creature.usuarioId.toString() !== session.user.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      creature: JSON.parse(JSON.stringify(creature)),
    },
  };
};

export default CreatureDetails;
