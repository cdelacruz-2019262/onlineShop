import BuyCar from '../buyCar/buycar.model.js'

export const addProduct = async (req, res) => {
    try{
        const carrito = await BuyCar.findById(buyCarId)
    }catch(err){
        console.error(err)
        return res.status(500).send({ message: 'Error adding products', err: err })
    }
}