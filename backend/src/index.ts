import { Elysia, t } from "elysia"
import * as crypto from 'crypto'
import { insertUrl, checkDuplicateUrl, getLongUrl } from "./db"
import { cors } from '@elysiajs/cors'
import * as undici from 'undici'
import { rateLimit } from 'elysia-rate-limit'
import { ip } from "elysia-ip"

const logger = require('pino')()
const PORT: number = +(process.env.PORT || 5173)

const app = new Elysia({ prefix: "/api/v1" })
    .use(cors())
    .use(ip())
    .use(rateLimit({
      duration: +(process.env.RATE_LIMIT_DURATION || 60000),
      max: +(process.env.RATE_LIMIT_MAX || 10),
      errorResponse: new Response("rate-limited", {
        status: 429,
        headers: new Headers({
          'Content-Type': 'text/plain',
          'Custom-Header': 'custom',
        })
      })
    }))
    .get("/", () => "Nothing to see here.")
    .get("/shorten", async ({ request, query, set }) => {
      const headerOrigin = request.headers.get('origin')
      logger.info(`request origin ${headerOrigin}`)
      logger.debug(query.url)
      const { statusCode, headers } = await undici.request(query.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      })
      logger.debug(statusCode, headers['content-type']) // debug only
      if (statusCode === 200 || 301 && headers['content-type'] === 'text/html; charset=utf-8') {
        const urlExists = checkDuplicateUrl(query.url)
        set.status = 201
        const hashStr = crypto.createHash('SHA256').update(query.url).digest('hex').slice(0,10)

        urlExists
          .then(uniq => {
            if (!uniq) {
              const today = new Date().toISOString()
              insertUrl(query.url, hashStr, today)          
            }
          })
        
        return {
          result: `${headerOrigin}/${hashStr}`
        }
      } else {
        return {
          result: 'Invalid URL'
        }
      }
      
    }, {
      query: t.Object({
        url: t.String()
      }),
      response: t.Object({
        result: t.String()
      })
    })
    .get('/longurl', ({ query, set }) => {
      const res = getLongUrl(query.short)
      set.status = 200
      return res
    }, {
      query: t.Object({
        short: t.String()
      }),
      response: t.String()
    })
    .listen(PORT);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
