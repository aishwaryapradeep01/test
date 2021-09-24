import React, { useState} from 'react';
import { Button,TextInput, Form, Loading, ToastNotification } from 'carbon-components-react';
import {DataTable,Table,TableHead,TableRow,TableHeader,TableBody,TableCell,TableContainer} from 'carbon-components-react';

function Search2(authtoken) {

  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  const [areaquery, setareaquery] = useState('');
  const [geocodeobj, setGeocodeobj] = useState({});
  const [isLoading,setLoading] = useState(false);
  const [lterrstate, setlterrstate] = useState(false);
  const [lngerrstate, setlngerrstate] = useState(false);
  const [arerrstate, setarerrstate] = useState(false);
  const [arerrtext, setarerrtext] = useState('A valid value is required');
  const [lterrtext, setlterrtext] = useState('A valid value is required');
  const [lnerrtext, setlnerrtext] = useState('A valid value is required');
  const [buttonstate, setbuttonstate] = useState(false);

  const [err1status, seterr1status] = useState(false);
  const [err2status, seterr2status] = useState(false);
  const [err3status, seterr3status] = useState(false);


    const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
            
    if (latitude && longitude && areaquery) {

    const locationstr = latitude.concat(',').concat(longitude);
      
        const searchsv2 = async() => {

        try{
        
            let headers = {'Authorization' : authtoken['authtoken']}
            let response = await fetch(`https://discover.search.hereapi.com/v1/discover?q=${areaquery}&at=${locationstr}`,{ headers})
            let result = await response.json();


          setGeocodeobj({...result});
          setLoading(false);
          if(JSON.stringify(result.items) === '[]'){
             seterr3status(true);
             setGeocodeobj({});
          }

        }
        catch(error){
            seterr2status(true);
            setLoading(false);
        }

        }
      
        searchsv2();
        setlatitude('');
        setlongitude('');
        setareaquery('');
    }
  
    else {
      seterr1status(true);
      setLoading(false);
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

const validArea = (e) => {

      if(!e.target.value.match(/^[a-zA-Z]+$/)){
              setarerrstate(true)
              setarerrtext("Only letters allowed. No special characters or numbers");
              setbuttonstate(true)
           }
      else{
            setarerrstate(false)
            setbuttonstate(false)
        }        
        setareaquery(e.target.value);
}

const validLatf = (e) => {

      if(!e.target.value.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?){2}$/)){
              setlterrstate(true)
              setlterrtext("Only valid co-ordinates allowed. No characters");
              setbuttonstate(true)
           }
      else{
            setlterrstate(false)
            setbuttonstate(false)
        }        
        
        setlatitude(e.target.value)
    
    
}

const validLongf = (e) => {

      if(!e.target.value.match(/^\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?){2}$/)){
              setlngerrstate(true)
              setlnerrtext("Only valid co-ordinates allowed. No characters");
              setbuttonstate(true)
          }
      
      else{
            setlngerrstate(false)
            setbuttonstate(false)
        }        
        
      setlongitude(e.target.value)
    
}

  function err1closef() {
    seterr1status(false);
  }
  function err2closef() {
    seterr2status(false);
  }
  function err3closef() {
    seterr3status(false);
  }


  return (
    <>

    <Form onSubmit={handleSubmit}>

    <div className="TextArea" >
      <TextInput id={'latitude'} labelText = {'Latitude*'} size = 'lg' invalid = {lterrstate} invalidText = {lterrtext} helperText="Add valid co-ordinates." placeholder = {'Latitude'} value={latitude} onChange={validLatf} /><br/>
    </div>
    <div className="TextArea" > 
      <TextInput id={'longitude'} labelText = {'Longitude*'} size = 'lg' invalid = {lngerrstate} invalidText = {lnerrtext}  helperText="Add valid co-ordinates." placeholder = {'Longitude'} value={longitude} onChange={validLongf} /><br/>
    </div>
    <div className="TextArea" >  
      <TextInput id={'area-query'} labelText = {'Area*'} size = 'lg' invalid = {arerrstate} invalidText = {arerrtext} helperText="Input values only in alphabets - Public places/Hotels/Restaurants." placeholder = {'Query: Area/Address'} value={areaquery} onChange={validArea} />
    </div>  
      <br/>
      <div className="CButtonArea">
        <Button type="submit" disabled = {buttonstate} > Get Places Near You </Button>
      </div>

      </Form>

       {err1status && 
    <ToastNotification
        iconDescription="Close notification"
        subtitle={<span>Latitude, Longitude, Area values cannot be empty</span>}
        timeout={3000}
        onClose = {err1closef}
        title="Error Notification"
      />
      }
  {err2status && 
    <ToastNotification
        iconDescription="Close notification"
        subtitle={<span>Server cannot be reached</span>}
        timeout={3000}
        onClose = {err2closef}
        title="Error Notification"
      />
      }
  
  {err3status && 
    <ToastNotification
        iconDescription="Close notification"
        subtitle={<span>No data results available</span>}
        timeout={3000}
        onClose = {err3closef}
        title="Error Notification"
      />
      }

      <Loading active = {isLoading} description="Active loading indicator" withOverlay={true}/>

        {geocodeobj.items && 
         <div className = "TableDisplay" >


          {geocodeobj.items && 
          
          <DataTable rows={geocodeobj.items} headers={headers}>
              {({ rows, headers, getHeaderProps}) => 
            (
              <TableContainer title="Search Results">
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
                </TableContainer>
            )
                }
          </DataTable>}

        </div>}


    </>
  );
};

export default Search2;
