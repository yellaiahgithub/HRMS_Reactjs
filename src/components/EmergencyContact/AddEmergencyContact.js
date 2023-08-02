import {
  Button,
  Card,
  Checkbox,
  Grid,
  TextField,
  Table,
  CardContent,
  Collapse,
  Snackbar,
  Dialog
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';
import SelectEmployee from 'components/SelectEmployee';

const CreateAddEmergencyContact = (props) => {
  const { countriesMasterData } = props;
  const [isSubmitted, setIsSubmitted] = useState();
  const [blocking, setBlocking] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const employeeUUID = queryParams.get('uuid') || null;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Emergency Contact' : 'Save';
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const [IndexToBeSplice, setIndexToBeSplice] = useState()
  const [emergencyContactToBeDeleted, setEmergencyContactToBeDeleted] = useState()
  const [relationship, setRelationship] = useState();
  const [selectRelationship, setSelectRelationship] = useState();
  const [contactName, setContactName] = useState();
  const [isPrimaryID, setIsPrimaryID] = useState(false);
  const [country, setCountry] = useState();
  const [addState, setAddState] = useState();
  const [selectCity, setSelectCity] = useState();
  const [addressSameAsEmployee, setAddressSameAsEmployee] = useState();
  const [addressLine1, setAddressLine1] = useState();
  const [addressLine2, setAddressLine2] = useState();
  const [pinCode, setPinCode] = useState();
  const [isEditNewEmergencyContact, setIsEditNewEmergencyContact] = useState();
  const [emergencyContactId, setEmergencyContactId] = useState();
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  const [employeeDetail, setEmployeeDetail] = useState()

  let tempCountries = [];
  let tempStates = [];
  //For Phone validation
  const validationSchema = yup.object({
    phoneNumber: yup
      .string('Please enter a valid phone number')
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
      // .phoneNumber("US", "Please enter a valid phone number")
      .required("A phone number is required"),
  });
  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // Handle Submit
    },
  });
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const [currentEmergencyContactArray, setCurrentEmergencyContactArray] = useState();

  const reState = () => {
    setContactName('')
    setSelectRelationship('')
    formik.values.phoneNumber = ''
    setAddressLine1('')
    setAddressLine2('')
    setCountry('')
    setAddState('')
    setCountryIndex(null);
    setStateIndex(null);
    setAllStates([]);
    setSelectCity('')
    setPinCode('')
    setIsPrimaryID('')
    setAddressSameAsEmployee(false)
    setIsSubmitted(false)
    setState1({ accordion: [false, false, false] })
    setIsEditNewEmergencyContact(false)
  }
  const handleEditIcon = (idx) => {
    // Set isEditNewEmergencyContact true to display Input Fields
    setIsEditNewEmergencyContact(true)
    // Show Accordion to display Address Input fields
    // setTrue in first accordion
    openAccordion(0)
    // assign values to edit contact in input feilds.
    const newEmergencyContactObj = currentEmergencyContactArray[idx]
    setContactName(newEmergencyContactObj.contactName)
    // find relationship in relationshipListArray to check if exist or not
    // if not exist means user has selected 'other'
    const foundRObj = getObjByValue(relationshipListArray, newEmergencyContactObj.relationship);
    if (!foundRObj) {
      // set 'other' if not found
      setSelectRelationship('other')
    } else {
      setSelectRelationship(newEmergencyContactObj.relationship)
    }
    // in both cases set relationship value in setReleationship
    setContactName(newEmergencyContactObj.contactName)
    setRelationship(newEmergencyContactObj.relationship)
    formik.values.phoneNumber = newEmergencyContactObj.phoneNo
    // setAddress(newEmergencyContactObj.address)
    setAddressLine1(newEmergencyContactObj.addressLine1)
    setAddressLine2(newEmergencyContactObj.addressLine2)
    setCountry(newEmergencyContactObj.country)
    setAddState(newEmergencyContactObj.state)
    setSelectCity(newEmergencyContactObj.city)
    setAddressSameAsEmployee(newEmergencyContactObj.addressSameAsEmployee)
    setPinCode(newEmergencyContactObj.pinCode)
    setIsPrimaryID(newEmergencyContactObj.isPrimary)
    setEmergencyContactId(newEmergencyContactObj.uuid)
    const countryIdx = countries.findIndex(
      (country) => country.name === newEmergencyContactObj.country
    );
    if (countryIdx != -1) {
      setCountryIndex(countryIdx);
      const stateIdx = countries[countryIdx]?.states.findIndex(
        (state) => state === newEmergencyContactObj.state
      );
      tempStates = countries[countryIdx].states;
      setAllStates(tempStates);
      if (stateIdx != -1) {
        setStateIndex(stateIdx);
      }
      else {
        setStateIndex(null);
      }
    }
    else {
      setCountryIndex(null);
      setStateIndex(null);
      setAllStates([]);
    }
  };

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteToggle = () => setDeleteModal(!deleteModal)
  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
  }, [])
  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    let employeeSearchInput = selectedEmployee.uuid
    apicaller('get', `${BASEURL}/emergency-contact/employeeUUID/${employeeSearchInput}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setCurrentEmergencyContactArray(res.data)
          reState()
        }
        else {
          setCurrentEmergencyContactArray([])
          reState()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get emergency contact err', err)
        setCurrentEmergencyContactArray([])
        reState()
      })
  }
  const getFetchAddressByID = (employeeId) => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/address/by/${employeeId}?isPrimary=true`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200 && res.data && res.data.length > 0) {
          setAddressLine1(res.data[0].address1)
          setAddressLine2(res.data[0].address2)
          setCountry(res.data[0].country);
          setAddState(res.data[0].state);
          const countryIdx = countries.findIndex(
            (country) => country.name === res.data[0].country
          );
          if (countryIdx != -1) {
            setCountryIndex(countryIdx);
            const stateIdx = countries[countryIdx]?.states.findIndex(
              (state) => state === res.data[0].state
            );
            tempStates = countries[countryIdx].states;
            setAllStates(tempStates);
            if (stateIdx != -1) {
              setStateIndex(stateIdx);
            }
            else {
              setStateIndex(null);
            }
          }
          else {
            setCountryIndex(null);
            setStateIndex(null);
            setAllStates([]);
          }
          setSelectCity(res.data[0].city)
          setPinCode(res.data[0].PIN)
        }
        else {
          setState({
            open: true,
            message: 'No Primary Address Found for this employee',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
          setAddressSameAsEmployee(false)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get emergency contact err', err)
        setAddressSameAsEmployee(false)
      })
  }
  const save = (e) => {
    e.preventDefault();
    //to do service call
    // phone save in db
    if (state1.accordion[0] && !formik.errors.phoneNumber) {
      setIsSubmitted(true);
      if (formik.values.phoneNumber) {
        const data = {
          contactName: contactName,
          relationship: relationship,
          phoneNo: formik.values.phoneNumber,
          // address:address,
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          country: country,
          state: addState,
          city: selectCity,
          addressSameAsEmployee: addressSameAsEmployee ? true : false,
          pinCode: pinCode,
          isPrimary: isPrimaryID ? true : false,
          employeeUUID: employeeDetail.uuid,
        };
        if (isEditNewEmergencyContact) {
          data.uuid = emergencyContactId
          apicaller('patch', `${BASEURL}/emergency-contact/update`, data)
            .then(res => {
              if (res.status === 200) {
                console.log('res.data', res.data);
                if (res.data && res.data) {
                  getAllData(employeeDetail)
                  // reset input fields to empty because our data is saved
                  reState()
                  setState({
                    open: true,
                    message: 'Details Updated Successfully',
                    toastrStyle: 'toastr-success',
                    vertical: 'top',
                    horizontal: 'right'
                  })
                }
              }
            })
            .catch((err) => {
              setBlocking(false)
              console.log('err', err);
              if (err?.response?.data) {
                setState({
                  open: true,
                  message: err.response.data,
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            })
        } else {
          //call an API to Add New Address
          apicaller('post', `${BASEURL}/emergency-contact`, data)
            .then(res => {
              if (res.status === 200) {
                console.log('res.data', res.data)
                if (res.data) {
                  getAllData(employeeDetail)
                  setState({
                    open: true,
                    message: 'Address Added Successfully',
                    toastrStyle: 'toastr-success',
                    vertical: 'top',
                    horizontal: 'right'
                  })
                }
              }
            })
            .catch(err => {
              setBlocking(false)
              console.log('err', err)
              if (err?.response?.data) {
                setState({
                  open: true,
                  message: err.response.data,
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            })
        }
        setIsSubmitted(true);
      }
    }
    setIsSubmitted(true);
  }
  // Confirmation for delete
  const showConfirmDelete = (i, selected) => {
    setDeleteModal(true)
    setEmergencyContactToBeDeleted(selected)
    setIndexToBeSplice(i)
  }
  //Delete API Call  
  const handleDelete = () => {
    setDeleteModal(false)
    setBlocking(true)
    const data = {
      uuid: emergencyContactToBeDeleted.uuid
    }
    apicaller('delete', `${BASEURL}/emergency-contact/delete`, data)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setState({
            open: true,
            message: 'Deleted Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          const list = [...currentEmergencyContactArray];
          list.splice(IndexToBeSplice, 1);
          setCurrentEmergencyContactArray(list);
        };
      })
      .catch(err => {
        setBlocking(false)
        console.log('err', err)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
  }
  const [state1, setState1] = useState({
    accordion: [false, false, false]
  });
  const toggleAccordion = (tab) => {
    const prevState = state1.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    setState1({
      accordion: state
    });
  };

  const openAccordion = (tab) => {
    const prevState = state1.accordion;
    const state = prevState.map((x, index) => (tab === index ? true : false));
    setState1({
      accordion: state
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    // const phoneObj = companyPhoneNumbers.find(o => o.preferred === true)
  };
  const notify = () => {
    //  toast('Hello Geeks')
  };

  const relationshipListArray = [
    { value: 'Aunt', label: 'Aunt' },
    { value: 'Brother-In-Law', label: 'Brother-In-Law' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Colleague', label: 'Colleague' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Ex-Spouse', label: 'Ex-Spouse' },
    { value: 'Father', label: 'Father' },
    { value: 'Father-In-Law', label: 'Father-In-Law' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Grand Father', label: 'grandFather' },
    { value: 'Grand Mother', label: 'grandMother' },
    { value: 'Grand Daughter', label: 'grandDaughter' },
    { value: 'Grand Son', label: 'grandSon' },
    { value: 'Mother', label: 'mother' },
    { value: 'Mother-In-Law', label: 'mother-in-law' },
    { value: 'Nephew', label: 'nephew' },
    { value: 'Niece', label: 'niece' },
    { value: 'Neighbour', label: 'neighbour' },
    { value: 'Son', label: 'son' },
    { value: 'Son-In-Law', label: 'son-in-Law' },
    { value: 'Sister', label: 'sister' },
    { value: 'Sister-In-Law', label: 'sister-in-Law' },
    { value: 'Spouse', label: 'spouse' },
    { value: 'Step Father', label: 'stepFather' },
    { value: 'Step Mother', label: 'stepMother' },
    { value: 'Step Son', label: 'stepSon' },
    { value: 'Uncle', label: 'uncle' },
    { value: 'Other', label: 'other' }
  ];

  const getObjByValue = (arr, value) => {
    return value ? arr.find((x) => x.value == value) : {};
  };

  return (
    <BlockUi
      tag="div"
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item md={10} lg={10} xl={11} className="mx-auto">
              <div className="bg-white p-4 rounded">
                <div className='text-center my-4'>
                  <h1 className='display-4 mb-1 '>
                    Create Emergency Contact
                  </h1>
                </div>
                <SelectEmployee getAllData={getAllData} employeeUUID={employeeUUID} />
                <br />
                {employeeDetail && (
                  <>
                    <Card
                      style={{
                        padding: '25px',
                        border: '1px solid #c4c4c4'
                      }}>
                      <div className="card-header">
                        <div className="card-header--title">
                          <p class="m-0">
                            <b>Current Emergency contact details</b>
                          </p>
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div
                          className="table-responsive-md"
                          style={{ width: '100%', overflowX: 'auto' }}>
                          <Table className="table table-hover table-striped mb-0">
                            <thead className="thead-light">
                              <tr>
                                <th style={{ width: '20%' }}>Contact Name</th>
                                <th style={{ width: '10%' }}>Relationship</th>
                                <th style={{ width: '20%' }}>Phone Number</th>
                                <th style={{ width: '30%' }}>Address</th>
                                <th style={{ width: '10%' }}>Primary</th>
                                <th style={{ width: '10%' }}></th>
                              </tr>
                            </thead>
                            {currentEmergencyContactArray ? (
                              <tbody>
                                {currentEmergencyContactArray?.map(
                                  (item, idx) => (
                                    <tr>
                                      <td>
                                        <div>{item.contactName}</div>
                                      </td>
                                      <td>
                                        <div>{item.relationship}</div>
                                      </td>
                                      <td>
                                        <div>{item.phoneNo}</div>
                                      </td>
                                      <td>
                                        <div>
                                          {item.addressLine1} {item.addressLine2}{' '}
                                          {item.city} {item.state}{' '}
                                          {item.country} {' '}
                                          {item.pinCode}
                                        </div>
                                      </td>
                                      <td>
                                        <div>
                                          <Checkbox
                                            style={item.isPrimary ? { color: 'blue' } : {}}
                                            color="primary"
                                            className="align-self-start"
                                            name={`preferred${idx}`}
                                            id={`phoneCheckbox${idx}`}
                                            checked={item.isPrimary}
                                            value={item.isPrimary}
                                            disabled={true}
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div>
                                          <Button
                                            onClick={() => handleEditIcon(idx)}
                                            disabled={item?.isPrimary}
                                            className="btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                            <span className="btn-wrapper--icon d-flex">
                                              <FontAwesomeIcon
                                                icon={['fas', 'edit']}
                                                className="font-size-sm"
                                              />
                                            </span>
                                          </Button>
                                          <Button
                                            disabled={item.isPrimary}
                                            onClick={() => {
                                              showConfirmDelete(idx, item)
                                            }}
                                            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                            <span className="btn-wrapper--icon d-flex">
                                              <FontAwesomeIcon
                                                icon={['fas', 'times']}
                                                className="font-size-sm"
                                              />
                                            </span>
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            ) :
                              <tbody>
                                <tr className='text-center'><td colSpan={6}>
                                  <span>No Emergency Contact Details Added</span>
                                </td></tr>
                              </tbody>
                            }
                          </Table>
                        </div>
                        <div className="divider" />
                        <div className="divider" />
                      </CardContent>
                    </Card>
                    <div className="accordion-toggle">
                      <Button
                        style={{ padding: '25px 0' }}
                        className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                        onClick={() => toggleAccordion(0)}
                        aria-expanded={state1.accordion[0]}>
                        <span>{isEditNewEmergencyContact ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}</span>
                        &nbsp;
                        {state1.accordion[0] ? (
                          <FontAwesomeIcon
                            icon={['fas', 'angle-down']}
                            className="font-size-xl accordion-icon"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={['fas', 'angle-right']}
                            className="font-size-xl accordion-icon"
                          />
                        )}
                      </Button>
                    </div>
                    <Collapse in={state1.accordion[0]}>
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className="mb-2">
                            Contact Name *
                          </label>
                          <TextField
                            id="outlined-contactName"
                            placeholder="Contact Name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={contactName}
                            onChange={(event) => {
                              setContactName(event.target.value);
                            }}
                            error={isSubmitted && (contactName ? false : true)}
                            helperText={
                              isSubmitted &&
                              (contactName ? '' : 'Field is Mandatory')
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            Relationship *
                          </label>
                          <Autocomplete
                            id="combo-box-demo"
                            select
                            options={relationshipListArray}
                            value={selectRelationship ? getObjByValue(
                              relationshipListArray,
                              selectRelationship
                            ) : ''}
                            getOptionLabel={(option) => (option.value ? option.value : '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Relationship"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={selectRelationship}
                                error={
                                  isSubmitted &&
                                  (selectRelationship ? false : true)
                                }
                                helperText={
                                  isSubmitted &&
                                  (selectRelationship
                                    ? ''
                                    : 'Field is Mandatory')
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              // set to show in select box
                              setSelectRelationship(value.value);
                              // set in relationship if anything selected other than 'other'
                              if (value.value !== 'other') {
                                setRelationship(value.value)
                              }
                            }}
                          />
                          {selectRelationship == 'other'
                            && (<TextField
                              id="outlined-enterRelationship"
                              placeholder="Enter Relationship"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={relationship}
                              onChange={(event) => {
                                setRelationship(event.target.value);
                              }}
                              error={isSubmitted && (relationship ? false : true)}
                              helperText={
                                isSubmitted &&
                                (relationship ? '' : 'Field is Mandatory')
                              }
                            />)}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            Phone Number
                          </label>
                          <TextField
                            id="outlined-phoneNumber"
                            placeholder="phoneNumber"
                            type="text"
                            variant="outlined"
                            fullWidth
                            required
                            size="small"
                            name='phoneNumber'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phoneNumber}
                            error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <div className='d-flex mt-5 align-items-center'>
                            <Checkbox
                              id="outlined-isPrimaryContact"
                              placeholder="Consider this as a Primary Card"
                              variant="outlined"
                              size="small"
                              style={{ padding: '0px' }}
                              checked={isPrimaryID}
                              value={isPrimaryID}
                              color="primary"
                              onChange={(event) => {
                                setIsPrimaryID(event.target.checked)
                              }
                              }
                            />
                            &nbsp;
                            <label >
                              Consider this as a Primary ID
                            </label>
                          </div>
                        </Grid>
                      </Grid>
                      <br />
                      <div className="divider" />
                      <Grid container spacing={0}>
                        <Grid item xs={10}>
                          <Checkbox
                            id="outlined-addressSameAsEmployee"
                            variant="outlined"
                            style={addressSameAsEmployee ? { color: 'blue' } : {}}
                            size="small"
                            checked={addressSameAsEmployee ? true : false}
                            value={addressSameAsEmployee ? true : false}
                            // disabled={true}
                            onChange={(event) => {
                              setAddressSameAsEmployee(event.target.checked);
                              if (event.target.checked) {
                                // Todo: Data from Employee Address API
                                getFetchAddressByID(employeeDetail.uuid)
                                // setAddressSameAsEmployee(employeeDetail.addressSameAsEmployee)
                                setAddressLine1(employeeDetail.addressLine1)
                                setAddressLine2(employeeDetail.addressLine2)
                                const countryIdx = countries.findIndex(
                                  (country) => country.name === employeeDetail.country
                                );
                                if (countryIdx != -1) {
                                  setCountryIndex(countryIdx);
                                  const stateIdx = countries[countryIdx]?.states.findIndex(
                                    (state) => state === employeeDetail.state
                                  );
                                  tempStates = countries[countryIdx].states;
                                  setAllStates(tempStates);
                                  if (stateIdx != -1) {
                                    setStateIndex(stateIdx);
                                  }
                                  else {
                                    setStateIndex(null);
                                  }
                                }
                                else {
                                  setCountryIndex(null);
                                  setStateIndex(null);
                                  setAllStates([]);
                                }
                                setSelectCity(employeeDetail.city)
                                setPinCode(employeeDetail.pinCode)
                              }
                              else {
                                setAddressLine1('')
                                setAddressLine2('')
                                setCountryIndex(null);
                                setCountry(null);
                                setAllStates([]);
                                setAddState(null);
                                setStateIndex(null);
                                setSelectCity('')
                                setPinCode('')
                              }
                            }}
                          />
                          &nbsp;
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            Address Same as Employees
                          </label>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className="mb-2">
                            Address Line 1
                          </label>
                          <TextField
                            id="outlined-addressLine1"
                            placeholder="Address Line 1"
                            type="text"
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled={addressSameAsEmployee ? true : false}
                            value={addressLine1}
                            onChange={(event) => {
                              setAddressLine1(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className="mb-2">
                            Address Line 2
                          </label>
                          <TextField
                            id="outlined-addressLine2"
                            placeholder="Address Line 2"
                            type="text"
                            variant="outlined"
                            fullWidth
                            disabled={addressSameAsEmployee ? true : false}
                            size="small"
                            value={addressLine2}
                            onChange={(event) => {
                              setAddressLine2(event.target.value);
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            Country *
                          </label>
                          <Autocomplete
                            id="combo-box-demo"
                            select
                            disabled={addressSameAsEmployee ? true : false}
                            value={
                              countryIndex != null
                                ? countries[countryIndex] || ''
                                : null
                            }
                            options={countries}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="select Country"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="country"
                                error={
                                  isSubmitted && (country ? false : true)
                                }
                                helperText={
                                  isSubmitted &&
                                  (country ? '' : 'Field is Mandatory')
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
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            State *
                          </label>
                          <Autocomplete
                            id="combo-box-demo"
                            select
                            disabled={addressSameAsEmployee ? true : false}
                            options={allStates}
                            getOptionLabel={(option) => option}
                            value={
                              countryIndex != null
                                ? stateIndex != null
                                  ? countries[countryIndex].states[
                                  stateIndex
                                  ] || ''
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
                                error={
                                  isSubmitted && (addState ? false : true)
                                }
                                helperText={
                                  isSubmitted &&
                                  (addState ? '' : 'Field is Mandatory')
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              const index = allStates.findIndex(
                                (state) => state === value
                              );
                              if (index != -1) {
                                setStateIndex(index);
                                setAddState(
                                  countries[countryIndex].states[index]
                                );
                              } else {
                                setStateIndex(null);
                                setAddState(null);
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            City *
                          </label>
                          <TextField
                            id="outlined-city"
                            placeholder='Select City'
                            variant="outlined"
                            fullWidth
                            disabled={addressSameAsEmployee ? true : false}
                            size="small"
                            name="selectCity"
                            value={selectCity}
                            error={
                              isSubmitted && (selectCity ? false : true)
                            }
                            helperText={
                              isSubmitted &&
                              (selectCity ? '' : 'Field is Mandatory')
                            }
                            onChange={(event) => {
                              setSelectCity(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            Pin Code
                          </label>
                          <TextField
                            id="outlined-pinCode"
                            placeholder="Pin Code"
                            type="text"
                            variant="outlined"
                            disabled={addressSameAsEmployee ? true : false}
                            fullWidth
                            size="small"
                            value={pinCode}
                            onChange={(event) => {
                              setPinCode(event.target.value);
                            }}
                          />
                        </Grid>
                      </Grid>
                      <div className="divider" />
                      <div className="divider" />
                      <div
                        className="float-right"
                        style={{ marginRight: '2.5%' }}>
                        <Button
                          className="btn-primary mb-2 m-2"
                          onClick={() => {
                            toggleAccordion(0)
                            setIsEditNewEmergencyContact(false)
                            setAddressSameAsEmployee(false)
                            formik.values.phoneNumber = ''
                            setContactName('')
                            setSelectRelationship('')
                            setAddressLine1('')
                            setAddressLine2('')
                            setCountry('')
                            setAddState('')
                            setSelectCity('')
                            setPinCode('')
                            setIsPrimaryID('')
                          }}>
                          Cancel
                        </Button>
                        <Button
                          className="btn-primary mb-2 m-2"
                          type="submit"
                          // disabled={employeeData ? false : true}
                          onClick={(e) => save(e)}>
                          {saveButtonLabel}
                        </Button>
                      </div>
                    </Collapse>
                  </>
                )}
              </div>
              <Dialog
                open={deleteModal}
                onClose={deleteToggle}
                classes={{ paper: 'shadow-lg rounded' }}>
                <div className='text-center p-5'>
                  <div className='avatar-icon-wrapper rounded-circle m-0'>
                    <div className='d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130'>
                      <FontAwesomeIcon
                        icon={['fas', 'times']}
                        className='d-flex align-self-center display-3'
                      />
                    </div>
                  </div>
                  <h4 className=' mt-4'>
                    Are you sure you want to delete this entry?
                  </h4>
                  <p className='mb-0 font-size-lg text-muted'>
                    You cannot undo this operation.
                  </p>
                  <div className='pt-4'>
                    <Button
                      onClick={deleteToggle}
                      className='btn-neutral-secondary btn-pill mx-1'>
                      <span className='btn-wrapper--label'>Cancel</span>
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className='btn-danger btn-pill mx-1'>
                      <span className='btn-wrapper--label'>Delete</span>
                    </Button>
                  </div>
                </div>
              </Dialog>
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
                autoHideDuration={2000}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </BlockUi>
  );
};

const mapStateToProps = (state) => ({
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreateAddEmergencyContact);