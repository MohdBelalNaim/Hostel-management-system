const express = require('express')
const app = express()
const port = process.env.PORT||5000
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Belal:Belal@cluster0.cegld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo')
})
mongoose.connection.on('error',(err)=>{
    console.log(err)
}) 

app.use(express.json())

app.use(cors())
app.use('/auth',require('./routes/auth'))
app.use('/student',require('./routes/student'))
app.use('/room',require('./routes/rooms'))
app.use('/fees',require('./routes/fees'))

app.listen(port,()=>{
    console.log("App is running on ",port)
})