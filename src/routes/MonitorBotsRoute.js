const router = require("express").Router();
 const { getMeterById, listMeters, last15DaysHourlyUptime, getApplianceList, fetchApplianceCountsByApplianceType} = require('../controllers/MonitorBotController')
 const { createPasswordHash, comparePassword, generateAccessToken, verifyAccess, authorize } = require('../controllers/userController')
 
 const permissions = {
    admin: 'admin',
    developer: 'developer',
    legal: 'legal',
    analyst: 'analyst',
    support: 'support'
}

// ===================================================================

//  router.route('/listMeters')
//  .get(authorize, verifyAccess([permissions.admin]),listMeters);

router.route('/listMeters')
 .get(authorize, listMeters);

 router.route('/getMeterById/:meter_id')
 .get(authorize, getMeterById);


 router.route('/last15DaysHourlyUptime/:meter_id')
 .get(authorize, last15DaysHourlyUptime);


 router.route('/getApplianceList')
 .get(authorize, getApplianceList);


 router.route('/fetchApplianceCountsByApplianceType/:meter_id')
 .get(authorize, fetchApplianceCountsByApplianceType)

// =================================================================

module.exports = router;