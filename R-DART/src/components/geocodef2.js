import React, { useState} from 'react';
import raw from 'raw.macro';
import { Button, TextInput, Form } from 'carbon-components-react';
 import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react';

const authtoken = raw('./auth.txt');

const Geocode2 = () => {


  const handleSubmit = (e) => {
    e.preventDefault();
      };

  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');

  const [geocodeobj, setGeocodeobj] = useState({});

  const buttonSubmit = (e) => {
            
    if (latitude && longitude) {
      geocode2();
    }
    else {
      console.log('empty values');
    }
      
      setlatitude('');
      setlongitude('');

  }

const locationstr = latitude.concat(',').concat(longitude);
      
        const geocode2 = async() => {

        try{
        
            const headers = {'Authorization' : authtoken}
            let response = await fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${locationstr}`,{ headers})
            let result = await response.json();


          setGeocodeobj({...result});

        }
        catch(error){
            console.log(error);
        }

        }
const headers = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'address',
    header: 'Address',
  },
    {
    key: 'location',
    header: 'Location',
  },
];
  return (
    <>

    <Form onSubmit={handleSubmit}>

      <TextInput id={'latitude'} labelText = {'Latitude'} placeholder = {'Latitude'} value={latitude} onChange={(e) => setlatitude(e.target.value)} />
      <TextInput id={'longitude'} labelText = {'Longitude'} placeholder = {'Longitude'} value={longitude} onChange={(e) => setlongitude(e.target.value)} />
      <br/>
      <Button type="submit" onClick={buttonSubmit} > Get Places Near You </Button>

      </Form>

        <div>

          {/* <p>{JSON.stringify(geocodeobj)}</p> */}

              {geocodeobj.items && 
          
          <DataTable rows={geocodeobj.items} headers={headers}>
              {({ rows, headers, getHeaderProps}) => 
            (
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {geocodeobj.items && geocodeobj.items.map((row, index) => {
                return (

                      <TableRow key={index} >

                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.address.label}</TableCell>
                        <TableCell>{row.position.lat + "," + row.position.lng}</TableCell>
                      </TableRow>

                );
            })}
                  </TableBody>
                </Table>
            )
                }
          </DataTable>}

        </div>


    </>
  );
};

export default Geocode2;
