import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

BigInt.prototype.toJSON = function () {
  return this.toString()
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prisma = new PrismaClient({ adapter })

export default prisma