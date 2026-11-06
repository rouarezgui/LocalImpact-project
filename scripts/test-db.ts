import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test LocalImpact",
      email: "test@localimpact.tn",
      password: "temporary-test-password",
      role: "USER",
    },
  });

  console.log("Utilisateur créé :", user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });