const axios = require('axios').default;

const getMapalEmployees = async () => {
    return await axios.get('https://jsonplaceholder.typicode.com/users');
}

module.exports = {
    getMapalEmployees
}