const express = require('express')
const ProductManager = require('../manager/products.js')
const CartManager = require('../manager/cart.js')
const router = express.Router()

const productService = new ProductManager()
const cartService = new CartManager()

let admin = true

const middleWare = (req,res,next) => {
    admin ? next() : res.send({status:'error',message:'only available as admin'})
}

router.get('/products',(req,res)=>{
    productService.get()
    .then(r=>res.send(r))
})

router.post('/products',middleWare,(req,res)=>{
    let product = req.body
    productService.add(product)
    .then(r=>res.send(r))
})

router.get('/products/:id',(req,res)=>{
    let id = parseInt(req.params.id)
    productService.getById(id)
    .then(r=>res.send(r))
})

router.put('/products/:id',middleWare,(req,res)=>{
    let id = parseInt(req.params.id)
    let updatedProduct = req.body
    productService.update(id,updatedProduct)
    .then(r=>res.send(r))
})

router.delete('/products/:id',middleWare,(req,res)=>{
    let id = parseInt(req.params.id)
    productService.delete(id)
    .then(r=>res.send(r))
})

router.post('/cart',(req,res)=>{
    cartService.new()
    .then(r=>res.send(r))
})

router.delete('/cart/:id',(req,res)=>{
    let id = req.params.id
    cartService.delete(id)
    .then(r=>res.send(r))
})

router.get('/cart/:id/products',(req,res)=>{
    let id = req.params.id
    cartService.get(id)
    .then(r=>res.send(r.payload.products))
})

router.post('/cart/:id/products',(req,res)=>{
    let id = req.params.id
    let idProd = req.body.id
    cartService.add(id,idProd)
    .then(r=>res.send(r))
})

router.delete('/cart/:id/products/:idProd',(req,res)=>{
    let id = req.params.id
    let idProd = req.params.idProd
    cartService.deleteProd(id,idProd)
    .then(r=>res.send(r))
})

module.exports = router