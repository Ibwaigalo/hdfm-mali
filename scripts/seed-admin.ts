import { db } from "../db";
import { users } from "../db/schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = "admin@hdfm-mali.org";
  const password = "HdfmAdmin2024!";
  const hash = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    email,
    passwordHash: hash,
    nom: "Administrateur HD FM",
    role: "ADMIN",
  }).onConflictDoNothing();

  console.log(`Admin créé : ${email} / ${password}`);
  process.exit(0);
}

seedAdmin().catch(console.error);
