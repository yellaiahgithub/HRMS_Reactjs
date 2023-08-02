import {
  Button,
  Card,
  Checkbox,
  Grid,
  MenuItem,
  Table,
  CardContent,
  TextField,
  Snackbar,
  Collapse,
  Dialog,
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import apicaller from 'helper/Apicaller'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { connect } from 'react-redux'
import SelectEmployee from 'components/SelectEmployee'
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';

const CreateDependants = (props) => {
  const { countriesMasterData } = props;
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employeeUUID = queryParams.get('uuid') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = employeeUUID ? true : false;
  const saveButtonLabel = edit ? ' Update ' : 'Save';
  const toggleAccordion = tab => {
    const prevState = state1.accordion
    const state = prevState.map((x, index) => (tab === index ? !x : false))
    setCountryIndex(null);
    setCountry(null);
    setAddState(null);
    setStateIndex(null);
    setAllStates([]);
    setState1({
      accordion: state
    })
  }
  const [state1, setState1] = useState({
    accordion: [false, false, false]
  })

  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
  }, [])

  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    let employeeUUID = selectedEmployee?.uuid
    apicaller(
      'get',
      `${BASEURL}/employeeDependantOrBeneficiary/fetchByEmployeeUUID/${employeeUUID} `
    )
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setDependantOrBeneficiaryRows(res.data)
        }
        else {
          setDependantOrBeneficiaryRows([])
          resetState()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getEmployees err', err)
        setDependantOrBeneficiaryRows([])
        resetState()
      })
    getEmployeesCurrentDetails(selectedEmployee)
  }

  const [employeeAddress, setEmployeeAddress] = useState()
  const getEmployeesCurrentDetails = selectedEmployee => {
    setBlocking(true)
    let employeeSearchInput = selectedEmployee.uuid
    apicaller('get', `${BASEURL}/address/by/${employeeSearchInput}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setBlocking(false)
          console.log(res.data)

          const primaryObject = res.data.find(obj => obj.isPrimary === true)
          setEmployeeAddress(primaryObject)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get employee err', err)
      })
  }

  const [employeeDetail, setEmployeeDetail] = useState()
  const [blocking, setBlocking] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState()
  const [newType, setNewType] = useState()
  const [beneficiaryType, setBeneficiaryType] = useState()
  const [beneficiaryName, setBeneficiaryName] = useState()
  const [relationship, setRelationship] = useState(null)
  const [firstName, setFirstName] = useState()
  const [middleName, setMiddleName] = useState()
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [DOB, setDOB] = useState(null)
  const [age, setAge] = useState(null)
  const [relationError, setRelationError] = useState(false)

  const [addressSameAsEmployees, setAddressSameAsEmployees] = useState(false)
  const [country, setCountry] = useState()
  const [addState, setAddState] = useState()
  const [selectCity, setSelectCity] = useState()
  const [addressLine1, setAddressLine1] = useState()
  const [addressLine2, setAddressLine2] = useState()
  const [pinCode, setPinCode] = useState()
  const [dependantOrBeneficiaryRows, setDependantOrBeneficiaryRows] = useState([])
  const [isStudent, setIsStudent] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [addedAddress, setEditAddress] = useState()
  const [updatedRowIndex, setUpdatedRowIndex] = useState()
  const [isUpdatedSubmitted, setUpdatedSubmitted] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [IndexToBeSplice, setIndexToBeSplice] = useState()
  const [dataToDelete, setDataToDelete] = useState()
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  const [hasNextSequence, setHasNextSequence] = useState(false);
  const [isEditDependantOrBeneficiary, setIsEditDependantOrBeneficiary] = useState(false);
  const [disability, setDisability] = useState()
  let tempCountries = [];
  let tempStates = [];
  const [deleteModal, setDeleteModal] = useState(false)
  const deleteToggle = () => setDeleteModal(!deleteModal)
  const types = [{ value: 'Beneficiary' }, { value: 'Dependant' }]

  const beneficiaryTypes = [
    { value: 'Charity' },
    { value: 'Estate' },
    { value: 'Organization' },
    { value: 'Person' },
    { value: 'Temple' },
    { value: 'Trust' },
    { value: 'Other' }
  ]

  const relationshipListArray = [
    { value: 'Brother' },
    { value: 'Daughter' },
    { value: 'Father' },
    { value: 'Father-In-Law' },
    { value: 'Mother' },
    { value: 'Mother-In-Law' },
    { value: 'Sister' },
    { value: 'Son' },
    { value: 'Spouse' }
  ]

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

  const maritalStatusList = [
    {
      value: 'Married',
      label: 'Married'
    },
    {
      value: 'Divorced',
      label: 'Divorced'
    },
    {
      value: 'Single',
      label: 'Single'
    },
    {
      value: 'Widowed',
      label: 'Widowed'
    },
    {
      value: 'Unknown',
      label: 'Unknown'
    }
  ]

  const disabilityType = [
    {
      value: 'Alzheimer’s Disease'
    },
    {
      value: 'Amyotrophic Lateral Sclerosis (ALS)'
    },
    {
      value: 'Angelman Syndrome'
    },
    {
      value: 'Ataxia'
    },
    {
      value: 'Attention Deficit/Hyperactivity Disorder (ADHD)'
    },
    {
      value: 'Autism '
    },
    {
      value: 'Autism Spectrum Disorders'
    },
    {
      value: 'Bipolar Disorder'
    },
    {
      value: 'Blindness'
    },
    {
      value: 'Cerebral Palsy'
    },
    {
      value: 'Cornelia de Lange Syndrome (CdLS)'
    },
    {
      value: 'Deafness'
    },
    {
      value: 'Depression'
    },
    {
      value: 'Developmental Disability'
    },
    {
      value: 'Down Syndrome'
    },
    {
      value: 'Epilepsy'
    },
    {
      value: 'Fetal Alcohol Spectrum Disorder (FASD)'
    },
    {
      value: 'Five P Minus Syndrome'
    },
    {
      value: 'Fragile X'
    },
    {
      value: 'Human Immunodeficiency Virus (HIV/AIDS)'
    },
    {
      value: 'Hydrocephalus'
    },
    {
      value: 'Learning Disability'
    },
    {
      value: 'Mental Illness'
    },
    {
      value: 'Mosaic Down Syndrome'
    },
    {
      value: 'Multiple Sclerosis (MS)'
    },
    {
      value: 'Muscular Dystrophy (MD)'
    },
    {
      value: 'Posttraumatic Stress Disorder (PTSD)'
    },
    {
      value: 'Prader-Willi Syndrome'
    },
    {
      value: 'Rett Syndrome'
    },
    {
      value: 'Sotos Syndrome'
    },
    {
      value: 'Spina Bifida'
    },
    {
      value: 'Spinal Cord Injury (SCI)'
    },
    {
      value: 'Traumatic Brain Injury (TBI)'
    },
    {
      value: 'Others'
    },

  ]
  const openAccordion = (tab) => {
    const prevState = state1.accordion;
    const state = prevState.map((x, index) => (tab === index ? true : false));
    setState1({
      accordion: state
    });
  };

  const handleEditIcon = idx => {
    let dependantOrBeneficiaryData = dependantOrBeneficiaryRows[idx]
    setEditAddress({ ...dependantOrBeneficiaryData })
    setUpdatedRowIndex(idx)
    openAccordion(0)
    setIsEditDependantOrBeneficiary(true)
    const dependantAndBenificiaryObj = dependantOrBeneficiaryRows[idx]
    setNewType(dependantAndBenificiaryObj?.type)
    setBeneficiaryType(dependantAndBenificiaryObj?.beneficiaryType)
    setBeneficiaryName(dependantAndBenificiaryObj?.name)
    setRelationship(dependantAndBenificiaryObj?.relationWithEmployee)
    setFirstName(dependantAndBenificiaryObj?.firstName)
    setMiddleName(dependantAndBenificiaryObj?.middleName)
    setLastName(dependantAndBenificiaryObj?.lastName)
    setGender(dependantAndBenificiaryObj?.gender)
    setMaritalStatus(dependantAndBenificiaryObj?.maritalStatus)
    setDOB(dependantAndBenificiaryObj?.dob)
    setAge(dependantAndBenificiaryObj?.age)
    setAddressLine1(dependantAndBenificiaryObj?.addressLineOne)
    setAddressLine2(dependantAndBenificiaryObj?.addressLineTwo)
    setCountry(dependantAndBenificiaryObj?.country)
    setAddState(dependantAndBenificiaryObj?.state)
    setSelectCity(dependantAndBenificiaryObj?.city)
    setPinCode(dependantAndBenificiaryObj?.pinCode)
    setIsStudent(dependantAndBenificiaryObj?.isStudent)
    setIsDisabled(dependantAndBenificiaryObj?.disabled)
    setDisability(dependantAndBenificiaryObj?.disabilityType)
    setAddressSameAsEmployees(dependantAndBenificiaryObj?.addressSameAsEmployees)
    setHasNextSequence(true);
    const countryIdx = countries.findIndex(
      (country) => country.name === dependantAndBenificiaryObj.country
    );
    if (countryIdx != -1) {
      setCountryIndex(countryIdx);
      const stateIdx = countries[countryIdx]?.states.findIndex(
        (state) => state === dependantAndBenificiaryObj.state
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
  }
  const handleClose = () => {
    setState({ ...state, open: false })
  }
  const getObjByValue = (arr, value) => {
    return value ? arr.find(x => x.value == value) : ''
  }

  const save = (e) => {
    e.preventDefault();
    setIsSubmitted(true)
    if (relationError) {
      setState({
        open: true,
        message: 'Dependant already exist with this relation',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }

    if (addressLine1 && country && selectCity && addState) {
      let newObj = {}
      let obj = {
        employeeUUID: employeeDetail?.uuid,
        type: newType,
        addressLineOne: addressLine1,
        addressLineTwo: addressLine2,
        city: selectCity,
        state: addState,
        country: country,
        pinCode: pinCode,
        isStudent: isStudent,
        disabled: isDisabled,
        firstName: beneficiaryName,
        disabilityType: disability,
      }
      if (newType == 'Beneficiary') {
        if (beneficiaryType && beneficiaryName) {
          obj['name'] = beneficiaryName
          obj['beneficiaryType'] = beneficiaryType
        }
        newObj = obj
        if (newType == 'Beneficiary' && isDisabled) {
          if (disability) {
          } else {
            setState({
              open: true,
              message: 'Disibility is required',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            return true
          }
        }
      } else if (newType == 'Dependant') {
        if (relationship && firstName && (DOB || age)) {
          let name = firstName + ' ' + lastName
          const depObj = {
            relationWithEmployee: relationship,
            name: name,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            maritalStatus: maritalStatus,
            age: parseInt(age),
            gender: gender,
            dob: DOB,
            disabilityType: disability,
          }
          newObj = Object.assign({}, obj, depObj)
        }
        if (newType == 'Dependant' && isDisabled) {
          if (disability) {
          } else {
            setState({
              open: true,
              message: 'Disibility is required',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            return true
          }
        }

      }
      setBlocking(true)
      if (!isEditDependantOrBeneficiary) {
        apicaller(
          'post',
          `${BASEURL}/employeeDependantOrBeneficiary/save`,
          newObj
        )
          .then(res => {
            if (res.status === 200) {
              setBlocking(false)
              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'Added Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              resetState()
              const updateData = [...dependantOrBeneficiaryRows, res.data[0]]
              console.log(updateData, 'updateData')
              setDependantOrBeneficiaryRows(dependantOrBeneficiaryRows => [
                ...dependantOrBeneficiaryRows,
                res.data[0]
              ])
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
              setState({
                open: true,
                message: err.response.data,
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
              console.log('create id err', err)
            }
            console.log('create id err', err)
          })
      } else {
        update(newObj)
      }
    } else {
      setState({
        open: true,
        message: 'Address is Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }
  }

  const update = updateObj => {
    setUpdatedSubmitted(true)
    setBlocking(true)
    updateObj['_id'] = addedAddress._id

    apicaller(
      'put',
      `${BASEURL}/employeeDependantOrBeneficiary/update`,
      updateObj
    )
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setState({
            open: true,
            message: 'Updated Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          dependantOrBeneficiaryRows[updatedRowIndex] = updateObj
          resetState()
          setIsSubmitted(false)
        }
      })
      .catch(err => {
        if (err?.response?.data) {
          setState({
            open: true,
            message: err,
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          console.log('create id err', err)
        }
        setBlocking(false)
        console.log('create id err', err)
      })
  }

  const checkDependantValidations = selectedRelationship => {
    // Check if the selected relationship is "Spouse", "Mother-In-Law" or "Father-In-Law" and the employee is single
    if (
      (selectedRelationship === 'Spouse' ||
        selectedRelationship === 'Mother-In-Law' ||
        selectedRelationship === 'Father-In-Law') &&
      employeeDetail.maritalStatus === 'Single'
    ) {
      alert('The employee is single and these fields cannot be selected.')
      return
    }
    // Check if the selected relationship is "Spouse", "Mother-In-Law" or "Father-In-Law" and the employee is male and married
    if (
      (selectedRelationship === 'Spouse' ||
        selectedRelationship === 'Mother-In-Law' ||
        selectedRelationship === 'Father-In-Law') &&
      employeeDetail.gender === 'Male' &&
      employeeDetail.maritalStatus === 'Married'
    ) {
      alert(
        'A Male Married employee cannot have In Laws selected as dependants.'
      )
      return
    }
    // Check if the selected relationship is "Spouse", "Mother" or "Father" and the employee is female and married
    if (
      (selectedRelationship === 'Spouse' ||
        selectedRelationship === 'Mother' ||
        selectedRelationship === 'Father') &&
      employeeDetail.gender === 'Female' &&
      selectedRelationship === 'Married'
    ) {
      alert(
        'A Female Married employee can have either her own parents or her In Laws selected as dependants.'
      )
      return
    }
    // Automatically select the gender based on the selected relationship
    if (
      selectedRelationship === 'Brother' ||
      selectedRelationship === 'Father' ||
      selectedRelationship === 'Father-In-Law' ||
      selectedRelationship === 'Son'
    ) {
      setGender('Male')
    } else if (
      selectedRelationship === 'Sister' ||
      selectedRelationship === 'Mother' ||
      selectedRelationship === 'Mother-In-Law' ||
      selectedRelationship === 'Daughter'
    ) {
      setGender('Female')
    }
    // Check if the selected relationship is "Spouse"
    if (selectedRelationship === 'Spouse') {
      // Check the gender of the employee and select the opposite as Gender
      if (employeeDetail.gender === 'Male') {
        setGender('Female')
      } else {
        setGender('Male')
      }
      // Automatically select the marital status as "Married"
      setMaritalStatus('Married')
    }
  }
  const showConfirmDelete = (i, selected) => {
    setModal2(true)
    setDeleteModal(true)
    setIndexToBeSplice(i)
    setDataToDelete(selected)
  }
  const handleDeleteID = () => {
    // setModal2(false)
    setDeleteModal(false)
    setBlocking(true)
    apicaller(
      'delete',
      `${BASEURL}/employeeDependantOrBeneficiary/delete/${dataToDelete.employeeUUID}/${dataToDelete.type}/${dataToDelete.name} `
    )
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

          const list = [...dependantOrBeneficiaryRows]
          list.splice(IndexToBeSplice, 1)
          setDependantOrBeneficiaryRows(list)
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
        console.log('create id err', err)
      })
  }
  const calculateAge = (event) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthYear = new Date(event).getFullYear();
    let age = (currentYear - birthYear)
    if (!isNaN(age)) setAge(age)
  }
  const resetState = () => {
    setIsSubmitted(false)
    setNewType('')
    setBeneficiaryType('')
    setBeneficiaryName('')
    setRelationship('')
    setFirstName('')
    setMiddleName('')
    setLastName('')
    setGender('')
    setMaritalStatus('')
    setDOB(null)
    setAge(null)
    setAddressLine1('')
    setAddressLine2('')
    setCountryIndex(null);
    setCountry(null);
    setAllStates([]);
    setAddState(null);
    setStateIndex(null);
    setSelectCity('')
    setPinCode('')
    setAddressSameAsEmployees(false)
    setIsStudent(false)
    setIsDisabled(false)
    setUpdatedSubmitted(false)
    setIsEditDependantOrBeneficiary()
    setState1({ accordion: [false, false, false] })
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <Grid container spacing={0}>
          <Grid item md={10} lg={10} xl={11} className='mx-auto'>
            <div className='bg-white p-4 rounded'>
              <div className='text-center my-4'>
                <h1 className='display-4 mb-1 '>
                  Create Dependants And Benificiaries
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
                    <div className='card-header'>
                      <div className='card-header--title'>
                        <p>
                          <b>Current Dependant/Beneficiary Details</b>
                        </p>
                      </div>
                    </div>
                    <CardContent className='p-0'>
                      <div
                        className='table-responsive-md'
                        style={{ overflow: 'auto' }}>
                        <Table className='table table-hover table-striped text-nowrap mb-0'>
                          <thead className='thead-light'>
                            <tr>
                              <th className='text-left'>Type</th>
                              <th className='text-left'>Beneficiary Type</th>
                              <th className='text-left'>
                                Relationship with Employee
                              </th>
                              <th className='text-left'>
                                Name of the Dependant/Beneficiary
                              </th>
                              <th className='text-left'>Action</th>
                              <th className='text-left'>Marital Status</th>
                              <th className='text-left'>Gender</th>
                              <th className='text-left'>Age</th>
                              <th className='text-left'></th>
                            </tr>
                          </thead>
                          {dependantOrBeneficiaryRows.length > 0 ? (
                            <>
                              <tbody>
                                {dependantOrBeneficiaryRows.map((item, idx) => (
                                  <tr>
                                    <td className='text-left'>
                                      <div>{item?.type}</div>
                                    </td>
                                    <td className='text-left'>
                                      <div>{item?.beneficiaryType ? item?.beneficiaryType : 'N/A'}</div>
                                    </td>
                                    <td className='text-left'>
                                      <div>{item?.relationWithEmployee ? item?.relationWithEmployee : 'N/A'}</div>
                                    </td>
                                    <td className='text-left'>
                                      <div>{item?.name}</div>
                                    </td>
                                    <td className='text-left'>
                                      <div>
                                        <Button
                                          title='Edit Address'
                                          onClick={() =>
                                            handleEditIcon(idx, item)
                                          }
                                          className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                          <FontAwesomeIcon
                                            icon={['far', 'edit']}
                                            className='font-size-sm'
                                          />
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item?.maritalStatus ? item?.maritalStatus : 'N/A'}</td>
                                    <td>{item?.gender ? item?.gender : 'N/A'}</td>
                                    <td>{item?.age ? item?.age : 'N/A'}</td>
                                    <td>
                                      <Button
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
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </>
                          ) : (
                            <>
                              <p>No Dependant/Beneficiary Data found</p>
                            </>
                          )}
                        </Table>
                      </div>
                      <div className='divider' />
                      <div className='divider' />
                    </CardContent>
                  </Card>
                  <div className='accordion-toggle' >
                    <Button
                      style={{ padding: '25px 0px 0px 0px' }}
                      className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                      onClick={() => toggleAccordion(0)}
                      aria-expanded={state1.accordion[0]}>
                      <span>{isEditDependantOrBeneficiary ? 'Edit New Dependant and Benificiary' : ' Add New Dependant and Benificiary'}</span>
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
                  <br />
                  <Collapse in={state1.accordion[0]}>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            {isEditDependantOrBeneficiary ? 'Edit' : 'Add New*'}
                          </label>
                          <TextField
                            id='outlined-new'
                            label='Select'
                            variant='outlined'
                            fullWidth
                            select
                            size='small'
                            name='New'
                            disabled={isEditDependantOrBeneficiary ? hasNextSequence : '' || readOnly || edit}
                            value={newType || ''}
                            onChange={event => {
                              setNewType(event.target.value)
                            }}
                            error={isSubmitted && (newType ? false : true)}
                            helperText={
                              isSubmitted && (newType ? '' : 'Type is Required')
                            }>
                            {types.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </Grid>
                    </Grid>
                    {newType == 'Beneficiary' ? (
                      <>
                        <Grid container spacing={6}>
                          <Grid item md={6}>
                            <div>
                              <label className=' mb-2'>
                                Beneficiary Type *
                              </label>
                              <TextField
                                id='outlined-beneficiary'
                                label='Select'
                                variant='outlined'
                                fullWidth
                                select
                                size='small'
                                name='Beneficiary Type'
                                value={beneficiaryType || ''}
                                onChange={event => {
                                  setBeneficiaryType(event.target.value)
                                }}
                                error={
                                  isSubmitted &&
                                  (beneficiaryType ? false : true)
                                }
                                helperText={
                                  isSubmitted &&
                                  (beneficiaryType
                                    ? ''
                                    : 'Beneficiary Type is Required')
                                }>
                                {beneficiaryTypes.map(option => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </Grid>
                          <Grid item md={6}>
                            <div>
                              <label className=' mb-2'>
                                Name of the Beneficiary *
                              </label>
                              <TextField
                                variant='outlined'
                                size='small'
                                fullWidth
                                placeholder='Beneficiary Name'
                                name='Beneficiary Name'
                                value={beneficiaryName}
                                onChange={event => {
                                  setBeneficiaryName(event.target.value)
                                }}
                                error={
                                  isSubmitted &&
                                  (beneficiaryName ? false : true)
                                }
                                helperText={
                                  isSubmitted &&
                                  (beneficiaryName
                                    ? ''
                                    : 'Beneficiary Name is Required')
                                }
                              />
                            </div>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      ''
                    )}
                    {newType == 'Dependant' ? (
                      <>
                        {' '}
                        <Grid container spacing={6}>
                          <Grid item md={6}>
                            {' '}
                            <label
                              style={{ marginTop: '15px' }}
                              className=' mb-2'>
                              Relationship With Employee *
                            </label>
                            <Autocomplete
                              id='combo-box-demo'
                              select
                              options={relationshipListArray}
                              value={relationship ? getObjByValue(
                                relationshipListArray,
                                relationship
                              ) : ''}
                              getOptionLabel={(option) => (option.value ? option.value : '')}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Relationship'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  value={relationship}
                                  error={
                                    relationError
                                      ? true
                                      : isSubmitted &&
                                      (relationship ? false : true)
                                  }
                                  helperText={
                                    relationError
                                      ? 'Dependant already exist with this relationship'
                                      : isSubmitted &&
                                      (relationship
                                        ? ''
                                        : 'Relationship is Required')
                                  }
                                />
                              )}
                              onChange={(event, value) => {
                                setRelationship(value?.value)
                                // Check if Dependant already there
                                if (
                                  value?.value == 'Father' ||
                                  value?.value == 'Mother' ||
                                  value?.value == 'Spouse'
                                ) {
                                  if (
                                    dependantOrBeneficiaryRows.filter(
                                      e =>
                                        e.relationWithEmployee === value?.value
                                    ).length > 0
                                  ) {
                                    setRelationError(true)
                                  }
                                } else {
                                  setRelationError(false)
                                }

                                checkDependantValidations(value?.value)
                              }}
                            />
                          </Grid>
                        </Grid>
                        <br></br>
                        <b>Name of Dependant</b>
                        <Grid container spacing={6}>
                          <Grid item md={4}>
                            <div>
                              <label className=' mb-2'>
                                First Name *
                              </label>
                              <TextField
                                id='outlined-firstName'
                                placeholder='First Name'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='firstName'
                                value={firstName}
                                onChange={event => {
                                  setFirstName(event.target.value)
                                }}
                                helperText={
                                  isSubmitted &&
                                    (!firstName || firstName === '')
                                    ? 'First Name is required'
                                    : ''
                                }
                                error={
                                  isSubmitted &&
                                    (!firstName || firstName === '')
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </Grid>
                          <Grid item md={4}>
                            <div>
                              <label className=' mb-2'>
                                Middle Name
                              </label>
                              <TextField
                                id='outlined-middleName'
                                placeholder='Middle Name'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='middleName'
                                value={middleName}
                                onChange={event => {
                                  setMiddleName(event.target.value)
                                }}
                              />
                            </div>
                          </Grid>
                          <Grid item md={4}>
                            <div>
                              <label className=' mb-2'>
                                Last Name
                              </label>
                              <TextField
                                id='outlined-lastName'
                                placeholder='Last Name'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='lastName'
                                value={lastName}
                                onChange={event => {
                                  setLastName(event.target.value)
                                }}
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container spacing={6}>
                          <Grid item md={6}>
                            <div>
                              <label className=' mb-2'>
                                Gender
                              </label>
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
                                  checkDependantValidations(relationship)
                                }}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date'
                                }}>
                                {genders.map(option => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </Grid>
                          <Grid item md={6}>
                            <div>
                              <label className=' mb-2'>
                                Marital Status
                              </label>
                              <TextField
                                variant='outlined'
                                fullWidth
                                id='outlined-marital'
                                select
                                label='Select'
                                size='small'
                                name='marital'
                                value={maritalStatus}
                                onChange={event => {
                                  setMaritalStatus(event.target.value)
                                  checkDependantValidations(relationship)
                                }}>
                                {maritalStatusList.map(option => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container spacing={6}
                          className='align-items-center justify-content-center'>
                          <Grid item md={6} >
                            <div>
                              <label className=' mb-2'>
                                Date Of Birth *
                              </label>
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                style={{ margin: '0%' }}>
                                <KeyboardDatePicker
                                  style={{ margin: '0%' }}
                                  inputVariant='outlined'
                                  format='dd/MM/yyyy'
                                  margin='normal'
                                  id='date-picker-inline'
                                  fullWidth
                                  size='small'
                                  maxDate={new Date()}
                                  value={DOB}
                                  onChange={event => {
                                    setDOB(event)
                                    calculateAge(event)
                                  }}
                                  error={
                                    isSubmitted
                                      ? DOB
                                        ? DOB !== null &&
                                          DOB instanceof Date &&
                                          new Date(DOB) > new Date()
                                          ? " Date of birth Cannot be greater than today's Date"
                                          : null
                                        : ' Date of Birth Required'
                                      : DOB !== null &&
                                        DOB instanceof Date &&
                                        new Date(DOB) > new Date()
                                        ? "Date of birth Cannot be greater than today's Date"
                                        : null
                                          ? !isSubmitted
                                          : DOB !== null &&
                                            DOB instanceof Date &&
                                            new Date(DOB) > new Date()
                                            ? "Date of birth Cannot be greater than today's Date"
                                            : null
                                  }
                                  helperText={
                                    isSubmitted
                                      ? DOB
                                        ? DOB !== null &&
                                          DOB instanceof Date &&
                                          new Date(DOB) > new Date()
                                          ? "Date of birth Cannot be greater than today's Date"
                                          : null
                                        : ' Date of Birth Required'
                                      : DOB !== null &&
                                        DOB instanceof Date &&
                                        new Date(DOB) > new Date()
                                        ? "Date of birth Cannot be greater than today's Date"
                                        : null
                                          ? !isSubmitted
                                          : DOB !== null &&
                                            DOB instanceof Date &&
                                            new Date(DOB) > new Date()
                                            ? "Date of birth Cannot be greater than today's Date"
                                            : null
                                  }
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                  }}
                                />
                              </MuiPickersUtilsProvider>
                            </div>
                          </Grid>
                          <Grid item md={1} className='pt-5'>
                            OR
                          </Grid>
                          <Grid item md={5}>
                            <div>
                              <label className=' mb-2'>
                                Age in Years *
                              </label>
                              <TextField
                                id='outlined-age'
                                placeholder='Age'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='age'
                                value={age}
                                onChange={event => {
                                  setAge(event.target.value)
                                }}
                                helperText={
                                  (!DOB || DOB == null) &&
                                    isSubmitted &&
                                    (!age || age === '')
                                    ? 'Age is required'
                                    : ''
                                }
                                error={
                                  (!DOB || DOB == null) &&
                                    isSubmitted &&
                                    (!age || age === '')
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </Grid>
                        </Grid>{' '}
                      </>
                    ) : (
                      ''
                    )}
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <Checkbox
                          id='outlined- addressSameAsEmployees'
                          variant='outlined'
                          size='small'
                          style={addressSameAsEmployees ? { color: 'blue' } : {}}
                          checked={addressSameAsEmployees ? true : false}
                          value={addressSameAsEmployees ? true : false}
                          onChange={event => {
                            setAddressSameAsEmployees(event.target.checked)
                            if (event.target.checked) {
                              console.log('hhh')
                              setAddressLine1(employeeAddress?.address1)
                              setAddressLine2(employeeAddress?.address2)
                              const countryIdx = countries?.findIndex(
                                (country) => country.name === employeeAddress.country
                              );
                              if (countryIdx != -1) {
                                setCountryIndex(countryIdx);
                                setCountry(employeeAddress.country)
                                const stateIdx = countries[countryIdx]?.states.findIndex(
                                  (state) => state === employeeAddress.state
                                );
                                tempStates = countries[countryIdx].states;
                                setAllStates(tempStates);
                                if (stateIdx != -1) {
                                  setStateIndex(stateIdx);
                                  setAddState(employeeAddress.state);
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
                              setSelectCity(employeeAddress?.city)
                              setPinCode(employeeAddress?.PIN)
                            } else {
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
                          className=' mb-2'>
                          Address Same as Employees
                        </label>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <label
                          style={{ marginTop: '15px' }}
                          className=' mb-2'>
                          Address Line 1
                        </label>
                        <TextField
                          id='outlined-addressLine1'
                          placeholder='Address Line 1'
                          type='text'
                          variant='outlined'
                          fullWidth
                          size='small'
                          value={addressLine1}
                          onChange={event => {
                            setAddressLine1(event.target.value)
                          }}
                          error={
                            isUpdatedSubmitted && (addressLine1 ? false : true)
                          }
                          helperText={
                            isUpdatedSubmitted &&
                            (addressLine1 ? '' : 'Address is Required')
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <label
                          style={{ marginTop: '15px' }}
                          className=' mb-2'>
                          Address Line 2
                        </label>
                        <TextField
                          id='outlined-addressLine2'
                          placeholder='Address Line 2'
                          type='text'
                          variant='outlined'
                          fullWidth
                          size='small'
                          value={addressLine2}
                          onChange={event => {
                            setAddressLine2(event.target.value)
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <label
                          style={{ marginTop: '15px' }}
                          className=' mb-2'>
                          Country
                        </label>
                        <Autocomplete
                          id='combo-box-demo'
                          select
                          value={
                            countryIndex != null
                              ? countries[countryIndex] || ''
                              : null
                          }
                          options={countries}
                          getOptionLabel={(option) => option.name}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='select Country'
                              variant='outlined'
                              fullWidth
                              size='small'
                              name='country'
                              value={
                                countryIndex != null
                                  ? countries[countryIndex] || ''
                                  : null
                              }
                              error={
                                isUpdatedSubmitted &&
                                (country ? false : true)
                              }
                              helperText={
                                isUpdatedSubmitted &&
                                (country ? '' : 'Country is Required')
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
                          className=' mb-2'>
                          State
                        </label>
                        <Autocomplete
                          id='combo-box-demo'
                          select
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
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Select State'
                              variant='outlined'
                              fullWidth
                              size='small'
                              name='addState'
                              value={
                                countryIndex != null
                                  ? stateIndex != null
                                    ? countries[countryIndex].states[
                                    stateIndex
                                    ] || ''
                                    : null
                                  : null
                              }
                              error={
                                isUpdatedSubmitted &&
                                (addState ? false : true)
                              }
                              helperText={
                                isUpdatedSubmitted &&
                                (addState ? '' : 'State is Required')
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
                          City
                        </label>
                        <TextField
                          id="outlined-city"
                          placeholder="Select City"
                          variant="outlined"
                          fullWidth
                          size="small"
                          name="city"
                          value={selectCity}
                          onChange={(event) => {
                            setSelectCity(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <label
                          style={{ marginTop: '15px' }}
                          className=' mb-2'>
                          Pin Code
                        </label>
                        <TextField
                          id='outlined-pinCode'
                          placeholder='Pin Code'
                          type='text'
                          variant='outlined'
                          fullWidth
                          size='small'
                          value={pinCode}
                          onChange={event => {
                            setPinCode(event.target.value)
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Checkbox
                          id='outlined- isStudent'
                          variant='outlined'
                          size='small'
                          checked={isStudent}
                          value={isStudent}
                          onChange={event => {
                            setIsStudent(event.target.checked)
                          }}
                        />
                        &nbsp;
                        <label
                          style={{ marginTop: '15px' }}
                          className=' mb-2'>
                          Student
                        </label>
                      </Grid>
                      <Grid item md={2}>
                        <Checkbox
                          id='outlined- isDisabled'
                          variant='outlined'
                          size='small'
                          checked={isDisabled}
                          value={isDisabled}
                          onChange={event => {
                            setIsDisabled(event.target.checked)
                            if (!event.target.checked) {
                              setDisability(' ')
                            }
                          }}
                        />
                        &nbsp;
                        <label
                          style={{ marginTop: '15px' }}
                          className=' mb-2'>
                          Disabled
                        </label>
                      </Grid>
                      {isDisabled ? (
                        <Grid item xs={4}>
                          <Autocomplete
                            id='combo-box-demo'
                            select
                            options={disabilityType}
                            value={disability ? getObjByValue(
                              disabilityType,
                              disability
                            ) : ''}
                            getOptionLabel={(option) => (option.value ? option.value : '')}
                            renderInput={params => (
                              <TextField
                                {...params}
                                id='outlined-pinCode'
                                placeholder='Select Disability'
                                type='text'
                                variant='outlined'
                                fullWidth
                                size='small'
                                value={disability}
                                helperText={
                                  isDisabled &&
                                    isSubmitted &&
                                    (!disability || disability === '')
                                    ? 'Disibility is required'
                                    : ''
                                }
                                error={
                                  isDisabled &&
                                    isSubmitted &&
                                    (!isDisabled || isDisabled === '')
                                    ? true
                                    : false
                                }
                              >
                              </TextField>
                            )}
                            onChange={(event, value) => {
                              setDisability(value?.value)
                            }}
                          />
                        </Grid>
                      ) : (
                        ' '
                      )}
                    </Grid>
                    <br></br>
                    <div className='divider' />
                    <div className='divider' />
                    <div
                      className='float-right'
                      style={{ marginRight: '2.5%' }}>
                      <Button
                        className='btn-primary mb-2 m-2'
                        onClick={() => {
                          toggleAccordion(0)
                          setIsEditDependantOrBeneficiary(false)
                          resetState()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className='btn-primary mb-2 m-2'
                        type='submit'
                        onClick={e => save(e)}>
                        {/* Save */}
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
                    onClick={handleDeleteID}
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
      </Card>
    </BlockUi>
  )
}

const mapStateToProps = (state) => ({
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreateDependants);
