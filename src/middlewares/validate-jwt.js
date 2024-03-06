'use strict'

import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'
const SECREY_KEY = 'llavesita'

export const validateJwt = async(req, res, next)=>{
    try{
        //let secretKey = SECRET_KEY
        let { authorization } = req.headers
        console.log(req.headers)
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let { uid } = jwt.verify(authorization, SECREY_KEY)
        let user = await User.findOne({_id: uid})
        if(!user) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token', err:err})
    }
}

