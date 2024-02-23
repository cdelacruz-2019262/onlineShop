'use strict'

import express from "express"
import { config } from "dotenv"
import morgan from "morgan"
import helmet from 'cors'
import cors from 'cors'
import categoryRoutes from "../src/category/category.routes.js"
import productRoutes from "../src/product/product.routes.js"

//Configs
const app = express()
config();
const port = process.env.PORT || 3056

//Configs del server
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) //Aceptar o denegar solicitudes de diferentes orígenes (local, remoto) / políticas de acceso
app.use(helmet()) //Aplica capa de seguridad básica al servidor
app.use(morgan('dev')) //Logs de solicitudes al servidor HTTP

//declaracion de rutas
app.use('/category', categoryRoutes)
app.use('/product', productRoutes)


//levantar el server(revisar que si prende)
export const initServer = ()=>{
    app.listen(port)
    console.log(`server is running in port ${port}`)
}