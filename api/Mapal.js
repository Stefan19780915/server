const axios = require('axios').default;
const { da } = require('date-fns/locale');
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
  const getClockings = async (empCode,startDate,endDate)=>{

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Clockings/GetClockingsByEmployee?employee_codes=${empCode}&start_date=${startDate.toDateString()}&end_date=${endDate.toDateString()}`,
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
    const date = new Date('2024-05-01T07:00:00');
    const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-date.getDay());
    const daysCount = new Date(date.getFullYear(), date.getMonth()+1,0).getDate();
    const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()+daysCount-1);
    console.log(date, lastDay, firstDay);
    const employees = await getMapalEmployees();

    const result = await Promise.all( employees.map( async (emp)=>{
    const mapalEmpClockings = await getClockings(emp.employee_code, date, lastDay) 
    const newDays = [...Array(daysCount+date.getDay()+1)].map( (d,i)=>{ 
        d = {
            employee_code: emp.employee_code,
            id: i+1,
            business_date: new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()+i+1),
            payable_time: '',
          };
          return d;
    });

    //console.log(newDays)

    const sortedMApal = mapalEmpClockings
    .filter( d => d.payable_time > 0 )
    .sort((a, b) => new Date(a.business_date).getTime() - new Date(b.business_date).getTime());

    const findMatch = (day, month)=>{
            const result = sortedMApal.find( (e)=>{
              return new Date(e.business_date).getDate() ==  day && new Date(e.business_date).getMonth() ==  month;   
            })
      return result;
    }

    const output = newDays.map( (day)=>{
    const found = findMatch(new Date(day.business_date).getDate(), new Date(day.business_date).getMonth());
    
        return found == undefined ? {...day} 
                                  : new Date(found.business_date).getDate() == new Date(day.business_date).getDate() 
                                  ? {...day,payable_time: found.payable_time } 
                                  : {...day,payable_time: ''};
    });

    emp.time = output;
    console.log(output);
    emp.reqMonth = date;

    return emp;

    }));
    return result.sort();
  }

  module.exports = {
    getMapalEmployees,
    getOneEmployee,
    getClockings,
    empWithTime
  }