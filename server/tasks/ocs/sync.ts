import prisma from '../../utils/prisma'
import { syncOrderToOcs } from '../../utils/ocs'

export default defineTask({
  meta: {
    name: 'ocs:sync',
    description: 'Sync unsynced or stale orders to OCS Workspace',
  },
  async run() {
    const config = useRuntimeConfig()
    if (!config.ocsUrl || !config.ocsApiKey || !config.ocsConnectionId) {
      return { result: 'OCS not configured, skipping.' }
    }

    // Find orders that have never been synced, or updated more recently than last sync
    const orders = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM orders
      WHERE "ocsSyncedAt" IS NULL
         OR "updatedAt" > "ocsSyncedAt"
      ORDER BY "createdAt" DESC
      LIMIT 50
    `

    let synced = 0
    for (const order of orders) {
      await syncOrderToOcs(order.id).catch((err) => {
        console.error('[ocs:sync] Failed for order', order.id, err?.message)
      })
      synced++
    }

    return { result: `Synced ${synced} order(s) to OCS Workspace.` }
  },
})
