const User = require('../Models/User')
const bcrypt = require('bcrypt')

async function hashPassowrd(password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)

    return encryptedPassword
  } catch(error){
    return error
  }
}

const UserController = {
    async store(req, res) {
     const { name, whatsapp, email, password, latitude, longitude } = req.body

     const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    }

    try{
      const userAlreadyExists = await User.findOne({ email })
      
      if (userAlreadyExists) return res.status(404).send({ message: "User already exists"})

      const hashedPassword = await hashPassowrd(password) 

      const user = await User.create({  name, whatsapp, email, password: hashedPassword, location })
    
      return res.status(201).send(user) 
    }

     
    
     catch(error) {
        return res.status(404).send(error)
    }
  },

  async delete(req, res) {
    const { user_id } = req.params

    const { auth } = req.headers 

    if (user_id !== auth) return res.status(400).send({ message: 'Unauthorized'})
    try {
      const deletedUser = await User.findByIdAndDelete(user_id)

      return res.status(200).send({ status: "deleted", user: deletedUser})
    } catch (error) {
      return res.status(404).send(error)
    }
  },
  async index(req, res) {
    try {
      const allUsers = await User.find()

      return res.status(200).send(allUsers)
    } catch (error) {
      return res.status(404).send(error)
    }
  }
}

 
module.exports = UserController