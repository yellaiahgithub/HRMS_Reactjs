import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  Snackbar,
  FormControl,
  Select,
  TextField,
  MenuItem
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
import { NavLink, useLocation } from 'react-router-dom'
import { SelectAllOutlined, SettingsBluetoothSharp } from '@material-ui/icons'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { setSelectedEmployee } from '../../actions/index'


const EmployeeJobDetailHistory = props => {
  const {
    selectedEmployeeInfoHistory,
    create,
    employeeUUID,
    savedEmployeeInfoHistoryDetails,
    setSavedEmployeeInfoHistoryDetails,
    setEmployeeInfoHistoryDetails,
    setSelectedEmployeeInfoHistory,
    setState,
    selectedEmployee,
    setEmployee
  } = props

  const [jobBand, setjobLevel] = useState()
  const [jobGrade, setjobGrade] = useState()
  const [isSubmitted, setIsSubmitted] = useState()
  const [effectiveDate, setEffectiveDate] = useState(new Date())
  const [files, setFiles] = useState([])

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteModaltoggle = () => setDeleteModal(!deleteModal)
  const [hireDate, setHireDate] = useState(null)
  const [empDep, setEmpDepartment] = useState()
  const [actionIndex, setActionIndex] = useState(null)
  const [reasonIndex, setReasonIndex] = useState(null)
  const [departIndex, setDepartIndex] = useState(null)
  const [desigIndex, setDesigIndex] = useState(null)
  const [loctnIndex, setLoctnIndex] = useState(null)
  const [managerIndex, setManagerIndex] = useState(null)
  const [empLoc, setEmpLocation] = useState()
  const [empDes, setEmpDesignation] = useState()
  const [allActions, setAllActions] = useState([])
  const [allReasons, setAllReasons] = useState([])
  const [managerUUID, setManagerUUID] = useState()
  const [allEmployees, setAllEmployees] = useState([])
  const [allDepartments, setAllDepartment] = useState([])
  const [allDesigntaion, setAllDesigntaion] = useState([])
  const [allLocations, setAllLocation] = useState([])
  const [allFetchedLocations, setAllFetchedLocations] = useState([])
  const [jobType, setJobType] = useState('')
  const [jobStatus, setJobStatus] = useState('')
  const [actionReason, setActionReason] = useState()
  const [action, setAction] = useState()
  const [blocking, setBlocking] = useState(false)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [employeeStatus,setEmployeeStatus] = useState(selectedEmployee.isActive)
  const [SEPERATE_ACTION_CODE,setSeparateactionCode]=useState(null);
  const [actionError, showActionError] = useState(false)
  const [disabledActionAndReason, setDisabledActionAndReason] = useState(false)

  const jobTypes = [
    {
      value: 'Consultant',
      label: 'Consultant'
    },
    {
      value: 'Contractor',
      label: 'Contractor'
    },
    {
      value: 'Employee',
      label: 'Employee'
    },
    {
      value: 'Intern',
      label: 'Intern'
    },
    {
      value: 'Retainer',
      label: 'Retainer'
    }
  ]

  const jobStatusList = [
    {
      value: 'Confirmed',
      label: 'Confirmed'
    },
    {
      value: 'Contract',
      label: 'Contract'
    },
    {
      value: 'Probation',
      label: 'Probation'
    },
    {
      value: 'Training',
      label: 'Training'
    }
  ]

  useEffect(() => {
    getEmployees()
    getDepartments()
    getDesignation()
    getLocation()
    getActions()
    if (create != null && !create) {
      setHireDate(selectedEmployeeInfoHistory?.historyObject.hireDate)
      const foundStatusObj = getObjByValue(
        jobStatusList,
        selectedEmployeeInfoHistory?.historyObject.jobStatus
      )
      setJobStatus(foundStatusObj?.value)

      const foundTypeObj = getObjByValue(
        jobTypes,
        selectedEmployeeInfoHistory?.historyObject.jobType
      )
      setJobType(foundTypeObj?.value)

      setEffectiveDate(new Date(selectedEmployeeInfoHistory?.effectiveDate))
    }
    else{
      setHireDate(selectedEmployee?.hireDate)
      const foundStatusObj = getObjByValue(
        jobStatusList,
        selectedEmployee?.jobStatus
      )
      setJobStatus(foundStatusObj?.value)

      const foundTypeObj = getObjByValue(
        jobTypes,
        selectedEmployee?.jobType
      )
      setJobType(foundTypeObj?.value)
      setEffectiveDate(new Date())
    }
  }, [])

  const getEmployees = () => {
    apicaller('get', `${BASEURL}/employee/nonDirectInDirectEmployees/${selectedEmployee.uuid}`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          for (const iterator of res.data) {
            iterator['nameWithId'] =
              iterator.employeeName + '-' + iterator.employeeID
          }
          setAllEmployees(res.data)

          let index = res.data.findIndex(
            emp =>
              emp.uuid ===
              (create?selectedEmployee.managerUUID:selectedEmployeeInfoHistory?.historyObject.managerUUID)
          )
          if (index > -1) {
            setManagerIndex(index)
            setManagerUUID(res.data[index].uuid)
          }
        }
      })
      .catch(err => {
        console.log('getEmployees err', err)
      })
  }

  const getDepartments = () => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDepartment(res.data)

          let index = res.data.findIndex(
            dep =>
              dep.id === (create?selectedEmployee.departmentId:selectedEmployeeInfoHistory?.historyObject.department)
          )
          if (index > -1) {
            setDepartIndex(index)
            setEmpDepartment(res.data[index].id)
          }
        }
      })
      .catch(err => {
        console.log('getDepartments err', err)
      })
  }

  const getDesignation = () => {
    apicaller('get', `${BASEURL}/designation/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDesigntaion(res.data)

          let index = res.data.findIndex(
            desig =>
              desig.id ===
              (create?selectedEmployee.designationId:selectedEmployeeInfoHistory?.historyObject.designation)
          )
          if (index > -1) {
            setDesigIndex(index)
            setEmpDesignation(res.data[index].id)
            setjobLevel(res.data[index].jobLevel)
            setjobGrade(res.data[index].jobGrade)
          }
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getLocation = () => {
    apicaller('get', `${BASEURL}/location`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllLocation(res.data)
          setAllFetchedLocations(res.data)
          let index = res.data.findIndex(
            loc =>
              loc.locationId ===(create?selectedEmployee.locationId:
              selectedEmployeeInfoHistory?.historyObject.location)
          )
          if (index > -1) {
            setLoctnIndex(index)
            setEmpLocation(res.data[index].locationId)
          }
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getActions = () => {
    apicaller('get', `${BASEURL}/action/find`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllActions(res.data)
          let index = res.data.findIndex(
            actn =>
              actn.actionCode ===
              selectedEmployeeInfoHistory?.historyObject.action
          )
          const SEPERATE_ACTION_CODE = res.data.find(
            actn =>
              actn.actionCode.toLowerCase() === "sep"
          ).actionCode
          setSeparateactionCode(SEPERATE_ACTION_CODE)
          if (index > -1) {
            setActionIndex(index)
            setAction(res.data[index].actionCode)
            // Disabled action and reason if Hire Row is selected 
            if (res.data[index].actionCode == 'HIRE') {
              setDisabledActionAndReason(true)
            }

            apicaller(
              'get',
              `${BASEURL}/reason/fetchReasonByAction/${res?.data[index].actionCode}`
            ).then(res => {
              if (res.status === 200) {
                console.log('res.data', res.data)
                setAllReasons(res.data)
                let index = res.data.findIndex(
                  rsn =>
                    rsn.reasonCode ===
                    selectedEmployeeInfoHistory?.historyObject.actionReason
                )
                if (index > -1) {
                  setReasonIndex(index)
                  setActionReason(res.data[index].reasonCode)
                }
              }
            })
          }
        }
      })
      .catch(err => {
        console.log('FEtchall Action Reasons Err', err)
      })
  }

  const getObjByValue = (arr, value) => {
    return value ? arr.find(x => x.value == value) : {}
  }

  const save = () => {
    setIsSubmitted(true)
    console.log(save)
    const detailHistoryObj = {
      employeeUUID: employeeUUID,
      type: 'EmployeeJobDetails',
      historyObject: {
        jobType: jobType,
        jobStatus: jobStatus,
        action: action,
        actionReason: actionReason,
        hireDate: hireDate,
        department: empDep,
        location: empLoc,
        designation: empDes,
        managerUUID: managerUUID,
        jobGrade: jobGrade,
        jobBand: jobBand
      },
      effectiveDate: effectiveDate,
      reason: actionReason
    }
    let isValid = true
    let errors = []
    if (
      action &&
      action !== '' &&
      actionReason &&
      actionReason !== '' &&
      effectiveDate &&
      effectiveDate !== '' &&
      jobType &&
      jobType !== '' &&
      jobStatus &&
      jobStatus !== '' &&
      hireDate &&
      hireDate !== null &&
      empDep &&
      empDep !== '' &&
      empLoc &&
      empLoc !== '' &&
      empDes &&
      empDes !== '' &&
      managerUUID &&
      managerUUID !== ''
    ) {
      if (create) {
      } else {
        if (
          jobBand == selectedEmployeeInfoHistory.historyObject.jobBand &&
          action == selectedEmployeeInfoHistory.historyObject.action &&
          actionReason ==
            selectedEmployeeInfoHistory.historyObject.actionReason &&
          effectiveDate ==
            selectedEmployeeInfoHistory.historyObject.effectiveDate &&
          hireDate == selectedEmployeeInfoHistory.historyObject.hireDate &&
          jobType == selectedEmployeeInfoHistory.historyObject.jobType &&
          jobStatus == selectedEmployeeInfoHistory.historyObject.jobStatus &&
          jobGrade == selectedEmployeeInfoHistory.historyObject.jobGrade &&
          empDep == selectedEmployeeInfoHistory.historyObject.empDep &&
          empDes == selectedEmployeeInfoHistory.historyObject.empDes &&
          empLoc == selectedEmployeeInfoHistory.historyObject.empLoc &&
          managerUUID == selectedEmployeeInfoHistory.historyObject.managerUUID
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
    } else {
      isValid = false
      setState({
        open: true,
        message: 'Mandatory fields are Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }

  const saveHistoryObject = detailHistoryObj => {
    let correctedHistoryObj = detailHistoryObj
    if (create) {
      apicaller('post', `${BASEURL}/employeeInfoHistory/save`, detailHistoryObj)
        .then(res => {
          if (res.status === 200) {
            const data=res.data[0];
            data.actionName=allActions[actionIndex].actionName
            data.reasonName=allReasons[reasonIndex].reasonName
            if(action==SEPERATE_ACTION_CODE){
              setEmployeeInfoHistoryDetails([
                data,
                ...savedEmployeeInfoHistoryDetails
              ])
              const updatedEmployee={...selectedEmployee,isActive:false,jobType:jobType,jobStatus:jobStatus,hireDate:hireDate,designationId:empDes,locationId:empLoc,departmentId:empDep,managerUUID:managerUUID}
              setSelectedEmployee(updatedEmployee)
              setEmployee(updatedEmployee)
              setEmployeeStatus(false)
            }
            else{
              setEmployeeInfoHistoryDetails([
                null,
                data,
                ...savedEmployeeInfoHistoryDetails
              ])
              const updatedEmployee={...selectedEmployee,jobType:jobType,jobStatus:jobStatus,hireDate:hireDate,designationId:empDes,locationId:empLoc,departmentId:empDep,managerUUID:managerUUID}
              setSelectedEmployee(updatedEmployee)
              setEmployee(updatedEmployee)
            }
            setSavedEmployeeInfoHistoryDetails([
              data,
              ...savedEmployeeInfoHistoryDetails
            ])
            setSelectedEmployeeInfoHistory(data)
            setState({
              open: true,
              message: 'Employee Job Detail Created Sucessfully',
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
            message: 'Error occured while creating Employee Job Detail',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        })
    } else {
      detailHistoryObj.uuid = selectedEmployeeInfoHistory.uuid
      apicaller(
        'put',
        `${BASEURL}/employeeInfoHistory/update`,
        detailHistoryObj
      )
        .then(res => {
          if (res.status === 200) {
            selectedEmployeeInfoHistory.actionName=allActions[actionIndex].actionName
            selectedEmployeeInfoHistory.reasonName=allReasons[reasonIndex].reasonName
            selectedEmployeeInfoHistory.historyObject.jobBand = jobBand
            selectedEmployeeInfoHistory.historyObject.actionReason =
              actionReason
            selectedEmployeeInfoHistory.historyObject.action = action
            selectedEmployeeInfoHistory.effectiveDate = effectiveDate
            selectedEmployeeInfoHistory.historyObject.hireDate = hireDate
            selectedEmployeeInfoHistory.historyObject.jobType = jobType
            selectedEmployeeInfoHistory.historyObject.jobStatus = jobStatus
            selectedEmployeeInfoHistory.historyObject.department = empDep
            selectedEmployeeInfoHistory.historyObject.designation = empDes
            selectedEmployeeInfoHistory.historyObject.location = empLoc
            selectedEmployeeInfoHistory.historyObject.managerUUID = managerUUID
            selectedEmployeeInfoHistory.historyObject.jobGrade = jobGrade
            if(action==SEPERATE_ACTION_CODE){
              setEmployeeInfoHistoryDetails([
                ...savedEmployeeInfoHistoryDetails
              ])
              const updatedEmployee={...selectedEmployee,isActive:false}
              setSelectedEmployee(updatedEmployee)
              setEmployeeStatus(false)
            }
            else{
              setEmployeeInfoHistoryDetails([
                null,
                ...savedEmployeeInfoHistoryDetails
              ])
            }
            setState({
              open: true,
              message: 'Employee Job Detail Corrected Sucessfully',
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
            message: 'Error occured while Correcting Employee Job Detail',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        })
    }
  }
  const deleteJobDetails = () => {
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
          if(action==SEPERATE_ACTION_CODE){
            const updatedEmployee={...selectedEmployee,isActive:true}
            setSelectedEmployee(updatedEmployee)
            setEmployeeStatus(true)
          }
          setEmployeeInfoHistoryDetails([null, ...filteredHistory])
          setSavedEmployeeInfoHistoryDetails(filteredHistory)
          setSelectedEmployeeInfoHistory(null);
          setState({
            open: true,
            message: 'Employee Job Detail History Deleted Sucessfully',
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

  const fetchReasonByAction = selectedAction => {
    if (selectedAction !== null) {
      const index = allActions.findIndex(
        action => action.actionCode === selectedAction.actionCode
      )
      if (index != -1) {
        setActionIndex(index)
        setAction(allActions[index].actionCode)
      }
      // show error if more than one Hire for an employee
      if (
        selectedAction?.actionCode == 'HIRE' &&
        savedEmployeeInfoHistoryDetails.filter(
          obj => obj.historyObject?.action === selectedAction.actionCode
        )
      ) {
        setAllReasons([])
        showActionError(true)
        return
      }
      showActionError(false)
      setBlocking(true)

      apicaller(
        'get',
        `${BASEURL}/reason/fetchReasonByAction/${selectedAction?.actionCode}`
      )
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            setAllReasons(res.data)
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('FEtchall Action Reasons Err', err)
        })
    } else {
      showActionError(false)
    }
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Grid item lg={12}>
        <div>
          <div>
            <div>
              <h4
                style={{
                  color: 'blue'
                }}>
                Change Employee Job Detail
              </h4>
              <br />

              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Action *</label>
                    <Autocomplete
                      disabled={disabledActionAndReason}
                      id='combo-box-demo'
                      options={allActions}
                      getOptionLabel={option => option.actionName}
                      value={
                        actionIndex != null
                          ? allActions[actionIndex] || ''
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='action'
                          helperText={
                            (isSubmitted && !action) ||
                            (isSubmitted && action === '')
                              ? 'Action is required'
                              : '' || actionError
                              ? 'Action HIRE is already exist. Please change the action'
                              : ''
                          }
                          error={
                            (isSubmitted && !action) ||
                            (isSubmitted && action === '')
                              ? true
                              : false || actionError
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        fetchReasonByAction(value)
                      }}
                    />
                  </div>
                </Grid>

                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Action Reason *</label>
                    <Autocomplete
                      disabled={disabledActionAndReason}
                      id='combo-box-demo'
                      options={allReasons}
                      getOptionLabel={option => option.reasonName}
                      value={
                        reasonIndex != null
                          ? allReasons[reasonIndex] || ''
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='actionReason'
                          helperText={
                            (isSubmitted && !actionReason) ||
                            (isSubmitted && actionReason === '')
                              ? 'Action is required'
                              : ''
                          }
                          error={
                            (isSubmitted && !actionReason) ||
                            (isSubmitted && actionReason === '')
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = allReasons.findIndex(
                          reason => reason.reasonCode === value?.reasonCode
                        )
                        if (index != -1) {
                          setReasonIndex(index)
                          setActionReason(allReasons[index].reasonCode)
                        }
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={6}>
                <Grid item md={6}>
                  <label className=' mb-2'>Effective As of</label>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    style={{ margin: '0%' }}>
                    <KeyboardDatePicker
                      style={{ margin: '0%' }}
                      inputVariant='outlined'
                      format='dd/MM/yyyy'
                      margin='normal'
                      id='outlined-effectiveDate'
                      fullWidth
                      size='small'
                      value={effectiveDate}
                      onChange={event => {
                        setEffectiveDate(event)
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

                <Grid item style={{marginTop:"30px"}} md={2} sm={3} className='mx-auto'>
                  <label  className='font-size-sm mt-1'>Employee Status</label>
                </Grid>
                <Grid item style={{marginTop:"30px"}} md={4} sm={9} className='mx-auto'>
                  <p
                    className='opacity-8 font-size-sm mt-1'
                    style={
                      employeeStatus ? { color: 'green' } : { color: 'red' }
                    }>
                    {employeeStatus ? 'Active' : 'InActive'}{' '}
                  </p>{' '}
                </Grid>
              </Grid>

              {/* <br></br>
              <div className='divider' />
              <br></br> */}

              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className='mb-2'>Hire Date *</label>
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
                        value={hireDate}
                        onChange={event => {
                          setHireDate(event)
                        }}
                        KeyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                        helperText={
                          (isSubmitted && !hireDate) ||
                          (isSubmitted && hireDate === null)
                            ? 'Hire Date is required'
                            : ''
                        }
                        error={
                          (isSubmitted && !hireDate) ||
                          (isSubmitted && hireDate === null)
                            ? true
                            : false
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </Grid>

                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Employee Job Type *</label>
                    <TextField
                      id='outlined-jobType'
                      label='Select'
                      variant='outlined'
                      fullWidth
                      select
                      size='small'
                      name='jobType'
                      value={jobType}
                      onChange={event => {
                        setJobType(event.target.value)
                      }}
                      helperText={
                        isSubmitted && (!jobType || jobType === '')
                          ? 'Job type is required'
                          : ''
                      }
                      error={
                        isSubmitted && (!jobType || jobType === '')
                          ? true
                          : false
                      }>
                      {jobTypes.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <br></br>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Employee Department *</label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={allDepartments}
                      getOptionLabel={option => option.name}
                      value={
                        departIndex != null
                          ? allDepartments[departIndex] || ''
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='empDep'
                          helperText={
                            (isSubmitted && !empDep) ||
                            (isSubmitted && empDep === '')
                              ? 'Department is required'
                              : ''
                          }
                          error={
                            (isSubmitted && !empDep) ||
                            (isSubmitted && empDep === '')
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = allDepartments.findIndex(
                          dep => dep.id === value?.id
                        )
                        if (index != -1) {
                          setDepartIndex(index)
                          setEmpDepartment(allDepartments[index].id)
                        }

                        if (value?.locations.length > 0) {
                          let locations = value?.locations
                          let result = []
                          for (let i = 0; i < locations.length; i++) {
                            const searchString = locations[i]

                            for (let j = 0; j < allLocations.length; j++) {
                              const object = allLocations[j]

                              if (object.locationId === searchString) {
                                result.push(object)
                              }
                            }
                          }
                          setAllLocation(result)
                          setEmpLocation('')
                        } else {
                          setAllLocation(allFetchedLocations)
                          setEmpLocation('')
                        }
                      }}
                    />
                  </div>
                </Grid>

                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Employee Location *</label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={allLocations}
                      getOptionLabel={option => option.locationName}
                      value={
                        loctnIndex != null
                          ? allLocations[loctnIndex] || ''
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='empLoc'
                          helperText={
                            (isSubmitted && !empLoc) ||
                            (isSubmitted && empLoc === '')
                              ? 'Location is required'
                              : ''
                          }
                          error={
                            (isSubmitted && !empLoc) ||
                            (isSubmitted && empLoc === '')
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = allLocations.findIndex(
                          loc => loc.locationId === value?.locationId
                        )
                        if (index != -1) {
                          setLoctnIndex(index)
                          setEmpLocation(allLocations[index].locationId)
                        }
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Employee Designation *</label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={allDesigntaion}
                      getOptionLabel={option => option.name}
                      value={
                        desigIndex != null
                          ? allDesigntaion[desigIndex] || ''
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='empDes'
                          helperText={
                            (isSubmitted && !empDes) ||
                            (isSubmitted && empDes === '')
                              ? 'Designation is required'
                              : ''
                          }
                          error={
                            (isSubmitted && !empDes) ||
                            (isSubmitted && empDes === '')
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = allDesigntaion.findIndex(
                          desig => desig.id === value?.id
                        )
                        if (index != -1) {
                          setDesigIndex(index)
                          setEmpDesignation(allDesigntaion[index].id)
                          setjobLevel(value?.jobLevel)
                          setjobGrade(value?.jobGrade)
                        }
                      }}
                    />
                  </div>
                </Grid>

                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Manager ID</label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={allEmployees}
                      getOptionLabel={option => option.nameWithId}
                      value={
                        managerIndex != null
                          ? allEmployees[managerIndex] || ''
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='managerUUID'
                          helperText={
                            (isSubmitted && !managerUUID) ||
                            (isSubmitted && managerUUID === '')
                              ? 'Manager is required'
                              : ''
                          }
                          error={
                            (isSubmitted && !managerUUID) ||
                            (isSubmitted && managerUUID === '')
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = allEmployees.findIndex(
                          emp => emp.uuid === value?.uuid
                        )
                        if (index != -1) {
                          setManagerIndex(index)
                          setManagerUUID(allEmployees[index].uuid)
                        }
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className=' mb-2'>Job Status *</label>
                    <TextField
                      id='outlined-jobStatus'
                      label='Select'
                      variant='outlined'
                      fullWidth
                      select
                      size='small'
                      name='jobStatus'
                      value={jobStatus}
                      onChange={event => {
                        setJobStatus(event.target.value)
                      }}
                      helperText={
                        isSubmitted && (!jobStatus || jobStatus === '')
                          ? 'Job status is required'
                          : ''
                      }
                      error={
                        isSubmitted && (!jobStatus || jobStatus === '')
                          ? true
                          : false
                      }>
                      {jobStatusList.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Grid>

                <Grid item md={6}>
                  <label className=' mb-2'>Job Band</label>
                  <TextField
                    disabled={true}
                    id='outlined-jobBand'
                    placeholder='Job Band'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='jobBand'
                    value={jobBand}
                    onChange={event => {
                      setjobLevel(event.target.value)
                    }}
                    // helperText={
                    //   isSubmitted && (!jobBand || jobBand === '')
                    //     ? 'Job Band is required'
                    //     : ''
                    // }
                    // error={
                    //   isSubmitted && (!jobBand || jobBand === '') ? true : false
                    // }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <label className=' mb-2'>Job Grade</label>
                  <TextField
                    id='outlined-jobGrade'
                    disabled={true}
                    placeholder='Job Grade'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='jobGrade'
                    value={jobGrade}
                    onChange={event => {
                      setjobGrade(event.target.value)
                    }}
                    // helperText={
                    //   isSubmitted && (!jobGrade || jobGrade === '')
                    //     ? 'Job Grade is required'
                    //     : ''
                    // }
                    // error={
                    //   isSubmitted && (!jobGrade || jobGrade === '') ? true : false
                    // }
                  />
                </Grid>
              </Grid>

              <br />
              <div className='float-left'>
                <Button
                  className='btn-primary mb-2 m-2'
                  onClick={e => save(e)}
                  disabled={actionError}>
                  {create ? 'Add New Job Details' : 'Correct History'}
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
                onClick={e => deleteJobDetails(e)}
                className='btn-danger btn-pill mx-1'>
                <span className='btn-wrapper--label'>Delete</span>
              </Button>
            </div>
          </div>
        </Dialog>
      </Grid>
    </BlockUi>
  )
}
const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany,
  selectedEmployee: state.Auth.selectedEmployee,
})

const mapDispatchToProps = dispatch => ({
  setEmployee: data => dispatch(setSelectedEmployee(data))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeJobDetailHistory)
