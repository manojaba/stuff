const express = require('express');
const morgan = require('morgan');
const cors = require('cors')


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const app = express()

morgan.token('body', request => JSON.stringify(request.body))


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/',(request,response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes',(request,response) => {
  console.log('request')
  response.json(notes)
})

app.get('/api/notes/:id', (request,response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if(note){
    response.json(note)
  }else {
    response.statusMessage = 'the index is not found'
    response.status(404).end()
  }
})

app.delete('/api/notes/:id',(request,response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => Number(n.id)))
  : 0
  return String(maxId + 1)
}

app.post('/api/notes',(request,response) => {
  if(!request.body.content){
    return response.status(400).json({
      error:'Content missing'
    })
  }

  const note = {
    content:request.body.content,
    important:request.body.important || false,
    id:generateId()
  }

  notes = notes.concat(note)
  response.json(note)
})

const PORT = process.env.PORT || 3001

app.listen(PORT,() => {
  console.log('Server running on port : ',PORT)
})


