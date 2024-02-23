import  {Schema, model} from "mongoose";

const productSchema = Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
})

export default model('product', productSchema)