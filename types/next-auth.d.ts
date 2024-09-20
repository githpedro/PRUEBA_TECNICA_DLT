import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: "Maestro" | "Cuidador";
    } & DefaultSession["user"];
    accessToken?: string;  
  }

  interface User {
    id: string;
    role: "Maestro" | "Cuidador";
    accessToken?: string;  
  }

  interface JWT {
    sub: string;
    role: "Maestro" | "Cuidador";
    accessToken?: string; 
  }
}
