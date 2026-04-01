import prisma from '../../utils/prisma'
import { clearStoredLicenseState } from '../../utils/license'

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

  await clearStoredLicenseState()

  return {
    success: true,
    message: 'License binding cleared',
  }
})
