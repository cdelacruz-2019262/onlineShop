'use strict'

import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'
import { Router } from "express"
import {printBill, test} from './bill.controller.js'

const api = Router()

api.get('/test', test)
api.get('/print', [validateJwt], printBill)

export default api