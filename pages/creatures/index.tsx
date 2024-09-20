import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../lib/mongodb';
import Creature from '../../models/creature';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/myCreatures.module.scss';

interface Props {
  creatures: Creature[];
  userRole: 'Maestro' | 'Cuidador';
}

interface Creature {
  _id: string;
  nombre: string;
  tipo: string;
  nivelDePoder: number;
  entrenada: 'Sí' | 'No';   
}

const CreaturesPage = ({ creatures, userRole }: Props) => {
  const [creatureList, setCreatureList] = useState<Creature[]>(creatures);
  const [filteredCreatures, setFilteredCreatures] = useState<Creature[]>(creatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [nombre, setNombre] = useState<{ [key: string]: string }>({});
  const [tipo, setTipo] = useState<{ [key: string]: string }>({});
  const [nivelDePoder, setNivelDePoder] = useState<{ [key: string]: number }>({});
  const [entrenada, setEntrenada] = useState<{ [key: string]: 'Sí' | 'No' }>({});   
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const backgroundImageClass = userRole === 'Maestro'
    ? styles['teacher-image']
    : styles['caregiver-image'];

  const profilePath = userRole === 'Maestro'
    ? '/roles/teacher'
    : '/roles/caregiver';

  const handleDelete = async (id: string) => {
    if (userRole !== 'Maestro') {
      alert('Solo los Maestros pueden eliminar criaturas.');
      return;
    }

    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta criatura?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/creatures/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedList = creatureList.filter(creature => creature._id !== id);
        setCreatureList(updatedList);
        filterCreatures(updatedList, searchTerm, selectedType);
        setSuccessMessage('Criatura eliminada exitosamente');
      } else {
        setError('Error al eliminar la criatura');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCreatures(creatureList, value, selectedType);
  };

  const handleTypeFilter = (type: string) => {
    const updatedTypes = selectedType.includes(type)
      ? selectedType.filter(t => t !== type)
      : [...selectedType, type];

    setSelectedType(updatedTypes);
    filterCreatures(creatureList, searchTerm, updatedTypes);
  };

  const filterCreatures = (creatures: Creature[], search: string, types: string[]) => {
    let filtered = creatures;
    if (types.length > 0) {
      filtered = filtered.filter(creature => types.includes(creature.tipo));
    }
    if (search) {
      filtered = filtered.filter(creature =>
        creature.nombre.toLowerCase().includes(search.toLowerCase()) ||
        creature.nivelDePoder.toString().includes(search)
      );
    }
    setFilteredCreatures(filtered);
  };

  const toggleEditMode = (id: string) => {
    setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: string,
    field: keyof Creature
  ) => {
    const value = e.target.value;

    switch (field) {
      case 'nombre':
        setNombre(prev => ({ ...prev, [id]: value as string }));
        break;
      case 'tipo':
        setTipo(prev => ({ ...prev, [id]: value as string }));
        break;
      case 'nivelDePoder':
        setNivelDePoder(prev => ({ ...prev, [id]: Number(value) }));
        break;
      case 'entrenada':
        setEntrenada(prev => ({ ...prev, [id]: value as 'Sí' | 'No' }));   
        break;
    }
  };

  const saveCreature = async (creature: Creature) => {
    setError('');
    try {
      const response = await fetch(`/api/creatures/${creature._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre[creature._id] || creature.nombre,
          tipo: tipo[creature._id] || creature.tipo,
          nivelDePoder: nivelDePoder[creature._id] || creature.nivelDePoder,
          entrenada: entrenada[creature._id] || creature.entrenada,   
        }),        
      });

      if (response.ok) {
        const updatedList = creatureList.map(item =>
          item._id === creature._id
            ? {
                ...item,
                nombre: nombre[creature._id] || item.nombre,
                tipo: tipo[creature._id] || item.tipo,
                nivelDePoder: nivelDePoder[creature._id] || item.nivelDePoder,
                entrenada: entrenada[creature._id] || item.entrenada,   
              }
            : item
        );
        setCreatureList(updatedList);
        setFilteredCreatures(updatedList);
        setEditMode(prev => ({ ...prev, [creature._id]: false }));
        setSuccessMessage('Criatura actualizada exitosamente');
      } else {
        setError('Error al actualizar la criatura');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    }
  };
  return (
    <div className={styles['caregiver-container']}>
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

        {creatureList.length === 0 ? (
          <div className={styles['no-creatures']}>
            <p className={styles['p-creature']}>Aún no has añadido ninguna criatura al santuario. ¡Empieza tu colección ahora!</p>
            <button 
              onClick={() => router.push('/creatures/newCreature')} 
              className={styles['add-button']}
            >
              Añadir nueva criatura
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => router.push('/creatures/newCreature')} 
              className={styles['add-button']} 
              style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}
            >
              Añadir nueva criatura
            </button>

            <div className={styles['main-content']}>
              <div className={styles['filter-container']}>
                <h3 className={styles['title3']}>Filtrar</h3>
                <div className={styles['filter-types']}>
                  {['dragón', 'fénix', 'golem', 'vampiro', 'unicornio'].map(type => (
                    <label key={type}>
                      <input 
                        type="checkbox" 
                        value={type}
                        onChange={() => handleTypeFilter(type)}
                        checked={selectedType.includes(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
                {userRole === 'Maestro' && (
                  <div className={styles['total-container']}>
                    <p className={styles['total']}>Total de criaturas creadas: {creatureList.length}</p>
                  </div>
                )}
              </div>

              <div className={styles['table-container']}>
                <div className={styles['search-container']}>
                  <label className={styles['label']}>Palabra mágica</label>
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Nombre o Poder"
                    className={styles['input']}
                  />
                </div>

                <table className={styles['creature-table']}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Nivel</th>
                      <th>Entrenado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCreatures.map(creature => (
                      <tr key={creature._id}>
                        <td>
                          {editMode[creature._id] ? (
                            <input
                              type="text"
                              value={nombre[creature._id] || creature.nombre}
                              onChange={(e) => handleInputChange(e, creature._id, 'nombre')}
                            />
                          ) : (
                            creature.nombre
                          )}
                        </td>
                        <td>
                          {editMode[creature._id] ? (
                            <select
                              value={tipo[creature._id] || creature.tipo}
                              onChange={(e) => handleInputChange(e, creature._id, 'tipo')}
                            >
                              {['dragón', 'fénix', 'golem', 'vampiro', 'unicornio'].map((creatureType) => (
                                <option key={creatureType} value={creatureType}>
                                  {creatureType}
                                </option>
                              ))}
                            </select>
                          ) : (
                            creature.tipo
                          )}
                        </td>
                        <td>
                          {editMode[creature._id] ? (
                            <input
                              type="number"
                              value={nivelDePoder[creature._id] !== undefined ? nivelDePoder[creature._id] : creature.nivelDePoder}
                              onChange={(e) => handleInputChange(e, creature._id, 'nivelDePoder')}
                            />
                          ) : (
                            creature.nivelDePoder
                          )}
                        </td>
                        <td>
                          {editMode[creature._id] ? (
                            <select
                              value={entrenada[creature._id] || creature.entrenada}
                              onChange={(e) => handleInputChange(e, creature._id, 'entrenada')}
                            >
                              <option value="Sí">Sí</option>
                              <option value="No">No</option>
                            </select>
                          ) : (
                            <select value={creature.entrenada} disabled>
                              <option value="Sí">Sí</option>
                              <option value="No">No</option>
                            </select>
                          )}
                        </td>
                        <td>
                          {editMode[creature._id] ? (
                            <>
                              <button title='Guardar' onClick={() => saveCreature(creature)} className={styles['save-button']}>
                                💾
                              </button>
                              <button title='Cancelar' onClick={() => toggleEditMode(creature._id)} className={styles['cancel-button']}>
                                ✖️
                              </button>
                              {userRole === 'Maestro' && (
                                <button title='Borrar' onClick={() => handleDelete(creature._id)} className={styles['delete-button']}>
                                  🗑️
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button title='Editar' onClick={() => toggleEditMode(creature._id)} className={styles['edit-button']}>
                                ✏️
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {successMessage && <div className={styles['success-message']}>{successMessage}</div>}
        {error && <div className={styles['error-message']}>{error}</div>}
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
  const creatures = await Creature.find({ usuarioId: session.user.id }).lean();

  return {
    props: {
      creatures: JSON.parse(JSON.stringify(creatures)),
      userRole: session.user.role,
    },
  };
};

export default CreaturesPage;
