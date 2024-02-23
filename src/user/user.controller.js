import User from './user.model.js'
import { encrypt, checkPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const saveClient = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({ message: `user is saved seccesfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving user' })
    }
}

/*export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ username })
        if (!user) { return res.status(404).send({ message: 'User not found' });}
        
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({ message: `welcome ${loggedUser.name}`, loggedUser, token })
        }
        return res.status(404).send({message: 'Invalid credentials'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}*/