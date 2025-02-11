import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import komikuRoute from './routes/komiku_route.js'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.route('/komiku', komikuRoute)

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

export default handle(app)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
