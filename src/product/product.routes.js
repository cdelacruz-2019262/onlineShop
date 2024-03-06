'use strict'

import { Router } from "express"
import { test, save, get, search, erase, update} from './product.controller.js'

const api = Router()

api.get('/test', test)
api.post('/save', save)
api.get('/get', get)
api.post('/search', search)
api.delete('/delete/:id', erase)
api.put('/update/:id', update)


export default api