const fs = require('fs')
const ProductManager = require('./products.js')

const productService = new ProductManager()

const pathToCart = __dirname+'/../files/carts.json'
const pathToProducts = __dirname+'/../files/products.json'

const fetch = async () => {
    let data = await fs.promises.readFile(pathToCart,'utf-8')
    let carts = JSON.parse(data)
    return carts
}

class CartManager {
    new = async () => {
        if(fs.existsSync(pathToCart)) {
            try {
                let carts = await fetch()
                if(carts.length === 0) {
                    let cart = {}
                    cart.id = 1
                    cart.timestamp = Date.now()
                    cart.products = []
                    carts.push(cart)
                    await fs.promises.writeFile(pathToCart,JSON.stringify(carts,null,2))
                    return {status:'success', message:`Cart added with ID:${cart.id}`}
                } else {
                    let cart = {}
                    cart.id = carts[carts.length-1].id+1
                    cart.timestamp = Date.now()
                    cart.products = []
                    carts.push(cart)
                    await fs.promises.writeFile(pathToCart,JSON.stringify(carts,null,2))
                    return{status:'success', message:`Cart added with ID:${cart.id}`}
                }
            } catch (error) {
                return{status:'error',error:error}
            }
        } else {
            try {
                let cart = {}
                cart.id = 1
                cart.timestamp = Date.now()
                cart.products = []
                await fs.promises.writeFile(pathToCart,JSON.stringify([cart],null,2))
                return {status:'success', message:`Cart added with ID:${cart.id}`}
            } catch (error) {
                return{status:'error',error:error}
            }
        }
    }

    delete = async (id) => {
        if(!id) return {status: 'error', error:'Id needed'}
        if(fs.existsSync(pathToCart)){
            try {
                let carts = await fetch()
                if(id<0||id>carts.length)return{status:'error',message:'ID invalid'}
                let newCarts = carts.filter(cart => cart.id != id)
                newCarts.map(cart => {
                    cart.id = newCarts.indexOf(cart)+1
                    cart.timestamp = cart.timestamp
                    cart.products = cart.products
                })
                await fs.promises.writeFile(pathToCart,JSON.stringify(newCarts,null,2))
                return{status:'success',message:'Cart deleted'}
            } catch (error) {
                return{status:'error',error:error} 
            }
        }
    }

    get = async (id) => {
        if(!id) return {status: 'error', error:'Id needed'}
        if(fs.existsSync(pathToCart)){
            try {
                let carts = await fetch()
                let cart = carts.find(cart => cart.id == id)
                if(cart)return{status:'success',payload:cart}
                return{status:'error',message:'cart doesnt exist'}
            } catch (error) {
                return{status:'error',error:error}
            }
        }
    }

    add = async (id,idProd) => {
        if(!id) return {status: 'error', error:'Id nedded'}
        if(!idProd) return {status:'error', message:'Id of product nedded'}
        if(!fs.existsSync(pathToProducts))return{status:'error',message:'No products available'}
        if(fs.existsSync(pathToCart)){
            try {
                let carts = await fetch()
                if(id<0||id>carts.length)return{status:'error',message:'cart ID invalid'}
                let cart = (await this.get(id)).payload.products
                let product = (await productService.getById(idProd))
                if(!product.payload)return{status:'error',message:'Id of product is invalid'}
                if(product.payload.stock < 1)return{status:'error',message:'Product out of stock'}
                let exist = 0
                cart.forEach(prod => {if(prod.idProd == idProd) exist = 1})
                if(exist)return{status:'error',message:'Product already added to cart'}
                cart.push({idProd:product.payload.id})
                let newCarts = carts.map(c => {
                    if(c.id == id){
                        c.products = cart
                        return c
                    } else {
                        return c
                    }
                })
                await fs.promises.writeFile(pathToCart,JSON.stringify(newCarts,null,2))
                return{status:'success',message:`Product added to cart ${id}`}   
            } catch (error) {
                return{status:'error',error:error}
            }
        }
    }

    deleteProd = async (id,idProd) => {
        if(!id) return {status: 'error', error:'Id needed'} 
        if(!idProd) return {status: 'error', error:'Id of product nedded'}
        if(fs.existsSync(pathToCart)) {
            try {
                let carts = await fetch()
                let cart = await this.get(id)
                if(cart.message)return{status:'error',message:'Cart doesnt exist'}
                let exist = 0
                cart.payload.products.forEach(prod => {if(prod.idProd == idProd) exist = 1})
                if(!exist)return{status:'error',message:'Product Id invalid'}
                let newCart = cart.payload.products.filter(prod => prod.idProd != idProd)
                let newCarts = carts.map(c => {
                    if(c.id == id){
                        c.products = newCart
                        return c
                    } else {
                        return c
                    }
                })
                await fs.promises.writeFile(pathToCart,JSON.stringify(newCarts,null,2))
                return{status:'success',message:`Product with id:${idProd} deleted from cart with id:${id}`}
            } catch (error) {
                return{status:'error',error:error}
            }
        }
    }
}

module.exports = CartManager