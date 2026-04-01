import bcrypt from 'bcryptjs'
import 'dotenv/config'

type SupportedBusinessType = 'jewelry' | 'guesthouse' | 'cctv'
type SharedPrismaModule = typeof import('../server/utils/prisma')

function getSeedBusinessType(value: string | undefined): SupportedBusinessType {
  if (value === 'guesthouse' || value === 'cctv') {
    return value
  }

  return 'jewelry'
}

async function main() {
  let prisma: SharedPrismaModule['default'] | null = null

  try {
    const [{ seedBusinessDemo }, prismaModule] = await Promise.all([
      import('../server/utils/businessSeeds'),
      import('../server/utils/prisma'),
    ])

    prisma = prismaModule.default
    await prisma.$connect()

    const email = process.env.AUTH_EMAIL || 'admin@pebblesbali.com'
    const password = process.env.AUTH_PASSWORD || 'admin123'
    const businessType = getSeedBusinessType(process.env.SEED_BUSINESS_TYPE || process.env.BUSINESS_TYPE)
    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.upsert({
      where: { email },
      update: {
        name: 'Admin',
        password: hashedPassword,
        role: 'superadmin',
      },
      create: {
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'superadmin',
      },
    })
    console.log(`Admin user seeded: ${email}`)

    const result = await seedBusinessDemo(businessType)
    console.log(result.message)
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
