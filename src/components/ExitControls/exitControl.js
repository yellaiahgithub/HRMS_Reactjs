import {
  Button,
  Card,
  Grid,
  MenuItem,
  Table,
  CardContent,
  TextField,
  Snackbar,
  Switch,
  FormControl,
  ListItem,
  List,
  Menu,
  InputAdornment
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory, useLocation } from 'react-router-dom'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'

import 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import apicaller from 'helper/Apicaller'
import clsx from 'clsx'

import Pagination from '@material-ui/lab/Pagination'

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'

const ControlExit = props => {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const { vertical, horizontal, open, toastrStyle, message } = state
  const [blocking, setBlocking] = useState(false)
  const [allReasons, setReasonArr] = useState([])
  const [allRoles, setallRoles] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [saveButtonLabel, setSaveButtonLabel] = useState('Save')
  const [updatedData, setUpdatedData] = useState()
  const [docUUID, setDocUUID] = useState('')
  const history = useHistory()

  useEffect(() => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/separationControl/fetch`)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          setSaveButtonLabel('Update')
          setUpdatedData(res.data)
          setDocUUID(res.data.uuid)

          // Call API's for fetching all the data
          getEmployees()
          getReasons(res.data)
          getRoles()
          getAllDepartments(res.data.noticePeriodSetup)
          getDesignations(res.data.noticePeriodSetup)
          getLocations(res.data.noticePeriodSetup)

          // Pre Populating fields
          setAutoApproveByManager(res.data.miscellineous.autoApproveByManager)
          setAutoApproveByAdmin(res.data.miscellineous.autoApproveByAdmin)
          setAllowEarlyExit(res.data.miscellineous.allowEarlyExit)
          setAllowEmployeeResignationDate(
            res.data.miscellineous.allowEmployeeResignationDate
          )
          setCriteriaApprovals(res.data.approvalPath)
          setHasExceptions(res.data.noticePeriodSetup.hasExceptions)
          setSetupBy(res.data.noticePeriodSetup.setupBy)
          setCriteriaExceptions(res.data.noticePeriodSetup.exceptionArray)
          setNoticePeriodArray(res.data.noticePeriodSetup.noticePeriodArray)
          if (res.data.noticePeriodSetup.setupBy == 'jobType') {
            res.data.noticePeriodSetup['noticePeriodArray'].forEach(element => {
              let index = jobTypes.findIndex(
                o => o.name == element.noticePeriodFor
              )
              if(index !== -1) {
                jobTypes[index]['priority'] = element.priority
                jobTypes[index]['noticePeriod'] = element.noticePeriod
                jobTypes[index]['unit'] = element.unit
              }
            })

            setDataArray(jobTypes)
            setPaginatedArray(jobTypes)
            setAllData(jobTypes)
          } else if (res.data.noticePeriodSetup.setupBy == 'jobStatus') {
            res.data.noticePeriodSetup['noticePeriodArray'].forEach(element => {
              let index = jobStatusList.findIndex(
                o => o.name == element.noticePeriodFor
              )
              if(index !== -1) {
                jobStatusList[index]['priority'] = element.priority
                jobStatusList[index]['noticePeriod'] = element.noticePeriod
                jobStatusList[index]['unit'] = element.unit
              }
            })

            setDataArray(jobStatusList)
            setPaginatedArray(jobStatusList)
            setAllData(jobStatusList)
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        getEmployees()
        getReasons()
        getRoles()
        getAllDepartments()
        getDesignations()
        getLocations()
        console.log('getcontrols err', err)
      })
  }, [])

  const [DepartmentsArray, setDepartments] = useState([])
  const [paginatedDepartments, setPaginatedDepartments] = useState([])
  const [allDepartments, setAllDepartments] = useState([])

  const [LocationsArray, setLocations] = useState([])
  const [paginatedLocations, setPaginatedLocations] = useState([])
  const [allLocations, setAllLocations] = useState([])

  const [DesignationsArray, setDesignations] = useState([])
  const [paginatedDesignations, setPaginatedDesignations] = useState([])
  const [allDesignations, setAllDesignations] = useState([])
  const [allEmployees, setEmployees] = useState([])

  const getEmployees = () => {
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          for (const iterator of res.data) {
            iterator['nameWithId'] =
              iterator.employeeName + '-' + iterator.employeeID
          }
          setEmployees(res.data)
        }
      })
      .catch(err => {
        console.log('getEmployees err', err)
      })
  }

  const getAllDepartments = setupFor => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setDepartments(res.data)
          setPaginatedDepartments(res.data)
          setAllDepartments(res.data)

          // Pre Populating fields
          if (setupFor.setupBy == 'department') {
            setupFor['noticePeriodArray'].forEach(element => {
              let index = res.data.findIndex(
                o => o.id == element.noticePeriodFor
              )
              if(index !== -1) {
                res.data[index]['priority'] = element.priority
                res.data[index]['noticePeriod'] = element.noticePeriod
                res.data[index]['unit'] = element.unit
              }
            })

            setDataArray(res.data)
            setPaginatedArray(res.data)
            setAllData(res.data)
          }
        }
      })
      .catch(err => {
        console.log('getDepartments err', err)
      })
  }

  const getDesignations = setupFor => {
    apicaller('get', `${BASEURL}/designation/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setDesignations(res.data)
          setPaginatedDesignations(res.data)
          setAllDesignations(res.data)
          // Pre Populating fields
          if (setupFor.setupBy == 'designation') {
            setupFor['noticePeriodArray'].forEach(element => {
              let index = res.data.findIndex(
                o => o.id == element.noticePeriodFor
              )
              if(index !== -1) {
                res.data[index]['priority'] = element.priority
                res.data[index]['noticePeriod'] = element.noticePeriod
                res.data[index]['unit'] = element.unit
              }
            })

            setDataArray(res.data)
            setPaginatedArray(res.data)
            setAllData(res.data)
          }
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getLocations = setupFor => {
    apicaller('get', `${BASEURL}/location`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setLocations(res.data)
          setPaginatedLocations(res.data)
          setAllLocations(res.data)
          if (setupFor.setupBy == 'location') {
            setupFor['noticePeriodArray'].forEach(element => {
              let index = res.data.findIndex(
                o => o.locationId
                == element.noticePeriodFor
              )
              if(index !== -1) {
                res.data[index]['priority'] = element.priority
                res.data[index]['noticePeriod'] = element.noticePeriod
                res.data[index]['unit'] = element.unit
              }
            })

            setDataArray(res.data)
            setPaginatedArray(res.data)
            setAllData(res.data)
          }
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getRoles = () => {
    apicaller('get', `${BASEURL}/role`)
      .then(res => {
        if (res.status === 200) {
          setallRoles(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get department err', err)
      })
  }

  const getReasons = data => {
    apicaller('get', `${BASEURL}/reason/fetchReasonByAction/SEP`).then(res => {
      if (res.status === 200) {
        setReasonArr(res.data)

        if (data) {
          res.data.find(opt => {
            data.miscellineous.resignationReasons.forEach(element => {
              if (opt.reasonCode == element.code) resignationReasons.push(opt)
              setResignationReasons(resignationReasons)
            })
          })
        }
      }
    })
  }

  const criteriaApprovalsData = [
    {
      criteria: '',
      level: '',
      approver: '',
      approverRoleUUID: ''
    },
    {
      criteria: '',
      level: '',
      approver: '',
      approverRoleUUID: ''
    }
  ]

  const criteriaExceptionsData = [
    {
      criteria: '',
      value: '',
      priority: '',
      noticePeriod: '',
      unit: ''
    },
    {
      criteria: '',
      value: '',
      priority: '',
      noticePeriod: '',
      unit: ''
    }
  ]

  const [approvalPath, setCriteriaApprovals] = useState(criteriaApprovalsData)

  const [exceptionArray, setCriteriaExceptions] = useState(
    criteriaExceptionsData
  )

  const [noticePeriodArray, setNoticePeriodArray] = useState([])

  const [anchorEl2, setAnchorEl2] = useState(null)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [sort, setSort] = useState('ASC')
  const [page, setPage] = useState(1)
  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)
  const [dataArray, setDataArray] = useState([])
  const [paginatedArrray, setPaginatedArray] = useState([])
  const [allData, setAllData] = useState([])

  const handleClick2 = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = event => {
    let results = [];
    if (setupBy == 'jobStatus' || setupBy == 'jobType') {
      results = allData.filter(obj =>
      obj?.name?.toUpperCase().includes(event.target.value?.toUpperCase()))
    } else if(setupBy == 'location') {
      results = allData.filter(
      obj =>
      obj?.locationId?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
      obj?.locationName?.toUpperCase().includes(event.target.value?.toUpperCase()) )
    } else {
      results = allData.filter(
      obj =>
      obj?.name?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
      obj?.id?.toUpperCase().includes(event.target.value?.toUpperCase()) )
    }
    if (results.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }
    setDataArray(results)
    setPaginatedArray(results)
  }

  const handleSort = sortOrder => {
    if (setupBy == 'location') {
      let sortedData = JSON.parse(JSON.stringify(paginatedArrray))
      if (sortOrder == 'ASC') {
        sortedData = sortedData.sort((data1, data2) =>
          data1.locationName > data2.locationName
            ? 1
            : data2.locationName > data1.locationName
            ? -1
            : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      } else {
        sortedData = sortedData.sort((data2, data1) =>
          data1.locationName > data2.locationName
            ? 1
            : data2.locationName > data1.locationName
            ? -1
            : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      }
    } else {
      let sortedData = JSON.parse(JSON.stringify(paginatedArrray))
      if (sortOrder == 'ASC') {
        sortedData = sortedData.sort((data1, data2) =>
          data1.name > data2.name ? 1 : data2.name > data1.name ? -1 : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      } else {
        sortedData = sortedData.sort((data2, data1) =>
          data1.name > data2.name ? 1 : data2.name > data1.name ? -1 : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      }
    }
  }

  const handleChange = (event, value) => {
    // console.log(value);
    setPage(value)
  }

  const noticePeriodBy = [
    { label: 'Department', value: 'department' },
    { label: 'Location', value: 'location' },
    { label: 'Designation', value: 'designation' },
    { label: 'Job Type', value: 'jobType' },
    { label: 'Job Status', value: 'jobStatus' }
  ]

  const criteriaArray = [
    { value: 'Employee’s regular exit request' },
    { value: 'Employee’s early exit request' },
    { value: 'Manager’s Proxy regular exit request' },
    { value: 'Manager’s Proxy early exit request' },
    { value: 'Admin’s Proxy regular exit request' },
    { value: 'Admin’s Proxy early exit request' },
    { value: 'All Criterias' }
  ]

  const [levelOfApproval, setLevelOfApproval] = useState([
    { label: '1st Level', value: 1, disabled: false },
    { label: '2nd Level', value: 2, disabled: false  },
    { label: '3rd Level', value: 3, disabled: false  },
    { label: '4th Level', value: 4, disabled: false  },
    { label: '5th Level', value: 5, disabled: false  }
  ])

  const approverArray = [
    { value: 'Reporting Manager' },
    { value: 'L2 Manager' },
    { value: 'L3 Manager' },
    { value: 'Role' },
    { value: 'Admin' }
  ]

  const priorities = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 }
  ]

  const handleAddApprovals = () => {
    setCriteriaApprovals([
      ...approvalPath,
      {
        criteria: '',
        level: '',
        approver: '',
        approverRoleUUID: ''
      }
    ])
  }

  const handleRemoveApprovals = i => {
    if(approvalPath.length !== 1) {
      const list = [...approvalPath]
      list.splice(i, 1)
      setCriteriaApprovals(list)
    }
  }

  const handleAddExceptions = () => {
    setCriteriaExceptions([
      ...exceptionArray,
      {
        criteria: '',
        value: '',
        priority: '',
        noticePeriod: '',
        unit: ''
      }
    ])
  }

  const handleCriteriaApprovalData = index => e => {

    if(e.target.name == 'level') {

      let levelIndex = levelOfApproval.findIndex(
        level =>
          level.value ===
          e.target.value)
          levelOfApproval[levelIndex]['disabled'] = true;

          setLevelOfApproval(levelOfApproval)

    }

    const newArray = approvalPath.map((item, i) => {
      if (index === i) {
        return { ...item, [e.target.name]: e.target.value }
      } else {
        return item
      }
    })
    setCriteriaApprovals(newArray)
  }

  const handleRemoveExceptions = i => {
    if(exceptionArray.length !== 1) {
      const list = [...exceptionArray]
      list.splice(i, 1)
      setCriteriaExceptions(list)
    }
  }

  const handleExceptionData = index => e => {
    const newArray = exceptionArray.map((item, i) => {
      if (index === i) {
        return { ...item, [e.target.name]: e.target.value }
      } else {
        return item
      }
    })
    setCriteriaExceptions(newArray)
  }

  const setValuesForSelectedCriteria = (value, param, idx) => {
    const newArray = exceptionArray.map((item, i) => {
      if (idx === i) {
        return { ...item, value: value[param] }
      } else {
        return item
      }
    })
    setCriteriaExceptions(newArray)
  }

  const jobTypes = [
    {
      name: 'Consultant'
    },
    {
      name: 'Contractor'
    },
    {
      name: 'Employee'
    },
    {
      name: 'Intern'
    },
    {
      name: 'Retainer'
    }
  ]

  const jobStatusList = [
    {
      name: 'Confirmed'
    },
    {
      name: 'Contract'
    },
    {
      name: 'Probation'
    },
    {
      name: 'Training'
    }
  ]

  const unitArray = [{ value: 'Days' }, { value: 'Weeks' }, { value: 'Months' }]

  const exceptionsValueArray = [
    { label: 'Department', value: 'department' },
    { label: 'Location', value: 'location' },
    { label: 'Designation', value: 'designation' },
    { label: 'Job Type', value: 'jobType' },
    { label: 'Job Status', value: 'jobStatus' },
    { label: 'Employee ID', value: 'id' }
  ]

  const [autoApproveByManager, setAutoApproveByManager] = useState(false)
  const [autoApproveByAdmin, setAutoApproveByAdmin] = useState(false)
  const [allowEarlyExit, setAllowEarlyExit] = useState(false)
  const [allowEmployeeResignationDate, setAllowEmployeeResignationDate] =
    useState(false)
  const [resignationReasons, setResignationReasons] = useState([])

  const [hasExceptions, setHasExceptions] = useState(false)

  const [setupBy, setSetupBy] = useState('')

  const showDataForNoticePeriod = event => {
    if (event.target.name == 'setupBy') {
      setNoticePeriodArray([])
      setPaginatedArray([])
      setDataArray([])
      setSetupBy(event.target.value)
      if (event.target.value == 'department') {
        setDataArray(DepartmentsArray)
        setPaginatedArray(paginatedDepartments)
        setAllData(allDepartments)
      } else if (event.target.value == 'designation') {
        setDataArray(DesignationsArray)
        setPaginatedArray(paginatedDesignations)
        setAllData(allDesignations)
      } else if (event.target.value == 'location') {
        setDataArray(LocationsArray)
        setPaginatedArray(paginatedLocations)
        setAllData(allLocations)
      } else if (event.target.value == 'jobType') {
        setDataArray(jobTypes)
        setPaginatedArray(jobTypes)
        setAllData(jobTypes)
      } else if (event.target.value == 'jobStatus') {
        setDataArray(jobStatusList)
        setPaginatedArray(jobStatusList)
        setAllData(jobStatusList)
      }
    }
  }

  const handleDataForNoticePeriodArray = item => e => {
    console.log(item)

    let name
    if (setupBy == 'jobStatus' || setupBy == 'jobType') {
      name = 'name'
    } else if(setupBy == 'location') {
      name = 'locationId'
    } else {
      name = 'id'
    }

    let index = noticePeriodArray.findIndex(
      o => o.noticePeriodFor == item[name]
    )
    if (index > -1) {
      const newArray = noticePeriodArray.map((item, i) => {
        if (i == index) {
          noticePeriodArray[i][e.target.name] = e.target.value
        }
      })
    } else {
      let newArray = {
        noticePeriodFor: item[name],
        [e.target.name]: e.target.value
      }

      noticePeriodArray.push(newArray)
    }

    item[e.target.name] = e.target.value

    const result = paginatedArrray.map((items, i) => {
      return { ...items, items }
    })
    setPaginatedArray(result)

    setNoticePeriodArray(noticePeriodArray)

  }

  const areAllValuesEmpty = arrayOfObjects => {
    for (let i = 0; i < arrayOfObjects.length; i++) {
      const obj = arrayOfObjects[i]
      const values = Object.values(obj)
      const isEmpty = values.every(
        value => value === null || value === undefined || value === ''
      )
      if (!isEmpty) {
        return false
      }
    }
    return true
  }

  const save = e => {
    e.preventDefault()
    //to do service call
    setIsSubmitted(true)

    if (
      resignationReasons.length == 0 ||
      setupBy == '' ||
      areAllValuesEmpty(approvalPath)
    ) {
      setState({
        open: true,
        message: 'Mandatory fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }

    if(noticePeriodArray.length !== paginatedArrray.length) {
      setState({
        open: true,
        message: 'Mandatory fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }

    // Chheck if any value is empty
    let ifValid = true
    approvalPath.some(objt => {
      for (var key in objt) {
        // If role is not selected, no need to check for approver uuid
        if (key == 'approver' && objt['approver'] != 'Role') {
          if (key != 'approverRoleUUID') {
            if (objt[key] == null || objt[key] == '') {
              setState({
                open: true,
                message: 'Mandatory fields are required',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
              ifValid = false
            }
          }
        } else if (key == 'approverRoleUUID' && objt['approver'] == 'Role') {
          // If role is selected, need to check for approver uuid
          if (objt[key] == null || objt[key] == '') {
            setState({
              open: true,
              message: 'Mandatory fields are required',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            ifValid = false
          }
        } else {
          if (key != 'approverRoleUUID')
            if (objt[key] == null || objt[key] == '') {
              setState({
                open: true,
                message: 'Mandatory fields are required',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
              ifValid = false
            }
        }
      }
    })

    if (!ifValid) {
      return
    }

    if (setupBy && areAllValuesEmpty(noticePeriodArray)) {
      let msg = 'Please select atleast one ' + setupBy
      setState({
        open: true,
        message: msg,
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      ifValid = false
    }

    if (!ifValid) {
      return
    }

    // Check if any value is empty
    for (let i = 0; i < noticePeriodArray.length; i++) {
      const objt = noticePeriodArray[i]
      if (Object.keys(objt).length != 4) {
        setState({
          open: true,
          message: 'Mandatory fields are required',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
        ifValid = false
      } else {
        let values = Object.values(objt)
        let isEmpty = values.some(
          value => value === null || value === undefined || value === ''
        )
        if(isEmpty) {
          setState({
            open: true,
            message: 'Mandatory fields are required',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
          ifValid = false
        }
      }
    }

    if (!ifValid) {
      return
    }

    if (hasExceptions && areAllValuesEmpty(exceptionArray)) {
      let msg = 'Please select atleast one exception criteria'
      setState({
        open: true,
        message: msg,
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      ifValid = false
    }

    if (!ifValid) {
      return
    }

    // Chheck if any value is empty
    if(hasExceptions) {
      exceptionArray.some(objt => {
        Object.values(objt).some(value => {
          if (value === '') {
            let msg = 'Mandatory fields are required'
            setState({
              open: true,
              message: msg,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            ifValid = false
          }
        })
      })
    }

    if (!ifValid) {
      return
    }

    // Code for removing blank rows from array
    // for (let i = 0; i < approvalPath.length; ++i) {
    //   Object.values(approvalPath[i]).every(value => {
    //     if (value === null || value === '') {
    //       approvalPath.splice(i, 1)
    //     }
    //   })
    // }

    // for (let i = 0; i < exceptionArray.length; ++i) {
    //   Object.values(exceptionArray[i]).every(value => {
    //     if (value === null || value === '') {
    //       exceptionArray.splice(i, 1)
    //     }
    //   })
    // }

    if(!hasExceptions) {
      setCriteriaExceptions([])
    }

    let resObj = []
    resignationReasons.forEach(element => {
      resObj.push({ code: element.reasonCode, name: element.reasonName })
    })

    let obj = {
      miscellineous: {
        autoApproveByManager: autoApproveByManager,
        autoApproveByAdmin: autoApproveByAdmin,
        allowEarlyExit: allowEarlyExit,
        allowEmployeeResignationDate: allowEmployeeResignationDate,
        resignationReasons: resObj
      },
      approvalPath,
      noticePeriodSetup: {
        setupBy: setupBy,
        noticePeriodArray: noticePeriodArray,
        hasExceptions: hasExceptions,
        exceptionArray
      }
    }

    console.log(obj)

    setBlocking(true)

    let query
    let msg = ''
    if (saveButtonLabel.toLocaleLowerCase() == 'update') {
      obj['uuid'] = docUUID
      query = apicaller('put', `${BASEURL}/separationControl/update`, obj)
      msg = 'Updated Successfully'
    } else {
      query = apicaller('post', `${BASEURL}/separationControl/save`, obj)
      msg = 'Added Successfully'
    }

    query
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setState({
            open: true,
            message: msg,
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })

          history.push('/dashboard')
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
          console.log('create id err', err)
        }
        console.log('create id err', err)
      })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const getObjByValue = (arr, value, matchWith) => {
    if (arr.length > 0) {
      return value ? arr.find(x => x[matchWith] == value) : {}
    }
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
              <div className='card-header--title'>
                <p>
                  <b>Miscellaneous Setup</b>
                </p>
              </div>

              <Card
                style={{
                  padding: '25px',
                  border: '1px solid #c4c4c4'
                }}>
                <CardContent className='p-0'>
                  <div>
                    <Switch
                      name='customUserId'
                      color='primary'
                      className='switch-small'
                      value={autoApproveByManager}
                      checked={autoApproveByManager}
                      onChange={event => {
                        setAutoApproveByManager(event.target.checked)
                      }}
                    />
                    &nbsp; &nbsp;
                    <label style={{ marginTop: '15px' }} className='mb-2'>
                      Auto-Approve for Manager proxy request
                    </label>{' '}
                    <br></br>
                    <Switch
                      name='customUserId'
                      color='primary'
                      className='switch-small'
                      value={autoApproveByAdmin}
                      checked={autoApproveByAdmin}
                      onChange={event => {
                        setAutoApproveByAdmin(event.target.checked)
                      }}
                    />
                    &nbsp; &nbsp;
                    <label style={{ marginTop: '15px' }} className='mb-2'>
                      Auto-Approve for Admin proxy request
                    </label>
                    <br></br>
                    <Switch
                      name='customUserId'
                      color='primary'
                      className='switch-small'
                      value={allowEarlyExit}
                      checked={allowEarlyExit}
                      onChange={event => {
                        setAllowEarlyExit(event.target.checked)
                      }}
                    />
                    &nbsp; &nbsp;
                    <label style={{ marginTop: '15px' }} className='mb-2'>
                      Allow employee to initiate early exit
                    </label>
                    <br></br>
                    {!allowEarlyExit ? (
                      ''
                    ) : (
                      <>
                        <Switch
                          name='customUserId'
                          color='primary'
                          className='switch-small'
                          value={allowEmployeeResignationDate}
                          checked={allowEmployeeResignationDate}
                          onChange={event => {
                            setAllowEmployeeResignationDate(
                              event.target.checked
                            )
                          }}
                        />
                        <>&nbsp; &nbsp;</>
                        <label style={{ marginTop: '15px' }} className='mb-2'>
                          Allow to change resignation date
                        </label>
                      </>
                    )}
                  </div>

                  <Grid item md={6} className='mt-4'>
                    <label className='font-weight-normal mb-2'>
                      Reasons for Resignations
                    </label>
                    <FormControl variant='outlined' fullWidth size='small'>
                      <Autocomplete
                        id='combo-box-demo'
                        multiple
                        options={allReasons}
                        value={resignationReasons}
                        getOptionLabel={option => option.reasonName}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Select Reasons'
                            variant='outlined'
                            fullWidth
                            size='small'
                            error={
                              isSubmitted && resignationReasons.length == 0
                            }
                            helperText={
                              isSubmitted && resignationReasons.length == 0
                                ? 'Reasons are Required'
                                : ''
                            }
                          />
                        )}
                        onChange={(event, value) => {
                          setResignationReasons(value)
                        }}
                      />
                    </FormControl>
                  </Grid>
                </CardContent>
              </Card>

              <div className='card-header--title mt-4'>
                <p>
                  <b>Approval Path</b>
                </p>
              </div>
              <Card
                style={{
                  padding: '25px',
                  border: '1px solid #c4c4c4'
                }}>
                <CardContent className='p-0'>
                  <div className='table-responsive-md'>
                    <Table className='table table-hover table-striped text-nowrap mb-0'>
                      <thead className='thead-light'>
                        <tr>
                          <th style={{ width: '20%' }}>
                            Criteria for Approval Path
                          </th>
                          <th style={{ width: '20%' }}>Level of Approver</th>
                          <th style={{ width: '20%' }}>Approver</th>
                          <th style={{ width: '20%' }}>Add</th>
                          <th style={{ width: '20%' }}>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvalPath.map((item, idx) => (
                          <tr>
                            <td>
                              <div>
                                <TextField
                                  variant='outlined'
                                  fullWidth
                                  id='outlined-criteria'
                                  select
                                  label='Select'
                                  size='small'
                                  name='criteria'
                                  value={item?.criteria}
                                  onChange={handleCriteriaApprovalData(idx)}
                                  error={
                                    isSubmitted &&
                                    (item?.criteria ? false : true)
                                  }>
                                  {criteriaArray.map(option => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}>
                                      {option.value}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </div>
                            </td>
                            <td>
                              <div>
                                <TextField
                                  disabled={item.criteria == 'All Criterias' && item?.disabled ? true : false}
                                  variant='outlined'
                                  fullWidth
                                  id='outlined-level'
                                  select
                                  label='Select'
                                  size='small'
                                  name='level'
                                  value={item?.level}
                                  onChange={handleCriteriaApprovalData(idx)}
                                  error={
                                    isSubmitted && (item?.level ? false : true)
                                  }>
                                  {levelOfApproval.map(option => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                      disabled={item.criteria == 'All Criterias' && option?.disabled ? true : false}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </div>
                            </td>
                            <td>
                              <div>
                                <TextField
                                  variant='outlined'
                                  fullWidth
                                  id='outlined-approver'
                                  select
                                  label='Select'
                                  size='small'
                                  name='approver'
                                  value={item?.approver}
                                  onChange={handleCriteriaApprovalData(idx)}
                                  error={
                                    isSubmitted &&
                                    (item?.approver ? false : true)
                                  }>
                                  {approverArray.map(option => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                      disabled={item.level !== 5 && option.value == 'Admin' ? true : false}>
                                      {option.value}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </div>

                              {item?.approver == 'Role' ? (
                                <>
                                  {' '}
                                  <br></br>
                                  <div>
                                    <TextField
                                      variant='outlined'
                                      fullWidth
                                      id='outlined-approverRoleUUID'
                                      select
                                      label='Select'
                                      size='small'
                                      defaultValue={allRoles.filter(
                                        option =>
                                          option.uuid === item?.approverRoleUUID
                                      )}
                                      value={item?.approverRoleUUID}
                                      name='approverRoleUUID'
                                      onChange={handleCriteriaApprovalData(idx)}
                                      error={
                                        isSubmitted &&
                                        item?.approver == 'Role' &&
                                        (item?.approverRoleUUID ? false : true)
                                      }>
                                      {allRoles.map(option => (
                                        <MenuItem
                                          key={option.name}
                                          value={option.uuid}>
                                          {option.name}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </div>
                                </>
                              ) : (
                                ''
                              )}
                            </td>
                            <td>
                              <Button
                                onClick={handleAddApprovals}
                                className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                <FontAwesomeIcon
                                  icon={['fas', 'plus']}
                                  className='font-size-sm'
                                />
                              </Button>
                            </td>
                            <td>
                              <Button
                                disabled={item?.preferred}
                                onClick={() => handleRemoveApprovals(idx)}
                                className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                <FontAwesomeIcon
                                  icon={['fas', 'times']}
                                  className='font-size-sm'
                                />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className='divider' />
                  <div className='divider' />
                </CardContent>
              </Card>

              <div className='card-header--title mt-4'>
                <p>
                  <b>Notice Period Setup</b>
                </p>
              </div>
              <Card
                style={{
                  padding: '25px',
                  border: '1px solid #c4c4c4'
                }}>
                <CardContent className='p-0'>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Setup Notice Period By</label>
                      <TextField
                        variant='outlined'
                        fullWidth
                        id='outlined-type'
                        select
                        label='Select'
                        size='small'
                        name='setupBy'
                        value={setupBy || ''}
                        onChange={event => {
                          showDataForNoticePeriod(event)
                        }}
                        error={isSubmitted && !setupBy}
                        helperText={
                          isSubmitted &&
                          (setupBy ? '' : 'Notice Period By is Required')
                        }>
                        {noticePeriodBy.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>

                  {setupBy !== '' ? (
                    <div>
                      <div className='d-flex justify-content-between p-4 py-3'>
                        <div
                          className={clsx(
                            'search-wrapper search-wrapper--alternate search-wrapper--grow',
                            { 'is-active': searchOpen }
                          )}>
                          <TextField
                            variant='outlined'
                            size='small'
                            id='input-with-icon-textfield22-2'
                            placeholder='Search Name, Id'
                            onFocus={openSearch}
                            onBlur={closeSearch}
                            onChange={handleSearch}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <SearchTwoToneIcon />
                                </InputAdornment>
                              )
                            }}
                          />
                        </div>
                        <div className='d-flex align-items-center'>
                          <div>
                            <Button
                              onClick={handleClick2}
                              className='btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill'>
                              <SettingsTwoToneIcon className='w-50' />
                            </Button>
                            <Menu
                              anchorEl={anchorEl2}
                              keepMounted
                              getContentAnchorEl={null}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                              }}
                              open={Boolean(anchorEl2)}
                              classes={{ list: 'p-0' }}
                              onClose={handleClose2}>
                              <div className='dropdown-menu-lg overflow-hidden p-0'>
                                <div className='font-weight-bold px-4 pt-3'>
                                  Results
                                </div>
                                <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                                  <ListItem
                                    button
                                    href='#/'
                                    value={recordsPerPage}
                                    onClick={e => {
                                      setRecordsPerPage(10)
                                      setPage(1)
                                      handleClose2()

                                      {
                                        setupBy == 'department'
                                          ? setPaginatedDepartments(
                                              allDepartments
                                            )
                                          : setPaginatedDepartments([])
                                      }
                                      {
                                        setupBy == 'designation'
                                          ? setPaginatedDesignations(
                                              allDesignations
                                            )
                                          : setPaginatedDesignations([])
                                      }
                                      {
                                        setupBy == 'location'
                                          ? setPaginatedLocations(allLocations)
                                          : setPaginatedLocations([])
                                      }
                                    }}>
                                    <div className='nav-link-icon mr-2'>
                                      <RadioButtonUncheckedTwoToneIcon />
                                    </div>
                                    <span className='font-size-md'>
                                      <b>10</b> results per page
                                    </span>
                                  </ListItem>
                                  <ListItem
                                    button
                                    href='#/'
                                    value={recordsPerPage}
                                    onClick={e => {
                                      setRecordsPerPage(20)
                                      setPage(1)
                                      handleClose2()
                                      {
                                        setupBy == 'department'
                                          ? setPaginatedDepartments(
                                              allDepartments
                                            )
                                          : setPaginatedDepartments([])
                                      }
                                      {
                                        setupBy == 'designation'
                                          ? setPaginatedDesignations(
                                              allDesignations
                                            )
                                          : setPaginatedDesignations([])
                                      }
                                      {
                                        setupBy == 'location'
                                          ? setPaginatedLocations(allLocations)
                                          : setPaginatedLocations([])
                                      }
                                    }}>
                                    <div className='nav-link-icon mr-2'>
                                      <RadioButtonUncheckedTwoToneIcon />
                                    </div>
                                    <span className='font-size-md'>
                                      <b>20</b> results per page
                                    </span>
                                  </ListItem>
                                  <ListItem
                                    button
                                    href='#/'
                                    value={recordsPerPage}
                                    onClick={e => {
                                      setRecordsPerPage(30)
                                      setPage(1)
                                      handleClose2()
                                      {
                                        setupBy == 'department'
                                          ? setPaginatedDepartments(
                                              allDepartments
                                            )
                                          : setPaginatedDepartments([])
                                      }
                                      {
                                        setupBy == 'designation'
                                          ? setPaginatedDesignations(
                                              allDesignations
                                            )
                                          : setPaginatedDesignations([])
                                      }
                                      {
                                        setupBy == 'location'
                                          ? setPaginatedLocations(allLocations)
                                          : setPaginatedLocations([])
                                      }
                                    }}>
                                    <div className='nav-link-icon mr-2'>
                                      <RadioButtonUncheckedTwoToneIcon />
                                    </div>
                                    <span className='font-size-md'>
                                      <b>30</b> results per page
                                    </span>
                                  </ListItem>
                                </List>
                                <div className='divider' />
                                <div className='font-weight-bold px-4 pt-4'>
                                  Order
                                </div>
                                <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                                  <ListItem
                                    button
                                    href='#/'
                                    onClick={e => {
                                      handleSort('ASC')
                                      handleClose2()
                                    }}>
                                    <div className='mr-2'>
                                      <ArrowUpwardTwoToneIcon />
                                    </div>
                                    <span className='font-size-md'>
                                      Ascending
                                    </span>
                                  </ListItem>
                                  <ListItem
                                    button
                                    href='#/'
                                    onClick={e => {
                                      handleSort('DES')
                                      handleClose2()
                                    }}>
                                    <div className='mr-2'>
                                      <ArrowDownwardTwoToneIcon />
                                    </div>
                                    <span className='font-size-md'>
                                      Descending
                                    </span>
                                  </ListItem>
                                </List>
                              </div>
                            </Menu>
                          </div>
                        </div>
                      </div>
                      <div className='divider' />
                      <div className='p-4'>
                        <div className='table-responsive-md'>
                          <Table className='table table-hover text-nowrap mb-0'>
                            <thead className='thead-light'>
                              <tr>
                                {setupBy == 'department' ||
                                setupBy == 'location' ||
                                setupBy == 'designation' ? (
                                  <th>
                                    {setupBy == 'department'
                                      ? 'Department ID'
                                      : setupBy == 'designation'
                                      ? 'Designation ID'
                                      : setupBy == 'location'
                                      ? 'Location ID'
                                      : ''}
                                  </th>
                                ) : (
                                  ''
                                )}
                                <th>
                                  {setupBy == 'department'
                                    ? 'Department Name'
                                    : setupBy == 'designation'
                                    ? 'Designation Name'
                                    : setupBy == 'location'
                                    ? 'Location Name'
                                    : setupBy == 'jobType' ||
                                      setupBy == 'jobStatus'
                                    ? 'Name'
                                    : 'Name'}
                                </th>
                                <th>Priority</th>
                                <th style={{ width: '10%' }}>Notice Period</th>
                                <th>Unit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedArrray
                                .slice(
                                  page * recordsPerPage > dataArray.length
                                    ? page === 0
                                      ? 0
                                      : page * recordsPerPage - recordsPerPage
                                    : page * recordsPerPage - recordsPerPage,
                                  page * recordsPerPage <= dataArray.length
                                    ? page * recordsPerPage
                                    : dataArray.length
                                )
                                .map((item, idx) => (
                                  <tr>
                                    {setupBy == 'department' ||
                                    setupBy == 'location' ||
                                    setupBy == 'designation' ? (
                                      <td>
                                        {setupBy == 'location' ? (
                                          <div>{item.locationId}</div>
                                        ) : (
                                          <div>{item.id}</div>
                                        )}
                                      </td>
                                    ) : (
                                      ''
                                    )}
                                    <td>
                                      {setupBy == 'location' ? (
                                        <div>{item.locationName}</div>
                                      ) : (
                                        <div>{item.name}</div>
                                      )}
                                    </td>

                                    <td>
                                      <div>
                                        <TextField
                                          variant='outlined'
                                          fullWidth
                                          id='outlined-priority'
                                          select
                                          label='Select'
                                          size='small'
                                          name='priority'
                                          value={item.priority}
                                          onChange={handleDataForNoticePeriodArray(
                                            item
                                          )}
                                          error={
                                            isSubmitted &&
                                            !item.priority
                                              ? true
                                              : false
                                          }>
                                          {priorities.map(option => (
                                            <MenuItem
                                              key={option.value}
                                              value={option.value}>
                                              {option.value}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <TextField
                                          variant='outlined'
                                          fullWidth
                                          id='outlined-noticePeriod'
                                          size='small'
                                          name='noticePeriod'
                                          value={item.noticePeriod || ''}
                                          onChange={handleDataForNoticePeriodArray(
                                            item
                                          )}
                                          error={
                                            isSubmitted &&
                                            !item.noticePeriod
                                              ? true
                                              : false
                                          }></TextField>
                                      </div>
                                    </td>

                                    <td>
                                      <div>
                                        <TextField
                                          variant='outlined'
                                          fullWidth
                                          id='outlined-unit'
                                          select
                                          label='Select'
                                          size='small'
                                          name='unit'
                                          value={item.unit}
                                          onChange={handleDataForNoticePeriodArray(
                                            item
                                          )}
                                          error={
                                            isSubmitted &&
                                            !item.unit
                                              ? true
                                              : false
                                          }>
                                          {unitArray.map(option => (
                                            <MenuItem
                                              key={option.value}
                                              value={option.value}>
                                              {option.value}
                                            </MenuItem>
                                          ))}
                                        </TextField>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>

                        <div className='d-flex  justify-content-center pt-3 mb-5'>
                          <Pagination
                            className='pagination-primary'
                            count={Math.ceil(dataArray.length / recordsPerPage)}
                            variant='outlined'
                            shape='rounded'
                            selected={true}
                            page={page}
                            onChange={handleChange}
                            showFirstButton
                            showLastButton
                          />
                        </div>
                      </div>
                      <Switch
                        name='hasExceptions'
                        color='primary'
                        className='switch-small'
                        value={hasExceptions}
                        checked={hasExceptions}
                        onChange={event => {
                          setHasExceptions(event.target.checked);
                          if(exceptionArray.length == 0) {
                            setCriteriaExceptions(
                              criteriaExceptionsData
                            )
                          }
                          
                        }}
                      />
                      &nbsp; &nbsp;
                      <label style={{ marginTop: '15px' }} className='mb-2'>
                        There are Exceptions to the above rule
                      </label>
                      <br></br>
                      <label style={{ marginTop: '15px' }} className='mb-2'>
                        {hasExceptions ? 'The notice period is different for employees with' : ''}
                      </label>
                      <br></br>
                      {hasExceptions ? (
                        <div className='table-responsive-md mt-4'>
                          <Table className='table table-hover table-striped text-nowrap mb-0'>
                            <thead className='thead-light'>
                              <tr>
                                <th>Criteria</th>

                                <th>Value</th>
                                <th>Priority</th>
                                <th style={{ width: '5%' }}>Notice Period</th>
                                <th>Unit</th>
                                <th>Add</th>
                                <th>Remove</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exceptionArray.map((item, idx) => (
                                <tr>
                                  <td>
                                    <div>
                                      <TextField
                                        variant='outlined'
                                        fullWidth
                                        id='outlined-criteria'
                                        select
                                        label='Select'
                                        size='small'
                                        name='criteria'
                                        value={item.criteria}
                                        onChange={handleExceptionData(idx)}
                                        error={
                                          isSubmitted && !item.criteria
                                            ? true
                                            : false
                                        }>
                                        {exceptionsValueArray.map(option => (
                                          <MenuItem
                                            key={option.value}
                                            value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  </td>

                                  <td>
                                    <div>
                                      {' '}
                                      {item.criteria == 'department' &&
                                      allDepartments.length > 0 ? (
                                        <Autocomplete
                                          id='combo-box-demo'
                                          select
                                          options={allDepartments}
                                          value={getObjByValue(
                                            allDepartments,
                                            item.value,
                                            'id'
                                          )}
                                          getOptionLabel={option => option.name}
                                          renderInput={params => (
                                            <TextField
                                              {...params}
                                              label='Select'
                                              variant='outlined'
                                              fullWidth
                                              size='small'
                                              name='value'
                                              value={getObjByValue(
                                                allDepartments,
                                                item.value,
                                                'id'
                                              )}
                                              error={
                                                isSubmitted && item.value == ''
                                                  ? true
                                                  : false
                                              }
                                            />
                                          )}
                                          onChange={(event, value) => {
                                            setValuesForSelectedCriteria(
                                              value,
                                              'id',
                                              idx
                                            )
                                          }}
                                          error={
                                            isSubmitted && !item.value
                                              ? true
                                              : false
                                          }
                                        />
                                      ) : (
                                        <>
                                          {item.criteria == 'designation' &&
                                          allDesignations.length > 0 ? (
                                            <Autocomplete
                                              id='combo-box-demo'
                                              select
                                              options={allDesignations}
                                              value={getObjByValue(
                                                allDesignations,
                                                item.value,
                                                'id'
                                              )}
                                              getOptionLabel={option =>
                                                option.name
                                              }
                                              renderInput={params => (
                                                <TextField
                                                  {...params}
                                                  label='Select'
                                                  variant='outlined'
                                                  fullWidth
                                                  size='small'
                                                  name='value'
                                                  value={getObjByValue(
                                                    allDesignations,
                                                    item.value,
                                                    'id'
                                                  )}
                                                />
                                              )}
                                              onChange={(event, value) => {
                                                setValuesForSelectedCriteria(
                                                  value,
                                                  'id',
                                                  idx
                                                )
                                              }}
                                            />
                                          ) : (
                                            <>
                                              {item.criteria == 'location' &&
                                              allLocations.length > 0 ? (
                                                <Autocomplete
                                                  id='combo-box-demo'
                                                  select
                                                  options={allLocations}
                                                  value={getObjByValue(
                                                    allLocations,
                                                    item.value,
                                                    'locationId'
                                                  )}
                                                  getOptionLabel={option =>
                                                    option.locationName
                                                  }
                                                  renderInput={params => (
                                                    <TextField
                                                      {...params}
                                                      label='Select'
                                                      variant='outlined'
                                                      fullWidth
                                                      size='small'
                                                      name='value'
                                                      value={getObjByValue(
                                                        allLocations,
                                                        item.value,
                                                        'locationId'
                                                      )}
                                                      error={
                                                        isSubmitted &&
                                                        item.value == ''
                                                          ? true
                                                          : false
                                                      }
                                                    />
                                                  )}
                                                  onChange={(event, value) => {
                                                    setValuesForSelectedCriteria(
                                                      value,
                                                      'locationId',
                                                      idx
                                                    )
                                                  }}
                                                />
                                              ) : (
                                                <>
                                                  {item.criteria == 'id' &&
                                                  allEmployees.length > 0 ? (
                                                    <Autocomplete
                                                      id='combo-box-demo'
                                                      select
                                                      options={allEmployees}
                                                      value={getObjByValue(
                                                        allEmployees,
                                                        item.value,
                                                        'employeeID'
                                                      )}
                                                      getOptionLabel={option =>
                                                        option.employeeName
                                                          ? option.employeeName
                                                          : option.employeeID
                                                          ? option.employeeID
                                                          : ''
                                                      }
                                                      renderInput={params => (
                                                        <TextField
                                                          {...params}
                                                          label='Select'
                                                          variant='outlined'
                                                          fullWidth
                                                          size='small'
                                                          name='value'
                                                          value={getObjByValue(
                                                            allEmployees,
                                                            item.value,
                                                            'employeeID'
                                                          )}
                                                          error={
                                                            isSubmitted &&
                                                            item.value == ''
                                                              ? true
                                                              : false
                                                          }
                                                        />
                                                      )}
                                                      onChange={(
                                                        event,
                                                        value
                                                      ) => {
                                                        setValuesForSelectedCriteria(
                                                          value,
                                                          'employeeID',
                                                          idx
                                                        )
                                                      }}
                                                    />
                                                  ) : (
                                                    <>
                                                      {item.criteria ==
                                                      'jobType' ? (
                                                        <Autocomplete
                                                          id='combo-box-demo'
                                                          select
                                                          options={jobTypes}
                                                          value={getObjByValue(
                                                            jobTypes,
                                                            item.value,
                                                            'name'
                                                          )}
                                                          getOptionLabel={option =>
                                                            option.name
                                                          }
                                                          renderInput={params => (
                                                            <TextField
                                                              {...params}
                                                              label='Select'
                                                              variant='outlined'
                                                              fullWidth
                                                              size='small'
                                                              name='value'
                                                              value={getObjByValue(
                                                                jobTypes,
                                                                item.value,
                                                                'name'
                                                              )}
                                                              error={
                                                                isSubmitted &&
                                                                !item.value
                                                                  ? true
                                                                  : false
                                                              }
                                                            />
                                                          )}
                                                          onChange={(
                                                            event,
                                                            value
                                                          ) => {
                                                            setValuesForSelectedCriteria(
                                                              value,
                                                              'name',
                                                              idx
                                                            )
                                                          }}
                                                        />
                                                      ) : (
                                                        <>
                                                          {item.criteria ==
                                                          'jobStatus' ? (
                                                            <Autocomplete
                                                              id='combo-box-demo'
                                                              select
                                                              options={
                                                                jobStatusList
                                                              }
                                                              value={getObjByValue(
                                                                jobStatusList,
                                                                item.value,
                                                                'name'
                                                              )}
                                                              getOptionLabel={option =>
                                                                option.name
                                                              }
                                                              renderInput={params => (
                                                                <TextField
                                                                  {...params}
                                                                  label='Select'
                                                                  variant='outlined'
                                                                  fullWidth
                                                                  size='small'
                                                                  name='value'
                                                                  value={getObjByValue(
                                                                    jobStatusList,
                                                                    item.value,
                                                                    'name'
                                                                  )}
                                                                  error={
                                                                    isSubmitted &&
                                                                    !item.value
                                                                      ? true
                                                                      : false
                                                                  }
                                                                />
                                                              )}
                                                              onChange={(
                                                                event,
                                                                value
                                                              ) => {
                                                                setValuesForSelectedCriteria(
                                                                  value,
                                                                  'name',
                                                                  idx
                                                                )
                                                              }}
                                                            />
                                                          ) : (
                                                            <TextField
                                                              id='outlined-company'
                                                              placeholder='Select'
                                                              variant='outlined'
                                                              fullWidth
                                                              size='small'
                                                              error={
                                                                isSubmitted &&
                                                                !item.value
                                                                  ? true
                                                                  : false
                                                              }
                                                            />
                                                          )}
                                                        </>
                                                      )}{' '}
                                                    </>
                                                  )}{' '}
                                                </>
                                              )}{' '}
                                            </>
                                          )}{' '}
                                        </>
                                      )}
                                    </div>
                                  </td>

                                  <td>
                                    <div>
                                      <TextField
                                        variant='outlined'
                                        fullWidth
                                        id='outlined-priority'
                                        select
                                        label='Select'
                                        size='small'
                                        name='priority'
                                        value={item.priority}
                                        onChange={handleExceptionData(idx)}
                                        error={
                                          isSubmitted && !item.priority
                                            ? true
                                            : false
                                        }>
                                        {priorities.map(option => (
                                          <MenuItem
                                            key={option.value}
                                            value={option.value}>
                                            {option.value}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  </td>

                                  <td>
                                    <div>
                                      <TextField
                                        variant='outlined'
                                        fullWidth
                                        id='outlined-noticePeriod'
                                        size='small'
                                        name='noticePeriod'
                                        value={item.noticePeriod}
                                        onChange={handleExceptionData(idx)}
                                        error={
                                          isSubmitted && !item.noticePeriod
                                            ? true
                                            : false
                                        }></TextField>
                                    </div>
                                  </td>

                                  <td>
                                    <div>
                                      <TextField
                                        variant='outlined'
                                        fullWidth
                                        id='outlined-unit'
                                        select
                                        label='Select'
                                        size='small'
                                        name='unit'
                                        value={item.unit}
                                        onChange={handleExceptionData(idx)}
                                        error={
                                          isSubmitted && !item.unit
                                            ? true
                                            : false
                                        }>
                                        {unitArray.map(option => (
                                          <MenuItem
                                            key={option.value}
                                            value={option.value}>
                                            {option.value}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </div>
                                  </td>

                                  <td>
                                    <Button
                                      onClick={handleAddExceptions}
                                      className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                      <FontAwesomeIcon
                                        icon={['fas', 'plus']}
                                        className='font-size-sm'
                                      />
                                    </Button>
                                  </td>
                                  <td>
                                    <Button
                                      disabled={item?.preferred}
                                      onClick={() =>
                                        handleRemoveExceptions(idx)
                                      }
                                      className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                      <FontAwesomeIcon
                                        icon={['fas', 'times']}
                                        className='font-size-sm'
                                      />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>

        <div className='float-right' style={{ marginRight: '2.5%' }}>
          <Button
            className='btn-primary mb-4 m-2'
            component={NavLink}
            to='./dashboard'>
            Cancel
          </Button>
          <Button className='btn-primary mb-4 m-2' onClick={e => save(e)}>
            {saveButtonLabel}
          </Button>
        </div>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
    </BlockUi>
  )
}

const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany,
  user: state.Auth.user
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ControlExit)
