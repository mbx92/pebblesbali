import { getSessionCookieOptions } from '../../utils/session'

export default defineEventHandler((event) => {
  deleteCookie(event, 'mm_session', getSessionCookieOptions(event))
  return { ok: true }
})
