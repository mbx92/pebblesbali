import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { getSessionCookieOptions } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readBody(event)

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Name, email, dan password wajib diisi' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 8 karakter' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah digunakan' })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: 'customer' },
    select: { id: true, name: true, email: true, role: true },
  })

  setCookie(event, 'mm_session', user.id, getSessionCookieOptions(event))

  return user
})
