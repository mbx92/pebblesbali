import { getTemplateByKey } from '../../../../app/templates/registry'
import { requireAdminUser } from '../../../utils/session'
import { generateTemplatePreviews, listTemplatePreviewStatuses } from '../../../utils/templatePreviews'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = await readBody<{ templateKey?: string }>(event)
  const requestUrl = getRequestURL(event)

  if (body.templateKey && !getTemplateByKey(body.templateKey)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown template key' })
  }

  const generated = await generateTemplatePreviews({
    baseUrl: requestUrl.origin,
    templateKeys: body.templateKey ? [body.templateKey] : undefined,
  })

  return {
    generated,
    statuses: await listTemplatePreviewStatuses(),
  }
})