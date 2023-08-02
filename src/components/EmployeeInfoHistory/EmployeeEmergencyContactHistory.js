import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  Snackbar,
  TextField,
  MenuItem,
  Checkbox
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Alert } from '@material-ui/lab'
import React from 'react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import CheckIcon from '@material-ui/icons/Check'
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'
import { NavLink } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

//For Phone validation
const validationSchema = yup.object({
  phoneNumber: yup
    .string('Please enter a valid phone number')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits')
    // .phoneNumber("US", "Please enter a valid phone number")
    .required('A phone number is required')
})

const EmployeeEmergencyContactHistory = props => {
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
  } = props

  const [blocking, setBlocking] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const deleteModaltoggle = () => setDeleteModal(!deleteModal)
  const [relationship, setRelationship] = useState('')
  const [selectRelationship, setSelectRelationship] = useState()
  const [contactName, setContactName] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [isSubmitted, setIsSubmitted] = useState()
  const [isPrimaryID, setIsPrimaryID] = useState(false)
  const [editEmergencyContact, setEditEmergencyContact] = useState()
  const [country, setCountry] = useState()
  const [addState, setAddState] = useState()
  const [selectCity, setSelectCity] = useState()
  const [addressSameAsEmployee, setAddressSameAsEmployee] = useState()
  const [addressLine1, setAddressLine1] = useState()
  const [addressLine2, setAddressLine2] = useState()
  const [pinCode, setPinCode] = useState()
  const [isEditNewEmergencyContact, setIsEditNewEmergencyContact] = useState()
  const [emergencyContactId, setEmergencyContactId] = useState()
  const [countries, setCountries] = useState([])
  const [countryIndex, setCountryIndex] = useState()
  const [allStates, setAllStates] = useState([])
  const [stateIndex, setStateIndex] = useState()
  let tempCountries = []
  let tempStates = []
  const [effectiveDate, setEffectiveDate] = useState(new Date())


  const relationshipListArray = [
    { value: 'aunt', label: 'aunt' },
    { value: 'brother-in-Law', label: 'brother-in-Law' },
    { value: 'Brother', label: 'brother' },
    { value: 'colleague', label: 'colleague' },
    { value: 'daughter', label: 'daughter' },
    { value: 'ex-Spouse', label: 'ex-Spouse' },
    { value: 'father', label: 'father' },
    { value: 'father-in-Law', label: 'father-in-Law' },
    { value: 'friend', label: 'friend' },
    { value: 'grandFather', label: 'grandFather' },
    { value: 'grandMother', label: 'grandMother' },
    { value: 'grandDaughter', label: 'grandDaughter' },
    { value: 'grandSon', label: 'grandSon' },
    { value: 'mother', label: 'mother' },
    { value: 'mother-in-Law', label: 'mother-in-law' },
    { value: 'nephew', label: 'nephew' },
    { value: 'niece', label: 'niece' },
    { value: 'neighbour', label: 'neighbour' },
    { value: 'son', label: 'son' },
    { value: 'son-in-Law', label: 'son-in-Law' },
    { value: 'sister', label: 'sister' },
    { value: 'sister-in-Law', label: 'sister-in-Law' },
    { value: 'spouse', label: 'spouse' },
    { value: 'stepFather', label: 'stepFather' },
    { value: 'stepMother', label: 'stepMother' },
    { value: 'stepSon', label: 'stepSon' },
    { value: 'uncle', label: 'uncle' },
    { value: 'other', label: 'other' }
  ]

  const getObjByValue = (arr, value) => {
    return value ? arr.find(x => x.value.toLowerCase() == value.toLowerCase()) : {}
  }

  useEffect(() => {
    tempCountries = countriesMasterData
    setCountries(tempCountries)

    if (create != null && !create) {
      setContactName(selectedEmployeeInfoHistory.historyObject.contactName)
      setSelectRelationship(
        selectedEmployeeInfoHistory.historyObject.relationship
      )

      const foundTypeObj = getObjByValue(
        relationshipListArray,
        selectedEmployeeInfoHistory.historyObject.relationship
      )
      setRelationship(foundTypeObj?.value)

      formik.values.phoneNumber =
        selectedEmployeeInfoHistory.historyObject.phoneNo

      setIsPrimaryID(selectedEmployeeInfoHistory.historyObject.isPrimary)

      setAddressLine1(selectedEmployeeInfoHistory.historyObject.addressLine1)
      setAddressLine2(selectedEmployeeInfoHistory.historyObject.addressLine2)

      setAddState(selectedEmployeeInfoHistory.historyObject.state)
      const countryIdx = countriesMasterData.findIndex(
        country =>
          country.name === selectedEmployeeInfoHistory.historyObject.country
      )

      if (countryIdx != -1) {
        setCountryIndex(countryIdx)
        setCountry(countriesMasterData[countryIdx].name)

        const stateIdx = countriesMasterData[countryIdx]?.states.findIndex(
          state => state === selectedEmployeeInfoHistory.historyObject.state
        )
        tempStates = countriesMasterData[countryIdx].states
        setAllStates(tempStates)
        if (stateIdx != -1) {
          setStateIndex(stateIdx)
        } else {
          setStateIndex(null)
        }
      } else {
        setCountryIndex(null)
        setStateIndex(null)
        setAllStates([])
      }
      setSelectCity(selectedEmployeeInfoHistory.historyObject.city)
      setPinCode(selectedEmployeeInfoHistory.historyObject.pinCode)
      setAddressSameAsEmployee(
        selectedEmployeeInfoHistory.historyObject.addressSameAsEmployee
      )
    }
  }, [])

  useEffect(() => { }, [])

  const formik = useFormik({
    initialValues: {
      phoneNumber: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // Handle Submit
    }
  })

  const save = () => {
    setIsSubmitted(true)
    console.log(save)
    const detailHistoryObj = {
      employeeUUID: employeeUUID,
      type: 'EmployeeEmergencyContact',
      historyObject: {
        contactName: contactName,
        relationship: relationship,
        phoneNo: formik.values.phoneNumber,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        country: country,
        state: addState,
        city: selectCity,
        addressSameAsEmployee: addressSameAsEmployee ? true : false,
        pinCode: pinCode,
        isPrimary: isPrimaryID ? true : false
      },
      effectiveDate: effectiveDate
    }
    let isValid = true
    let errors = []
    if (isValid) {
      if (
        contactName &&
        contactName !== '' &&
        relationship &&
        relationship !== '' &&
        formik.values.phoneNumber &&
        formik.values.phoneNumber !== '' &&
        addressLine1 &&
        addressLine1 !== '' &&
        addressLine2 &&
        addressLine2 !== null &&
        country &&
        country !== '' &&
        selectCity &&
        selectCity !== '' &&
        pinCode &&
        pinCode !== ''
      ) {
        if (create) {
          setState({
            open: true,
            message: 'Added Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        } else {
          if (
            contactName ==
            selectedEmployeeInfoHistory.historyObject.contactName &&
            relationship ==
            selectedEmployeeInfoHistory.historyObject.relationship &&
            formik.values.phoneNumber ==
            selectedEmployeeInfoHistory.historyObject.phoneNumber &&
            addressLine1 ==
            selectedEmployeeInfoHistory.historyObject.addressLine1 &&
            addressLine2 ==
            selectedEmployeeInfoHistory.historyObject.addressLine2 &&
            country == selectedEmployeeInfoHistory.historyObject.country &&
            selectCity ==
            selectedEmployeeInfoHistory.historyObject.selectCity &&
            addressSameAsEmployee ==
            selectedEmployeeInfoHistory.historyObject.addressSameAsEmployee &&
            pinCode == selectedEmployeeInfoHistory.historyObject.pinCode &&
            isPrimaryID == selectedEmployeeInfoHistory.historyObject.isPrimaryID
          ) {
            isValid = false
            errors.push(
              'There are no changes to update kindly change the fields before saving'
            )
          }
        }
        if (isValid) {
          saveHistoryObject(detailHistoryObj)
        } else {
          setState({
            open: true,
            message: 'Mandatory fields are Required',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      }
    } else {
      isValid = false
      setState({
        open1: true,
        message: 'Mandatory fields are Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }

  const getFetchAddressByID = employeeId => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/address/by/${employeeId}?isPrimary=true`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200 && res.data && res.data.length > 0) {
          setAddressLine1(res.data[0].address1)
          setAddressLine2(res.data[0].address2)
          setCountry(res.data[0].country)
          setAddState(res.data[0].state)
          const countryIdx = countries.findIndex(
            country => country.name === res.data[0].country
          )
          if (countryIdx != -1) {
            setCountryIndex(countryIdx)
            const stateIdx = countries[countryIdx]?.states.findIndex(
              state => state === res.data[0].state
            )
            tempStates = countries[countryIdx].states
            setAllStates(tempStates)
            if (stateIdx != -1) {
              setStateIndex(stateIdx)
            } else {
              setStateIndex(null)
            }
          } else {
            setCountryIndex(null)
            setStateIndex(null)
            setAllStates([])
          }
          setSelectCity(res.data[0].city)
          setPinCode(res.data[0].PIN)
        } else {
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
      })
  }

  const saveHistoryObject = detailHistoryObj => {
    const emergencyContactHistoryObj = {
      employeeUUID: employeeUUID,
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
      effectiveDate: effectiveDate,
  };
    if (create) {
      apicaller('post', `${BASEURL}/emergency-contact`, emergencyContactHistoryObj)
        .then(res => {
          if (res.status === 200) {
            const detailHistoryObj = {
              uuid:res.data.historyUUID,
              employeeUUID: employeeUUID,
              documentUUID: res.data.uuid,
              effectiveDate: effectiveDate,
              historyObject: {
                contactName: contactName,
                relationship: relationship,
                phoneNo: formik.values.phoneNumber,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                country: country,
                state: addState,
                city: selectCity,
                addressSameAsEmployee: addressSameAsEmployee ? true : false,
                pinCode: pinCode,
                isPrimary: isPrimaryID ? true : false
              },
            }        
            setEmployeeInfoHistoryDetails([
              null,
              detailHistoryObj,
              ...savedEmployeeInfoHistoryDetails
            ])
            setSavedEmployeeInfoHistoryDetails([
              detailHistoryObj,
              ...savedEmployeeInfoHistoryDetails
            ])
            setSelectedEmployeeInfoHistory(detailHistoryObj)
            setState({
              open: true,
              message: 'Emergency Contact Created Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
            if(isPrimaryID){
              savedEmployeeInfoHistoryDetails.forEach(
              (historyDetail) =>{
                historyDetail.historyObject.isPrimary = historyDetail == selectedEmployeeInfoHistory
              });
            }
          }
        })
        .catch(err => {
          console.log('getEmployeeInfoHistory err', err)
          setState({
            open: true,
            message: 'Error occured while creating Emergency Contact',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        })
    } else {
      emergencyContactHistoryObj.uuid = selectedEmployeeInfoHistory.documentUUID;
      emergencyContactHistoryObj.historyUUID=selectedEmployeeInfoHistory.uuid
      apicaller(
        'patch',
        `${BASEURL}/emergency-contact/update`,
        emergencyContactHistoryObj
      )
        .then(res => {
          if (res.status === 200) {
            const selectedHistory = { ...selectedEmployeeInfoHistory }
            selectedHistory.historyObject.contactName = contactName
            selectedHistory.historyObject.relationship = relationship
            selectedHistory.historyObject.phoneNo = formik.values.phoneNumber
            selectedHistory.historyObject.addressLine1 = addressLine1
            selectedHistory.historyObject.addressLine2 = addressLine2
            selectedHistory.historyObject.country = country
            selectedHistory.historyObject.state = addState
            selectedHistory.historyObject.city = selectCity
            selectedHistory.historyObject.addressSameAsEmployee =
              addressSameAsEmployee
            selectedHistory.historyObject.pinCode = pinCode
            selectedHistory.historyObject.isPrimary = isPrimaryID

            const selectedHistoryIndex =
              savedEmployeeInfoHistoryDetails.findIndex(
                historyDetail =>
                  historyDetail.uuid == selectedEmployeeInfoHistory.uuid
              )
              if(isPrimaryID){
                savedEmployeeInfoHistoryDetails.forEach(
                (historyDetail) =>{
                  historyDetail.historyObject.isPrimary = historyDetail == selectedEmployeeInfoHistory
                });
              }

            setEmployeeInfoHistoryDetails([
              null,
              ...savedEmployeeInfoHistoryDetails.slice(0, selectedHistoryIndex),
              selectedHistory,
              ...savedEmployeeInfoHistoryDetails.slice(
                selectedHistoryIndex + 1,
                savedEmployeeInfoHistoryDetails.length
              )
            ])
            setSavedEmployeeInfoHistoryDetails([
              ...savedEmployeeInfoHistoryDetails.slice(0, selectedHistoryIndex),
              selectedHistory,
              ...savedEmployeeInfoHistoryDetails.slice(
                selectedHistoryIndex + 1,
                savedEmployeeInfoHistoryDetails.length
              )
            ])
            setSelectedEmployeeInfoHistory(selectedHistory)
            setState({
              open: true,
              message: 'Emergency Contact Corrected Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })

          }
        })
        .catch(err => {
          console.log('getEmployeeInfoHistory err', err)
          setState({
            open: true,
            message: 'Error occured while Correcting Emergency Contact',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        })
    }
  }
  const deleteName = () => {
    setDeleteModal(false)
    apicaller(
      'delete',
      `${BASEURL}/employeeInfoHistory/delete/` +
      selectedEmployeeInfoHistory.uuid
    )
      .then(res => {
        if (res.status === 200) {
          const filteredHistory = savedEmployeeInfoHistoryDetails.filter(
            historyDetail =>
              historyDetail.uuid != selectedEmployeeInfoHistory.uuid
          )
          setEmployeeInfoHistoryDetails([null, ...filteredHistory])
          setSavedEmployeeInfoHistoryDetails(filteredHistory)
          setSelectedEmployeeInfoHistory(null)
          setState({
            open: true,
            message: 'Emergency Contact History Deleted Sucessfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        console.log('getEmployeeInfoHistory err', err)
        setState({
          open: true,
          message: err.response.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  }
  return (
    <Grid item lg={12}>
      <div>
        <div>
          <div>
            <h4
              style={{
                color: 'blue'
              }}>
              Change Emergency Contact
            </h4>
            <br />

            <Grid container spacing={6}>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className='mb-2'>
                  Contact Name *
                </label>
                <TextField
                  id='outlined-contactName'
                  placeholder='Contact Name'
                  type='text'
                  variant='outlined'
                  fullWidth
                  size='small'
                  value={contactName}
                  onChange={event => {
                    setContactName(event.target.value)
                  }}
                  error={isSubmitted && (contactName ? false : true)}
                  helperText={
                    isSubmitted && (contactName ? '' : 'Field is Mandatory')
                  }
                />
              </Grid>

              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  Relationship *
                </label>
                <Autocomplete
                  id='combo-box-demo'
                  select
                  options={relationshipListArray}
                  value={
                    selectRelationship
                      ? getObjByValue(relationshipListArray, selectRelationship)
                      : ''
                  }
                  getOptionLabel={option => (option.value ? option.value : '')}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select Relationship'
                      variant='outlined'
                      fullWidth
                      size='small'
                      value={selectRelationship}
                      error={isSubmitted && (selectRelationship ? false : true)}
                      helperText={
                        isSubmitted &&
                        (selectRelationship ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    // set to show in select box
                    setSelectRelationship(value.value)
                    // set in relationship if anything selected other than 'other'
                    if (value.value !== 'other') {
                      setRelationship(value.value)
                    }
                  }}
                />
                {selectRelationship == 'other' && (
                  <TextField
                    id='outlined-enterRelationship'
                    placeholder='Enter Relationship'
                    type='text'
                    variant='outlined'
                    fullWidth
                    size='small'
                    value={relationship}
                    onChange={event => {
                      setRelationship(event.target.value)
                    }}
                    error={isSubmitted && (relationship ? false : true)}
                    helperText={
                      isSubmitted && (relationship ? '' : 'Field is Mandatory')
                    }
                  />
                )}
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  Phone Number *
                </label>
                <TextField
                  id='outlined-phoneNumber'
                  placeholder='phoneNumber'
                  type='text'
                  variant='outlined'
                  fullWidth
                  required
                  size='small'
                  name='phoneNumber'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                  error={
                    (isSubmitted && formik.values.phoneNumber == '') ||
                    (formik.touched.phoneNumber && formik.errors.phoneNumber)
                  }
                  helperText={
                    (isSubmitted && formik.values.phoneNumber == '' 
                      ? 'Field is Mandatory'
                      : '') ||
                    (formik.touched.phoneNumber && formik.errors.phoneNumber)
                  }
                  InputLabelProps={{
                    shrink: true
                  }}
                // value={phoneNumber}
                // onChange={(event) => {
                //   setPhoneNumber(event.target.value);
                // }}
                // error={isSubmitted && (phoneNumber ? false : true)}
                // helperText={
                //   isSubmitted &&
                //   (phoneNumber ? '' : 'Field is Mandatory')
                // }
                />
              </Grid>

              <Grid item md={6}>
                <div
                  style={{
                    bottom: '20px',
                    position: 'absolute'
                  }}>
                  <Checkbox
                    id='outlined-isPrimaryContact'
                    placeholder='Consider this as a Primary Card'
                    variant='outlined'
                    size='small'
                    style={{ padding: '0px' }}
                    checked={isPrimaryID}
                    value={isPrimaryID}
                    color='primary'
                    onChange={event => {
                      setIsPrimaryID(event.target.checked)
                    }}
                  />
                  &nbsp;
                  <label className=' mb-2'>Consider this as a Primary</label>
                </div>
              </Grid>
            </Grid>
            <br />
            <br></br>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <Checkbox
                  id='outlined-addressSameAsEmployee'
                  variant='outlined'
                  style={addressSameAsEmployee ? { color: 'blue' } : {}}
                  // style={{ background: 'lightgrey' }}
                  size='small'
                  checked={addressSameAsEmployee ? true : false}
                  value={addressSameAsEmployee ? true : false}
                  // disabled={true}
                  onChange={event => {
                    setAddressSameAsEmployee(event.target.checked)
                    if (event.target.checked) {
                      // Todo: Data from Employee Address API
                      getFetchAddressByID(employeeUUID)
                      // setAddressSameAsEmployee(addressSameAsEmployee)
                      setAddressLine1(addressLine1)
                      setAddressLine2(addressLine2)
                      const countryIdx = countries.findIndex(
                        country => country.name === country
                      )
                      if (countryIdx != -1) {
                        setCountryIndex(countryIdx)
                        const stateIdx = countries[
                          countryIdx
                        ]?.states.findIndex(state => state === state)
                        tempStates = countries[countryIdx].states
                        setAllStates(tempStates)
                        if (stateIdx != -1) {
                          setStateIndex(stateIdx)
                        } else {
                          setStateIndex(null)
                        }
                      } else {
                        setCountryIndex(null)
                        setStateIndex(null)
                        setAllStates([])
                      }
                      setSelectCity(selectCity)
                      setPinCode(pinCode)
                    } else {
                      setAddressLine1('')
                      setAddressLine2('')
                      setCountryIndex(null)
                      setCountry(null)
                      setAllStates([])
                      setAddState(null)
                      setStateIndex(null)
                      setSelectCity('')
                      setPinCode('')
                    }
                  }}
                />
                &nbsp;
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  Address Same as Employees
                </label>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item md={6}>
                <label style={{ marginTop: '10px' }} className='mb-2'>
                  Address Line 1 *
                </label>
                <TextField
                  id='outlined-addressLine1'
                  placeholder='Address Line 1'
                  type='text'
                  variant='outlined'
                  fullWidth
                  size='small'
                  disabled={addressSameAsEmployee ? true : false}
                  value={addressLine1}
                  onChange={event => {
                    setAddressLine1(event.target.value)
                  }}
                  error={isSubmitted && (addressLine1 ? false : true)}
                  helperText={
                    isSubmitted && (addressLine1 ? '' : 'Field is Mandatory')
                  }
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className='mb-2'>
                  Address Line 2 *
                </label>
                <TextField
                  id='outlined-addressLine2'
                  placeholder='Address Line 2'
                  type='text'
                  variant='outlined'
                  fullWidth
                  disabled={addressSameAsEmployee ? true : false}
                  size='small'
                  value={addressLine2}
                  onChange={event => {
                    setAddressLine2(event.target.value)
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  Country *
                </label>
                <Autocomplete
                  id='combo-box-demo'
                  select
                  disabled={addressSameAsEmployee ? true : false}
                  value={
                    countryIndex != null ? countries[countryIndex] || '' : null
                  }
                  options={countries}
                  getOptionLabel={option => option.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='select Country'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='country'
                      error={isSubmitted && (country ? false : true)}
                      helperText={
                        isSubmitted && (country ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    const index = countries.findIndex(
                      country => country.name === value?.name
                    )
                    if (index != -1) {
                      setCountryIndex(index)
                      setCountry(countries[index].name)
                      setAllStates(countries[index].states)
                      setAddState(null)
                      setStateIndex(null)
                    } else {
                      setCountryIndex(null)
                      setCountry(null)
                      setAllStates([])
                      setAddState(null)
                      setStateIndex(null)
                    }
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  State *
                </label>
                <Autocomplete
                  id='combo-box-demo'
                  select
                  disabled={addressSameAsEmployee ? true : false}
                  options={allStates}
                  getOptionLabel={option => option}
                  value={
                    countryIndex != null
                      ? stateIndex != null
                        ? countries[countryIndex].states[stateIndex] || ''
                        : null
                      : null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select State'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='addState'
                      error={isSubmitted && (addState ? false : true)}
                      helperText={
                        isSubmitted && (addState ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    const index = allStates.findIndex(state => state === value)
                    if (index != -1) {
                      setStateIndex(index)
                      setAddState(countries[countryIndex].states[index])
                    } else {
                      setStateIndex(null)
                      setAddState(null)
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  City *
                </label>
                <TextField
                  // {...params}
                  id='outlined-city'
                  placeholder='Select City'
                  variant='outlined'
                  fullWidth
                  disabled={addressSameAsEmployee ? true : false}
                  size='small'
                  name='selectCity'
                  value={selectCity}
                  error={isSubmitted && (selectCity ? false : true)}
                  helperText={
                    isSubmitted && (selectCity ? '' : 'Field is Mandatory')
                  }
                  onChange={event => {
                    if (event.target && event.target.value) {
                      setSelectCity(event.target.value)
                    }
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <label style={{ marginTop: '15px' }} className=' mb-2'>
                  Pin Code
                </label>
                <TextField
                  id='outlined-pinCode'
                  placeholder='Pin Code'
                  type='text'
                  variant='outlined'
                  disabled={addressSameAsEmployee ? true : false}
                  fullWidth
                  size='small'
                  value={pinCode}
                  onChange={event => {
                    setPinCode(event.target.value)
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <br />
            <div className='float-left'>
              <Button className='btn-primary mb-2 m-2' onClick={e => save(e)}>
                {create ? 'Add New Emergency Contact' : 'Correct History'}
              </Button>
              {!(
                create ||
                savedEmployeeInfoHistoryDetails[
                  savedEmployeeInfoHistoryDetails.length - 1
                ].uuid == selectedEmployeeInfoHistory.uuid
              ) && (
                  <Button
                    className='btn-primary mb-2 m-2'
                    onClick={e => setDeleteModal(true)}>
                    Delete History
                  </Button>
                )}
              <Button
                className='btn-primary mb-2 mr-3 m-2'
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
        <div className='text-center p-5'>
          <div className='avatar-icon-wrapper rounded-circle m-0'>
            <div className='d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130'>
              <FontAwesomeIcon
                icon={['fas', 'times']}
                className='d-flex align-self-center display-3'
              />
            </div>
          </div>
          <h4 className='font-weight-bold mt-4'>
            Are you sure you want to delete this History?
          </h4>
          <p className='mb-0 font-size-lg text-muted'>
            You cannot undo this operation.
          </p>
          <div className='pt-4'>
            <Button
              onClick={e => deleteModaltoggle}
              className='btn-neutral-secondary btn-pill mx-1'>
              <span className='btn-wrapper--label'>Cancel</span>
            </Button>
            <Button
              onClick={e => deleteName(e)}
              className='btn-danger btn-pill mx-1'>
              <span className='btn-wrapper--label'>Delete</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </Grid>
  )
}
const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany,
  countriesMasterData: state.Auth.countriesMasterData
})

const mapDispatchToProps = dispatch => ({})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeEmergencyContactHistory)
