import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from 'react-redux'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

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

const DepartmentReport = props => {
  const { setDepartment, user } = props
  const history = useHistory()

  const [anchorEl, setAnchorEl] = useState(null)
  const [formURL, setFormURL] = useState('/assignedPermissions')
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
  const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] =
    useState(false)
  const [downloadResults, setDownloadUrl] = useState('/downloadResults')
  const [status, setStatus] = useState('0')
  const [departments, setDepartments] = useState([])
  const [allDepartments, setAllDepartments] = useState([])
  const [allDepartmentsForFilter, setAllDepartmentsForFilter] = useState([])
  const [paginationDepartments, setPaginationDepartments] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [sort, setSort] = useState('ASC')
  const [page, setPage] = useState(1)
  const [allLocations, setAllLocations] = useState([])
  const [allDesignations, setAllDesignations] = useState([])
  const [filteredDepartments, setfilteredDepartments] = useState([])
  const [filteredLocations, setfilteredLocations] = useState([])

  const [filteredDesignations, setfilteredDesignations] = useState([])

  const [selectedJoiningDate, setJoiningDate] = useState(null)
  const [allBands, setAllBands] = useState([])
  const [allGrades, setAllGrades] = useState([])
  const [filteredGrades, setfilteredGrades] = useState([])
  const [filteredBands, setfilteredBands] = useState([])

  const handleStatus = event => {
    setStatus(event.target.value)
  }
  const handleFilter = type => {
    let designation
    let departments
    let location
    let grades
    let bands

    if (filteredDesignations?.length > 0) {
      designation = filteredDesignations.map(a => a.id)
    }
    if (filteredDepartments?.length > 0) {
      departments = filteredDepartments.map(a => a.id)
    }
    if (filteredLocations?.length > 0) {
      location = filteredLocations.map(a => a.locationId)
    }
    if (filteredBands?.length > 0) {
      bands = filteredBands.map(a => a.bandId)
    }
    if (filteredGrades?.length > 0) {
      grades = filteredGrades.map(a => a.gradeId)
    }

    let obj = {
      designation: designation,
      department: departments,
      location: location,
      reportType: 'Department',
      jobGrade: grades,
      jobBand: bands
    }

    const joiningDate = selectedJoiningDate ? selectedJoiningDate : null

    if (joiningDate) {
      obj['joiningDate'] = joiningDate
    }

    if (type == 'excel') {
      obj['exportData'] = true
      obj['downloadedBy'] = user.uuid
    }

    setBlocking(true)
    axios
      .post(`${BASEURL}/employee/filter`, obj)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          if (type == 'excel') {
            setNavigateToDownloadResultPage(true)
            setState({
              open: true,
              message:
                "Download is in Queue Kindly download the file from 'DOWNLOAD RESULTS' page",
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
          } else {
            if (res.data.length > 0) {
              setDepartments(res.data)
              setPaginationDepartments(res.data)
            } else {
              setDepartments([])
              setPaginationDepartments([])
            }
            handleClose()
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getDepartments err', err)
      })
  }

  const handleSort = sortOrder => {
    let sortedDepartments = JSON.parse(JSON.stringify(departments))
    if (sortOrder == 'ASC') {
      sortedDepartments = sortedDepartments.sort((loct1, loct2) =>
        loct1.employeeName > loct2.employeeName
          ? 1
          : loct2.employeeName > loct1.employeeName
            ? -1
            : 0
      )
      setDepartments(sortedDepartments)
      setPaginationDepartments(sortedDepartments)
    } else {
      sortedDepartments = sortedDepartments.sort((loct2, loct1) =>
        loct1.employeeName > loct2.employeeName
          ? 1
          : loct2.employeeName > loct1.employeeName
            ? -1
            : 0
      )
      setDepartments(sortedDepartments)
      setPaginationDepartments(sortedDepartments)
    }
  }

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
      value: 'Department',
      label: 'Department'
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
    getDepartments()
    getLocations()
    getDesignations()
    getJobGrades()
    getJobBands()
    getDepartmentsForFilter()
  }, [])

  const getJobGrades = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/jobGrade/fetchAll`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data?.data)
          setAllGrades(res.data?.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getJObGrade err', err)
      })
  }

  const getJobBands = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/jobBand/fetchAll`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllBands(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getJObBand err', err)
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
  const getDepartmentsForFilter = () => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDepartmentsForFilter(res.data)
        }
      })
      .catch(err => {
        console.log('getDepartments err', err)
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

  const getDepartments = () => {
    setBlocking(true)

    let obj = {
      reportType: 'Department'
    }

    axios
      .post(`${BASEURL}/employee/filter`, obj)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          if (res.data.length > 0) {
            setDepartments(res.data)
            setAllDepartments(res.data)
            setPaginationDepartments(res.data)
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getDepartments err', err)
      })
  }
  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }
  const handleSearch = (event) => {
    const results = allDepartments.filter((obj) =>
      JSON.stringify(obj)
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    if (results.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      });
    }
    setDepartments(results)
    setPaginationDepartments(results)
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


  const handleClose3 = () => {
    setState({ ...state, open: false })
    setAnchorEl3(null)

  }
  const handleClose4 = event => {
    setAnchorEl4(null)
  }
  const [blocking, setBlocking] = useState(false)
  const [addedDepartments, setAddedDepartments] = useState([])
  const [ifMultiselect, setIfMultiselect] = useState(true)

  const tableData = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '135px'
  }

  const paddingTop = {
    paddingTop: '25px'
  }

  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
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
                placeholder='Search Department...'
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
            {navigateToDownloadResultPage ? (
              <div className='d-flex align-items-center justify-content-center'>
                <a
                  href={downloadResults}
                  className='text-black'
                  title='Navigate To Download Results Page'
                  style={{ color: 'blue' }}>
                  Navigate To Downlaod Results Page
                </a>
              </div>
            ) : (
              ''
            )}
            <div className='d-flex align-items-center'>
              <FontAwesomeIcon
                onClick={() => handleFilter('excel')}
                icon={['far', 'file-excel']}
                style={{ color: 'green', cursor: 'pointer' }}
                className='btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill'
              />
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
                            Designations
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
                            Departments
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={allDepartmentsForFilter}
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
                            Job Grade
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={allGrades}
                              value={filteredGrades}
                              getOptionLabel={option => option.gradeName}
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
                                setfilteredGrades(value)
                              }}
                            />{' '}
                          </FormControl>
                        </Grid>

                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            Job Band
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={allBands}
                              value={filteredBands}
                              getOptionLabel={option => option.bandName}
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
                                setfilteredBands(value)
                              }}
                            />{' '}
                          </FormControl>
                        </Grid>

                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block mt-4'>
                            Joining Date
                          </small>
                          <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            style={{ margin: '0%' }}>
                            <KeyboardDatePicker
                              style={{ margin: '0%' }}
                              inputVariant='outlined'
                              format='dd/mm/yyyy'
                              placeholder='dd/mm/yyyy'
                              margin='normal'
                              id='outlined-joiningDate'
                              fullWidth
                              size='small'
                              value={selectedJoiningDate}
                              onChange={event => {
                                setJoiningDate(event)
                              }}
                              KeyboardButtonProps={{
                                'aria-label': 'change date'
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                    </div>
                    <div className='divider' />
                    <div className="p-3 text-center bg-secondary">
                      <Button
                        style={{ margin: '0px 15px' }}
                        className="btn-primary"
                        onClick={() => {
                          handleFilter();
                        }}
                        size="small">
                        Search
                      </Button>
                      <Button
                        style={{ margin: '0px 15px' }}
                        className="btn-secondary"
                        onClick={() => {
                          setfilteredDesignations([])
                          setfilteredLocations([])
                          setfilteredDepartments([])
                          setfilteredBands([])
                          setfilteredGrades([])
                          setJoiningDate(null)
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
                                getDepartments()
                                setfilteredDesignations([])
                                setfilteredDepartments([])
                                setfilteredLocations([])
                                setfilteredBands([])
                                setfilteredGrades([])
                                setJoiningDate(null)
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
                          setPaginationDepartments(departments);
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
                          setPaginationDepartments(departments);
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
                          setPaginationDepartments(departments);
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
            <div className='text-center my-4'>
              <span className='display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize'>
                Department wise Manpower Report
              </span>
            </div>

            <div className='table-responsive-md'>
              <TableContainer>
                <Table className='table table-alternate-spaced mb-0'>
                  <thead style={{ background: '#eeeeee' }}>
                    <tr>
                      <th
                        title='SI.No'
                        style={Object.assign(
                          { minWidth: '75px', maxWidth: '135px' },
                          paddingTop
                        )}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        SI.No.
                      </th>
                      <th
                        title='Location'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Location
                      </th>
                      <th
                        title='Employee Id'
                        style={Object.assign(
                          { minWidth: '125px', maxWidth: '185px' },
                          paddingTop
                        )}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee Id
                      </th>
                      <th
                        title='Employee Name'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee Name
                      </th>
                      <th
                        title='Designation'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Designation
                      </th>
                      <th
                        title='Department'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Department
                      </th>
                      <th
                        title='Job Grade'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Job Grade
                      </th>
                      <th
                        title='Job Band'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Job Band
                      </th>
                      <th
                        title='Date of Joining'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Date of Joining
                      </th>
                      <th
                        title='Manager'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Manager
                      </th>
                    </tr>
                  </thead>
                  {paginationDepartments.length > 0 ? (
                    <>
                      <tbody>
                        {paginationDepartments
                          .slice(
                            page * recordsPerPage > departments.length
                              ? page === 0
                                ? 0
                                : page * recordsPerPage - recordsPerPage
                              : page * recordsPerPage - recordsPerPage,
                            page * recordsPerPage <= departments.length
                              ? page * recordsPerPage
                              : departments.length
                          )
                          .map((item, idx) => (
                            <>
                              <tr>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div style={tableData} title={item.SNo}>
                                      {item.SNo}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div style={tableData} title={item.location}>
                                      {item.location}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    {item?.employeeId ? (
                                      <div
                                        style={tableData}
                                        title={item?.employeeId}>
                                        {item.employeeId}
                                      </div>
                                    ) : (
                                      <div
                                        style={tableData}
                                        title={item?.employeeID}>
                                        {item.employeeID}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      style={tableData}
                                      title={item.employeeName}>
                                      {item.employeeName}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      style={tableData}
                                      title={item.designation}>
                                      {item.designation}
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
                                    <div style={tableData} title={item.jobGrade}>
                                      {item.jobGrade}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div style={tableData} title={item.jobBand}>
                                      {item.jobBand}
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
                                      title={item?.managerName}
                                      style={tableData}>
                                      {item?.managerName}
                                    </div>
                                  </div>
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
          </div>
          <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
            <Pagination
              className='pagination-primary'
              count={Math.ceil(departments.length / recordsPerPage)}
              variant='outlined'
              shape='rounded'
              selected={true}
              page={page}
              onChange={handleChange}
              showFirstButton
              showLastButton
            />
          </div>
        </Card>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose3}
          message={message}
          autoHideDuration={2000}
        />
      </BlockUi>
    </>
  )
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentReport)
