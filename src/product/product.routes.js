'use strict'

import { Router } from "express"
import { test, save, get, search, erase, update, searchByCategory, searchOutOfStock} from './product.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test', test)
api.post('/save', [validateJwt, isAdmin], save)
api.get('/get', get)
api.post('/search',  search)
api.post('/search/category',  searchByCategory)
api.get('/search/outOfStock',  searchOutOfStock)
api.delete('/delete/:id', [validateJwt, isAdmin], erase)
api.put('/update/:id', [validateJwt, isAdmin], update)


export default api