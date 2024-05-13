import { Elysia, error, t } from "elysia"
import * as crypto from 'crypto'
import { insertUrl, checkDuplicateUrl, getLongUrl } from "./db"
import { cors } from '@elysiajs/cors'
import * as undici from 'undici'

const PORT: number = +(process.env.PORT || 5173)
const NODE_ENV = process.env.NODE_ENV ?? "development"

const app = new Elysia({ prefix: "/api/v1" })
    .use(cors())
    .get("/", () => "Nothing to see here.")
    .get("/shorten", async ({ request, query, set }) => {
      const headerOrigin = request.headers.get('origin')
      const { statusCode, headers } = await undici.request(query.url)
      if (statusCode === 200 && headers['content-type'] === 'text/html; charset=utf-8') {
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
          short_url: `${headerOrigin}/${hashStr}`
        }
      } else {
        return {
          short_url: 'Invalid URL'
        }
      }
      
    }, {
      query: t.Object({
        url: t.String()
      }),
      response: t.Object({
        short_url: t.String()
      })
    })
    .get('/longurl', ({ query, set }) => {
      const res = getLongUrl(query.short)
      return res
    }, {
      query: t.Object({
        short: t.String()
      }),
      response: t.String()
    })
    .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
