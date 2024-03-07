import { Router } from "express";
import { test, saveClient, login, update, erase, saveAdmin, updatePassword } from "./user.controller.js"
import { validateJwt, isAdmin } from "../middlewares/validate-jwt.js";

const api = Router();

api.get('/test', test)
api.post('/save/client', saveClient)
api.post('/save/admin', [validateJwt, isAdmin], saveAdmin)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt] ,erase)
api.put('/update/password/:id', [validateJwt], updatePassword)

export default api