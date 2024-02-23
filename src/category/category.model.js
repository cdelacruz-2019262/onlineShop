import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    versionKey: false //Desahabilitar el _v (version del documento)
})

export default model('category', categorySchema)