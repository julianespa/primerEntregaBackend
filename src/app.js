const express = require("express")
const productsRouter = require('./routes/products.js')
const cartRouter = require('./routes/carts.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products',productsRouter)
app.use('/api/cart',cartRouter)

const PORT = process.env.PORT || 8080
const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))