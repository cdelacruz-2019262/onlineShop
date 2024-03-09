'use strict'

import Bill from '../bill/bill.model.js';
import Product from './product.model.js'
import Category from '../category/category.model.js';
import { checkProductUpdate } from '../utils/validator.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

export const save = async (req, res) => {
    try {
        let data = req.body
        let product = new Product(data)
        await product.save()
        return res.send({ message: `product is saved seccesfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving product' })
    }
}

export const get = async (req, res) => {
    try {
        let product = await Product.find().populate('category')
        return res.send({ product })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting product' })
    }
}

export const search = async (req, res) => {
    try {
        let { search } = req.body
        let product = await Product.find(
            { name: { $regex: search, $options: 'i' } }
        ).populate('category')
        if (products.length === 0) return res.status(404).send({ menssage: 'Product not found' })
        return res.send({ menssage: 'Product found', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ menssage: 'Error searching product' })
    }
}

export const searchByCategory = async (req, res) => {
    try {
        let { search } = req.body
        let category = await Category.find(
            { name: search }
        ).select('_id')
        if (!category) return res.status(404).send({ menssage: 'category not found' })
        let product = await Product.find(
            { category: category }
        ).populate('category')
        return res.send({ menssage: 'Product found', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ menssage: 'Error searching product' })
    }
}

export const searchOutOfStock = async (req,res) => {
    try{
        let product = await Product.find({stock: 0})
        return res.send({ menssage: 'Out of stock products found', product })
    }catch(err){
        console.error(err)
        return res.status(500).send({ menssage: 'Error searching out of stock product' })
    }
}

export const getMostSoldItems = async (req, res) => {
    try {
        const bills = await Bill.find();

        // Crear un objeto para almacenar la cantidad de ventas de cada producto
        let soldItems = {};

        //contar la cantidad de cada producto vendido
        bills.forEach(bill => {
            bill.products.forEach(product => {
                const productId = product.product;
                const amount = product.amount;

                if (soldItems[productId]) {
                    soldItems[productId] += amount;
                } else {
                    soldItems[productId] = amount;
                }
            });
        });

        // Ordenar los productos por la cantidad vendida en orden descendente
        const sortedProductos = Object.entries(soldItems).sort((a, b) => b[1] - a[1]);

        // Obtener los detalles de los productos más vendidos
        let mostSoldItems = [];
        for (let [productId, quantity] of sortedProductos) {
            const product = await Product.findById(productId);
            if (product) {
                mostSoldItems.push({ product, quantity });
            }
        }

        return res.send({ message: 'Productos más vendidos encontrados', mostSoldItems });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener los productos más vendidos' });
    }
}

export const erase = async (req, res) => {
    try {
        let { id } = req.params
        let deletedProduct = await Product.findOneAndDelete({ _id: id })
        if (!deletedProduct) return res.status(404).send({ message: 'Product not found and not deleted' })
        return res.send({ message: `Deleted product with name ${deletedProduct.name} successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting product' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params

        if (data.category) {
            return res.status(400).send({ message: 'you can`t update a foreign key' });
        }

        let update = checkProductUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedProduct) return res.status(404).send({ message: 'Product not found and not updated' })
        return res.send({ message: 'Product updated successfully', updatedProduct })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating product' })
    }
}
