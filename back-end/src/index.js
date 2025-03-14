import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRouter from './routes/user'
import accRouter from './routes/account'
const app = new Hono()
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: ["https://blog-chi-tan-50.vercel.app","http://localhost:5173"],
    allowMethods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
  return corsMiddleware(c, next) // <-- no need to await
})
app.route('/api/v1/user',userRouter)
app.route('/api/v1/account',accRouter)//go to routes/index.js

export default app

