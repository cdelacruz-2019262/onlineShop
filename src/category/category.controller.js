'use strict'

import { checkCategoryUpdate } from '../utils/validator.js'
import Category from './category.model.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

export const save = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ message: `category is saved seccesfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving category' })
    }
}

export const get = async (req, res) => {
    try {
        let category = await Category.find()
        return res.send({ category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting category' })
    }
}

export const search = async (req, res) => {
    try {
        let { search } = req.body
        let category = await Category.find(
            { name: search }
        )
        if (!category) return res.status(404).send({ menssage: 'Category not found' })
        return res.send({ menssage: 'Category found', category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ menssage: 'Error searching category' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkCategoryUpdate(data, id)
        if (!update) return res.status(404).send({ menssage: 'Have submitted some data that cannot be updated or missing data' })
        let updateCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send({menssage: 'Category is not found and not upadate'})
        return res.send({message: 'Update new', updateCategory})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating category' })
    }
}

export const erase = async (req, res) => {
    try {
        let { id } = req.params
        let deletedCategory = await Category.findOneAndDelete({ _id: id })
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found and not deleted' })
        return res.send({ message: `Deleted category with name  ${deletedCategory.name} successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting category' })
    }
}

export const defaultCategory = async (req, res) => {
    try {
        const categoryExist = await Category.findOne({ name: 'miscellaneous' })

        if (categoryExist) {
            return console.log('The miscellaneous category already exists')
        }
        let data = {
            name: 'miscellaneous',
            description: 'uncategorized articles'
        }
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'Updated category', data })
    } catch (err) {
        console.error(err)
    }
}