const { addTrans,getTrans, delTrans, transById, updateTransById, summary, filterByCategory, filterByDate } = require('../controllers/IncomeController')
const { register, login } = require('../controllers/userController')

const Authenticate = require('../Middleware')

const router = require('express').Router()

router.post('/transactions',Authenticate,addTrans)

router.get('/transactions',Authenticate,getTrans)

router.get('/transactions/:id',Authenticate,transById)

router.put('/transactions/:id',Authenticate,updateTransById)

router.delete('/transactions/:id',Authenticate,delTrans)

router.get('/summary',Authenticate,summary)

router.post('/filter',Authenticate,filterByCategory)


//users
router.post('/register',register)

router.post('/login',login)


module.exports = router