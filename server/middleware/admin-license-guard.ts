import prisma from '../utils/prisma'
import { describeLicenseStatus, getStoredLicenseState, isAdminLicenseBlocked } from '../utils/license'

const RECOVERY_ALLOWED_PATHS = new Set([
  '/api/auth/logout',
  '/api/auth/me',
  '/api/settings',
  '/api/settings/license',
])

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) {
    return
  }

  if (RECOVERY_ALLOWED_PATHS.has(path)) {
    return
  }

  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) {
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { role: true },
  })

  if (!user || user.role === 'customer') {
    return
  }

  const licenseState = await getStoredLicenseState()

  if (!isAdminLicenseBlocked(licenseState.licenseStatus)) {
    return
  }

  throw createError({
    statusCode: 403,
    statusMessage: describeLicenseStatus(licenseState.licenseStatus, licenseState.licenseStatusMessage),
    data: {
      licenseStatus: licenseState.licenseStatus,
    },
  })
})
