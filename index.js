const express = require("express");
const cors = require("cors");
var morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(express.static('build'))

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    function (tokens, req, res) {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens.body(req, res),
      ].join(" ");
    },
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

let persons = require("./persons.json");

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const info = `<div>Phonebook has info for ${
    Object.keys(persons).length
  } people</div><div>${date}</div>`;
  res.send(info);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generatePersonId = () => {
  min = Math.ceil(1);
  max = Math.floor(10000000);
  return Math.floor(Math.random() * (max - min) + min);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  } else if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generatePersonId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
