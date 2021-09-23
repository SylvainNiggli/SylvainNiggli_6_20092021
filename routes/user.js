const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

/*-- POST -- */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/signup', userCtrl.getAllUsers);
router.delete('/signup/:email', userCtrl.deleteUser);
module.exports = router;