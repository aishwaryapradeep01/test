import {  Select, SelectItem, TextInput  } from 'carbon-components-react';
import React, { useState, useEffect} from 'react';


function Sdatatestcopy() {
   
    const [label , setlabel] = useState('');
    const [labeldd , setlabeldd] = useState({});
    const [csvfile, setcsvfile] = useState('');
    var chosenfile = '/Users/aishwaryapradeep/Desktop/demo/adult.csv';

     const dataset = [
  {
    id: '/Users/aishwaryapradeep/Desktop/demo/adult.csv',
    value: 'adult.csv',
  },
  {
    id: '/Users/aishwaryapradeep/Desktop/demo/breast-cancer.csv',
    value: 'breast-cancer.csv',
  },
  {
    id: '/Users/aishwaryapradeep/Desktop/demo/credit-g.csv',
    value: 'credit-g.csv',
  },
];

const bcancerlabels = [
  'Class',       'age',
  'menopause',   'tumor-size',
  'inv-nodes',   'node-caps',
  'deg-malig',   'breast',
  'breast-quad', 'irradiat'
];

const creditlabels = [
  'checking_status', 'duration',
  'credit_history',  'purpose',
  'credit_amount',   'savings_status',
  'employment',      'installment_commitment',
  'personal_status', 'other_parties',
  'residence_since', 'property_magnitude',
  'age',             'other_payment_plans',
  'housing',         'existing_credits',
  'job',             'num_dependents',
  'own_telephone',   'foreign_worker',
  'class'
];

const adultlabels = [
  'age',            'workclass',
  'fnlwgt',         'education',
  'education-num',  'marital-status',
  'occupation',     'relationship',
  'race',           'sex',
  'capital-gain',   'capital-loss',
  'hours-per-week', 'native-country',
  'income'
];



const [labelitems, setlabelitems] = useState(adultlabels);

 const handledatasetChange = (event) => {
    setdatasetquery(event.target.value);
    // setSelectedcsv(event.target.value);
    // setfilepath(event.target.value);
    // setfilename(event.target.options[event.target.options.selectedIndex].text)
    setcsvfile(event.target.value);

    chosenfile = event.target.value;
    
    
      if(chosenfile === "/Users/aishwaryapradeep/Desktop/demo/credit-g.csv"){
          setlabelitems(creditlabels);
        }
        else if(chosenfile === "/Users/aishwaryapradeep/Desktop/demo/breast-cancer.csv"){
          setlabelitems(bcancerlabels);
        }
        else{
          setlabelitems(adultlabels);
        }
    

setTimeout(() => {
  console.log("What is the dataset now?: ", labelitems);
  }, 8000);
    // getLabeldropdown()
    // .then((resp) => {
    //   setlabeldd(resp);
    //   console.log(resp);
    // })
    // .catch((err) => {console.log(err)})

    // callBackendAPI()
    //   .then(res => setdata({ data: res.result }))
    //   .catch(err => console.log(err));

    console.log("chosen csv is: ", chosenfile);
    // console.log("chosen dataset state is: ", csvfile);
    
  }

  //  const getLabeldropdown = async () => {

  //   console.log("inside func: ", chosenfile);

  //   let response = await fetch('/express_backend');
  //   //  let response = await fetch('/classoverlap?label=' + LabelInput + '&fpath=' + filepath + '&fname=' + filename);

  //   let body = await response.json();
    
  //   if (response.status !== 200) {
  //     throw Error(body.message) 
  //   }
  //   return body.result;
  // };

  //   const callBackendAPI = async () => {
  //   const response = await fetch('/express_backend');
  //   const body = await response.json();

  //   if (response.status !== 200) {
  //     throw Error(body.message) 
  //   }
  //   return body;
  // };


 const [datasetquery, setdatasetquery] = useState(dataset[0].id);
    //const [data, setdata] = useState({data: null})
   
    const [labelquery, setlabelquery] = useState(labelitems[0]);
   
      useEffect(() => {
          console.log("labelquery: ", labelquery);
        }, [datasetquery,labelquery]);

  //  const handleLabelChange = (e) => {

  //   console.log("labelquery: ", labelquery);
  //     setlabelquery(e.target[e.target.selectedIndex].text)

  //     console.log("Label chosen: ",e.target[e.target.selectedIndex].text);
      
  //   }

	
	return (

        <div>
            <Select labelText="Sample Dataset" value={datasetquery} onChange={handledatasetChange}>
                {dataset.map((item, i) => (
                    <SelectItem value={item.id} key={i} text = {item.value} />
                            ))}
            </Select>
            <br/>
            <br/>
            <Select labelText="Label" value={labelquery} onChange={(e) => {setlabelquery(e.target[e.target.selectedIndex].text)}} >

                {labelitems.map((item, i) => (
                    <SelectItem value={item.id} key={i} text = {item} />
                            ))}
            </Select>

           {/* <TextInput id={'slabel'} labelText = {'Label'} placeholder = {'Label'} value={label} onChange={onLabelSubmit} /> */}
            <br/>
            <br/>

            {/* {JSON.stringify(labeldd)} */}

            {/* {JSON.stringify(data)} */}
      </div>

	);
	
}

export default Sdatatestcopy;



