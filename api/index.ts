import { handle } from 'hono/vercel'

// @ts-expect-error
import app from '../dist/index.js'

export const runtime = 'edge'

export const GET = handle(app)