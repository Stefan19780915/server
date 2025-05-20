const { getUnits } = require('../api/Mapal');
const { getMapalEmployees } = require('../api/Mapal');
const moment = require("moment");

const unitHeadCount = async () => {
    try {
        const units = await getUnits();
        const employees = await getMapalEmployees();
       // console.log('Units:', units);
        //console.log('Employees:', employees);
        
        // Filter out units that are not needed
        const filteredUnits = units.filter(unit => 
            unit.business_unit !== 'KFC Office' &&
            unit.business_unit !== 'KFC Wörgl'
        );

        // Sort units alphabetically by unitName
        filteredUnits.sort((a, b) => a.business_unit.localeCompare(b.business_unit));

        // Create a list of unit headcounts
        const unitHeadCountList = filteredUnits.map((unit) => {
            const unitId = unit.business_unit_id;
            const unitName = unit.business_unit;

            // Filter employees by unitId
            const unitEmployees = employees.filter(employee => employee.unit_id === unitId);

            return {
                unitName: unitName,
                headCount: unitEmployees.length,
                TPP: unitEmployees.filter(employee => employee.job === 'Team Member').length,
                DOBPS: unitEmployees.filter(employee => employee.job === 'Student').length,
                DOPC: unitEmployees.filter(employee => employee.job === 'Part Timer').length,
                SL: unitEmployees.filter(employee => employee.job === 'Shift Leader').length,
                ARGM: unitEmployees.filter(employee => employee.job === 'Assistant Restaurant General Manager').length,
                RGM: unitEmployees.filter(employee => employee.job === 'Restaurant General Manager').length,
                MNG: unitEmployees.filter(employee => employee.category_group === 'Manager').length,
                employees : unitEmployees
            };
        });

        return unitHeadCountList;
    } catch (error) {
        console.error('Error fetching unit headcount:', error);
    }
};


module.exports = {
    unitHeadCount
};
