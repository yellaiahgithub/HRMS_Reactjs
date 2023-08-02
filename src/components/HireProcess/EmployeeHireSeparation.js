import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import clsx from 'clsx'
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
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  TableContainer,
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

const EmployeeHireSeperarion = props => {
  const { setEmployee, user } = props
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)
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
  const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] = useState(false)
  const [downloadResults, setDownloadUrl] = useState('/downloadResults')
  const [employees, setEmployees] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [paginationEmployees, setPaginationEmployees] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [allDepartments, setAllDepartments] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [filteredDepartments, setfilteredDepartments] = useState([])
  const [filteredLocations, setfilteredLocations] = useState([])
  const [filterAction, setfilterActions] = useState('')
  const [selectedFromDate, setFromDate] = useState(null)
  const [selectedToDate, setToDate] = useState(null)

  const ActionType = [
    {
      value: 'HIRE',
      label: 'HIRE'
    },
    {
      value: 'SEP',
      label: 'SEP'
    },
    {
      value: 'BOTH',
      label: 'BOTH'
    }
  ]

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

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  useEffect(() => {
    getEmployees()
    getLocations()
    getDepartments()
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

    let obj = {
      reportType: 'Hire_Separation'
    }

    axios
      .post(`${BASEURL}/employee/filter`, obj)
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

  const handleFilter = type => {
    let departments
    let location

    if (filteredDepartments?.length > 0) {
      departments = filteredDepartments.map(a => a.id)
    }
    if (filteredLocations?.length > 0) {
      location = filteredLocations.map(a => a.locationId)
    }

    let obj = {
      department: departments,
      type: filterAction.value,
      location: location,
      reportType: 'Hire_Separation',
    }

    const fromDate = selectedFromDate ? selectedFromDate : null
    const toDate = selectedToDate ? selectedToDate : null

    if (fromDate) {
      obj['fromDate'] = fromDate
    }
    if (toDate) {
      obj['toDate'] = toDate
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
              setEmployees(res.data)
              setAllEmployees(res.data)
              setPaginationEmployees(res.data)
            } else {
              setEmployees([])
              setPaginationEmployees([])
              setAllEmployees([])
            }
            handleClose()
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
    const results = allEmployees.filter((obj) =>
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

  const [blocking, setBlocking] = useState(false)

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
                            ACTIONS
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              options={ActionType}
                              value={filterAction}
                              getOptionLabel={option => option.value}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='select Actions'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilterActions(value)
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block mt-4'>
                            FROM DATE
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
                              id='outlined-fromDate'
                              fullWidth
                              size='small'
                              value={selectedFromDate}
                              onChange={event => {
                                setFromDate(event)
                              }}
                              KeyboardButtonProps={{
                                'aria-label': 'change date'
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block mt-4'>
                            TO DATE
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
                              id='outlined-toDate'
                              fullWidth
                              size='small'
                              value={selectedToDate}
                              onChange={event => {
                                setToDate(event)
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
                          setfilteredDepartments([])
                          setfilterActions([])
                          setfilteredLocations([])
                          setFromDate(null)
                          setToDate(null)
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
                                setfilterActions([])
                                setfilteredLocations([])
                                setFromDate(null)
                                setToDate(null)
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
                          setPaginationEmployees(employees);
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
                          setPaginationEmployees(employees);
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
                          setPaginationEmployees(employees);
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
                Employee Hire Seperarion Summary <br />
                For the Period {selectedFromDate ? selectedFromDate.toLocaleDateString() : ''} - {selectedToDate ? selectedToDate.toLocaleDateString() : ''}
              </span>
            </div>
            <div className='table-responsive-md'>
              <TableContainer>
                <Table className='table table-alternate-spaced mb-0'>
                  <thead style={{ background: '#eeeeee' }}>
                    <tr>
                      <th
                        title='Employee ID'
                        style={Object.assign(
                          { minWidth: '135px', maxWidth: '185px' },
                          paddingTop
                        )}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee ID
                      </th>
                      <th
                        title='Employee'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Employee Name
                      </th>
                      <th
                        title='Location'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Location
                      </th>
                      <th
                        title='Department'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Department
                      </th>
                      <th
                        title='Designation'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                        scope='col'>
                        Designation
                      </th>
                      <th
                        title='Hire Date'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                        scope='col'>
                        Hire Date
                      </th>
                      <th
                        title='Hire Reason'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                        scope='col'>
                        Hire Reason
                      </th>
                      <th
                        title='Exit Date'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                        scope='col'>
                        Exit Date
                      </th>
                      <th
                        title='Exit Reason'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                        scope='col'>
                        Exit Reason
                      </th>
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
                                      title={item?.location}
                                      style={tableData}>
                                      {item?.location}
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
                                      title={item?.designation}
                                      style={tableData}>
                                      {item?.designation}
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
                                      title={item?.hireReasonName}
                                      style={tableData}>
                                      {item?.hireReasonName}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item.exitDate !== 'N/A' ? getParsedDate(item?.exitDate) : item.exitDate}
                                      style={tableData}>
                                      {item.exitDate !== 'N/A' ? getParsedDate(item?.exitDate) : item.exitDate}{' '}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      title={item?.exitReasonName}
                                      style={tableData}>
                                      {item?.exitReasonName}
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

const mapStateToProps = state => {
  return {
    user: state.Auth.user
  }
}

const mapDispatchToProps = dispatch => ({
  setEmployee: data => dispatch(setSelectedEmployee(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeHireSeperarion)
