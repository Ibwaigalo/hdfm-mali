// Exécuter : node scripts/hash-password.js VotreMotDePasse
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.js <mot_de_passe>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nHash bcrypt généré :");
console.log(hash);
console.log("\nSQL à exécuter dans Neon Console :");
console.log(`INSERT INTO users (email, password_hash, nom, role) VALUES ('admin@hdfm-mali.org', '${hash}', 'Administrateur HD FM', 'ADMIN');`);
