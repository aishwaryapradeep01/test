

// Sdataset copy
// import {  Select, SelectItem, TextInput  } from 'carbon-components-react';

// import React, { useState} from 'react';

// function Sdataset({setSelectedcsv, setLabelInput, setfilepath, setfilename}) {
   
//     const [label , setlabel] = useState('');
    

//  const handledatasetChange = (event) => {
//     setdatasetquery(event.target.value);
//     setSelectedcsv(event.target.value);
//     setfilepath(event.target.value);
//     setfilename(event.target.options[event.target.options.selectedIndex].text)
//     // console.log("dataset chosen value: ",event.target.value );
//     // console.log("dataset chosen key: ", event.target.options[event.target.options.selectedIndex].text);
//   }
//   //ftemp = document.getElementById('files1');
//     // fname = ftemp.options[ftemp.selectedIndex].text;

//       const onLabelSubmit = (e) => {

//       setlabel(e.target.value)
//       setLabelInput(e.target.value)
//     }

//  const dataset = [
//   {
//     id: '/Users/aishwaryapradeep/Desktop/demo/adult.csv',
//     value: 'adult.csv',
//   },
//   {
//     id: '/Users/aishwaryapradeep/Desktop/demo/breast-cancer.csv',
//     value: 'breast-cancer.csv',
//   },
//   {
//     id: '/Users/aishwaryapradeep/Desktop/demo/credit-g.csv',
//     value: 'credit-g.csv',
//   },
// ];

//  const [datasetquery, setdatasetquery] = useState(dataset[0].id);

	
// 	return (

//         <div>
//             <Select labelText="Sample Dataset" value={datasetquery} onChange={handledatasetChange}>
//                 {dataset.map((item, i) => (
//                     <SelectItem value={item.id} key={i} text = {item.value} />
//                             ))}
//             </Select>
//             <br/>
//             <br/>
//            <TextInput id={'slabel'} labelText = {'Label'} placeholder = {'Label'} value={label} onChange={onLabelSubmit} />

//       </div>

// 	);
	
// }

// export default Sdataset;
