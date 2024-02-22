import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    versionKey: false //Desahabilitar el __v (version del documento)
})

export default model('category', categorySchema)