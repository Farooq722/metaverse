import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Use a single instance

async function testConnection() {
    try {
      await prisma.$connect();
      console.log("Database connected successfully! 🚀");
    } catch (error) {
      console.error("Database connection failed ❌", error);
    } finally {
      await prisma.$disconnect();
    }
}

testConnection();

export default prisma;
