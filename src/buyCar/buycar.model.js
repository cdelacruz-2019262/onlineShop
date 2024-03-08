import { Schema, model } from "mongoose";

const buyCarSchema = Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: false
        },
        amount: {
            type: Number,
            required: false
        }
    }],
    total: {
        type: Number,
        required: false
    }
}, {
    versionKey: false 
})

export default model('buyCar', buyCarSchema)
