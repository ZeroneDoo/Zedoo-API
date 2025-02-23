import { Hono } from 'hono'
import komikuRoute from './routes/komiku_route.js'

const app = new Hono().basePath("/api")

app.route('/komiku', komikuRoute)

app.get('/', (c) => {
  return c.json({
    message: "Zedoo API"
  })
})

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

export default app