const express = require('express')
const app = express()
const port = process.env.PORT || 3333
const mongoose = require('mongoose')
require('dotenv').config()
const router = require('./routes/router')
const cors = require('cors')


mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, console.log('Connected to database'))

app.use(cors())
app.use(express.json())
app.use(router)

app.listen(port, () => console.log(`Server is loading on port ${port}`))