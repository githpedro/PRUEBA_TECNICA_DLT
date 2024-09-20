import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Creature from '../../../models/creature';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { nombre, tipo, nivelDePoder, entrenada, usuarioId } = req.body;

      if (entrenada !== 'Sí' && entrenada !== 'No') {
        return res.status(400).json({ message: 'El valor de entrenada debe ser "Sí" o "No"' });
      }

      const newCreature = new Creature({
        nombre,
        tipo,
        nivelDePoder,
        entrenada,  
        usuarioId,
      });

      const savedCreature = await newCreature.save();
      res.status(201).json(savedCreature);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear la criatura', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}

