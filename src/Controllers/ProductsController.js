const Product = require('../Models/Product')
const User = require('../Models/User')


const ProductsController = {
  async store(req, res) {
    const { name, price, user } = req.body
    const { user_id } = req.params 
    const { auth } = req.headers 

    if (user_id !== auth) return res.status(400).send({ message: 'Unauthorized'})

    try {
      const userInfo = await User.findById(user_id)

      const { location } = userInfo
      const longitude = location.coordinates[0]
      const latitude = location.coordinates[1]

      const setLocation = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
      const createdProduct = await Product.create({ name, price, user: user_id, location: setLocation, order: randomNumberOrder  })

      return res.status(201).send(createdProduct)
    } catch (error) {
      return res.status(404).send(error)
    }
  },
   async delete(req, res) {
    const { product_id, user_id } = req.params 

    const { auth } = req.headers 

    if (user_id !== auth) return res.status(400).send({ message: 'Unauthorized'})

    try {
      const deletedProduct = await Product.findByIdAndDelete(product_id)

      return res.status(200).send({ status: "deleted", product: deletedProduct })
    } catch (error) {
      return res.status(404).send(error)
    }
  },
  async indexByUser(req, res) {
    const { user_id } = req.params 

    const { auth } = req.headers 

    if (user_id !== auth) return res.status(400).send({ message: 'Unauthorized'})

    try {
      const allProductsOfAUser = await Product.find({
        user: user_id
      }).populate("user")

      return res.status(200).send(allProductsOfAUser)
    } catch (error) {
      return res.status(404).send(error)
    }
  },
  async indexAll(req, res) {
    const { longitude, latitude } = req.query 

    const maxDistance = 10000
    try {
      const allProduct = await Product.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      }).populate("user").limit(40)

      return res.status(200).send(allProduct)
    } catch (error) {
      return res.status(404).send(error)
    }
  } 
}

module.exports = ProductsController