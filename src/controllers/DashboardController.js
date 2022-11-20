const fetch = require("node-fetch")
const config = require('../config/index');
const OPS_HOST = config.OPS_HOST; 


// =====================================================

const getOnlineMeters = async (req, res) => {
    let response = await fetch(`${OPS_HOST}/getOnlineMeters`);
    response = await response.json();
    return res.json(response)
}



const mappedMetersCount = async (req, res)=>{
    let response = await fetch(`${OPS_HOST}/mappedMetersCount`);
    console.log(response.status)
    response = await response.json();
    return res.json(response)
}



const performance = async (req, res)=> {
    res.header('Content-Type', 'application/json');
    return res.json({
        
        "firmware_performance": 90,
        "hardware_performance": 80,
        "appliance_detection_accuracy": 70,
        "application_performance": 60,
        "backend_uptime": 60,
    }
   
    );
}

// =================================



module.exports = {
    getOnlineMeters,
    mappedMetersCount,
    performance
    
}