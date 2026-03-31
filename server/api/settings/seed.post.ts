import { requireSessionUser } from '../../utils/session'
import { seedBusinessDemo } from '../../utils/businessSeeds'

export default defineEventHandler(async (event) => {
  const user = await requireSessionUser(event)

  if (user.role !== 'superadmin') {
    throw createError({ statusCode: 403, statusMessage: 'Only superadmin can run business seeds' })
  }

  const body = await readBody(event)
  const businessType = String(body.businessType || '')

  if (businessType !== 'jewelry' && businessType !== 'guesthouse' && businessType !== 'cctv') {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported business type seed' })
  }

  return seedBusinessDemo(businessType)
})