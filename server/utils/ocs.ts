import prisma from './prisma'

export interface OcsPushPayload {
  sourceId: string
  sourceEntityType: string
  sourceStatus?: string
  sourcePayload: Record<string, unknown>
}

export interface OcsPushResult {
  action: 'created' | 'updated'
  mappedEntityId: string | null
}

/**
 * Push a single entity to OCS Workspace via the /push endpoint.
 * Returns null (silently) if OCS is not configured.
 */
export async function ocsPush(payload: OcsPushPayload): Promise<OcsPushResult | null> {
  const config = useRuntimeConfig()
  const { ocsUrl, ocsApiKey, ocsConnectionId, ocsProjectId } = config

  if (!ocsUrl || !ocsApiKey || !ocsConnectionId) return null

  const res = await $fetch<{ action: string; record: { id: string }; mappedEntityId: string | null }>(
    `${ocsUrl}/api/integrations/${ocsConnectionId}/push`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ocsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        sourceId: payload.sourceId,
        sourceEntityType: payload.sourceEntityType,
        sourceStatus: payload.sourceStatus,
        projectId: ocsProjectId || undefined,
        sourcePayload: payload.sourcePayload,
      },
    },
  ).catch((err) => {
    console.error('[OCS] Push failed:', payload.sourceId, err?.message ?? err)
    return null
  })

  if (!res) return null
  return { action: res.action as 'created' | 'updated', mappedEntityId: res.mappedEntityId ?? null }
}

/**
 * Push an Order to OCS and update its ocsSyncedAt / ocsEntityId tracking columns.
 * Respects the ocsSyncOrders site setting toggle.
 */
export async function syncOrderToOcs(orderId: string) {
  const syncSetting = await prisma.siteSetting.findUnique({ where: { key: 'ocsSyncOrders' } })
  if (syncSetting?.value === 'false') return

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  })
  if (!order) return

  const result = await ocsPush({
    sourceId: `ORDER-${order.id}`,
    sourceEntityType: 'order',
    sourceStatus: order.status,
    sourcePayload: {
      title: `Order dari ${order.shipName} (${order.items.length} item)`,
      customer: order.user?.name ?? order.shipName,
      email: order.shipEmail,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
      courier: order.shippingCourier,
      items: order.items.map(i => ({
        name: i.productName,
        qty: i.qty,
        price: Number(i.price),
      })),
    },
  })

  if (result) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        ocsSyncedAt: new Date(),
        ocsEntityId: result.mappedEntityId,
      },
    })
  }
}
