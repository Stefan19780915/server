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
  const employees = await axios.request(config);
  return employees;
  }

  
  module.exports = {
    getMapalEmployees
  }