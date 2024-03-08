import { Schema, model } from "mongoose";

const billSchema = Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
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

export default model('bill', billSchema)