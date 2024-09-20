import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Creature from '../../../models/creature';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const creature = await Creature.findById(id);
        if (!creature) {
          return res.status(404).json({ message: 'Criatura no encontrada' });
        }
        res.status(200).json(creature);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener la criatura' });
      }
      break;

 
    case 'PUT':
      try {
        const { entrenada, ...rest } = req.body;
        const updatedCreature = await Creature.findByIdAndUpdate(
          id,
          { ...rest, entrenada: entrenada === 'Sí' ? 'Sí' : 'No' },  
          { new: true }
        );
        if (!updatedCreature) {
          return res.status(404).json({ message: 'Criatura no encontrada' });
        }
        res.status(200).json(updatedCreature);
      } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la criatura', error });
      }
      break;

      

    case 'DELETE':
      try {
        const deletedCreature = await Creature.findByIdAndDelete(id);
        if (!deletedCreature) {
          return res.status(404).json({ message: 'Criatura no encontrada' });
        }
        res.status(200).json({ message: 'Criatura eliminada con éxito' });
      } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la criatura' });
      }
      break;

    case 'POST':
      try {
        const newCreature = new Creature(req.body);
        await newCreature.save();
        res.status(201).json(newCreature);
      } catch (error) {
        res.status(500).json({ message: 'Error al crear la criatura' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
      res.status(405).end(`Método ${req.method} no permitido`);
      break;
  }
}
