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
  return employees.data;
  }

  //this works
  const getOneEmployee = async ()=>{

        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://gotogir.com/wap/labor/Employee/getEmployeeData?employee_codes=001661',
        headers: { 
          'accept': 'text/plain', 
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      };
    try{
      const oneEmployee = await axios.request(config);
      return oneEmployee.data;
    } catch (err){
      console.log(err);
    }
  }

  //clockings
  const getClockings = async (empCode)=>{
    const startDate = 'July 1, 2024 07:00:00';
    const endDate = 'July 31, 2024 07:00:00';
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Clockings/GetClockingsByEmployee?employee_codes=${empCode}&start_date=${startDate.toString()}&end_date=${endDate.toString()}`,
      headers: { 
        'accept': 'text/plain',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    };
    try{
      const clockings = await axios.request(config);
      return clockings.data;
    } catch (err){
      console.log(err);
    }
  }

  //Combine Emp and clockigs
  const empWithTime = async ()=>{
    const employees = await getMapalEmployees();
    const result = await Promise.all( employees.map( async (emp)=>{
      emp.time = await getClockings(emp.employee_code);
     // emp.time.forEach( t => console.log(emp.name ,t.business_date , parseFloat( (t.payable_time/3600 ).toFixed(2) )  ))
      return emp;
    }));
    return result;
  }

  module.exports = {
    getMapalEmployees,
    getOneEmployee,
    getClockings,
    empWithTime
  }