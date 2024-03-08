import BuyCar from '../buyCar/buyCar.model.js'
import Product from '../product/product.model.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

export const addProduct = async (req, res) => {
    try {
        let { product, amount } = req.body
        let uid = req.user._id

        let car = await BuyCar.findOne({ user: uid })
        if (req.user.role === 'ADMIN') {
            return res.send({ message: 'An admin cant buy ando use a shopping car' })
        }
        if (!car && req.user.role !== 'ADMIN') {
            car = new BuyCar({ client: uid, products: [] })
        }

        let items = await Product.findById(product)
        if (!items) {
            return res.status(404).send({ message: 'Product not found' })
        }
        if (items.stock < amount) {

            return res.status(404).send({ message: 'Insufficient products' })
        }
        items.stock = items.stock - parseInt(amount)
        await items.save()

        let existence = car.products.findIndex(item => item.product.toString() === product.toString())
        if (existence !== -1) {
            car.products[existence].amount += parseInt(amount)
        } else {
            car.products.push({ product: product, amount: parseInt(amount) })
        }
        let total = 0;
        for (let item of car.products) {
            let product = await Product.findById(item.product);
            if(product){
                total += product.price * item.amount
                console.log(total)
            }
        }
        car.total = total
        await car.save()
        return res.send({ message: 'Has been successfully added to the shopping car' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error adding products', err: err })
    }
}

export const removeProduct = async (req, res) => {
    try {
        let { product, amount } = req.body
        let uid = req.user._id

        let car = await BuyCar.findOne({ user: uid })
        if (!car && req.user.role !== 'ADMIN') {
           return res.status(403).send({message:'You do not have any shopping car'}) 
        }

        let items = await Product.findById(product)
        if (!items) {
            return res.status(404).send({ message: 'Product not found' })
        }
        if (car.amount < amount) {
            return res.status(404).send({ message: 'Insufficient products in buy car' })
        }
        items.stock = items.stock + parseInt(amount)
        
        let existence = car.products.findIndex(item => item.product.toString() === product.toString())
        if (existence !== -1) {
            if (existence !== -1) {     
                car.products[existence].amount -= parseInt(amount)
            }
        }
        await items.save()
        await car.save()
        return res.send({ message: 'Has been successfully removed product to the shopping car' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error adding products', err: err })
    }
}