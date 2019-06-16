var express = require('express');
const passport = require('passport');
var router = express.Router();

var IndexController = require('../controllers/index_controller');
var UpdateInfoController = require('../controllers/account_management');
var UtilController = require('../controllers/util_controller');

router.get('/',IndexController.home);

router.get('/dang-nhap',IndexController.loginGet);

router.get('/dang-ky',IndexController.registerGet);

router.post('/dang-nhap',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/dang-nhap'
}));

router.post('/dang-ky',IndexController.registerPost);
router.get('/dang-xuat',IndexController.logout);

router.get('/quen-mat-khau', IndexController.accountRecovery);

router.get('/web-parser',UtilController.parseWebsite);
router.get('/normalize',UtilController.normalize);

module.exports = router;


