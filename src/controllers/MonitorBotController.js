const fetch = require("node-fetch")
const config = require('../config/index');
const OPS_HOST = config.OPS_HOST; 
const moment = require('moment')
const querystring = require('query-string');

const fs = require('fs');
const { createPasswordHash, comparePassword, generateAccessToken, verifyAccess, authorize } = require('../controllers/userController')






// =====================================================

const getMeterById = async (req, res) => {
    let _id = req.params.meter_id      
    let response = await fetch(`${OPS_HOST}/getMeterById/${_id}`);    
    response = await response.json();    
   
    response["generation"] = "3"
    return res.json(response)
}



const listMeters = async (req, res) => { 

   
    req.query.vendor = req.vendor
    console.log(req.query.vendor)

    let queryString = querystring.stringify(req.query);
        
    let response = await fetch(`${OPS_HOST}/listMeters?${queryString}`); 
    response = await response.json();  

    // if (req.vendor == "schnider"){
    //     response.payload.meters = response.payload.meters.filter(element => element.vendor == "schnider")
    // }


    response.payload.meters = response.payload.meters.map(element => {
        const newElement =  { }
        newElement["online"] = (moment(element['last_disconnected']).unix() > moment(element['last_connected']).unix())? false : true;
        newElement["botid"]  = element.meter_id
        newElement["source"]  = element.source
        newElement["ssid"]  = element.ssid
        newElement["Type"]   = element.sys_type
        newElement["_id"]  = element._id
        return newElement
    });

     return res.json({data: response.payload.meters })
}



const last15DaysHourlyUptime = async (req, res) => {
    let meterId = req.params.meter_id
    let response = await fetch(`${OPS_HOST}/last15DaysHourlyUptime/${meterId}`);
    response = await response.json();
    return res.json(response)
}


const getApplianceList = async (req, res) => {
    let response = await fetch(`${OPS_HOST}/getApplianceList`);
    response = await response.json();
    return res.json(response)
}

const fetchApplianceCountsByApplianceType = async (req, res) => {
    let meterId = req.params.meter_id
    let response = await fetch(`${OPS_HOST}/fetchApplianceCountsByApplianceType/${meterId}`);
    response = await response.json();
    return res.json(response)
}





// =========================================================================




module.exports = {
    getMeterById,
    listMeters,
    last15DaysHourlyUptime,
    getApplianceList,
    fetchApplianceCountsByApplianceType
    
}