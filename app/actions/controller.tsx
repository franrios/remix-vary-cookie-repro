import { createController } from 'remix/router'

import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { HomePage } from './home-page.tsx'
import { reproPage } from './repro-page.ts'

let greetings = 0

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },
    home(context) {
      return context.render(<HomePage />)
    },
    // A personalized answer the browser may keep for 60 seconds, for requests
    // that carry the same cookies.
    greeting(context) {
      let cookie = context.request.headers.get('Cookie') ?? ''
      let user = /(?:^|;\s*)user=([^;]*)/.exec(cookie)?.[1] ?? 'stranger'
      greetings++
      return new Response(`Hello, ${user}! (response #${greetings})`, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'private, max-age=60',
          Vary: 'Cookie',
        },
      })
    },
    repro() {
      return new Response(reproPage, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    },
  },
})
