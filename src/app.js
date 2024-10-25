const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const fs = require("fs")
const path = require('path');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

//configuracion de cors que no sé quién quitó

app.use(
    cors({
        methods: "GET, PATCH, PUT, POST, DELETE",
        origin: '*',
        optionsSuccessStatus: 200,
        credentials: true,
      })
);


app.get('/expenses', (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf-8', (err, data) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Error reading database' });
      }
      res.json(JSON.parse(data).expenses);
    });
  });
  
  // Ruta para agregar un nuevo gasto
  app.post('/expenses', (req, res) => {
    const newExpense = req.body;
  
    fs.readFile(path.join(__dirname, 'db.json'), 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading database' });
      }
  
      const json = JSON.parse(data);
      newExpense.id = json.expenses.length ? json.expenses[json.expenses.length - 1].id + 1 : 1;
      json.expenses.push(newExpense);
  
      fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(json, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing to database' });
        }
        res.status(201).json(newExpense);
      });
    });
  });
  
  // Ruta para actualizar un gasto existente
  app.patch('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const updatedExpense = req.body;
  
    fs.readFile(path.join(__dirname, 'db.json'), 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading database' });
      }
  
      const json = JSON.parse(data);
      const index = json.expenses.findIndex(exp => exp.id == id);
  
      if (index === -1) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      json.expenses[index] = { ...json.expenses[index], ...updatedExpense };
  
      fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(json, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing to database' });
        }
        res.json(json.expenses[index]);
      });
    });
  });
  
  // Ruta para eliminar un gasto
  app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;
  
    fs.readFile(path.join(__dirname, 'db.json'), 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading database' });
      }
  
      const json = JSON.parse(data);
      const index = json.expenses.findIndex(exp => exp.id == id);
  
      if (index === -1) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      json.expenses.splice(index, 1);
  
      fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(json, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing to database' });
        }
        res.status(204).send();
      });
    });
  });
  

module.exports = app;
