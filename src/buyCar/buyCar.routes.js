'use strict'

import { Router } from 'express'
import { test, addProduct, removeProduct } from './buyCar.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test', test)
api.put('/add/product', [validateJwt], addProduct)
api.put('/remove/product', [validateJwt], removeProduct)


export default api