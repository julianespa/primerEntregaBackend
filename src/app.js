const express = require("express")
const productsRouter = require('./routes/routers')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',productsRouter)

const PORT = process.env.PORT || 8080
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))