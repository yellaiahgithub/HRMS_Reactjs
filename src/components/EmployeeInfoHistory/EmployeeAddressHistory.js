import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Grid,
  MenuItem,
  Snackbar,
  TextField
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import React from 'react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
import CheckIcon from '@material-ui/icons/Check';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';

const EmployeeAddressHistory = (props) => {
  const {
    selectedEmployeeInfoHistory,
    create,
    employeeUUID,
    savedEmployeeInfoHistoryDetails,
    setSavedEmployeeInfoHistoryDetails,
    setEmployeeInfoHistoryDetails,
    setSelectedEmployeeInfoHistory,
    countriesMasterData,
    setState
  } = props;

  const [isPrimaryID, setIsPrimaryID] = useState(false);
  const [addressType, setAddressType] = useState();
  const [editCurrentContact, setEditCurrentContact] = useState();
  const [addState, setAddState] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [addressLine1, setAddressLine1] = useState();
  const [addressLine2, setAddressLine2] = useState();
  const [addressLine3, setAddressLine3] = useState();
  const [PIN, setPIN] = useState();
  const [currentStatus, setCurrentStatus] = useState([
    { label: 'Active', value: true }
  ]);
  const [status, setStatus] = useState(true);
  const [addressId, setAddressId] = useState();
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  let tempCountries = [];
  let tempStates = [];
  const [isSubmitted, setIsSubmitted] = useState();
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [reason, setReason] = useState();
  const [files, setFiles] = useState([]);
  const [savedFileDetails, setSavedFileDetails] = useState();

  const [deleteModal, setDeleteModal] = useState(false);
  const deleteModaltoggle = () => setDeleteModal(!deleteModal);
  const [uploadedDocument, setUploadedDocument] = useState();
  const [hasDocument, setHasDocument] = useState(false);
  const [existingDocument, setExistingDocument] = useState(false);

  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
    if (create != null && !create) {
      setAddressType(selectedEmployeeInfoHistory.historyObject.addressType);
      setIsPrimaryID(selectedEmployeeInfoHistory.historyObject.isPrimary);
      setStatus(selectedEmployeeInfoHistory.historyObject.status);
      setCurrentStatus([
        { label: 'Active', value: true },
        { label: 'InActive', value: false }
      ]);
      setEffectiveDate(selectedEmployeeInfoHistory.historyObject.effectiveDate);
      setCountry(selectedEmployeeInfoHistory.historyObject.country);
      setAddState(selectedEmployeeInfoHistory.historyObject.state);
      setCity(selectedEmployeeInfoHistory.historyObject.city);
      setPIN(selectedEmployeeInfoHistory.historyObject.PIN);
      setAddressLine1(selectedEmployeeInfoHistory.historyObject.address1);
      setAddressLine2(selectedEmployeeInfoHistory.historyObject.address2);
      setAddressLine3(selectedEmployeeInfoHistory.historyObject.address3);
      setStatus(selectedEmployeeInfoHistory.historyObject.isActive);
      setAddressId(selectedEmployeeInfoHistory.historyObject.documentUUID);
      const countryIdx = tempCountries.findIndex(
        (country) =>
          country.name === selectedEmployeeInfoHistory.historyObject.country
      );
      if (countryIdx != -1) {
        setCountryIndex(countryIdx);
        const stateIdx = tempCountries[countryIdx]?.states.findIndex(
          (state) => state === selectedEmployeeInfoHistory.historyObject.state
        );
        tempStates = tempCountries[countryIdx].states;
        setAllStates(tempStates);
        if (stateIdx != -1) {
          setStateIndex(stateIdx);
        } else {
          setStateIndex(null);
        }
      } else {
        setCountryIndex(null);
        setStateIndex(null);
        setAllStates([]);
      }
      setEffectiveDate(
        new Date(selectedEmployeeInfoHistory.effectiveDate).toString()
      );
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
  const addressTypeArray = [
    {
      value: 'Permanent',
      label: 'Permanent'
    },
    {
      value: 'Current',
      label: 'Current'
    }
  ];
  const getParsedDate = (date) => {
    if (date !== null && date !== '') {
      return new Date(date).toLocaleDateString('af-ZA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } else {
      return 'N/A';
    }
  };

  const [state1, setState1] = useState({
    accordion: [false, false, false]
  });

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
  const getObjByValue = (arr, value) => {
    const a = arr.find((x) => x.value + '' == value + '');
    return a;
    // return value ? arr.find((x) => x.value == value) : {};
  };
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
    const addressObject = {
      addressType: addressType,
      effectiveDate: effectiveDate,
      isActive: status,
      address1: addressLine1,
      address2: addressLine2,
      address3: addressLine3,
      country: country,
      state: addState,
      city: city,
      PIN: PIN,
      isPrimary: isPrimaryID,
      employeeUUID: employeeUUID,
      isHistory: true
    };

    let isValid = true;
    let errors = [];
    if (addressType == null || addressType.length == 0) {
      isValid = false;
      errors.push('AddressType Can not be Empty\n');
    }
    if (addressLine1 == null || addressLine1.length == 0) {
      isValid = false;
      errors.push('Address Line one Can not be Empty\n');
    }
    if (addressLine2 == null || addressLine2.length == 0) {
      isValid = false;
      errors.push('Address Line Two Can not be Empty\n');
    }
    if (addressLine3 == null || addressLine3.length == 0) {
      isValid = false;
      errors.push('Address Line Three Can not be Empty\n');
    }
    if (country == null || country.length == 0) {
      isValid = false;
      errors.push('Country Can not be Empty\n');
    }
    if (addState == null || addState.length == 0) {
      isValid = false;
      errors.push('State Can not be Empty\n');
    }
    if (PIN == null || PIN.length == 0) {
      isValid = false;
      errors.push('PIN Can not be Empty\n');
    }
    if (effectiveDate == null || effectiveDate.length == 0) {
      isValid = false;
      errors.push('Effective Date Can not be Empty\n');
    }
    if (reason == null || reason.length == 0) {
      isValid = false;
      errors.push('Reason Can not be Empty\n');
    }
    if (create) {
      if (files.length == 0) {
        isValid = false;
        errors.push('Document is Required. Kindly upload the document\n');
      }
    } else {
      if (!hasDocument) {
        isValid = false;
        errors.push('Document is Required. Kindly upload the document\n');
      }
      if (
        addressType == selectedEmployeeInfoHistory.historyObject.addressType &&
        addressLine1 == selectedEmployeeInfoHistory.historyObject.address1 &&
        addressLine2 == selectedEmployeeInfoHistory.historyObject.address2 &&
        addressLine3 == selectedEmployeeInfoHistory.historyObject.address3 &&
        country == selectedEmployeeInfoHistory.historyObject.country &&
        addState == selectedEmployeeInfoHistory.historyObject.state &&
        city == selectedEmployeeInfoHistory.historyObject.city &&
        PIN == selectedEmployeeInfoHistory.historyObject.PIN &&
        isPrimaryID == selectedEmployeeInfoHistory.historyObject.isPrimary &&
        status == selectedEmployeeInfoHistory.historyObject.isActive &&
        savedFileDetails == selectedEmployeeInfoHistory.historyObject.file
      ) {
        isValid = false;
        errors.push(
          'There are no changes to update kindly change the fields before saving\n.'
        );
      }
    }
    if (isValid) {
      if (create) {
        let formData = new FormData();
        formData.append('file', files[0]);
        formData.append('documentType', 'EmployeeAddress');
        apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
          .then((res) => {
            if (res.status === 200) {
              addressObject.file = res.data;
              saveHistoryObject(addressObject);
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
          formData.append('documentType', 'EmployeeAddress');
          apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
            .then((res) => {
              if (res.status === 200) {
                addressObject.file = res.data;
                saveHistoryObject(addressObject);
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
          addressObject.file = savedFileDetails;
          addressObject.reason = reason;
          saveHistoryObject(addressObject);
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
  const saveHistoryObject = (addressObject) => {
    if (create) {
      apicaller('post', `${BASEURL}/address`, addressObject)
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
              message: 'Employee Address Created Sucessfully',
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
    } else {
      addressObject.historyUUID = selectedEmployeeInfoHistory.uuid;
      addressObject.uuid = selectedEmployeeInfoHistory.documentUUID;
      apicaller(
        'patch',
        `${BASEURL}/address?uuid=${selectedEmployeeInfoHistory.documentUUID}`,
        addressObject
      )
        .then((res) => {
          if (res.status === 200) {
            selectedEmployeeInfoHistory.historyObject.addressType = addressType;
            selectedEmployeeInfoHistory.historyObject.isPrimary = isPrimaryID;
            selectedEmployeeInfoHistory.historyObject.country = country;
            selectedEmployeeInfoHistory.historyObject.state = addState;
            selectedEmployeeInfoHistory.historyObject.city = city;
            selectedEmployeeInfoHistory.historyObject.PIN = PIN;
            selectedEmployeeInfoHistory.historyObject.address1 = addressLine1;
            selectedEmployeeInfoHistory.historyObject.address2 = addressLine2;
            selectedEmployeeInfoHistory.historyObject.address3 = addressLine3;
            selectedEmployeeInfoHistory.historyObject.isActive = status;
            selectedEmployeeInfoHistory.effectiveDate = effectiveDate;
            selectedEmployeeInfoHistory.reason = reason;
            selectedEmployeeInfoHistory.historyObject.file = addressObject.file;
            setState({
              open: true,
              message: 'Employee Address Corrected Sucessfully',
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
    }
  };
  const deleteAddress = () => {
    setDeleteModal(false);
    apicaller(
      'delete',
      `${BASEURL}/address?uuid=${selectedEmployeeInfoHistory.documentUUID}`
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
          setState({
            open: true,
            message: 'Employee Address History Deleted Sucessfully',
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
          message: err.response.data?.message,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
      });
  };
  return (
    <Grid item lg={12}>
      <div>
        <div>
          <div>
            <h4
              style={{
                color: 'blue'
              }}>
              Change Employee's Address
            </h4>
            <br />
            <Grid container spacing={1}>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Address Type *
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  select
                  options={addressTypeArray}
                  value={
                    addressType
                      ? getObjByValue(addressTypeArray, addressType)
                      : null
                  }
                  getOptionLabel={(option) =>
                    option.value ? option.value : null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Address Type"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={addressType}
                      error={isSubmitted && (addressType ? false : true)}
                      helperText={
                        isSubmitted && (addressType ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    if (value) setAddressType(value.value);
                    else setAddressType(null);
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <div
                  style={{
                    bottom: '10px',
                    position: 'absolute'
                  }}>
                  <Checkbox
                    id="outlined-isPrimaryContact"
                    placeholder="Consider this as a Primary Id"
                    variant="outlined"
                    size="small"
                    style={{ padding: '0px' }}
                    checked={isPrimaryID}
                    // onChange={handleChange1}
                    value={isPrimaryID}
                    color="primary"
                    onChange={(event) => {
                      setIsPrimaryID(event.target.checked);
                    }}
                  />
                  &nbsp;
                  <label className=" mb-2">Consider this as a Primary ID</label>
                </div>
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Status *
                </label>
                <TextField
                  id="outlined-status"
                  // required
                  label={status ? '' : 'Select Status'}
                  variant="outlined"
                  error={isSubmitted && (status === '' ? true : false)}
                  helperText={
                    isSubmitted && (status === '' ? 'Field is Mandatory' : '')
                  }
                  fullWidth
                  select
                  size="small"
                  value={status === '' ? '' : status ? true : false}
                  onChange={(event) => {
                    setStatus(event.target.value);
                  }}>
                  {currentStatus.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6}>
                <label className=" mb-2" style={{ marginTop: '15px' }}>
                  Effective Date *
                </label>
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
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Country *
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  select
                  value={
                    countryIndex != null ? countries[countryIndex] || '' : null
                  }
                  options={countries}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Country"
                      variant="outlined"
                      fullWidth
                      size="small"
                      name="country"
                      value={
                        countryIndex != null
                          ? countries[countryIndex] || ''
                          : null
                      }
                      error={isSubmitted && (country ? false : true)}
                      helperText={
                        isSubmitted && (country ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    const index = countries.findIndex(
                      (country) => country.name === value?.name
                    );
                    if (index != -1) {
                      setCountryIndex(index);
                      setCountry(countries[index].name);
                      setAllStates(countries[index].states);
                      setAddState(null);
                      setStateIndex(null);
                    } else {
                      setCountryIndex(null);
                      setCountry(null);
                      setAllStates([]);
                      setAddState(null);
                      setStateIndex(null);
                    }
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  State *
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  select
                  options={allStates}
                  getOptionLabel={(option) => option}
                  value={
                    countryIndex != null
                      ? stateIndex != null
                        ? countries[countryIndex].states[stateIndex] || ''
                        : null
                      : null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select State"
                      variant="outlined"
                      fullWidth
                      size="small"
                      name="addState"
                      value={
                        countryIndex != null
                          ? stateIndex != null
                            ? countries[countryIndex].states[stateIndex] || ''
                            : null
                          : null
                      }
                      error={isSubmitted && (addState ? false : true)}
                      helperText={
                        isSubmitted && (addState ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    const index = allStates.findIndex(
                      (state) => state === value
                    );
                    if (index != -1) {
                      setStateIndex(index);
                      setAddState(countries[countryIndex].states[index]);
                    } else {
                      setStateIndex(null);
                      setAddState(null);
                    }
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  City *
                </label>
                <TextField
                  id="outlined-city"
                  placeholder="Select City"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="city"
                  value={city}
                  error={isSubmitted && (city ? false : true)}
                  helperText={isSubmitted && (city ? '' : 'Field is Mandatory')}
                  onChange={(event) => {
                    setCity(event.target.value);
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Pin Code *
                </label>
                <TextField
                  id="outlined-PIN"
                  placeholder="Select Pin Code"
                  type="text"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={PIN}
                  onChange={(event) => {
                    setPIN(event.target.value);
                  }}
                  helperText={
                    isSubmitted && (!PIN || PIN === '')
                      ? 'Field is required'
                      : ''
                  }
                  error={isSubmitted && (!PIN || PIN === '') ? true : false}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Address Line 1 *
                </label>
                <TextField
                  id="outlined-addressLine1"
                  placeholder="Address Line 1"
                  type="text"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={addressLine1}
                  onChange={(event) => {
                    setAddressLine1(event.target.value);
                  }}
                  helperText={
                    isSubmitted && (!addressLine1 || addressLine1 === '')
                      ? 'Field is required'
                      : ''
                  }
                  error={
                    isSubmitted && (!addressLine1 || addressLine1 === '')
                      ? true
                      : false
                  }
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=" mb-2">
                  Address Line 2 *
                </label>
                <TextField
                  id="outlined-addressLine2"
                  placeholder="Address Line 2"
                  type="text"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={addressLine2}
                  onChange={(event) => {
                    setAddressLine2(event.target.value);
                  }}
                  helperText={
                    isSubmitted && (!addressLine2 || addressLine2 === '')
                      ? 'Field is required'
                      : ''
                  }
                  error={
                    isSubmitted && (!addressLine2 || addressLine2 === '')
                      ? true
                      : false
                  }
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className="mb-2">
                  Address Line 3 *
                </label>
                <TextField
                  id="outlined-addressLine3"
                  placeholder="Address Line 3"
                  type="text"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={addressLine3}
                  onChange={(event) => {
                    setAddressLine3(event.target.value);
                  }}
                  helperText={
                    isSubmitted && (!addressLine3 || addressLine3 === '')
                      ? 'Field is required'
                      : ''
                  }
                  error={
                    isSubmitted && (!addressLine3 || addressLine3 === '')
                      ? true
                      : false
                  }
                />
              </Grid>
              <Grid item md={6}>
                <label className=" mb-2" style={{ marginTop: '15px' }}>
                  Reason for Change *
                </label>
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
                {create ? 'Add New Address' : 'Correct History'}
              </Button>
              {!(
                create ||
                savedEmployeeInfoHistoryDetails[
                  savedEmployeeInfoHistoryDetails.length - 1
                ]?.uuid == selectedEmployeeInfoHistory.uuid
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
              onClick={(e) => deleteModaltoggle}
              className="btn-neutral-secondary btn-pill mx-1">
              <span className="btn-wrapper--label">Cancel</span>
            </Button>
            <Button
              onClick={(e) => deleteAddress(e)}
              className="btn-danger btn-pill mx-1">
              <span className="btn-wrapper--label">Delete</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany,
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeAddressHistory);
