import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { urls, users, visits } from './schema'
import { like } from 'drizzle-orm'

const logger = require('pino')()
const client = postgres(process.env.DATABASE_URL as string)
const db = drizzle(client)

export const insertUrl = async ( longUrl: string, shortHash: string, createdAt: string ) => {
    try {
        await db.insert(urls).values({
            longUrl: longUrl,
            shortHash: shortHash,
            createdAt: createdAt,
        })    
    } catch (error) {
        logger.info(error)
        throw new Error("Insert failed.")
    }
}

export const checkDuplicateUrl = async ( longUrl: string ) => {
    try {
        const result = await db.select({ longUrl: urls.longUrl }).from(urls).where(like(urls.longUrl, longUrl))
        if (Object.keys(result).length === 1) return true
    } catch (error) {
        logger.info(error)
        throw new Error("Failed to query the database to find duplicates.");
    }

    return false
}

export async function getLongUrl( shortParam: string ) {
    const result = await db.select({ longUrl: urls.longUrl}).from(urls).where(like(urls.shortHash, shortParam)).limit(1)
    const { longUrl } = result[0]
    return longUrl
}
