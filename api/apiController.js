const axios = require('axios').default;

const getMapalEmployees = async () => {
    return await axios.get('https://jsonplaceholder.typicode.com/users');
}

const getToken = async () => {


    const reqData = "grant_type=password&client_id=wap&client_secret=secret&username=stefan.csomor@qweurope.com%40mapal-os.com&password=Queensway.123";
    const token = await axios({
    method: 'post',
    url: 'https://gotogir.com/login/connect/token',
        data: (reqData),   
    headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": "113"
    }
  }).then((response) =>{
            console.log(response)
        }).catch((error) =>{
            console.log(error);
        })


    const token2 = axios.post('https://gotogir.com/login/connect/token', 
    "grant_type=password&client_id=wap&client_secret=secret&username=stefan.csomor@qweurope.com%40mapal-os.com&password=Queensway.123")
    .then(
        function(res){
            console.log(res);
        }
    ).catch(
        function(err){
            console.log(err);
        }
    );


      
     
        return token2;

}

module.exports = {
    getMapalEmployees,
    getToken
}