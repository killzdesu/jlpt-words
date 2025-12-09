import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler((event) => {
    const filePath = resolve(process.cwd(), 'public/JPDB/JPDB.json.gz')

    try {
        const data = readFileSync(filePath)

        // Set headers for gzip-compressed JSON
        setHeader(event, 'Content-Type', 'application/json')
        setHeader(event, 'Content-Encoding', 'gzip')
        setHeader(event, 'Cache-Control', 'public, max-age=31536000') // Cache for 1 year

        return data
    } catch (error) {
        throw createError({
            statusCode: 404,
            message: 'JPDB data file not found'
        })
    }
})

