import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { getSessionCookieOptions } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' })
  }

  setCookie(event, 'mm_session', user.id, getSessionCookieOptions(event))

  return { id: user.id, email: user.email, name: user.name, role: user.role }
})
