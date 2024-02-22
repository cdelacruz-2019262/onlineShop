'use strict'

import Category from './category.model.js'

export const test = (req, res) =>{ 
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

export const save = async(req, res) =>{
    try{
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ message: `category is saved seccesfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({ message: 'Error saving category' })
    }
}

export const get = async (req, res) => {
    try{
        let category = await Category.find()
        return res.send({ category })
    }catch(err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting category' })
    }
}
