const axios = require('axios').default;
const { date } = require('date-fns/locale');
const qs = require('qs');
const Store = require("../model/Store");

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
 //console.log(employees)
  return employees.data;
  }


  //this works
  const getOneEmployee = async (empCode)=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Employee/getEmployeeData?employee_codes=${empCode}`,
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

  //getAbsences

  const getAbsences = async (employee_code, start_date, end_date)=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Absences/GetAbsences?employee_codes=${employee_code}&start_date=${start_date.toDateString()}&end_date=${end_date.toDateString()}`,
      headers: { 
        'accept': 'text/plain', 
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    };

    try{
      const absences = await axios.request(config);
      
      return absences.data;
    } catch(err){
      console.log(err);
    }

  }

  //getContracts
const getContracts = async ()=>{
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://gotogir.com/wap/labor/Setup/contracts',
    headers: { 
      'accept': 'text/plain', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
    }
  };
  try{
    const result = await axios.request(config);
    return result.data;
  } catch (err){
    console.log(err);
  }  
}

  //getHiredEmployees
  const getHiredEMployeesByUnit = async (workcenter_ids, start, end)=>{
    const toDay = new Date().toDateString();
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Employee/getHiredEmployees?workcenter_ids=${workcenter_ids}&start_date=2005-01-01&end_date=${end.toDateString()}`,
      headers: { 
        'accept': 'text/plain', 
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    };
    try{
      const result = await axios.request(config);
      return result.data;
    } catch (err){
      console.log(err);
    }  

  }

  //get Stores
  const getUnits = async()=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://gotogir.com/wap/General/GetBusinessUnits',
      headers: { 
        'accept': 'text/plain', 
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    };

    try{
      const result = await axios.request(config);
      return result.data;
    } catch(err){
      console.log(err);
    }
  }

  //attach contract to employee
  const employeesWithContract = async (start, end ,storeId)=>{

    const unitId = storeId == undefined ? '' : storeId;

    //getEmployees
    const employees = await getMapalEmployees();
    //console.log(employees);

    const getHiredElmployeesByUnit = await getHiredEMployeesByUnit(unitId, start, end);
    //console.log(getHiredElmployeesByUnit);

    //get Contracts
    const getCont = await getContracts();
    //console.log(getCont);

    //find employee
    const foundEmployee = (emp_id)=>{
      const result = getHiredElmployeesByUnit.find( (emp)=>{
        //console.log(emp.employee_id, emp_id);
            return emp.employee_id == emp_id
      });
      return result
    }

    //find contract
    const foundContract = (cont_id)=>{
      const result = getCont.find( (c)=>{
        return c.contract_id == cont_id;
      })
      return result;
    }

    const result = await Promise.all( employees.map( (emp)=>{
           const found = foundEmployee(emp.employee_id);
           if(found != undefined){
              const contract = foundContract(found.contract_id);
              return {...emp, contract: contract};
           }
    }));
    //console.log(result);
    return result.filter( emp => emp != undefined );
  }

  //Combine Emp and clockigs
  const empWithTime = async (req, res)=>{
    const dateNavigation = req.body.calendar;
    const appState = req.body.appState;
    const now = new Date(Date.now());
    console.log(now)
    //GET STORE ID BY COMPARING MAPAL STORE NAME TO LOCAL NAME store.storeName which in on the req.user
    //getting local store name from req.user.store
    const store = await Store.findById(req.user.store);
    //console.log(store.storeName);
    //getting mapal stores - arr
    const allMapalStores = await getUnits();
    //console.log(allMapalStores);
    //filteringt to get the store that matches req.user.store.storeName - local storeName must be the same as in MAPAL
    const mapalStore = allMapalStores.find( (e) => {
      //console.log(e.business_unit, store.storeName);
        return store && store.storeName == e.business_unit ? e.business_unit : '';
      });
    //accessing the store id and passing on to employeesWithContract to get the specified store employees
   //console.log(mapalStore[0].business_unit_id);

    const date = dateNavigation == 'next' 
    ? new Date(now.getFullYear(), now.getMonth()+1, 1 ) 
    : dateNavigation == 'previous' 
    ? new Date(now.getFullYear(), now.getMonth()-1, 1 )
    : new Date(now.getFullYear(), now.getMonth(), 1 );

    const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
    const daysCount = new Date(date.getFullYear(), date.getMonth()+1,0).getDate();
    const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()+daysCount-1);

    //console.log(firstDay, daysCount, lastDay)

    if(mapalStore != undefined){
    //getEmployees
    const employees =  await employeesWithContract(firstDay, lastDay, mapalStore.business_unit_id);
    //console.log(employees);

    //Create the employee with time and absences
    const result = await Promise.all( employees.map( async (emp)=>{
    //get Absences
    const getAb = await getAbsences(emp.employee_code,date, lastDay);
    //getCloskings
    const mapalEmpClockings = await getClockings(emp.employee_code, date, lastDay) 
    //create new month
    const newDays = [...Array(daysCount+date.getDay()+1)].map( (d,i)=>{ 
        d = {
            employee_code: emp.employee_code,
            id: i+1,
            business_date: new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()+i+1),
            payable_time: '',
          };
          return d;
    });
    const sortedMApal = mapalEmpClockings
    .filter( d => d.payable_time > 0 )
    .sort((a, b) => new Date(a.business_date).getTime() - new Date(b.business_date).getTime());

    const sortedAbsences = getAb.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    //console.log(sortedAbsences);

    const findMatch = (day, month)=>{
            const result = sortedMApal.find( (e)=>{
             //console.log(day, new Date(e.business_date).getDate());
              return new Date(e.business_date).getDate() ==  day && new Date(e.business_date).getMonth() ==  month;   
            })
      return result;
    }

    const findMatchAbsence = (day, month)=>{
      const result = sortedAbsences.find( (e)=>{
        return (day >= new Date(e.start_date).getDate() &&  day <= new Date(e.end_date).getDate() && new Date(e.start_date).getMonth() ==  month);
      })

      return result
    }

    const absenceMap = (absence)=>{
      switch(absence){
        case 'Medical treatment':
          return 'P';
        case 'Vacation':
          return 'D';
          case 'Sickness (more than 10 days)':
            return 'PN';
          case 'Sickness (up to10 days)':
            return 'PN';
          case 'Family Med Leave w/Benefits':
            return 'PD';
          case 'Family Med Leave (No Benefits)':
            return 'PD';
          case 'Unexcused absence':
            return 'A';
          case 'Redundancy (80%)':
            return 'PNZ';
          case 'Maternity':
            return 'MD';
          case 'Parental Leave':
            return 'RD';
          case 'aPaid leave':
            return 'PV';
          case 'Unpaid Authorized Leave':
            return 'NV';
      }
    }

    const output = newDays.map( (day)=>{
    const found = findMatch(new Date(day.business_date).getDate(), new Date(day.business_date).getMonth());
    const foundAbs = findMatchAbsence(new Date(day.business_date).getDate(), new Date(day.business_date).getMonth());
      switch(true) {
        case found == undefined && foundAbs == undefined:
          return {...day};
        case found != undefined && foundAbs == undefined && new Date(found.business_date).getDate() == new Date(day.business_date).getDate():
          return {...day, payable_time: found.payable_time};
        case found == undefined && foundAbs != undefined && new Date(new Date(day.business_date).getDate() >= foundAbs.start_date).getDate() && new Date(day.business_date).getDate() <= new Date(foundAbs.end_date).getDate():
          return {...day, payable_time: absenceMap(foundAbs.absence_type)}
      } 
    });
    emp.time = output;
    emp.reqMonth = date;
    return emp;
    }));

    return result;
    }else{
      return [];
    }
  }


  module.exports = {
    getMapalEmployees,
    getContracts,
    getClockings,
    empWithTime,
    getOneEmployee
  }