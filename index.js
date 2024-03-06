import { initServer } from "./configs/app.js"
import { connect } from "./configs/mongo.js"
import { defaultUser } from "./src/user/user.controller.js"

connect()
initServer()
defaultUser()