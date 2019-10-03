const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token("postData", function(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms :postData'))





let persons = [
    {
        name: "Paavo",
        number: "9057846954",
        id: 1  
    },
    {
        name: "Mikko",
        number: "093459043",
        id: 2
    }
]


//apin info
app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`)
})

//GET all
app.get("/api/persons", (req, res) => {
    res.json(persons)
})
//GET one
app.get("/api/persons/:id", (req, res) => {
    console.log("hellou")
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
})


//adding a connection
app.post("/api/persons", (req, res) => {
    
    const body = req.body

    const id = Math.floor(Math.random() * 10000)
    if(!body.name || !body.number){
        return res.status(400).json({
            error: "Content missing"
        })
    } 
    if(persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())){
        return res.status(400).json({
            error: "name must be unique"
        })
    }


    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)

    res.json(person)
})

//DELETE
app.delete("/api/persons/:id", (req, res) => {
    console.log("hellou")
    const id = Number(req.params.id)

    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

