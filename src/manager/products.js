const fs = require('fs')

const pathToProducts = __dirname+'/../files/products.json'

const fetch = async () => {
    let data = await fs.promises.readFile(pathToProducts,'utf-8')
    let products = JSON.parse(data)
    return products
}

class ProductManager {
    add = async (product) =>{
        if(!product.name||!product.description||!product.code||!product.image||!product.price||!product.stock)return{status:'error',message:'data mising'}
        if(fs.existsSync(pathToProducts)) {
            try {
                let products = await fetch()
                let exist = 0
                products.forEach(prod => {if(prod.code == product.code){exist = 1}})
                if(exist)return{status:'error',message:'product already added'}
                if(products.length === 0){
                    product.id = 1
                    product.timestamp = Date.now()
                    products.push(product)
                    await fs.promises.writeFile(pathToProducts,JSON.stringify(products,null,2))
                    return {status: 'success', message:'Product added successfully'}
                } else {
                    product.id = products[products.length-1].id+1
                    product.timestamp = Date.now()
                    products.push(product)
                    await fs.promises.writeFile(pathToProducts,JSON.stringify(products,null,2))
                    return {status: 'success', message:'Product added successfully'}
                }
            } catch (error) {
                return {status:"error",error:error}
            }
        } else {
            try {
                product.id = 1
                product.timestamp = Date.now()
                await fs.promises.writeFile(pathToProducts,JSON.stringify([product],null,2))
                return {status: 'success', message:'Product added successfully'}    
            } catch (error) {
                return {status:"error",error:error}
            }
        }
    }

    get = async () => {
        if(fs.existsSync(pathToProducts)) {
            try {
                let products = await fetch()
                return {status:'success',payload:products}
            } catch (error) {
                return {status:"error",error:error}
            }
        } else {
            return {status:'success',payload:[]}
        }
    }

    getById = async (id) => {
        if(!id) return {status:'error', message:'ID nedded'}
        if(fs.existsSync(pathToProducts)){
            try {
                let products = await fetch()
                let product = products.find(product => product.id == id)
                if(product){return{status:'success',payload:product}}
                else{return{status:'error',message:'ID not found'}}
            } catch (error) {
                return {status:"error",error:error}
            }
        } else {
            return {status:'success',payload:[]}
        }
    }

    update = async (id, updatedProduct) => {
        if(!id) return {status: 'error', error:'Id nedded'}
        if(!updatedProduct.name||!updatedProduct.description||!updatedProduct.code||!updatedProduct.image||!updatedProduct.price||!updatedProduct.stock)return{status:'error',message:'data mising'}
        if(fs.existsSync(pathToProducts)){
            try {
                let products = await fetch()
                if(id<0||id>products.length)return{status:'error',message:'Invalid ID'}
                let newProducts = products.map(product => {
                    if(product.id == id){
                        updatedProduct.id = id
                        updatedProduct.timestamp = Date.now()
                        return updatedProduct
                    } else {
                        return product
                    }
                })
                await fs.promises.writeFile(pathToProducts,JSON.stringify(newProducts,null,2))
                return {status: 'succes', message:'Product updated'}
            } catch (error) {
                return {status:"error",error:error}
            }
        }
    }

    delete = async (id) => {
        if(!id) return {status: 'error', error:'Id needed'}
        if(fs.existsSync(pathToProducts)) {
            try {
                let products = await fetch()
                if(id<0||id>products.length)return{status:'error',message:'Invalid ID'}
                let newProducts = products.filter(product => product.id != id)
                newProducts.map(product => {
                    product.id = newProducts.indexOf(product)+1
                    product.timestamp = product.timestamp
                    product.name = product.name
                    product.description = product.description
                    product.code = product.code
                    product.img = product.img
                    product.price = product.price
                    product.stock = product.stock
                })
                await fs.promises.writeFile(pathToProducts,JSON.stringify(newProducts,null,2))
                return {status:'success', message:'Product deleted'}
            } catch (error) {
                return {status:"error",error:error}
            }
        }
    }

    deleteAll = async () => {
        if(fs.existsSync(pathToProducts)) {
            await fs.promises.unlink(pathToProducts)
            return {status:'success', message:'All products deleted'}
        }
    }
}

module.exports = ProductManager