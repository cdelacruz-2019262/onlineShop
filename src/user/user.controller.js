import User from './user.model.js'
import BuyCar from '../buyCar/buyCar.model.js'
import { encrypt, checkPassword, checkUserUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const saveClient = async (req, res) => {
    try {
        let data = req.body
        let exist = await User.findOne({
            $or: [
                { user: data.username },
                { email: data.email }
            ]
        })
        if (exist) return res.send({ message: 'username or email is repeat' })
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        let buyCar = new BuyCar({ user: user._id });
        await buyCar.save();
        return res.send({ message: `user is saved seccesfully and buy car for ${data.username} is added` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving user', err: err })
    }
}

export const saveAdmin = async (req, res) => {
    try {
        let data = req.body
        let exist = await User.findOne({
            $or: [
                { user: data.username },
                { email: data.email }
            ]
        })
        if (exist) return res.send({ message: 'username or email is repeat' })
        data.password = await encrypt(data.password)
        data.role = 'ADMIN'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Admin is saved seccesfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving admin', err: err })
    }
}

//login del usuario
export const login = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let user = await User.findOne({
            //un or para elegir entre uno u otro
            $or: [
                { username },
                { email }
            ]
        })
        //Verifico que la contraseña coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`,
                    loggedUser,
                    token
                }
            )
        }

        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async (req, res) => {
    try {
        const tokenId = req.user;
        let { id } = req.params
        if (tokenId._id.toString() === id || req.user.role === 'ADMIN') {
            let data = req.body
            let update = checkUserUpdate(data, id)
            if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: id },
                data,
                { new: true }
            )
            //Validar la actualización
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            //Respondo al usuario
            return res.send({ message: 'Updated user', updatedUser })
        }
        return res.status(403).send({ message: 'Forbidden - You are not allowed or admin to update this account' });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account', err: err })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const token = req.user;
        const { id } = req.params;
        if (token._id.toString() === id) {
            const { newPassword, actualPassword } = req.body;

            if (!actualPassword || !newPassword) {
                return res.status(400).send({ message: 'Missing current or new password in request body' });
            }
            const originalPassword = checkPassword(token.password,
                 actualPassword)
            if (originalPassword) {
                
                const encriptedPassword = await encrypt(newPassword)
                const updatedPassword = await User.findOneAndUpdate(
                    { _id: id },
                    { password: encriptedPassword },
                    { new: true }
                );
                // Validar la actualización
                if (!updatedPassword) {
                    return res.status(401).send({ message: 'User not found or password not updated' });
                }

                // Responder al usuario
                return res.send({ message: 'Updated password', updatedPassword })
            }
            return res.send({ message: 'this is not your actual password' })
        }
        return res.send({ message: 'this not is your account' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating password', err: err })
    }

}

export const erase = async (req, res) => {
    try {
        const tokenId = req.user;
        let { id } = req.params
        let { validate } = req.body
        if (!validate) return res.status(400).send({message: 'Write autorization word "CONFIRM"'})
        if (validate !== 'CONFIRM') return res.status(400).send({message: 'This is not the authorization word "CONFIRM"'})
        if (tokenId._id.toString() === id || req.user.role === 'ADMIN') {
            let deletedUser = await User.findOneAndDelete({ _id: id })
            if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
            return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
        }
        return res.status(403).send({ message: 'Forbidden - You are not allowed to delete this account' });

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}

export const defaultUser = async (req, res) => {
    try {
        const userExist = await User.findOne({ username: 'default' })

        if (userExist) {
            return console.log('The default user already exists')
        }
        let data = {
            name: 'Default',
            surname: 'default',
            username: 'default',
            email: 'default@gmail.com',
            password: await encrypt('1'),
            role: 'ADMIN'
        }
        let user = new User(data)
        await user.save()
        return res.send({ message: 'Updated user', data })
    } catch (err) {
        console.error(err)
    }
}