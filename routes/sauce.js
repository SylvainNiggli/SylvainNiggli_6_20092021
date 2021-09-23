const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/*-- POST -- */
router.post('/', auth, multer, sauceCtrl.setOneSauce);
router.post('/:id/like', auth, sauceCtrl.setSauceLikeStatus);

/*-- GET -- */
router.get('/', auth, sauceCtrl.getAllSauces); 
router.get('/:id', auth, sauceCtrl.getOneSauce);
 
 /*-- PUT -- */
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
 
  /*-- DELETE -- */
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;