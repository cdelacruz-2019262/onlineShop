'use strict'

import { Schema, model } from "mongoose"

const userSchema = Schema({
    name:{
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
        minLegth: 8,
        maxLeght: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'CLIENT']
    }
})

export default model('user', userSchema)