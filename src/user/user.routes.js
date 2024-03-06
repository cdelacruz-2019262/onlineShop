import { Router } from "express";
import { test, saveClient, login, update, erase } from "./user.controller.js"
import { validateJwt } from "../middlewares/validate-jwt.js";

const api = Router();

api.get('/test', test)
api.post('/save/client', saveClient)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt] ,erase)

export default api