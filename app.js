const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
      data: {
          firstName: 'Sarfraz',
          lastName: 'Alam',
          email: 'alamsarfraz422@gmail.com'
      }
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })