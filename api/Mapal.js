const axios = require('axios').default;
const qs = require('qs');

  const getMapalEmployees = async ()=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://gotogir.com/wap/labor/Employee/AllHiredEmployees',
        headers: { 
          'accept': 'text/plain', 
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      };
  const token = await axios.request(config);
  return token;
  }

  
  module.exports = {
    getMapalEmployees
  }