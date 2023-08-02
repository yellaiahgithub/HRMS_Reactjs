import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Snackbar,
  Container,
  MenuItem,
  MenuList,
  TextField,
  Switch,
  Table
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
// List
import apicaller from 'helper/Apicaller';
import { useDropzone } from 'react-dropzone';
import { Alert, Autocomplete } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import { parse } from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSVLink } from 'react-csv';
import { moment } from 'moment';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { ContentState, EditorState, convertFromHTML } from 'draft-js';

const DropZoneComponent = (props) => {
  const {
    isHeader = false,
    isFooter = false,
    isSignature = false,
    setUploadedHeader,
    setUploadedFooter,
    setUploadedSignature
  } = props;

  const [files, setFiles] = useState([]);

  useEffect(() => {}, []);

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    // noClick: true,
    // noKeyboard: true,
    multiple: false,
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
        updateData(
          Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(file)
          })
        );
      });
    }
  });
  const updateData = (file) => {
    if (isHeader) setUploadedHeader(file?.preview);
    if (isFooter) setUploadedFooter(file?.preview);
    if (isSignature) setUploadedSignature(file?.preview);
  };
  const thumbs = files.map((file, index) => (
    <Grid item md={12} className="p-2" key={file.name}>
      <div className="p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm">
        {file.name} - {file.size}KB
        <Box textAlign="right">
          <Button
            onClick={(e) => {
              files.splice(index, 1);
              thumbs.splice(index, 1);
              if (isHeader) setUploadedHeader(null);
              if (isFooter) setUploadedFooter(null);
              if (isSignature) setUploadedSignature(null);
            }}
            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
            <FontAwesomeIcon icon={['fas', 'times']} className="font-size-sm" />
          </Button>
        </Box>
      </div>
    </Grid>
  ));
  return (
    <Grid item container spacing={2} direction="row">
      <Grid item md={12}>
        <Card
          style={{
            padding: '25px',
            border: '1px solid #c4c4c4',
            margin: '25px'
          }}
          className="mt-4 p-3 p-lg-5 shadow-xxl">
          <div className="card-header">
            <div className="card-header--title">
              <p>
                <b>
                  Upload{' '}
                  {isHeader ? 'Header' : isFooter ? 'Footer' : 'Signature'}
                </b>
              </p>
            </div>
          </div>
          <div className="dropzone">
            <div
              {...getRootProps({
                className: 'dropzone-upload-wrapper'
              })}>
              <input {...getInputProps()} />
              <div className="dropzone-inner-wrapper bg-white">
                {isDragAccept && (
                  <div>
                    <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-success mx-auto">
                      <svg
                        className="d-140 opacity-2"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(300,300)">
                          <path
                            d="M170.4,-137.2C213.2,-82.3,234.8,-11.9,223.6,56.7C212.4,125.2,168.5,191.9,104.3,226.6C40.2,261.3,-44.1,264,-104,229.8C-163.9,195.7,-199.4,124.6,-216.2,49.8C-233,-25.1,-231,-103.9,-191.9,-158C-152.7,-212.1,-76.4,-241.6,-6.3,-236.6C63.8,-231.6,127.7,-192.2,170.4,-137.2Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                      <div className="blob-icon-wrapper">
                        <CheckIcon className="d-50" />
                      </div>
                    </div>
                    <div className="font-size-sm text-success">
                      All files will be uploaded!
                    </div>
                  </div>
                )}
                {isDragReject && (
                  <div>
                    <div className="d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-danger mx-auto">
                      <svg
                        className="d-140 opacity-2"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(300,300)">
                          <path
                            d="M169,-144C206.7,-87.5,216.5,-18,196.9,35.7C177.3,89.4,128.3,127.1,75.2,150.7C22,174.2,-35.4,183.5,-79.7,163.1C-124,142.7,-155.1,92.6,-164.1,40.9C-173.1,-10.7,-160.1,-64,-129,-118.9C-98,-173.8,-49,-230.4,8.3,-237.1C65.7,-243.7,131.3,-200.4,169,-144Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                      <div className="blob-icon-wrapper">
                        <CloseTwoToneIcon className="d-50" />
                      </div>
                    </div>
                    <div className="font-size-sm text-danger">
                      Some files will be rejected! Accepted only csv files
                    </div>
                  </div>
                )}
                {!isDragActive && (
                  <div>
                    <div className="d-140 hover-scale-lg icon-blob btn-icon text-first mx-auto">
                      <svg
                        className="d-140 opacity-2"
                        viewBox="0 0 600 600"
                        xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(300,300)">
                          <path
                            d="M171.2,-128.5C210.5,-87.2,223.2,-16.7,205.1,40.4C186.9,97.5,137.9,141.1,81.7,167.2C25.5,193.4,-38,202.1,-96.1,181.2C-154.1,160.3,-206.7,109.7,-217.3,52.7C-227.9,-4.4,-196.4,-68,-153.2,-110.2C-110,-152.4,-55,-173.2,5.5,-177.5C65.9,-181.9,131.9,-169.8,171.2,-128.5Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                      <div className="blob-icon-wrapper">
                        <PublishTwoToneIcon className="d-50" />
                      </div>
                    </div>
                    <div className="font-size-sm">
                      Drop files here or click to upload
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card-footer p-3 bg-secondary">
            <div>
              <div className="font-weight-bold mb-3 text-uppercase text-dark font-size-sm text-center">
                Uploaded Files
              </div>
              {thumbs.length > 0 && (
                <div>
                  <Alert severity="success" className="text-center mb-3">
                    You have uploaded <b>{thumbs.length}</b> files!
                  </Alert>
                  <Grid container spacing={0}>
                    {thumbs}
                  </Grid>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DropZoneComponent;
