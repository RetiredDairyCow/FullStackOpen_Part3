/* const { request, response } = require('express' )*/
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('type', function (req, res) { 
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const totPersons = Object.keys(persons).length
    
    const info = {
        content: `Phonebook has info for ${totPersons} people`,
        date: new Date()
    }
    response.json(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const result = persons.find(p => p.id === id)
    
    if (result) response.json(result)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log(request.body.number)
    const reqBody = request.body
    const reqName = request.body.name
    
    if(persons.find(p => p.name === reqName)) {
        return response.status(400).json({"error": "name must be unique"})
    }

    if (!reqBody.name) return response.status(400).json({"error" : "content missing"})
    
    const newPerson = {
        id: Math.floor(Math.random() * 100),
        name : reqName,
        number : Number(reqBody.number),
        important : reqBody.important || false,
        
        date: new Date()
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})