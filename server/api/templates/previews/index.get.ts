import { requireAdminUser } from '../../../utils/session'
import { listTemplatePreviewStatuses } from '../../../utils/templatePreviews'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  return listTemplatePreviewStatuses()
})