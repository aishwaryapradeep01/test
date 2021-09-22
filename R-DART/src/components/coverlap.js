import React, { useState} from 'react';
import { Button} from 'carbon-components-react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react';

function Coverlap({Selectedcsv, LabelInput, filepath, filename}) {

  const [jobid , setjobid] = useState('');
  const [msg , setmsg] = useState('');
  

  const onClickHandler = (e) => {
    callClassoverlap()
    .then((resp) => {
      // console.log("RES: ", resp["JobID"])
      // console.log("RES MSG: ", resp["message"])
      setjobid(resp["JobID"]);
      setmsg(resp["message"]);
    })
    .catch((err) => {console.log(err)});

    console.log("TESTING: FILE NAME: ", filename);

  }

  
    
   const callClassoverlap = async () => {

    //let response = await fetch('/classoverlap?label=' + LabelInput );
     let response = await fetch('/classoverlap?label=' + LabelInput + '&fpath=' + filepath + '&fname=' + filename);

    let body = await response.json();
    
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.result;
  };

  const headers = [
  {
    key: 'jobid',
    header: 'Job ID',
  },
  {
    key: 'message',
    header: 'Message',
  },
  
];
  const rows = [
  {
    id: 'a',
    jobid: jobid,
    message: msg
  }
];
  
    return (
     <div>

         <Button type="submit" onClick={onClickHandler} > Get Class Overlap </Button>
         <br/>
         <br/>
         <br/>

         { jobid && <DataTable rows={rows} headers={headers}>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()}>
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
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
          </DataTable>}

      </div>
    );
  
}

export default Coverlap;