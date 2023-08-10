import { useState, useEffect } from "react"
import personsService from "./services/persons"
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import Filter from "./components/Filter"

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  if (message.isError) {
    return <div className="error">{message.message}</div>
  }
  return <div className="notification">{message.message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const handleUpdate = (existingPerson) => {
    const personObject = {
      name: existingPerson.name,
      number: newNumber,
    }
    personsService
      .update(existingPerson.id, personObject)
      .then((updatedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id !== updatedPerson.id ? person : updatedPerson
          )
        )
        setNewName("")
        setNewNumber("")
        setMessage({
          isError: false,
          message: `Updated ${updatedPerson.name}`,
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        setMessage({
          isError: true,
          message: `Information of ${existingPerson.name} has already been removed from server`,
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter((p) => p.id !== existingPerson.id))
        console.log(`Error updating person to list: ${error}`)
      })
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(person.id)
        .then((response) => {
          setPersons(persons.filter((p) => p.id !== person.id))
          setMessage({
            isError: false,
            message: `${person.name} deleted`,
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setMessage({
            isError: true,
            message: `Information of ${person.name} has already been removed from server`,
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter((p) => p.id !== person.id))
          console.log(`Error removing person from list: ${error}`)
        })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => {
      return person.name === newName
    })

    if (
      existingPerson &&
      window.confirm(
        `${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`
      )
    ) {
      handleUpdate(existingPerson)
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personsService
        .add(personObject)
        .then((newPerson) => {
          setPersons(persons.concat(newPerson))
          setNewName("")
          setNewNumber("")
          setMessage({
            isError: false,
            message: `Added '${newPerson.name}'`,
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setMessage({
            isError: false,
            message: `Error adding ${newName}`,
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          console.log(`Error adding person to list: ${error}`)
        })
    }
  }

  useEffect(() => {
    personsService
      .getAll()
      .then((personList) => {
        setPersons(personList)
      })
      .catch((error) => {
        console.log(`Error getting person list: ${error}`)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleSubmit={handleSubmit}
        handleNumberChange={handleNumberChange}
        handleNameChange={handleNameChange}
      />
      <h2>Numbers</h2>
      <div>
        <Persons
          persons={persons}
          filter={filter}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default App
