import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../lib/mongodb';
import Creature, { ICreature } from '../../models/creature';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface Props {
  creature: ICreature;
}

const EditCreature = ({ creature }: Props) => {
  const [nombre, setNombre] = useState(creature.nombre);
  const [tipo, setTipo] = useState(creature.tipo);
  const [nivelDePoder, setNivelDePoder] = useState(creature.nivelDePoder);
  const [entrenada, setEntrenada] = useState<'Sí' | 'No'>('No');  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/creatures/${creature._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          tipo,
          nivelDePoder,
          entrenada,  
        }),
      });
      if (response.ok) {
        router.push('/creatures');
      } else {
        console.error('Error al actualizar la criatura');
      }
    } catch (err) {
      console.error('Error al procesar la solicitud', err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input 
          type="text" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
        />
      </label>
      <label>
        Tipo:
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {['dragón', 'fénix', 'golem', 'vampiro', 'unicornio'].map(creatureType => (
            <option key={creatureType} value={creatureType}>{creatureType}</option>
          ))}
        </select>
      </label>
      <label>
        Nivel de Poder:
        <input 
          type="number" 
          value={nivelDePoder} 
          onChange={(e) => setNivelDePoder(Number(e.target.value))} 
        />
      </label>
      <label>
        ¿Entrenada?
        <select 
          value={entrenada} 
          onChange={(e) => setEntrenada(e.target.value as 'Sí' | 'No')}
        >
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </label>
      <button type="submit">Actualizar</button>
    </form>
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
  const creature = await Creature.findById(context.query.id).lean();

  if (!creature) {
    return {
      notFound: true,  
    };
  }
  
  return {
    props: {
      creature: JSON.parse(JSON.stringify(creature)),
    },
  };
};

export default EditCreature;
