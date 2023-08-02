import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Snackbar,
  Table,
  TextField
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import 'date-fns';
import apicaller from 'helper/Apicaller';
import { useDropzone } from 'react-dropzone';
import { Alert, Pagination } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import JSZip from 'jszip';

const CreateUploadDocument = (props) => {
  const { selectedCompany } = props;

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const [newFileUploaded, setNewFileUploaded] = useState(false);
  const [showUploadedData, setShowUploadedData] = useState(false);
  const [documentType, setDocumentType] = useState(null);

  const [files, setFiles] = useState([]);
  const [paginationUploadDocumentData, setPaginationUploadDocumentData] =
    useState([]);
  const [mappedUploadDocumentData, setMappedUploadDocumentData] = useState([]);
  const [uploadDocumentData, setUploadDocumentData] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [CSVHeader, setCSVHeader] = useState([]);
  const [navigateToUploadResultsPage, setNavigateToUploadResultsPage] =
    useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults');

  const documentTypeList = [
    { key: 'NationalId', value: 'National Id' },
    { key: 'EmployeeProfileImage', value: 'Employee Profile Image' }
  ];
  const nationalIdTypeList = [
    'AadhaarCard',
    'IndianPassport',
    'VoterIDCard',
    'PANCard',
    'DrivingLicense',
    'SSN'
  ];
  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    getDocumentCSVHeader();
  }, []);
  const getDocumentCSVHeader = () => {
    apicaller('get', `${BASEURL}/document/CSVHeader`)
      .then((res) => {
        if (res.status === 200) {
          setCSVHeader(res.data.CSVHeader);
        }
      })
      .catch((err) => {
        console.log('get document err', err);
      });
  };

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
    accept: ['application/x-zip-compressed'],
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
        const uploadingData = [];
        JSZip.loadAsync(file) // 1) read the Blob
          .then((zip) => {
            zip.forEach((relativePath, zipEntry) => {
              const zipEntryNameDetails = zipEntry.name.split('/', 2);
              const fileName = zipEntryNameDetails?.[1];
              const documentName = fileName?.split('.', 2);
              const employeeDocumenntDetails = documentName[0].split('_', 2);
              const extension = documentName?.[1];
              const employeeId = employeeDocumenntDetails?.[0];
              const contentType = employeeDocumenntDetails?.[1];
              uploadingData.push({
                employeeId: employeeId,
                contentType: contentType,
                fileName: fileName
              });
            });
            const mappedUploadingData = new Map();
            for (let i = 0; i < uploadingData?.length > 0; i++) {
              const record = uploadingData[i];
              if (mappedUploadingData.get(record.employeeId)) {
                mappedUploadingData.set(record.employeeId, [
                  ...mappedUploadingData.get(record.employeeId),
                  { ...record, index: i }
                ]);
              } else {
                mappedUploadingData.set(record.employeeId, [
                  { ...record, index: i }
                ]);
              }
            }
            setMappedUploadDocumentData(mappedUploadingData);
            setUploadDocumentData(uploadingData);
            setPaginationUploadDocumentData(uploadingData);
          });
      });
      setNewFileUploaded(true);
    }
  });
  const thumbs = files.map((file, index) => (
    <Grid item md={12} className="p-2" key={file.name}>
      <div className="p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm">
        {file.name} - {file.size}KB
        <Box textAlign="right">
          <Button
            onClick={(e) => {
              files.splice(index, 1);
              thumbs.splice(index, 1);
              setPaginationUploadDocumentData([]);
              setUploadDocumentData([]);
            }}
            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
            <FontAwesomeIcon icon={['fas', 'times']} className="font-size-sm" />
          </Button>
        </Box>
      </div>
    </Grid>
  ));

  const validateUploadingData = () => {
    let dataWithoutErrors = [];
    let dataWithErrors = [];

    uploadDocumentData.forEach((item, currentItemIndex) => {
      let isValid = true;
      item.errors = [];
      const uploadingRecordListOfEmployee = mappedUploadDocumentData.get(
        item.employeeId
      );
      if (item.employeeId == null || item.employeeId.length == 0) {
        isValid = false;
        item.errors.push('Employee Id can not be empty.\n');
      }
      if (documentType === documentTypeList[0].key) {
        if (item.contentType == null || item.contentType.length == 0) {
          isValid = false;
          item.errors.push('Content Type can not be empty.\n');
        }
        if (
          nationalIdTypeList.find(
            (nationalIdType) =>
              nationalIdType.toLowerCase() === item.contentType?.toLowerCase()
          ) == null
        ) {
          isValid = false;
          item.errors.push(
            "Invalid Content Type. Content Type Should be One Of these: ' " +
            nationalIdTypeList.toString() +
            " ' \n"
          );
        }
        const duplicateEmployeeRecordIdWithType =
          uploadingRecordListOfEmployee.find(
            (record) =>
              record.contentType?.toLowerCase() ===
              item.contentType?.toLowerCase() &&
              currentItemIndex != record.index
          );
        if (duplicateEmployeeRecordIdWithType) {
          isValid = false;
          item.errors.push(
            "Duplicate National Id Type '" +
            item.contentType +
            "' .Another record also has same Type with EmployeeId'" +
            duplicateEmployeeRecordIdWithType?.employeeId +
            "' in the uploaded file " +
            '\n'
          );
        }
      }
      if (isValid) {
        dataWithoutErrors.push(item);
      } else {
        dataWithErrors.push(item);
      }
    });
    const data = [...dataWithErrors];
    data.push(...dataWithoutErrors);
    setUploadDocumentData(data);
    setPaginationUploadDocumentData(data);
    setState({
      open: true,
      message:
        dataWithErrors?.length > 0
          ? dataWithErrors.length +
          ' Records have errors kindly resolve them in order to save them'
          : 'No Errors found in the data you can save them',
      toastrStyle:
        dataWithErrors?.length > 0 ? 'toastr-warning' : 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    });
  };
  const saveAll = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('documentType', documentType);
    formData.append('forValidationOnly', false);
    formData.append('data', JSON.stringify(uploadDocumentData));
    setNavigateToUploadResultsPage(true);
    setState({
      open: true,
      message:
        "Upload is in Queue Kindly verify the results in 'UPLOAD RESULTS' page",
      toastrStyle: 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    });
    apicaller('post', `${BASEURL}/upload-document/saveAll`, formData)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        setState({
          open: true,
          message: err?.response?.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
        console.log('Upload Document err', err);
      });
  };
  return (
    <>
      {!showUploadedData ? (
        <Grid container spacing={0}>
          <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
            <Grid item container spacing={2} direction="row">
              <Grid item container md={12} spacing={2} direction="row" className='mt-4'>
                <Grid item md={3} className="">
                  <label style={{ marginTop: '10px' }} className=" mb-2">
                    Select Document
                  </label>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    variant="outlined"
                    label='Select'
                    fullWidth
                    id="outlined-hod-type"
                    select
                    size="small"
                    name="documentType"
                    value={documentType}
                    onChange={(event) => {
                      setDocumentType(event.target.value);
                    }}
                    error={
                      isNextClicked &&
                      (documentType == null || documentType.length == 0)
                    }
                    helperText={
                      isNextClicked &&
                        (documentType == null || documentType.length == 0)
                        ? 'Document Type Should not be empty'
                        : null
                    }>
                    {documentTypeList.map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row">
                <Grid item md={10} className="mx-auto">
                  {documentType === documentTypeList[0].key && (
                    <>
                      <br />
                      <b>Instructions for National ID</b>
                      <br />
                      <span>
                        * Each Image to be uploaded should be saved in the
                        followig format - 'EmployeeID_DocumentType'. Example, if
                        the employee ID is 35 and the file to be uploaded is
                        Aadhar then the file should be saved as 35_Aadhar.
                      </span>
                      <br />
                      <label>
                        * Place all the files (Images) in a folder and save it
                        as a Zip file.
                      </label>
                      <br />
                      <label>* Each Zip file should not exceed 20 MB.</label>
                      <br />
                    </>
                  )}
                  {documentType === documentTypeList[1].key && (
                    <>
                      <br />
                      <b>Instructions for Employee Profile Image</b>
                      <br />
                      <label>
                        * Each Image to be uploaded should be saved as the
                        employee ID.
                      </label>
                      <br />
                      <label>
                        * Place all the files (Images) in a folder and save it
                        as a Zip file.
                      </label>
                      <br />
                      <label>* Each Zip file should not exceed 20 MB.</label>
                      <br />
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="row" className='mt-4'>
                <Grid item md={12}>
                  <Card
                    className="mt-4 p-3 p-lg-5 shadow-xxl codesCard">
                    <div className="card-header">
                      <div className="card-header--title">
                        <p>
                          <b>Upload .CSV file</b>
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
                                Some files will be rejected! Accepted only csv
                                files
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
                        <div className="mb-3 text-uppercase text-dark font-size-sm text-center">
                          Uploaded Files
                        </div>
                        {thumbs.length <= 0 && (
                          <div className='text-first text-center font-size-sm'>
                            Uploaded demo File previews will appear here!
                          </div>
                        )}
                        {thumbs.length > 0 && (
                          <div>
                            <Alert
                              severity="success"
                              className="text-center mb-3">
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
              <br />
            </Grid>
            <Grid item container spacing={2} direction="row" className='mt-4'>
              <Button
                className="btn-primary m-2 "
                type="submit"
                disabled={files?.length == 0}
                onClick={(e) => {
                  setIsNextClicked(true);
                  if (documentType != null) setShowUploadedData(true);
                }}>
                Next
              </Button>
              <Button
                className="btn-primary m-2 "
                component={NavLink}
                to="./dashboard">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <>
          {paginationUploadDocumentData.length > 0 && (
            <>
              <Box textAlign="right">
                <Button
                  className="btn-primary mb-2 mr-3"
                  onClick={(e) => validateUploadingData()}>
                  Validate
                </Button>
              </Box>
              <div className="p-4">
                <div className="table-responsive-md">
                  <Table className="table table-alternate-spaced mb-0">
                    <thead>
                      <tr>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Employee Id
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize"
                          scope="col">
                          File Name
                        </th>
                        <th
                          style={{ width: 'auto' }}
                          className="font-size-lg font-weight-bold pb-4 text-capitalize "
                          scope="col">
                          Errors
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginationUploadDocumentData
                        .slice(
                          page * recordsPerPage > uploadDocumentData.length
                            ? page === 0
                              ? 0
                              : page * recordsPerPage - recordsPerPage
                            : page * recordsPerPage - recordsPerPage,
                          page * recordsPerPage <= uploadDocumentData.length
                            ? page * recordsPerPage
                            : uploadDocumentData.length
                        )
                        .map((item, index) => (
                          <>
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label title={item.employeeId}>
                                      {item.employeeId}
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label title={item.fileName}>
                                      {item.fileName}
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <label
                                      style={
                                        item.errors?.length > 0
                                          ? { color: 'red' }
                                          : {}
                                      }
                                      title={item.errors}>
                                      {item.errors}
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr className="divider"></tr>
                          </>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                <Pagination
                  className="pagination-primary"
                  count={Math.ceil(uploadDocumentData.length / recordsPerPage)}
                  variant="outlined"
                  shape="rounded"
                  selected={true}
                  page={page}
                  onChange={handleChange}
                  showFirstButton
                  showLastButton
                />
              </div>
            </>
          )}
          {navigateToUploadResultsPage ? (
            <div className="d-flex align-items-center justify-content-center">
              <a
                href={uploadResultsUrl}
                className="text-black"
                title="Navigate To Upload Results Page"
                style={{ color: 'blue' }}>
                Navigate To Upload Results Page
              </a>
            </div>
          ) : (
            ''
          )}
          <Box textAlign="right">
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => {
                setShowUploadedData(false);
              }}>
              Back
            </Button>
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => saveAll(e)}>
              Save all
            </Button>
          </Box>
        </>
      )}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
      <br />
      <br />
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUploadDocument);
