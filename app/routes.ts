import { get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  greeting: get('/greeting'),
  repro: get('/repro'),
})
