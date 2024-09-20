 
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await dbConnect();

     
    const { nombre, email, password, role } = req.body;

     
    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
       
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

       
      const hashedPassword = await bcrypt.hash(password, 10);

       
      const newUser = new User({
        nombre,   
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();
      return res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res.status(500).json({ message: "Error al registrar el usuario" });
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}
