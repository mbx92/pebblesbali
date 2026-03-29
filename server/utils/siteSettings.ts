import prisma from './prisma'

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany()
  const result: Record<string, string> = {}

  for (const setting of settings) {
    result[setting.key] = setting.value
  }

  return result
}

export async function ensureDefaultGuesthouseProperty() {
  const settings = await getSiteSettings()

  const existing = await prisma.property.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  const payload = {
    slug: 'main-property',
    name: settings.siteName || 'Guesthouse',
    description: settings.siteTagline || null,
    address: settings.address || null,
    timezone: 'Asia/Makassar',
    currency: 'IDR',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    isActive: true,
  }

  if (existing) {
    return prisma.property.update({
      where: { id: existing.id },
      data: payload,
    })
  }

  return prisma.property.create({
    data: payload,
  })
}

export async function getPrimaryProperty() {
  const property = await prisma.property.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  })

  if (property) {
    return property
  }

  return ensureDefaultGuesthouseProperty()
}