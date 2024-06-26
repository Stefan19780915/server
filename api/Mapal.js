const axios = require('axios').default;
const qs = require('qs');
const request = require('request');

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

  //this works
  const getOneEmployee = ()=>{

    let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://gotogir.com/wap/labor/Employee/getEmployeeData?employee_codes=001661',
  headers: { 
    'accept': 'text/plain', 
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
};
    
    axios.request(config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });


  }

  
  module.exports = {
    getMapalEmployees,
    getOneEmployee
  }