import http from 'http'
import { parse } from 'url'
import signHandler from './uploads/sign.js'
import deleteHandler from './uploads/delete.js'

// const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 3001
const PORT = 3001

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = parse(req.url || '', true)
    if (pathname === '/api/uploads/sign') return signHandler(req, res)
    if (pathname === '/api/uploads/delete') return deleteHandler(req, res)
    if (pathname === '/api/health') {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ ok: true }))
    }
    // Note: /api/download and /api/upload are Vercel serverless functions
    // Run 'npm run dev:full' or 'vercel dev' to use them locally
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Not found' }))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: e?.message || 'Server error' }))
  }
})

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
