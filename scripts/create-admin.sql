-- Script à exécuter dans Neon Console pour créer le premier compte admin
-- Remplace 'VOTRE_MOT_DE_PASSE_HASH' par le résultat de bcrypt.hashSync("votre_mdp", 10)

-- Option 1 : Via Node.js (dans le terminal du projet)
-- node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('VotreMotDePasse123', 10))"

-- Option 2 : Insérer directement avec le hash généré
INSERT INTO users (email, password_hash, nom, role)
VALUES (
  'admin@hdfm-mali.org',
  '$2a$10$REMPLACEZ_PAR_LE_HASH_BCRYPT',
  'Administrateur HD FM',
  'ADMIN'
);
