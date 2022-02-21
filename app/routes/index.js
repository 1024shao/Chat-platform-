const fs = require('fs')


module.exports = (app) => {
  fs.readdir(__dirname, (err, data) => {
    if (err) throw err
    data.forEach(filename => {
      if (filename === 'index.js') return
      const route = require(`./${filename}`)
      app.use(route.routes()).use(route.allowedMethods())
    })
  })
}