import axios from 'axios';
import { Button, ToastNotification } from 'carbon-components-react';
// import { settings } from 'carbon-components';
import {
  FileUploaderItem,
  FileUploaderDropContainer
} from 'carbon-components-react';
import React, { useState, useCallback, useEffect} from 'react';
let lastId = 0;
function uid(prefix = 'id') {
  lastId++;
  return `${prefix}${lastId}`;
}

// const { prefix } = settings;

function Filetest1({setufilepath, setufilename}) {

    const [selectedFile, setselectedFile] = useState({});
    const [loaded, setloaded] = useState(1);
    const [uploadbuttonstate, setuploadbuttonstate] = useState(false);
    const [notifystatus, setnotifystatus] = useState(false);

  var global_filename = '/Users/aishwaryapradeep/Desktop/Project-SAppGen/R-DART/datafolder/data.csv';

  const onClickHandler = () => {
    // console.log("click handler ",selectedFile);

   const data = new FormData()
   data.append('file', selectedFile)
   axios.post("http://localhost:8000/upload", data, { 
  })
  .then(res => { 
    console.log("file response:", res);
   if(res.statusText === "OK" ){
      //alert("File Upload Successful");
      setnotifystatus(true);
      setufilepath(global_filename);
      setufilename('data.csv');
    }


 })
}
  const [files, setFiles] = useState([]);


  const handleDrop = (e) => {
    e.preventDefault();
     e.stopPropagation();
     console.log(e);
  };

  const handleDragover = (e) => {
    e.preventDefault();
     e.stopPropagation();
     console.log(e);
     
  };
  
  useEffect(() => {
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragover);
    return () => {
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragover);
      
    };
  }, []);

  

  const uploadFile = async (fileToUpload) => {
    // file size validation

    if (fileToUpload.filesize <= 15000000)
    {
        setuploadbuttonstate(false);
    }
    else
    {
        const updatedFile = {
            ...fileToUpload,
            status: 'edit',
            iconDescription: 'Delete file',
            invalid: true,
            errorSubject: 'File size exceeds limit',
            errorBody: 'Max file size is 15MB. Select a new file and try again.',
          };
          setuploadbuttonstate(true);
          setFiles((files) =>
            files.map((file) =>
              file.uuid === fileToUpload.uuid ? updatedFile : file
            )
          );
          return;
    }

    // file type validation
    if (fileToUpload.invalidFileType) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'Invalid file type',
        errorBody: `"${fileToUpload.name}" does not have a valid file type.`,
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }
    try {
      const response = await fetch(
        'https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=1000ms',
        {
          method: 'POST',
          mode: 'cors',
          body: fileToUpload,
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedFile = {
        ...fileToUpload,
        status: 'complete',
        iconDescription: 'Upload complete',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );

      // show x icon after 1 second
      setTimeout(() => {
        const updatedFile = {
          ...fileToUpload,
          status: 'edit',
          iconDescription: 'Remove file',
        };
        setFiles((files) =>
          files.map((file) =>
            file.uuid === fileToUpload.uuid ? updatedFile : file
          )
        );
      }, 1000);
    } catch (error) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Upload failed',
        invalid: true,
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      console.log(error);
    }
  };

  // const onAddFiles = 
  //   (evt, { addedFiles }) => {
  //     evt.stopPropagation();
      // const newFiles = addedFiles.map((file) => ({
      //   uuid: uid(),
      //   name: file.name,
      //   filesize: file.size,
      //   status: 'uploading',
      //   iconDescription: 'Uploading',
      // }));

  //     if (newFiles[0]) {
  //       setFiles([newFiles[0]]);
  //       uploadFile(newFiles[0]);

  //       //setselectedFile(evt.target.files[0]); // rn both methods work but NO FILE STORED
  //       }

  //      console.log("onaddfiles evoked");

    //  if (newFiles[0]) {
    //     setFiles([newFiles[0]]);
    //     uploadFile(newFiles[0]);
        // setloaded(0);
      // }
        // setselectedFile(evt.target.files[0]); manual add works with this + file gets stored

      
    // }

const onAddFiles = useCallback((evt, { addedFiles }) => {
    evt.stopPropagation();
    const newFiles = addedFiles.map((file) => ({
        uuid: uid(),
        name: file.name,
        filesize: file.size,
        status: 'uploading',
        iconDescription: 'Uploading',
      }));
    console.log("addedFiles[0]")
      if (addedFiles[0]) {
        console.log("addedFiles[0]:", addedFiles[0]);
        setFiles([newFiles[0]]);
        uploadFile(newFiles[0]);
        setselectedFile(addedFiles[0]);
        }
      else{
        console.log("No file uploaded : filetest");
      }
    }
  );

  const handleFileUploaderItemClick = useCallback(
    (_, { uuid: clickedUuid }) =>
      setFiles(files.filter(({ uuid }) => clickedUuid !== uuid)),
    [files]
  );

	function notifystatusf() {
    setnotifystatus(false);
  }

	return (

    <div className="bx--file__container" >

      <FileUploaderDropContainer
        // name="productLogo"
        labelText="Drag and drop here or click to upload"
        onAddFiles={onAddFiles}
        accept={['.csv']}
         />

       {/* <FileUploaderDropContainer accept={['.csv']} onAddFiles={onAddFiles} /> */}
      <div className="uploaded-files" style={{ width: '100%' }}>
        {files.map(
          ({
            uuid,
            name,
            filesize,
            status,
            iconDescription,
            invalid,
            ...rest
          }) => (
            <FileUploaderItem
              key={uid()}
              uuid={uuid}
              name={name}
              filesize={filesize}
              size="lg"
              status={status}
              iconDescription={iconDescription}
              invalid={invalid}
              onDelete={handleFileUploaderItemClick}
              {...rest}
            />
          )
        )}
      </div>

      <div className="ButtonArea">
         <Button type="submit" disabled = {uploadbuttonstate} onClick= {onClickHandler} >Upload </Button>
      </div>

  {notifystatus && 
    <ToastNotification
        // caption="00:00:00 AM"
        iconDescription="Close notification"
        subtitle={<span>File Upload Successful</span>}
        timeout={3000}
        onClose = {notifystatusf}
        kind = 'success'
        title="Success Notification"
      />
      }

      </div>

	);
	
}

export default Filetest1;