const axios = require('axios').default;
const { date } = require('date-fns/locale');
const qs = require('qs');
const Store = require("../model/Store");


const getContractedHours = async (startDate, endDate, ticks, empId)=>{
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/TimeEvaluation/ContractedFixedHours?DateFrom=${startDate.toDateString()}&DateTo=${endDate.toDateString()}&ticks=0&EmployeeId=${empId}`,
  headers: { 
      'api-version': '1.2', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
  };
  const fixedHours = await axios.request(config);
    return fixedHours.data;
  }

const getHoursFondCompliance = async (startDate, endDate, employee_id)=>{
  const params = new URLSearchParams();
  employee_id.forEach(id => params.append('employee_ids', id));
    let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/TimeEvaluation/AccruedFixedHours?date_from=${startDate.toDateString()}&date_to=${endDate.toDateString()}&${params.toString()}`,
  headers: {
    'api-version': '1.2',
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
};

    const compliance = await axios.request(config);
    return compliance.data;

}

const getWorkedHours = async (startDate, endDate, id_employee)=>{
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://gotogir.com/wap/labor/Employee/WorkedAndProjectedDistributionTime?date_from=${startDate.toDateString()}&date_to=${endDate.toDateString()}&id_employee=${id_employee}`,
      headers: { 
      'api-version': '1.2', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
  };
  const hours = await axios.request(config);
    return hours.data;
}


const getTerminatedEmployees = async (start, end)=>{
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/Employee/getTerminatedEmployees?start_date=${start.toDateString()}&end_date=${end.toDateString()}`,
  headers: { 
      'api-version': '1.2', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
  };
  const termEmp = await axios.request(config);
    return termEmp.data;

}

const getEmployeeDetails = async (empId)=>{
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/Employee/EmployeeDetails?employeeId=${empId}`,
  headers: { 
      'api-version': '1.2', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
   };
  const empDetails = await axios.request(config);
    return empDetails.data;

}

const getEmployeeData = async (empIds) =>{
  const params = new URLSearchParams();
  empIds.forEach(id => params.append('employee_ids', id));
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/Employee/getEmployeeData?${params}`,
  headers: { 
      'api-version': '1.2', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
};

  const empData = await axios.request(config);
    return empData.data;
}
  

const getSales = async (startDate, endDate, unitIds)=>{
  const params = new URLSearchParams();
  unitIds.forEach(id => params.append('unitIds', id));
// console.log('getSales', startDate, endDate, unit);
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/sales/Sales/SalesByUnitDateAndSource?source=1&${params}&fromDate=${startDate}&toDate=${endDate}`,
  
  headers: { 
    'api-version': '1.2', 
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
};
  const sales = await axios.request(config);
   return sales.data;
}

