const { PrismaClient } = require('../app/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.admin.findFirst();
    
    if (existingAdmin) {
      console.log('Un administrateur existe déjà.');
      return;
    }

    // Créer le premier admin
    const hashedPassword = await bcrypt.hash('ld4p@ssw0rd!', 12);
    
    const admin = await prisma.admin.create({
      data: {
        email: 'theo.morio@margoul1.dev',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'super_admin'
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 