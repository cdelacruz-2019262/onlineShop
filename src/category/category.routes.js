'use strict'

import { Router } from 'express'
import { test, save, get } from './category.controller.js'

const api = Router()

api.get('/test', test)
api.post('/save', save)
api.get('/get', get)

export default api