const getMapalUsers = async ()=>{
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://gotogir.com/wap/General/GetUsers',
    headers: { 
      'accept': 'text/plain', 
      'Authorization': `Bearer ${process.env.API_TOKEN}`
    }
  };
  const users = await axios.request(config);
   return users.data;
}
// getting all PLANNED shifts by employee by their unit in a specified time
const getShifts = async (startDate, endDate)=>{
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/Schedules/getShiftsByEmployee?start_date=${startDate}&end_date=${endDate}`,
  headers: { 
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
};
const shifts = await axios.request(config);
 //console.log(employees)
  return shifts.data;
}


// getting all clocings
const getClockingsByDate = async (startDate, endDate)=>{
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://gotogir.com/wap/labor/Clockings/GetClockingsByBusinessUnit?start_date=${startDate}&end_date=${endDate}`,
  headers: { 
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
};
const shifts = await axios.request(config);
 //console.log(employees)
  return shifts.data;
}





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


  const getEmployeeLabourState = async (employee_ids)=>{
    const params = new URLSearchParams();
    employee_ids.forEach(id => params.append('employee_ids', id));
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Employee/getActualLaborEmployeeState?${params}`,
      headers: { 
        'accept': 'text/plain', 
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    };
    try{
      const employeeState = await axios.request(config);
      return employeeState.data;
    } catch (err){
      console.log(err);
    }  
  }


  //this works
  const getOneEmployee = async (empCode)=>{
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Employee/getEmployeeData?employee_ids=${empCode}`,
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
  const getClockings = async (employee_id,startDate,endDate)=>{
   //console.log(employee_id, startDate,endDate);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Clockings/GetClockingsByEmployee?employee_ids=${employee_id}&start_date=${startDate.toDateString()}&end_date=${endDate.toDateString()}`,
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

  const getAbsences = async (employee_ids, start_date, end_date)=>{
    const params = new URLSearchParams();
    employee_ids.forEach(id => params.append('employee_ids', id));
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://gotogir.com/wap/labor/Absences/GetAbsences?${params}&start_date=${start_date.toDateString()}&end_date=${end_date.toDateString()}`,
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
    return result.filter( emp => emp != undefined );
  }

  //Combine Emp and clockigs
  const empWithTime = async (req, res)=>{
    const dateNavigation = req.body.calendar;
    const appState = req.body.appState;
    const now = new Date(Date.now());
    //console.log(now)
    //GET STORE ID BY COMPARING MAPAL STORE NAME TO LOCAL NAME store.storeName which in on the req.user
    //getting local store name from req.user.store
    const store = await Store.findById(req.user.store);
    //console.log(req.user.store);
    //console.log(store.storeName);
    //getting mapal stores - arr
    const allMapalStores = await getUnits();
    /*
    allMapalStores.forEach(element => {
      console.log(element.email, element.business_unit)
    });
    */
    //console.log(allMapalStores);
    //filteringt to get the store that matches req.user.store.storeName - local storeName must be the same as in MAPAL
    const mapalStore = allMapalStores.find( (e) => {
      //console.log(e, req.user.store);
        return store && store.storeName == e.business_unit ? e.business_unit : '';
      });
    //accessing the store id and passing on to employeesWithContract to get the specified store employees
   //console.log(mapalStore);

    const date = dateNavigation == 'next' 
    ? new Date(now.getFullYear(), now.getMonth()+1, 1 ) 
    : dateNavigation == 'previous' 
    ? new Date(now.getFullYear(), now.getMonth()-1, 1 )
    : new Date(now.getFullYear(), now.getMonth(), 1 );

    const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
    const daysCount = new Date(date.getFullYear(), date.getMonth()+1,0).getDate();
    const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()+daysCount-1);

    //console.log(firstDay, daysCount, lastDay)

    if(mapalStore != undefined && req.body.storeState){
    //getEmployees
    const employees =  await employeesWithContract(firstDay, lastDay, mapalStore.business_unit_id);
    


    //Create the employee with time and absences
    const result = await Promise.all( employees.map( async (emp)=>{


    const labour = await getEmployeeLabourState(emp.employee_id);
    //console.log(labour);

      //console.log(emp);
    //get Absences
    const getAb = await getAbsences(emp.employee_id,date, lastDay);
    //getCloskings
    const mapalEmpClockings = await getClockings(emp.employee_id, date, lastDay) 
    
    
    //create new month
    const newDays = [...Array(daysCount+date.getDay()+1)].map( (d,i)=>{ 

        d = {
            employee_id: emp.employee_id,
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
            // console.log(day, new Date(e.business_date).getDate());
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
   //emp.employee_id == '1408' ? console.log(found) : null;
    
    const foundAbs = findMatchAbsence(new Date(day.business_date).getDate(), new Date(day.business_date).getMonth());
   // emp.employee_id == '1408' ? console.log(foundAbs) : null;
    
      switch(true) {
        case found == undefined && foundAbs == undefined:
          return {...day};
        case found != undefined && foundAbs == undefined && new Date(found.business_date).getDate() == new Date(day.business_date).getDate():
          return {...day, payable_time: found.payable_time};
        case found == undefined && foundAbs != undefined && new Date(new Date(day.business_date).getDate() >= foundAbs.start_date).getDate() && new Date(day.business_date).getDate() <= new Date(foundAbs.end_date).getDate():
          return {...day, payable_time: absenceMap(foundAbs.absence_type)};
          case found != undefined && foundAbs != undefined && new Date(new Date(day.business_date).getDate() >= foundAbs.start_date).getDate() && new Date(day.business_date).getDate() <= new Date(foundAbs.end_date).getDate():
            return {...day, payable_time: absenceMap(foundAbs.absence_type)};
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
    getClockingsByDate,
    empWithTime,
    getOneEmployee,
    getUnits,
    getMapalUsers,
    getShifts,
    getSales,
    getWorkedHours,
    getEmployeeLabourState,
    getContractedHours,
    getAbsences,
    getHiredEMployeesByUnit,
    getHoursFondCompliance,
    getTerminatedEmployees,
    getEmployeeData,
    getEmployeeDetails
  }