const { Router } = require('express')
const UserController = require('../Controllers/UserController')
const SessionController = require('../Controllers/SessionController')
const ProductsController = require('../Controllers/ProductsController')


const routes = Router()

routes.get('/', (req, res) => {
  res.send('Hello Koe')
})

routes.post('/user', UserController.store)
routes.get('/user', UserController.index)
routes.delete('/user/:user_id', UserController.delete)

routes.post('/session', SessionController.create)

routes.post('/:user_id/product', ProductsController.store)
routes.delete('/:user_id/product/:product_id', ProductsController.delete)
routes.get('/products', ProductsController.indexAll)
routes.get('/products/:user_id', ProductsController.indexByUser)



module.exports = routes