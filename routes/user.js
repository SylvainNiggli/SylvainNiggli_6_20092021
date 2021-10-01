const express = require('express');
const userCtrl = require('../controllers/user');

const router = express.Router();

/*-- POST -- */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/*-- GET -- */
router.get('/signup', userCtrl.getAllUsers);

/*-- DELETE -- */
router.delete('/signup/:email', userCtrl.deleteUser);
module.exports = router;