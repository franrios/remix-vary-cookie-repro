import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'

describe('root controller', () => {
  it('GET / returns the home page', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)
    assert.match(await response.text(), /<html[\s>]/)
  })

  it('GET /greeting keeps the Vary spelling the action set', async () => {
    let response = await router.fetch(new URL(routes.greeting.href(), 'http://localhost'))

    assert.equal(response.headers.get('Cache-Control'), 'private, max-age=60')
    // Safari only varies its cache on cookies for the spelling `Cookie`.
    assert.equal(response.headers.get('Vary'), 'Cookie, Accept-Encoding')
  })
})
