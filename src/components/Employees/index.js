import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from 'react-redux'
import noResults from '../../assets/images/composed-bg/no_result.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Table,
  Grid,
  InputAdornment,
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select,
  TableContainer,
  Checkbox,
  Snackbar
} from '@material-ui/core'
import apicaller from 'helper/Apicaller'

import Pagination from '@material-ui/lab/Pagination'
import Autocomplete from '@material-ui/lab/Autocomplete'

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'

import { setSelectedEmployee } from '../../actions/index'

const Dashboardemployee = props => {
  const { setEmployee } = props
  const history = useHistory()

  const [anchorEl, setAnchorEl] = useState(null)
  const [formURL, setFormURL] = useState('/assignedPermissions')

  const [employeeDetail, setEmployeeDetails] = useState()
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setState({ ...state, open: false })
    setAnchorEl(null)
  }

  const [anchorEl2, setAnchorEl2] = useState(null)

  const handleClick2 = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)

  const [status, setStatus] = useState('0')

  const handleStatus = event => {
    setStatus(event.target.value)
  }
  const handleFilter = () => {
    let departments
    let designation
    let location
    let employmentType
    let employeeStatus

    if (filteredDepartments?.length > 0) {
      departments = filteredDepartments.map(a => a.id)
    }
    if (filteredDesignations?.length > 0) {
      designation = filteredDesignations.map(a => a.id)
    }
    if (filteredLocations?.length > 0) {
      location = filteredLocations.map(a => a.locationId)
    }
    if (filteredJobTypes?.length > 0) {
      employmentType = filteredJobTypes.map(a => a.value)
    }
    if (filteredJobStatus?.length > 0) {
      employeeStatus = filteredJobStatus.map(a => a.value)
    }

    let obj = {
      department: departments,
      designation: designation,
      location: location,
      employmentType: employmentType,
      jobStatus: employeeStatus
    }

    setBlocking(true)
    axios
      .post(`${BASEURL}/employee/filter`, obj)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          if (res.data.length > 0) {
            setEmployees(res.data)
            setPaginationEmployees(res.data)
          } else {
            setEmployees([])
            setPaginationEmployees([])
          }
          handleClose()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getEmployees err', err)
      })
  }

  const handleSort = sortOrder => {
    let sortedEmployees = JSON.parse(JSON.stringify(employees))
    if (sortOrder == 'ASC') {
      sortedEmployees = sortedEmployees.sort((loct1, loct2) =>
        loct1.employeeName > loct2.employeeName
          ? 1
          : loct2.employeeName > loct1.employeeName
            ? -1
            : 0
      )
      setEmployees(sortedEmployees)
      setPaginationEmployees(sortedEmployees)
    } else {
      sortedEmployees = sortedEmployees.sort((loct2, loct1) =>
        loct1.employeeName > loct2.employeeName
          ? 1
          : loct2.employeeName > loct1.employeeName
            ? -1
            : 0
      )
      setEmployees(sortedEmployees)
      setPaginationEmployees(sortedEmployees)
    }
  }
  const [employees, setEmployees] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [paginationEmployees, setPaginationEmployees] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [sort, setSort] = useState('ASC')
  const [page, setPage] = useState(1)
  const [allDepartments, setAllDepartments] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [allDesignations, setAllDesignations] = useState([])
  const [filteredDepartments, setfilteredDepartments] = useState([])
  const [filteredLocations, setfilteredLocations] = useState([])

  const [filteredDesignations, setfilteredDesignations] = useState([])

  const [filteredJobTypes, setfilteredJobTypes] = useState([])

  const [filteredJobStatus, setfilteredJobStatus] = useState([])
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

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

  const checkUserCredentialStatus = () => {
    console.log(checkUserCredentialStatus)
    const inputObj = {
      employeeIds: [selectedEmployee.uuid]
    }
    apicaller(
      'post',
      `${BASEURL}/employee/fetchEmployeesCredentialStatus`,
      inputObj
    )
      .then(res => {
        if (res.status === 200) {
          if (res.data[0].credentialStatus == 'To Be Created') {
            // /createUserCredentials
            history.push('/createUserCredentials')
          } else {
            setState({
              open: true,
              message: res.data[0].credentialStatus,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            // history.push('/employees')
          }
        }
      })
      .catch(err => {
        console.log('User Id is alredy created', err)
        setState({
          open: true,
          message: err.response.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  }

  useEffect(() => {
    getEmployees()
    getLocations()
    getDepartments()
    getDesignations()
  }, [])

  const getDepartments = () => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDepartments(res.data)
        }
      })
      .catch(err => {
        console.log('getDepartments err', err)
      })
  }

  const getDesignations = () => {
    apicaller('get', `${BASEURL}/designation/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDesignations(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getLocations = () => {
    apicaller('get', `${BASEURL}/location`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllLocations(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getEmployees = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          if (res.data.length > 0) {
            setEmployees(res.data)
            setAllEmployees(res.data)
            setPaginationEmployees(res.data)
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getEmployees err', err)
      })
  }
  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  const handleSearch = (event) => {
    const results = allEmployees.filter(
      obj =>
        obj?.employeeID?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.employeeName?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.location?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.designation?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.department?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.userId?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.jobType?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.jobStatus?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        obj?.dob?.toUpperCase().includes(event.target.value?.toUpperCase())
    )
    if (results.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
    setEmployees(results)
    setPaginationEmployees(results)
  };

  const getParsedDate = date => {
    if (date && date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }
  const [anchorEl3, setAnchorEl3] = useState(null)
  const [anchorEl4, setAnchorEl4] = useState(null)

  const openUserMenu = (event, selectedEmployee) => {
    setAnchorEl3(event.currentTarget)
    if (selectedEmployee) {
      setSelectedEmployee(selectedEmployee)
      setEmployee(selectedEmployee)
    }
  }

  const openUserMenu4 = (event, selectedEmployee) => {
    setAnchorEl4(event.currentTarget)
    if (selectedEmployee) {
      setSelectedEmployee(selectedEmployee)
      setEmployee(selectedEmployee)
    }
  }

  const [selectedEmployee, setSelectedEmployee] = useState()

  const handleClose3 = event => {
    setAnchorEl3(null)
  }
  const handleClose4 = event => {
    setAnchorEl4(null)
  }
  const [blocking, setBlocking] = useState(false)
  const [addedEmployees, setAddedEmployees] = useState([])
  const [checkAllEmployees, setCheckAllEmployees] = useState(false)
  const [ifMultiselect, setIfMultiselect] = useState(true)

  const addRemoveEmployees = (e, item, idx) => {
    let newArray = []
    let index = -1
    for (let i = 0; i < addedEmployees.length; i++) {
      if (addedEmployees[i] === item.uuid) {
        index = i
        break
      }
    }
    if (index === -1) {
      let uuid = item.uuid
      addedEmployees.push(uuid)
      setAddedEmployees(addedEmployees)

      const result = paginationEmployees.map((item, i) => {
        return { ...item, item }
      })
      setPaginationEmployees(result)
      setEmployees(result)
      if (addedEmployees.length == allEmployees.length) {
        setCheckAllEmployees(true)
      } else {
        setCheckAllEmployees(false)
      }
      if (addedEmployees.length == 1) {
        setIfMultiselect(false)
        setSelectedEmployee(item)
      } else {
        setIfMultiselect(true)
        setSelectedEmployee()
      }
    } else {
      addedEmployees.splice(index, 1)
      setAddedEmployees(addedEmployees)

      const result = paginationEmployees.map((item, i) => {
        return { ...item, item }
      })

      setPaginationEmployees(result)
      setEmployees(result)
      if (addedEmployees.length == allEmployees.length) {
        setCheckAllEmployees(true)
      } else {
        setCheckAllEmployees(false)
      }

      if (addedEmployees.length == 1) {
        setIfMultiselect(false)
        setSelectedEmployee(allEmployees.find(x => x.uuid == addedEmployees[0]))
      } else {
        setIfMultiselect(true)
        setSelectedEmployee()
      }
    }
  }

  const tableData = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100px'
  }

  const paddingTop = {
    paddingTop: '25px'
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <>
        <Card className='card-box shadow-none'>
          <div className='d-flex flex-column flex-md-row justify-content-between px-4 py-3'>
            <div
              className={clsx(
                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                { 'is-active': searchOpen }
              )}>
              <TextField
                variant='outlined'
                size='small'
                id='input-with-icon-textfield22-2'
                placeholder='Search employees...'
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
                  onClick={handleClick}
                  className='btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill'>
                  <FilterListTwoToneIcon className='w-50' />
                </Button>
                <Menu
                  anchorEl={anchorEl}
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
                  open={Boolean(anchorEl)}
                  classes={{ list: 'p-0' }}
                  onClose={handleClose}>
                  <div className='dropdown-menu-xxl overflow-hidden p-0'>
                    <div className='p-3'>
                      <Grid container spacing={6}>
                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            Departments
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={allDepartments}
                              value={filteredDepartments}
                              getOptionLabel={option => option.name}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Employee Department'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilteredDepartments(value)
                              }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            Locations
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={allLocations}
                              value={filteredLocations}
                              getOptionLabel={option => option.locationName}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Employee Locations'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilteredLocations(value)
                              }}
                            />{' '}
                          </FormControl>
                        </Grid>

                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            designations
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={allDesignations}
                              value={filteredDesignations}
                              getOptionLabel={option => option.name}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Employee Designations'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilteredDesignations(value)
                              }}
                            />{' '}
                          </FormControl>
                        </Grid>

                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            Job Type
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={jobTypes}
                              value={filteredJobTypes}
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Employee Job Type'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilteredJobTypes(value)
                              }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            Job Status
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={jobStatusList}
                              value={filteredJobStatus}
                              getOptionLabel={option => option.label}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Employee Job Status'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilteredJobStatus(value)
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>
                    <div className='divider' />
                    {/* <div className='p-3 text-center bg-secondary'>
                      <Button
                        className='btn-primary'
                        onClick={() => {
                          handleFilter()
                        }}
                        size='small'>
                        Filter results
                      </Button>
                    </div> */}
                    <div className="p-3 text-center bg-secondary">
                      <Button
                        style={{ margin: '0px 15px' }}
                        className="btn-primary"
                        onClick={() => {
                          handleFilter('');
                        }}
                        size="small">
                        Search
                      </Button>
                      <Button
                        style={{ margin: '0px 15px' }}
                        className="btn-secondary"
                        onClick={() => {
                          setfilteredDepartments([])
                          setfilteredDesignations([])
                          setfilteredJobStatus([])
                          setfilteredJobTypes([])
                          setfilteredLocations([])
                        }}
                        size="small">
                        Clear Filters
                      </Button>
                    </div>
                    <div className='divider' />
                    <div className='p-3'>
                      <Grid container spacing={6}>
                        <Grid item md={12}>
                          <List className='nav-neutral-danger flex-column p-0'>
                            <ListItem
                              button
                              className='d-flex rounded-sm justify-content-center'
                              href='#/'
                              onClick={e => {
                                getEmployees()
                                setfilteredDepartments([])
                                setfilteredDesignations([])
                                setfilteredJobStatus([])
                                setfilteredJobTypes([])
                                setfilteredLocations([])
                                handleClose()
                              }}>
                              <div className='mr-2'>
                                <DeleteTwoToneIcon />
                              </div>
                              <span>Cancel</span>
                            </ListItem>
                          </List>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Menu>
              </div>
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
                    <div className='font-weight-bold px-4 pt-3'>Results</div>
                    <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                      <ListItem
                        button
                        href='#/'
                        value={recordsPerPage}
                        onClick={e => {
                          setRecordsPerPage(10)
                          setPage(1)
                          setPaginationEmployees(employees)
                          handleClose2();
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
                          setPaginationEmployees(employees)
                          handleClose2();
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
                          setPaginationEmployees(employees)
                          handleClose2();
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
                    <div className='font-weight-bold px-4 pt-4'>Order(By Employee Name)</div>
                    <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                      <ListItem
                        button
                        href='#/'
                        onClick={e => {
                          handleSort('ASC');
                          handleClose2();
                        }}>
                        <div className='mr-2'>
                          <ArrowUpwardTwoToneIcon />
                        </div>
                        <span className='font-size-md'>Ascending</span>
                      </ListItem>
                      <ListItem
                        button
                        href='#/'
                        onClick={e => { handleSort('DES'); handleClose2(); }}>
                        <div className='mr-2'>
                          <ArrowDownwardTwoToneIcon />
                        </div>
                        <span className='font-size-md'>Descending</span>
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
              <TableContainer>
                <Table className='table table-alternate-spaced mb-0'>
                  <thead style={{ background: '#eeeeee' }}>
                    <tr>
                      <th style={Object.assign({ width: '5px' }, paddingTop)}>
                        <Checkbox
                          id='outlined-AllEmployees'
                          placeholder='AllEmployees'
                          variant='outlined'
                          size='small'
                          value={checkAllEmployees}
                          onChange={event => {
                            setCheckAllEmployees(event.target.checked)
                            if (event.target.checked) {
                              let uuids = paginationEmployees.map(a => a.uuid)
                              setAddedEmployees(uuids)
                            } else {
                              setAddedEmployees([])
                            }
                          }}></Checkbox>
                      </th>
                      <th
                        title='Employee ID'
                        style={Object.assign({ minWidth: '135px', maxWidth: '185px' }, paddingTop)}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee ID
                      </th>
                      <th
                        title='Employee'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee
                      </th>
                      <th
                        title='userId'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        User ID
                      </th>
                      <th
                        title='Date of Joining'
                        style={Object.assign({ width: '5px' }, paddingTop)}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        DOJ
                      </th>
                      <th
                        title='Department'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Department
                      </th>
                      <th
                        title='Location'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Location
                      </th>
                      <th
                        title='Designation'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                        scope='col'>
                        Designation
                      </th>
                      <th
                        title='Employee Type'
                        style={Object.assign({ minWidth: '135px', maxWidth: '185px' }, paddingTop)}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee Type
                      </th>
                      <th
                        title='Job Status'
                        style={Object.assign({ minWidth: '135px', maxWidth: '185px' }, paddingTop)}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Job Status
                      </th>
                      <th
                        title=' Employee Status'
                        style={Object.assign({ minWidth: '135px', maxWidth: '185px' }, paddingTop)}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee Status
                      </th>
                      <th style={{ width: '5px' }}>
                        <Button
                          size='small'
                          className='btn-neutral-first d-30 btn-pill p-0 btn-icon'
                          onClick={e => openUserMenu(e, selectedEmployee)}>
                          <FontAwesomeIcon
                            icon={['fas', 'ellipsis-v']}
                            className='font-size-sm'
                          />
                        </Button>{' '}
                      </th>
                      <Menu
                        id='userMenu'
                        component='div'
                        anchorEl={anchorEl4}
                        keepMounted
                        getContentAnchorEl={null}
                        classes={{ list: 'p-0' }}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        open={Boolean(anchorEl4)}
                        onClose={handleClose4}>
                        <div className='dropdown-menu-xl outline-none p-0'>
                          <div className='scroll-area-sm shadow-overflow'>
                            <PerfectScrollbar>
                              <List component='div' className='flex-column'>
                                <ListItem
                                  disabled={
                                    addedEmployees.length > 1 ? true : false
                                  }
                                  button
                                  onClick={e => history.push('/resetPasswordByAdmin')}
                                  className='rounded-0'>
                                  <span>Reset Password</span>
                                </ListItem>
                                <ListItem
                                  disabled={
                                    addedEmployees.length > 1 ? true : false
                                  }
                                  button
                                  className='rounded-0'>
                                  <NavLink
                                    activeClassName='active'
                                    className='nav-link-simple'
                                    to={'/activeInActive'}>
                                    <span>Lock/UnLock Account</span>
                                  </NavLink>
                                </ListItem>
                                <ListItem
                                  component={NavLink}
                                  to='./employeeDetails'
                                  disabled={
                                    addedEmployees.length > 1 ? true : false
                                  }
                                  button
                                  className='rounded-0'>
                                  <span>View/Edit Employee Details</span>
                                </ListItem>
                                <ListItem
                                  button
                                  className='rounded-0'
                                  onClick={() => {
                                    checkUserCredentialStatus()
                                  }}>
                                  <span>Create User Login Details</span>
                                </ListItem>
                                <ListItem
                                  component={NavLink}
                                  to={
                                    formURL +
                                    '?id=' +
                                    selectedEmployee?.employeeID
                                  }
                                  disabled={
                                    addedEmployees.length > 1 ? true : false
                                  }
                                  button
                                  className='rounded-0'>
                                  <span>Create/Modify Admin Access</span>
                                </ListItem>
                              </List>
                            </PerfectScrollbar>
                          </div>
                        </div>
                      </Menu>

                      <Menu
                        id='userMenu'
                        component='div'
                        anchorEl={anchorEl3}
                        keepMounted
                        getContentAnchorEl={null}
                        classes={{ list: 'p-0' }}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        open={Boolean(anchorEl3)}
                        onClose={handleClose3}>
                        <div className='dropdown-menu-xl outline-none p-0'>
                          <div className='scroll-area-sm shadow-overflow'>
                            <PerfectScrollbar>
                              <List component='div' className='flex-column'>
                                <ListItem
                                  disabled={ifMultiselect}
                                  button
                                  onClick={e => history.push('/resetPasswordByAdmin')}
                                  className='rounded-0'>
                                  <span>Reset Password</span>
                                </ListItem>
                                <ListItem
                                  disabled={ifMultiselect}
                                  button
                                  className='rounded-0'>
                                  <NavLink
                                    activeClassName='active'
                                    className='nav-link-simple'
                                    to={'/activeInActive'}>
                                    <span>Lock/UnLock Account</span>
                                  </NavLink>
                                </ListItem>
                                <ListItem
                                  component={NavLink}
                                  to='./employeeDetails'
                                  disabled={ifMultiselect}
                                  button
                                  className='rounded-0'>
                                  <span>View/Edit Employee Details</span>
                                </ListItem>
                                {
                                  (addedEmployees && addedEmployees.length >= 1) ? (
                                    <ListItem
                                      component={NavLink}
                                      className='rounded-0'
                                      to={{
                                        pathname: '/createUserCredentials',
                                        search: `?employeeUUIDs=${addedEmployees.join(',')}`
                                      }}>
                                      <span>Create User Login Details</span>
                                    </ListItem>
                                  ) : (
                                    <ListItem
                                      button
                                      className='rounded-0'
                                      onClick={() => {
                                        checkUserCredentialStatus()
                                      }}
                                      disabled={
                                        addedEmployees && addedEmployees.length >= 1
                                          ? false
                                          : true
                                      }>
                                      <span>Create User Login Details</span>
                                    </ListItem>
                                  )
                                }

                                <ListItem
                                  component={NavLink}
                                  to={
                                    formURL +
                                    '?id=' +
                                    selectedEmployee?.employeeID
                                  }
                                  disabled={ifMultiselect}
                                  button
                                  className='rounded-0'>
                                  <span>Create/Modify Admin Access</span>
                                </ListItem>
                              </List>
                            </PerfectScrollbar>
                          </div>
                        </div>
                      </Menu>
                    </tr>
                  </thead>
                  {paginationEmployees.length > 0 ? (
                    <>
                      <tbody>
                        {paginationEmployees
                          .slice(
                            page * recordsPerPage > employees.length
                              ? page === 0
                                ? 0
                                : page * recordsPerPage - recordsPerPage
                              : page * recordsPerPage - recordsPerPage,
                            page * recordsPerPage <= employees.length
                              ? page * recordsPerPage
                              : employees.length
                          )
                          .map((item, idx) => (
                            <>
                              <tr>
                                <td>
                                  <Checkbox
                                    id='outlined-isOne-to-OneJob'
                                    placeholder='Is One-to-One Job'
                                    variant='outlined'
                                    size='small'
                                    value={addedEmployees.includes(item?.uuid)}
                                    checked={addedEmployees.includes(
                                      item?.uuid
                                    )}
                                    onChange={event => {
                                      addRemoveEmployees(event, item, idx)
                                    }}></Checkbox>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.employeeID}
                                      style={tableData}>
                                      {item?.employeeID}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.employeeName}
                                      style={tableData}>
                                      {item?.employeeName}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.userId}
                                      style={tableData}>
                                      {item?.userId}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={getParsedDate(item?.hireDate)}
                                      style={tableData}>
                                      {getParsedDate(item?.hireDate)}{' '}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.department}
                                      style={tableData}>
                                      {item?.department}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.location}
                                      style={tableData}>
                                      {item?.location}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.designation}
                                      style={tableData}>
                                      {item?.designation}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.jobType}
                                      style={tableData}>
                                      {item?.jobType}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.jobStatus}
                                      style={tableData}>
                                      {item?.jobStatus}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>                                  
                                    <p                                     
                                      style={
                                        item?.isActive
                                          ? { color: 'green' }
                                          : { color: 'red' }
                                      }>
                                      {item?.isActive ? 'Active' : 'InActive'}{' '}
                                    </p>{' '}
                                  </div>
                                </td>
                                <td>
                                  <Button
                                    size='small'
                                    className='btn-neutral-first d-30 btn-pill p-0 btn-icon'
                                    onClick={e => openUserMenu4(e, item)}>
                                    <FontAwesomeIcon
                                      icon={['fas', 'ellipsis-v']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                </td>
                              </tr>
                              <tr className='divider'></tr>
                            </>
                          ))}
                      </tbody>
                    </>
                  ) : (
                    <tbody className='text-center'>
                      <div>
                        <img
                          alt='...'
                          src={noResults}
                          style={{ maxWidth: '600px' }}
                        />
                      </div>
                    </tbody>
                  )}
                </Table>
              </TableContainer>
            </div>
            <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
              <Pagination
                className='pagination-primary'
                count={Math.ceil(employees.length / recordsPerPage)}
                variant='outlined'
                shape='rounded'
                selected={true}
                page={page}
                onChange={handleChange}
                showFirstButton
                showLastButton
              />
            </div>
            {/* </>
              );
            } else {
              return (
                <>
                  <h1>NO RESULTS FOUND....</h1>
                </>
              );
            }
          }} */}
          </div>
        </Card>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={3000}
        />
      </>
    </BlockUi>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  setEmployee: data => dispatch(setSelectedEmployee(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboardemployee)
