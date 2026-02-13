import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World | <a href="https://github.com/andrewmcelvey2/legendary-memory-yar" target="blank">legendary-memory-yar</a>')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})