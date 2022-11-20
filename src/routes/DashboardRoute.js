const router = require("express").Router();
 const { getOnlineMeters, mappedMetersCount , performance} = require('../controllers/DashboardController')

 const { createPasswordHash, comparePassword, generateAccessToken, verifyAccess, authorize } = require('../controllers/userController')
 
 const permissions = {
    admin: 'admin',
    developer: 'developer',
    legal: 'legal',
    analyst: 'analyst',
    support: 'support'
}



// ===================================================================

// router.route('/getOnlineMeters')
//  .get(authorize, verifyAccess([permissions.admin]),getOnlineMeters)

 router.route('/getOnlineMeters')
 .get(authorize, getOnlineMeters)


 router.route('/mappedMetersCount')
 .get(authorize, mappedMetersCount)


 router.route('/performance')
 .get(authorize, performance)









// =================================================================

module.exports = router;