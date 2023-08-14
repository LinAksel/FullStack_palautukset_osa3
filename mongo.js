/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

var onlyPassword = true

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length === 4) {
  console.log('missing name or phone number argument')
  process.exit(1)
} else if (process.argv.length === 5) {
  onlyPassword = false
} else if (process.argv.length > 5) {
  console.log('too many arguments')
  process.exit(1)
}

const password = process.argv[2]

//Slightly modded the task 3.12 to hide user and address in env variables. Code works the same, but you have to set MONGODB_USER and MONGODB_ADDRESS
const user = process.env.MONGODB_USER
const address = process.env.MONGODB_ADDRESS
const url = `mongodb+srv://${user}:${password}@${address}`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (onlyPassword) {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
