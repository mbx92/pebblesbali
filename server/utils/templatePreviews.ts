import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { getAllTemplateOptions, getTemplateByKey } from '../../app/templates/registry'
import type { TemplatePreviewStatus } from '../../app/types'

const GENERATED_TEMPLATE_PREVIEW_DIR = path.join(process.cwd(), 'public', 'template-previews', 'generated')

function getGeneratedPreviewFilename(templateKey: string) {
  return `${templateKey}.png`
}

function getGeneratedPreviewPath(templateKey: string) {
  return path.join(GENERATED_TEMPLATE_PREVIEW_DIR, getGeneratedPreviewFilename(templateKey))
}

function getGeneratedPreviewUrl(templateKey: string, version?: number) {
  const baseUrl = `/template-previews/generated/${getGeneratedPreviewFilename(templateKey)}`
  if (!version) return baseUrl
  return `${baseUrl}?v=${version}`
}

function buildCaptureUrl(baseUrl: string, templateKey: string, businessType: string) {
  const params = new URLSearchParams({
    previewTemplate: templateKey,
    previewBusinessType: businessType,
    previewMode: 'draft',
    capturePreview: '1',
  })

  return `${baseUrl}/?${params.toString()}`
}

export async function getTemplatePreviewStatus(templateKey: string): Promise<TemplatePreviewStatus> {
  const template = getTemplateByKey(templateKey)
  const fallbackImageUrl = template?.previewImage || null

  try {
    const fileStats = await stat(getGeneratedPreviewPath(templateKey))
    return {
      templateKey,
      imageUrl: getGeneratedPreviewUrl(templateKey, Math.round(fileStats.mtimeMs)),
      fallbackImageUrl,
      generated: true,
      generatedAt: fileStats.mtime.toISOString(),
    }
  } catch {
    return {
      templateKey,
      imageUrl: null,
      fallbackImageUrl,
      generated: false,
      generatedAt: null,
    }
  }
}

export async function listTemplatePreviewStatuses() {
  const templates = getAllTemplateOptions()
  return Promise.all(templates.map(template => getTemplatePreviewStatus(template.key)))
}

export async function generateTemplatePreviews(options: {
  baseUrl: string
  templateKeys?: string[]
}) {
  const templates = (options.templateKeys?.length
    ? options.templateKeys.map(key => getTemplateByKey(key)).filter(Boolean)
    : getAllTemplateOptions())

  await mkdir(GENERATED_TEMPLATE_PREVIEW_DIR, { recursive: true })

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })

  try {
    const generated: Array<{ templateKey: string, imageUrl: string }> = []

    for (const template of templates) {
      const page = await browser.newPage({
        viewport: template.previewViewport || { width: 1440, height: 1080 },
        deviceScaleFactor: 1,
      })

      const response = await page.goto(
        buildCaptureUrl(options.baseUrl.replace(/\/$/, ''), template.key, template.businessType),
        { waitUntil: 'networkidle' },
      )

      if (response && !response.ok()) {
        throw new Error(`Failed to open preview page for ${template.key}: ${response.status()}`)
      }

      await page.evaluate(async () => {
        if ('fonts' in document) {
          await (document as Document & { fonts?: { ready: Promise<void> } }).fonts?.ready
        }
      })
      await page.waitForTimeout(800)

      await page.screenshot({
        path: getGeneratedPreviewPath(template.key),
        type: 'png',
        fullPage: false,
      })
      await page.close()

      generated.push({
        templateKey: template.key,
        imageUrl: getGeneratedPreviewUrl(template.key),
      })
    }

    return generated
  } finally {
    await browser.close()
  }
}