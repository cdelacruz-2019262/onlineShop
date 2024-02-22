import { initServer } from "./configs/app.js"
import { connect } from "./configs/mongo.js"

connect()
initServer()