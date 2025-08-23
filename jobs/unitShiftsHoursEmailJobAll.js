const { unitShiftHoursJob } = require('../api/unitShiftsHoursEmailAll');
const cc = ['peter.gazo@qweurope.com', 'peter.deak@qweurope.com','peter.zidek@qweurope.com','radka.hrebickova@qweurope.com'];
const email = 'stefan.csomor@qweurope.com';
unitShiftHoursJob(email,cc);
/*
module.exports = {
    unitShiftHoursJob
};
*/