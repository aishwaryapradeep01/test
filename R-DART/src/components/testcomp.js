import React, { useState, useCallback, useEffect } from 'react';
import { settings } from 'carbon-components';
import {
  FileUploaderItem,
  FileUploaderDropContainer,
  FormItem,
} from 'carbon-components-react';

let lastId = 0;

function uid(prefix = 'id') {
  lastId++;
  return `${prefix}${lastId}`;
}
const { prefix } = settings;

function ExampleDropContainerApp() {



  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
  };

  const handleDragover = (e) => {
    e.preventDefault();
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
    if (fileToUpload.filesize > 3145728) {
      const updatedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'File size exceeds limit',
        errorBody: '3MB max file size. Select a new file and try again.',
      };
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

const onAddFiles = useCallback(
    (evt, { addedFiles }) => {
      evt.stopPropagation();
      const newFiles = addedFiles.map((file) => ({
        uuid: uid(),
        name: file.name,
        filesize: file.size,
        status: 'uploading',
        iconDescription: 'Uploading',
      }));
      
      if (newFiles[0]) {
        setFiles([newFiles[0]]);
        uploadFile(newFiles[0]);
      }
    },[files]
  );

  const handleFileUploaderItemClick = useCallback(
    (_, { uuid: clickedUuid }) =>
      setFiles(files.filter(({ uuid }) => clickedUuid !== uuid)),
    [files]
  );

  return (
    <FormItem>
      <p className={`${prefix}--file--label`}>Upload files</p>
      <p className={`${prefix}--label-description`}>
        Max file size is 3MB. Supported file type is csv
      </p>
      <FileUploaderDropContainer accept={['.csv']} onAddFiles={onAddFiles} />
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
    </FormItem>
  );
}

export default ExampleDropContainerApp;