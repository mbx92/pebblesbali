import bcrypt from 'bcryptjs'
import 'dotenv/config'

type SupportedBusinessType = 'jewelry' | 'guesthouse' | 'cctv'
type SharedPrismaModule = typeof import('../server/utils/prisma')
type SeedAdminUser = {
  email: string
  password: string
}

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

    const defaultAdminEmail = 'admin@pebblesbali.com'
    const configuredAdminEmail = process.env.AUTH_EMAIL || defaultAdminEmail
    const configuredAdminPassword = process.env.AUTH_PASSWORD || 'admin123'
    const businessType = getSeedBusinessType(process.env.SEED_BUSINESS_TYPE || process.env.BUSINESS_TYPE)
    const seedUsers = new Map<string, SeedAdminUser>()
    seedUsers.set(defaultAdminEmail, {
      email: defaultAdminEmail,
      password: configuredAdminPassword,
    })
    seedUsers.set(configuredAdminEmail, {
      email: configuredAdminEmail,
      password: configuredAdminPassword,
    })

    for (const user of seedUsers.values()) {
      const hashedPassword = await bcrypt.hash(user.password, 12)

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: 'Admin',
          password: hashedPassword,
          role: 'superadmin',
        },
        create: {
          name: 'Admin',
          email: user.email,
          password: hashedPassword,
          role: 'superadmin',
        },
      })
    }

    console.log(`Admin users seeded: ${Array.from(seedUsers.keys()).join(', ')}`)

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
