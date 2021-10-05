
// const request = require('request');
// const OAuth = require('oauth-1.0a')
// const crypto = require('crypto'); 
// require('dotenv').config()

//   const oauth = OAuth({
//       consumer: {
//           key: process.env.REACT_APP_CLIENT_ID,
//           secret: process.env.REACT_APP_CLIENT_SECRET,
//       },
//       signature_method: 'HMAC-SHA256',
//       hash_function(base_string, key) {
//           return crypto
//               .createHmac('sha256', key)
//               .update(base_string)
//               .digest('base64')
//       },
//   });
//   const request_data = {
//       url: 'https://account.api.here.com/oauth2/token',
//       method: 'POST',
//       data: { grant_type: 'client_credentials' },
//   };

const request = require('request');
require('dotenv/config');
const fs = require('fs');

function generateToken() {
    
    var cli_id = process.env.REACT_APP_CLIENT_ID;
    var cli_sec = process.env.REACT_APP_CLIENT_SECRET;

    const basicAuth = Buffer.from(`${cli_id}:${cli_sec}`).toString('base64');
    const options = {
      method: 'POST',
      url: 'https://api.ibm.com/scx/sbs_orgaccess/oauth2/token',
      headers: {
        'Authorization': `Basic ${basicAuth}`,

      },
      form: {
        'grant_type': 'password',
        'scope': '/sbs_orgaccess',
        'username': process.env.REACT_APP_USERNAME,
        'password': process.env.REACT_APP_PASSWORD
      }
    };

  request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const jsonData = JSON.parse(body.toString());
      const au = `Bearer ${jsonData.access_token}`;
      fs.writeFile('src/components/auth.txt', au, function (err) {
        if (err) return console.log(err);
                // console.log('written to file');
         });
    });
}

generateToken();

//   request(
//       {
//           url: request_data.url,
//           method: request_data.method,
//           form: request_data.data,
//           headers: oauth.toHeader(oauth.authorize(request_data)),
//       },
//       function (error, response, body) {

//           if (response.statusCode === 200) {
//             let result = JSON.parse(response.body);
//             let auth = 'Bearer '.concat(result["access_token"].toString());



//             console.log(auth);
              
//           }
//       }
//   );


