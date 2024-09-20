import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Por favor, añade tu URI de MongoDB en el archivo .env.local");
}

let isConnected = false; 

export async function dbConnect() {
  if (isConnected) {
    console.log("Ya conectado a MongoDB");
    return;
  }

  try {

    await mongoose.connect(uri!, {
      dbName: "Santuario",  
    });

    isConnected = true;
    console.log("Conectado a MongoDB - Base de datos: Santuario");
  } catch (error) {
    console.error("Error conectándose a MongoDB", error);
    throw new Error("Error conectándose a MongoDB");
  }
}

export default dbConnect;
