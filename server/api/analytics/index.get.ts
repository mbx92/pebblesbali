import prisma from '../../utils/prisma'
import {
  buildAnalyticsMapMarkers,
  buildDailyAnalyticsSeries,
  countAnalyticsByLabel,
  formatDeviceLabel,
  formatLocationLabel,
} from '../../utils/analytics'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'mm_session')
  if (!sessionId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })

  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { role: true } })
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const last7DaysStart = new Date(now)
  last7DaysStart.setDate(last7DaysStart.getDate() - 6)
  last7DaysStart.setHours(0, 0, 0, 0)

  const last14DaysStart = new Date(now)
  last14DaysStart.setDate(last14DaysStart.getDate() - 13)
  last14DaysStart.setHours(0, 0, 0, 0)

  const [
    totalPageviews,
    viewsToday,
    last7DaysEvents,
    last14DaysEvents,
    recentVisits,
  ] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: last7DaysStart } },
      orderBy: { createdAt: 'desc' },
      take: 1000,
      select: {
        id: true,
        visitorId: true,
        path: true,
        title: true,
        referrer: true,
        country: true,
        region: true,
        city: true,
        deviceType: true,
        browser: true,
        os: true,
        createdAt: true,
      },
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: last14DaysStart } },
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
      },
    }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        path: true,
        title: true,
        referrer: true,
        ipAddress: true,
        country: true,
        region: true,
        city: true,
        deviceType: true,
        browser: true,
        os: true,
        createdAt: true,
      },
    }),
  ])

  return {
    totalPageviews,
    uniqueVisitorsLast7Days: new Set(last7DaysEvents.map(eventItem => eventItem.visitorId)).size,
    viewsToday,
    viewsLast7Days: last7DaysEvents.length,
    topCountries: countAnalyticsByLabel(last7DaysEvents.map(eventItem => eventItem.country), 5),
    topLocations: countAnalyticsByLabel(last7DaysEvents.map(eventItem => formatLocationLabel(eventItem.city, eventItem.region, eventItem.country)), 5),
    topDevices: countAnalyticsByLabel(last7DaysEvents.map(eventItem => formatDeviceLabel(eventItem.deviceType)), 5),
    topPages: countAnalyticsByLabel(last7DaysEvents.map(eventItem => eventItem.path), 5),
    dailyViews: buildDailyAnalyticsSeries(last14DaysEvents.map(eventItem => eventItem.createdAt), 14),
    mapMarkers: buildAnalyticsMapMarkers(countAnalyticsByLabel(last7DaysEvents.map(eventItem => eventItem.country), 8).map(item => ({ country: item.label, count: item.count }))),
    recentVisits: recentVisits.map(eventItem => ({
      ...eventItem,
      deviceType: formatDeviceLabel(eventItem.deviceType),
    })),
  }
})