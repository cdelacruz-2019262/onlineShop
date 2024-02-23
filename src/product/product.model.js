import mongoose, {Schema} from "mongoose";

const productSchema = mongoose.Schema({
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

export default mongoose.model('product', productSchema)