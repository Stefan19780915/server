const { apiTokenAutomate } = require('../middleware/apiToken');
const { getUnits } = require('./Mapal');
const { getSales } = require('./Mapal');
const sendEmail = require("../utils/sendEmployeeEmail");
const moment = require("moment");
const { getWeekDates } = require("../api/unitShiftsHoursEmailAll");
const { getStartOfWeek, getEndOfWeek } = require("../api/unitShiftsHoursEmailAll");
const { makeUnitSalesEmail } = require('../utils/unitsSalesEmail')

const unitsSalesEmailAll = async (email, cc = []) => {
    const weeks = getWeekDates();
    const currentDate = new Date();
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = getEndOfWeek(currentDate);

    try {
        await apiTokenAutomate();
        const units = await getUnits();
        const unitIds = units.map(u => u.business_unit_id).filter(Boolean);
        const salesAll = await getSales(weeks.previousWeek[0], weeks.nextWeek[6], unitIds); // Get all sales for the unit IDs
        
        const unitSalesPromises = units.map(async (unit) => {
                const unitId = unit.business_unit_id;
                if (unitId === undefined) return null; // Skip if unitId is undefined
                const unitName = unit.business_unit;

                const currentWeekSalesPromises = weeks.currentWeek.map( date => {
                    const sales = salesAll.filter(sale => {
                            // Filter shifts for the current unit and date
                        return sale.unit_id === unitId && moment(sale.business_date).format('YYYY-MM-DD') === date});
                    const totalSales = sales.reduce((acc, sale) => {
                                if (sale.unit_id !== unitId) return acc; // Skip if sale business unit id does not match unit id
                                return acc + (Number(sale.net_sale) || 0);
                            }, 0);
                    const totalChecks = sales.reduce((acc, sale) => {
                                if (sale.unit_id !== unitId) return acc; // Skip if sale business unit id does not match unit id
                                return acc + (Number(sale.checks) || 0);
                            }, 0);

                    return {
                    unit: unitName,
                    date: date,
                    totalChecks: totalChecks,
                    totalSales: totalSales,
                    };
                });


                const previousWeekSalesPromises = weeks.previousWeek.map( date=> {
                    const sales = salesAll.filter(sale => {
                            // Filter shifts for the current unit and date
                        return sale.unit_id === unitId && moment(sale.business_date).format('YYYY-MM-DD') === date});
                    const totalSales = sales.reduce((acc, sale) => {
                                if (sale.unit_id !== unitId) return acc; // Skip if sale business unit id does not match unit id
                                return acc + (Number(sale.net_sale) || 0);
                            }, 0);
                    const totalChecks = sales.reduce((acc, sale) => {
                                if (sale.unit_id !== unitId) return acc; // Skip if sale business unit id does not match unit id
                                return acc + (Number(sale.checks) || 0);
                            }, 0);

                    return {
                    unit: unitName,
                    date: date,
                    totalChecks: totalChecks,
                    totalSales: totalSales,
                    };
                });
            
            //Previous sales and sums
            const previousWeekSales = await Promise.all(previousWeekSalesPromises);
            const totalSalesSumPrev = previousWeekSales.reduce((sum, shift) => {
            return sum + (Number(shift.totalSales) || 0); }, 0);
            const totalChecksSumPrev = previousWeekSales.reduce((sum, shift) => {
            return sum + (Number(shift.totalChecks) || 0); }, 0);

            const currentWeekSales = await Promise.all(currentWeekSalesPromises)
            const totalSalesSumCurr = currentWeekSales.reduce((sum, shift) => {
            return sum + (Number(shift.totalSales) || 0); }, 0);
            const totalChecksSumCurr = currentWeekSales.reduce((sum, shift) => {
            return sum + (Number(shift.totalChecks) || 0); }, 0);
        
        return {
             unitId: unitId,
             unitName: unitName,
             currentWeekSales: currentWeekSales,
             totalSalesSumCurr: totalSalesSumCurr,
             totalChecksSumCurr: totalChecksSumCurr,
             previousWeekSales: previousWeekSales,
             totalSalesSumPrev: totalSalesSumPrev,
             totalChecksSumPrev: totalChecksSumPrev,
         };
        
        })
        
    
    const unitSales = (await Promise.all(unitSalesPromises)).filter(Boolean);
    makeUnitSalesEmail(unitSales, startOfWeek)
        //console.log(unitSales, email);

        if (unitSales.length) {
            const html = makeUnitSalesEmail(unitSales, startOfWeek);
            const subject = `KFC Units MAPAL Sales - Week Monday ${ moment(startOfWeek).format("L") }`;
               
           // console.log(unit.email)
           
            const info = await sendEmail(
              email,
                cc,
                subject,
                html
              );

              if (info.messageId) {
                console.log("Message sent");
              } else {
                console.log("Message was not sent");
              }
        } 


    } catch (error) {
        console.error("Error in unitsSalesEmailAll:", error);
        res.status(500).send("Internal Server Error");
    }

}


module.exports = {
    unitsSalesEmailAll
}
