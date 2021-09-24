import React, { useState} from 'react';
import "./App.css";
import { Tabs, Tab, Form,TextInput,Button } from "carbon-components-react";
import {
  Header,
  HeaderName,
} from "carbon-components-react/lib/components/UIShell";

import Geocode1 from "./components/geocodef1";
import Geocode2 from "./components/geocodef2";
import Search1 from "./components/searchf1";
import Search2 from "./components/searchf2";
import Weather1 from "./components/weatherf1";
import Weather2 from "./components/weatherf2";
import Alertw from "./components/alertw";

const request = require('request');
const OAuth = require('oauth-1.0a')
const crypto = require('crypto'); 

function App() {

  const [cid, setcid] = useState('');
  const [csecret, setcsecret] = useState('');
  const [authtoken, setauthtoken] = useState('');


const generateToken = (cid,csecret) => {

  const oauth = OAuth({
      consumer: {
          key: cid,
          secret: csecret,
      },
      signature_method: 'HMAC-SHA256',
      hash_function(base_string, key) {
          return crypto
              .createHmac('sha256', key)
              .update(base_string)
              .digest('base64')
      },
  });
  const request_data = {
      url: 'https://account.api.here.com/oauth2/token',
      method: 'POST',
      data: { grant_type: 'client_credentials' },
  };

  request(
      {
          url: request_data.url,
          method: request_data.method,
          form: request_data.data,
          headers: oauth.toHeader(oauth.authorize(request_data)),
      },
      function (error, response, body) {

          if (response.statusCode === 200) {
            let result = JSON.parse(response.body);
            let auth = 'Bearer '.concat(result["access_token"].toString());

            console.log("AUTH generated: ", auth);
            setauthtoken(auth);
              
          }
      }
  );

}


  const handleSubmit = (e) => {
    e.preventDefault();
    generateToken(cid,csecret);
  }

  return (
    <>
      <Header aria-label="IBM">
        <HeaderName href="#" prefix="">
          <div Style="white-space: nowrap;">
            HERE Geocoding Sample Application
          </div>
        </HeaderName>
      </Header>

      <div className="App">
        <div className="AppContent">
          <br />
          <br />
          <br />
          <br />
          <h2> Authentication </h2>
          <br />
          <br />
          <Form onSubmit={handleSubmit}>

            <div className="TextArea" >
            <TextInput id={'cid'} labelText = {'Client ID*'} placeholder = {'Client ID'} size = 'lg' value={cid} onChange={(e)=> setcid(e.target.value)} />
            </div>

            <div className="TextArea" >
            <TextInput id={'csecret'} labelText = {'Client Secret*'}  placeholder = {'Client Secret'} size = 'lg' value={csecret} onChange={(e)=> setcsecret(e.target.value)} />
            </div>
            
            <div className="CButtonArea" >
              <Button type="submit" > Authenticate </Button>
            </div>

          </Form>

          <br />
          <br />
          <br />
          <br />
          <h2>Location Details</h2>
          <br />
          <br />
          <Tabs type="container">
            <Tab id="tab-g1" label="Get Co-ordinates">
              <div className="TabArea">
              <Geocode1 authtoken = {authtoken} />
              </div>
            </Tab>
            <Tab id="tab-g2" label="Get Area">
              <div className="TabArea">
              <Geocode2 authtoken = {authtoken}/>
              </div>
            </Tab>
          </Tabs>

          <h2>Search Services</h2>
          <br />
          <br />
          <Tabs type="container">
            <Tab id="tab-s1" label="By Area">
              <div className="TabArea">
              <Search1 authtoken = {authtoken}/>
              </div>
            </Tab>
            <Tab id="tab-s2" label="By Co-ordinates">
              <div className="TabArea">
              <Search2 authtoken = {authtoken}/>
              </div>
            </Tab>
          </Tabs>

          <h2> Weather Services </h2>
          <br />
          <br />
          <Tabs type="container">
            <Tab id="tab-w1" label="By Area">
              <div className="TabArea">
              <Weather1 authtoken = {authtoken}/>
              </div>
            </Tab>
            <Tab id="tab-w2" label="By Co-ordinates">
              <div className="TabArea">
              <Weather2 authtoken = {authtoken}/>
              </div>
            </Tab>
          </Tabs>

          <h2> Extreme Weather Warnings </h2>
          <br />
          <br />
          <Alertw authtoken = {authtoken}/>
          <br />
        </div>
      </div>
    </>
  );
}

export default App;
