import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Maestro', 'Cuidador'], required: true }, // Verifica que los valores coincidan exactamente
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
