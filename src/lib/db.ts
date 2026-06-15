import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create PrismaClient with error handling for missing database
function createPrismaClient(): PrismaClient | null {
  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    })
    return client
  } catch (error) {
    console.error('Failed to create PrismaClient:', error)
    return null
  }
}

const rawDb = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && rawDb) {
  globalForPrisma.prisma = rawDb
}

// Helper to check if database is available
export function isDatabaseAvailable(): boolean {
  return rawDb !== null
}

/**
 * A safe database proxy that gracefully handles missing database connections.
 * When the real PrismaClient is unavailable, all model operations return
 * empty arrays (findMany) or throw a descriptive error (create/update/delete).
 */
function createSafeDbProxy(): PrismaClient {
  const handler: ProxyHandler<object> = {
    get(_target, prop: string) {
      // For each model accessor (e.g., db.heroSlide, db.fAQ, etc.)
      return new Proxy({} as object, {
        get(_modelTarget, method: string) {
          // For read operations, return empty results
          if (method === 'findMany') {
            return async () => []
          }
          if (method === 'findFirst') {
            return async () => null
          }
          if (method === 'findUnique') {
            return async () => null
          }
          if (method === 'count') {
            return async () => 0
          }
          if (method === 'aggregate') {
            return async () => ({})
          }
          if (method === 'groupBy') {
            return async () => []
          }
          // For write operations, return a descriptive error
          if (
            method === 'create' ||
            method === 'update' ||
            method === 'delete' ||
            method === 'upsert' ||
            method === 'createMany' ||
            method === 'updateMany' ||
            method === 'deleteMany'
          ) {
            return async () => {
              throw new Error('Database is not available. Please configure DATABASE_URL.')
            }
          }
          // Default: return a no-op function
          return async () => null
        },
      })
    },
  }

  return new Proxy({} as object, handler) as unknown as PrismaClient
}

// Export db: use real client if available, otherwise use safe proxy
export const db = rawDb ?? createSafeDbProxy()
