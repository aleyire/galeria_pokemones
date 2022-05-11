const axios = require("axios")
const http = require("http")
const fs = require("fs")
async function pokemonGet() {
  const { data } = await axios.get(
    "https://pokeapi.co/api/v2/pokemon/?limit=150"
  )
  return data.results
}
async function getData(url) {
  const { data } = await axios.get(url)
  return data
}
// server
http
  .createServer((req, res) => {
    if (req.url == "/") {
      res.writeHead(200, { "Content-Type": "text/html" })
      fs.readFile("index.html", "utf8", (err, html) => {
        res.end(html)
      })
    }
    if (req.url == "/pokemones") {
      let pokePromise = []
      let pokeDetail = []
      res.writeHead(200, { "Content-Type": "application/json" })
      pokemonGet().then((results) => {
        results.forEach((p) => {
          pokePromise.push(getData(p.url))
        })
        Promise.all(pokePromise).then((data) => {
          data.forEach((p) => {
            const nombre = p.name
            const img = p.sprites.front_default
            pokeDetail.push({ nombre, img })
          })
          res.write(JSON.stringify(pokeDetail))
          res.end()
        })
      })
    }
  })
  .listen(3000, () => console.log("Server on"))
