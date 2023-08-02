import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Card,
  MenuItem,
  Dialog,
  Grid,
  Snackbar,
  TextField
} from '@material-ui/core';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CheckIcon from '@material-ui/icons/Check';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import { NavLink } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
const EmployeeGenderHistory = (props) => {
  const {
    selectedEmployeeInfoHistory,
    create,
    employeeUUID,
    savedEmployeeInfoHistoryDetails,
    setSavedEmployeeInfoHistoryDetails,
    setEmployeeInfoHistoryDetails,
    setSelectedEmployeeInfoHistory,
    setState
  } = props;
  const [gender, setGender] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [reason, setReason] = useState();
  const [files, setFiles] = useState([]);
  const [savedFileDetails, setSavedFileDetails] = useState();
  const [uploadedDocument, setUploadedDocument] = useState();
  const [hasDocument, setHasDocument] = useState(false);
  const [existingDocument, setExistingDocument] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const deleteModaltoggle = () => setDeleteModal(!deleteModal);
  const genders = [
    {
      value: 'Male',
      label: 'Male'
    },
    {
      value: 'Female',
      label: 'Female'
    },
    {
      value: 'Transgender',
      label: 'Transgender'
    },
    {
      value: 'Unknown',
      label: 'Unknown'
    }
  ]
  useEffect(() => {
    if (create != null && !create) {
      setEffectiveDate(
        new Date(selectedEmployeeInfoHistory.effectiveDate)
      );
      setGender(selectedEmployeeInfoHistory.historyObject.gender);
      setReason(selectedEmployeeInfoHistory.reason);
      setSavedFileDetails(selectedEmployeeInfoHistory.historyObject.file);
      checkIfUploadedDocument(selectedEmployeeInfoHistory.historyObject.file);
    }
  }, []);
  const checkIfUploadedDocument = (file) => {
    if (file) {
      let path = file.filePath + '/' + file.fileName;
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then((res) => {
          if (res.status === 200) {
            if (res.data) {
              let baseStr64 = res.data;
              let imgSrc64 = 'data:image/jpg;base64,' + baseStr64;
              // Set the source of the Image to the base64 string
              setUploadedDocument(imgSrc64);
              setHasDocument(true);
              setExistingDocument(true);
            }
          }
        })
        .catch((err) => {
          console.log('updateSession err', err);
        });
    }
  };
  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    // noClick: true,
    // noKeyboard: true,
    multiple: false,
    accept: 'application/pdf, image/jpeg, image/png',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((certificateFile) =>
          Object.assign(certificateFile, {
            preview: URL.createObjectURL(certificateFile)
          })
        )
      );
      setHasDocument(true);
    }
  });
  const thumbs = files.map((certificateFile, index) => (
    <Grid item md={3} className="p-2" key={certificateFile.name}>
      <div className="p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm">
        <a href={certificateFile.preview} download={certificateFile.name}>
          File: {certificateFile.name}{' '}
        </a>
        <FontAwesomeIcon
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            background: 'black',
            color: 'white',
            cursor: 'pointer'
          }}
          icon={['fas', 'times']}
          className="font-size-lg crossIcon"
          onClick={(e) => {
            setFiles([]);
            setHasDocument(false);
          }}
        />
      </div>
    </Grid>
  ));
  const save = () => {
    setIsSubmitted(true);
    const genderHistoryObj = {
      employeeUUID: employeeUUID,
      type: 'EmployeeGender',
      historyObject: { gender: gender },
      effectiveDate: effectiveDate,
      reason: reason
    };
    let isValid = true;
    let errors = [];
    if (effectiveDate == null || effectiveDate.length == 0) {
      isValid = false;
      errors.push('Effective Date Can not be Empty');
    }
    if (reason == null || reason.length == 0) {
      isValid = false;
      errors.push('Reason Can not be Empty');
    }
    if (create) {
      if (files.length == 0) {
        isValid = false;
        errors.push('Document is Required. Kindly upload the document');
      }
    } else {
      if (!hasDocument) {
        isValid = false;
        errors.push('Document is Required. Kindly upload the document');
      }
      if (
        gender == selectedEmployeeInfoHistory.historyObject.gender &&
        savedFileDetails == selectedEmployeeInfoHistory.historyObject.file
      ) {
        isValid = false;
        errors.push(
          'There are no changes to update kindly change the fields before saving'
        );
      }
    }
    if (isValid) {
      if (create) {
        let formData = new FormData();
        formData.append('file', files[0]);
        formData.append('documentType', 'EmployeeGender');
        apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
          .then((res) => {
            if (res.status === 200) {
              genderHistoryObj.historyObject.file = res.data;
              saveHistoryObject(genderHistoryObj);
            }
          })
          .catch((err) => {
            console.log('Document Upload err', err);
            setState({
              open: true,
              message: 'err',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            });
          });
      } else {
        if (files.length > 0) {
          let formData = new FormData();
          formData.append('file', files[0]);
          formData.append('documentType', 'EmployeeGender');
          apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
            .then((res) => {
              if (res.status === 200) {
                genderHistoryObj.historyObject.file = res.data;
                saveHistoryObject(genderHistoryObj);
                setSavedFileDetails(res.data);
                setExistingDocument(true);
              }
            })
            .catch((err) => {
              console.log('Document Upload err', err);
              setState({
                open: true,
                message: 'err',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              });
            });
        } else {
          genderHistoryObj.historyObject.file = savedFileDetails;
          saveHistoryObject(genderHistoryObj);
        }
      }
    } else {
      setState({
        open: true,
        message: errors.toString(),
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };
  const saveHistoryObject = (genderHistoryObj) => {
    if (create) {
      apicaller('post', `${BASEURL}/employeeInfoHistory/save`, genderHistoryObj)
        .then((res) => {
          if (res.status === 200) {
            setEmployeeInfoHistoryDetails([
              null,
              res.data[0],
              ...savedEmployeeInfoHistoryDetails
            ]);
            setSavedEmployeeInfoHistoryDetails([
              res.data[0],
              ...savedEmployeeInfoHistoryDetails
            ]);
            setSelectedEmployeeInfoHistory(res.data[0]);
            setState({
              open: true,
              message: 'Employee Gender Created Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          console.log('getEmployeeInfoHistory err', err);
          setState({
            open: true,
            message: 'Error occured while creating Employee Gender',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
        });
    } else {
      genderHistoryObj.uuid = selectedEmployeeInfoHistory.uuid;
      apicaller('put', `${BASEURL}/employeeInfoHistory/update`, genderHistoryObj)
        .then((res) => {
          if (res.status === 200) {
            selectedEmployeeInfoHistory.historyObject.gender = gender;
            setState({
              open: true,
              message: 'Employee Gender Corrected Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          console.log('getEmployeeInfoHistory err', err);
          setState({
            open: true,
            message: 'Error occured while Correcting Employee Gender',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
        });
    }
  };
  const deleteGender = () => {
    setDeleteModal(false);
    apicaller(
      'delete',
      `${BASEURL}/employeeInfoHistory/delete/` +
      selectedEmployeeInfoHistory.uuid
    )
      .then((res) => {
        if (res.status === 200) {
          const filteredHistory = savedEmployeeInfoHistoryDetails.filter(
            (historyDetail) =>
              historyDetail.uuid != selectedEmployeeInfoHistory.uuid
          );
          setEmployeeInfoHistoryDetails([null, ...filteredHistory]);
          setSavedEmployeeInfoHistoryDetails(filteredHistory);
          setSelectedEmployeeInfoHistory(null);
          console.log(savedEmployeeInfoHistoryDetails)
          setState({
            open: true,
            message: 'Employee History Deleted Sucessfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          });
        }
      })
      .catch((err) => {
        console.log('getEmployeeInfoHistory err', err);
        setState({
          open: true,
          message: err.response.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
      });
  };
  return (
    <Grid item lg={12}>
      <div>
        <h4>
          Change Employee's Gender
        </h4>
        <br />
        <Grid container spacing={6}>
          <Grid item md={4}>
            <label className='mb-2'>Gender *</label>
            <TextField
              variant='outlined'
              fullWidth
              id='outlined-gender'
              select
              label='Select'
              size='small'
              name='gender'
              value={gender}
              onChange={event => {
                setGender(event.target.value)
              }}
              helperText={
                (isSubmitted && !gender) || (isSubmitted && gender === '')
                  ? 'Gender is required'
                  : ''
              }
              error={
                (isSubmitted && !gender) || (isSubmitted && gender === '')
                  ? true
                  : false
              }
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}>
              {genders.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <label className=" mb-2">Effective As of *</label>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              style={{ margin: '0%' }}>
              <KeyboardDatePicker
                style={{ margin: '0%' }}
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="outlined-effectiveDate"
                fullWidth
                size="small"
                value={effectiveDate}
                onChange={(event) => {
                  setEffectiveDate(event);
                }}
                error={isSubmitted && (effectiveDate ? false : true)}
                helperText={
                  isSubmitted &&
                  (effectiveDate ? '' : 'Effective Date is Mandatory')
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item md={8}>
            <label className=" mb-2">Reason for Change *</label>
            <TextField
              id="outlined-reason"
              variant="outlined"
              fullWidth
              size="small"
              name="reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
              }}
              helperText={
                isSubmitted && (!reason || reason === '')
                  ? 'Reason is required'
                  : ''
              }
              error={
                isSubmitted && (!reason || reason === '') ? true : false
              }
            />
          </Grid>
          {(create || !existingDocument) && (
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
                        <b>Upload Document</b>
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
          )}
          {!create && existingDocument && (
            <Grid item md={10} className="p-2">
              <div className="p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm">
                <a
                  href={uploadedDocument}
                  download={savedFileDetails?.fileName}>
                  File: {savedFileDetails?.fileName}
                </a>
                <Box textAlign="right">
                  <Button
                    onClick={(e) => {
                      setUploadedDocument(null);
                      setSavedFileDetails(null);
                      setHasDocument(false);
                      setExistingDocument(false);
                    }}
                    className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right">
                    <FontAwesomeIcon
                      icon={['fas', 'times']}
                      className="font-size-sm"
                    />
                  </Button>
                </Box>
              </div>
            </Grid>
          )}
        </Grid>
        <br />
        <div className="float-left">
          <Button className="btn-primary mb-2 m-2" onClick={(e) => save(e)}>
            {create ? 'save' : 'Correct History'}
          </Button>
          {!(
            create ||
            savedEmployeeInfoHistoryDetails[
              savedEmployeeInfoHistoryDetails.length - 1
            ]?.uuid == selectedEmployeeInfoHistory?.uuid
          ) && (
              <Button
                className="btn-primary mb-2 m-2"
                onClick={(e) => setDeleteModal(true)}>
                Delete History
              </Button>
            )}
          <Button
            className="btn-primary mb-2 mr-3 m-2"
            component={NavLink}
            to={'./employeeDetails'}>
            Cancel
          </Button>
        </div>
      </div>
      <Dialog
        open={deleteModal}
        onClose={deleteModaltoggle}
        classes={{ paper: 'shadow-lg rounded' }}>
        <div className="text-center p-5">
          <div className="avatar-icon-wrapper rounded-circle m-0">
            <div className="d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130">
              <FontAwesomeIcon
                icon={['fas', 'times']}
                className="d-flex align-self-center display-3"
              />
            </div>
          </div>
          <h4 className="font-weight-bold mt-4">
            Are you sure you want to delete this History?
          </h4>
          <p className="mb-0 font-size-lg text-muted">
            You cannot undo this operation.
          </p>
          <div className="pt-4">
            <Button
              onClick={deleteModaltoggle}
              className="btn-neutral-secondary btn-pill mx-1">
              <span className="btn-wrapper--label">Cancel</span>
            </Button>
            <Button
              onClick={(e) => deleteGender(e)}
              className="btn-danger btn-pill mx-1">
              <span className="btn-wrapper--label">Delete</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </Grid>
  )
}
const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeGenderHistory);

