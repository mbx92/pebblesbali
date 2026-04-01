import prisma from '../../utils/prisma'
import {
  getAnalyticsLocation,
  getRequestIpAddress,
  getUserAgentDetails,
  normalizeAnalyticsPath,
  normalizeAnalyticsUrl,
} from '../../utils/analytics'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    visitorId?: string
    path?: string
    title?: string
    referrer?: string
  }>(event)

  const visitorId = String(body.visitorId || '').trim().slice(0, 64)
  const path = normalizeAnalyticsPath(String(body.path || ''))

  if (!visitorId) {
    throw createError({ statusCode: 422, statusMessage: 'visitorId is required' })
  }

  if (path.startsWith('/admin')) {
    return { tracked: false, ignored: true }
  }

  const location = getAnalyticsLocation(event)
  const userAgentDetails = getUserAgentDetails(getHeader(event, 'user-agent'))

  await prisma.analyticsEvent.create({
    data: {
      visitorId,
      path,
      title: String(body.title || '').trim().slice(0, 255) || null,
      referrer: normalizeAnalyticsUrl(body.referrer),
      ipAddress: getRequestIpAddress(event),
      country: location.country,
      region: location.region,
      city: location.city,
      deviceType: userAgentDetails.deviceType,
      browser: userAgentDetails.browser,
      os: userAgentDetails.os,
      userAgent: userAgentDetails.userAgent,
    },
  })

  return { tracked: true }
})