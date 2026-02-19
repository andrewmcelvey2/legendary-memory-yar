import express from 'express'

const app = express()

app.get('/', (req, res) => {
<<<<<<< HEAD
  res.send('Hello World | Final Test from dev branch <a href="https://github.com/andrewmcelvey2/legendary-memory-yar" target="blank">legendary-memory-yar</a>')
=======
  res.send('Hello World | Final Test to ci/cd <a href="https://github.com/andrewmcelvey2/legendary-memory-yar" target="blank">legendary-memory-yar</a>')
>>>>>>> origin/main
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
