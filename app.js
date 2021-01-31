const express = require('express');
const users = require('./routes/users')
const todos = require('./routes/todos')
const config = require('./middleware/config')
const authMiddleWare = require('./middleware/auth');



const app = express()

////middleware
app.use(config)

///USERS

app.use('/api/users', users)

////TODOS

app.use('/api/todos', authMiddleWare ,todos)







 
app.listen(3000)