import { spawn } from 'node:child_process'

const procs = []

const run = (cmd, args, name) => {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
  procs.push(p)
  p.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code`, code)
    }
    // If one process exits, terminate others
    shutdown()
  })
}

const shutdown = () => {
  while (procs.length) {
    const p = procs.pop()
    try { p.kill('SIGTERM') } catch {}
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

run('node', ['api/server.mjs'], 'api')
run('npx', ['vite'], 'vite')

