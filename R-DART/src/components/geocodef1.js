import React, { useState} from 'react';
import raw from 'raw.macro';
import { Button,TextInput, Form } from 'carbon-components-react';
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
// console.log(authtoken);

const Geocode = () => {
  const [location, setlocation] = useState('');
//   const [area, setarea] = useState({});

  const [geocodeobj, setGeocodeobj] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (location) {

        const areaToCoord = async() => {

        try{
        
            const headers = {'Authorization' : authtoken}
            let response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${location}`,{ headers})
            let result = await response.json();

            setGeocodeobj({...result})
            
            // deal with [0] to [i]. adding 'for' loop !!
            // bearer token generation - done / cbi
            // table component --- Multiple results ?

          // const locdata = [{name: name, address: address, position: position}]
          // console.log(locdata);

          // if(JSON.stringify(result) !== JSON.stringify({})){
          // }

                   

          // if(geocodeobj){
          //   console.log("Results stored");
          // }
          // else{
          //   console.log("Results not found");
          // }
        }
        catch(error){
            console.log(error);
        }

        }
        areaToCoord();

      setlocation('');
    } 
    
    else {
      console.log('empty values');
    }
  };

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
      <TextInput id={'location'} labelText = {'Location'} placeholder = {'Location'} value={location} onChange={(e) => setlocation(e.target.value)} />
      <br/>
      <Button type="submit" > Get Area Coordinates </Button>
    </Form>


        <div>

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

export default Geocode;


    //         {/* {geocodeobj.name && <table>
    //           <thead>
    //             <tr>
    //               <th>Name</th>
    //               <th>Address</th>
    //               <th>Coordinates</th>
    //             </tr>
    //           </thead>
              
    //           <tbody>
    //             <tr>
    //               <td>{geocodeobj.name}</td>
    //               <td>{geocodeobj.address}</td>
    //               <td>{geocodeobj.position}</td>
    //             </tr>
    //           </tbody>
    //       </table>
    // }  //rows={} and rows in {} defn needed as stack fails without//*/}
