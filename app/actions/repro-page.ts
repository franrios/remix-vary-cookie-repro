// Fetches /greeting as alice, then as bob. A browser that varies on cookies
// asks the server again for bob; one that doesn't answers bob from the copy it
// kept for alice.
export const reproPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Vary: Cookie repro</title>
  </head>
  <body>
    <pre id="result">Running…</pre>
    <script type="module">
      // A new URL on every load, so no earlier run's copy is reused.
      let url = '/greeting?run=' + Date.now()

      document.cookie = 'user=alice; path=/'
      let alice = await fetch(url)
      let aliceText = await alice.text()

      document.cookie = 'user=bob; path=/'
      let bob = await fetch(url)
      let bobText = await bob.text()

      document.getElementById('result').textContent = [
        'Vary: ' + bob.headers.get('Vary'),
        'As alice: ' + aliceText,
        'As bob:   ' + bobText,
        '',
        bobText.startsWith('Hello, bob')
          ? 'OK: the browser asked the server again for bob.'
          : "BUG: the browser gave bob alice's private answer.",
      ].join('\\n')
    </script>
  </body>
</html>
`
