const axios = require('axios').default;
const qs = require('qs');

let data = qs.stringify({
    'grant_type': 'password',
    'client_id': 'wap',
    'client_secret': 'secret',
    'username': process.env.USR_MAPAL,
    'password': process.env.PASS_MAPAL 
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.URL_MAPAL,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };

const apiToken = async (req, res, next) => {
  if(process.env.API_TOKEN == 'token'){
    const token = await axios.request(config)
      .then((response) => {
          const token = response.data.access_token;
          console.log('New token generated');
          process.env.API_TOKEN = token;
      })
      .catch((error) => {
        console.log(error);
      });
  
  next();
  } else {
    console.log('Token already exists');
    next();
  }
}

const apiTokenAutomate = async (req, res, next) => {
  if(process.env.API_TOKEN == 'token'){
    const token = await axios.request(config)
      .then((response) => {
          const token = response.data.access_token;
          console.log('New token generated');
          process.env.API_TOKEN = token;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('Token already exists');
  }
}

module.exports = {
    apiToken,
    apiTokenAutomate,
}