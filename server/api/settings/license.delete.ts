import prisma from '../../utils/prisma'

const LICENSE_RESET_KEYS = {
  licenseKey: '',
  licensePlan: '',
  licenseStatus: '',
  licenseLastValidatedAt: '',
  licenseFeatures: '',
  featureMediaLibrary: 'false',
  featureShop: 'false',
  featureCart: 'false',
  featureBlog: 'false',
  featureRoomInventory: 'false',
  featureBookingEngine: 'false',
} as const

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')

  if (!sessionId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true },
  })

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  for (const [key, value] of Object.entries(LICENSE_RESET_KEYS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  return {
    success: true,
    message: 'License binding cleared',
  }
})