# Remix `Vary` lowercasing repro

`Vary` from `remix/headers` lowercases every header name it writes, and `compression()` rewrites every response's `Vary` through it. So an action that answers `Vary: Cookie` sends `Vary: cookie, accept-encoding`. Safari only varies its HTTP cache on cookies for a name spelled exactly `Cookie`, so it gives one user's private answer to another user in the same browser.

The first commit is `npx remix@3.2.0 new`. The second adds the repro:

- `app/router.ts` adds `compression()`.
- `/greeting` answers `Hello, <user cookie>!` with `Cache-Control: private, max-age=60` and `Vary: Cookie`.
- `/repro` sets `user=alice`, fetches `/greeting`, sets `user=bob`, fetches it again, and prints both answers.
- `app/actions/controller.test.ts` checks the `Vary` header `/greeting` sends.

## Steps

```sh
npm i
npm test
PORT=44100 npm start
curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' http://localhost:44100/greeting
```

Then open http://localhost:44100/repro in Safari, and in Chrome or Firefox.

## Expected

- `npm test` passes, and `curl` shows `Vary: Cookie, Accept-Encoding`.
- Every browser asks the server again for bob: `As bob: Hello, bob!`.

## Actual

- `npm test` fails with `"cookie, accept-encoding" !== "Cookie, Accept-Encoding"`, and `curl` shows `vary: cookie, accept-encoding`.
- Safari answers bob from the copy it kept for alice: `As bob: Hello, alice!`, with the same response number. Chrome and Firefox ask the server again.
