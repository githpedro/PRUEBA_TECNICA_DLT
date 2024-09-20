import mongoose, { Schema, Document } from 'mongoose';

export interface ICreature extends Document {
  nombre: string;
  tipo: string;
  nivelDePoder: number;
  entrenada: 'Sí' | 'No'; 
  usuarioId: mongoose.Schema.Types.ObjectId;
}

const CreatureSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  nivelDePoder: { type: Number, required: true },
  entrenada: { type: String, enum: ['Sí', 'No'], required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


export default mongoose.models.Creature || mongoose.model<ICreature>('Creature', CreatureSchema);
