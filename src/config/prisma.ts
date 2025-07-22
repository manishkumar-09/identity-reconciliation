import { PrismaClient } from "@prisma/client";

// Declare a global variable to store the PrismaClient instance in development
// This is necessary to prevent multiple instances during hot reloading in Next.js
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, reuse the global instance if it exists, otherwise create a new one
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
