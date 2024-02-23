import express, { Router } from "express";
import { test, saveClient, login } from "./user.controller.js"

const api = Router();

api.get('/test', test)
api.post('/save/client', saveClient)
api.post('/login', login)

export default api