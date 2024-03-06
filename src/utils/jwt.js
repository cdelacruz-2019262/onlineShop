'use strict'

import jwt from 'jsonwebtoken'
const SECREY_KEY = 'llavesita'

export const generateJwt = async (payload) => {
    try {
        return jwt.sign(payload, SECREY_KEY, {
            expiresIn: '3h',
            algorithm: 'HS256'
        })
    } catch (err) {
        console.error(err)
        return err
    }
}