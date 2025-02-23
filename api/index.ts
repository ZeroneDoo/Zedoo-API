import { handle } from 'hono/vercel'

// @ts-expect-error
import app from '../dist/src/app.js'

export const runtime = 'edge'

export const GET = handle(app)