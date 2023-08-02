import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux'
import apicaller from 'helper/Apicaller'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Table,
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  TableContainer,
  DialogTitle,
  Switch
} from '@material-ui/core'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { ClimbingBoxLoader } from 'react-spinners'
import Pagination from '@material-ui/lab/Pagination'
import BlockUi from 'react-block-ui'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import Autocomplete from '@material-ui/lab/Autocomplete'

const NationalIDReport = props => {
  const { user } = props
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const handleClose3 = () => {
    setState({ ...state, open: false })
  }

  const [formURL, setFormURL] = useState('/createNationalIds')
  const [anchorEl, setAnchorEl] = useState(null)
  // const [formURL, setFormURL] = useState('/createCustomer');
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
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
  const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] =
    useState(false)
  const [downloadUrl, setDownloadUrl] = useState('/downloadResults')

  const handleStatus = event => {
    setStatus(event.target.value)
  }
  const handleFilter = type => {
    let departments
    let location
    let idType
    let obj = {}

    if (filteredDepartments?.length > 0) {
      departments = filteredDepartments.map(a => a.id)
    }
    if (filteredLocations?.length > 0) {
      location = filteredLocations.map(a => a.locationId)
    }
    if (filteredIdTypes?.length > 0) {
      idType = filteredIdTypes.map(a => a.value)
    }

    obj = {
      department: departments,
      location: location,
      identificationType: idType,
      reportType: 'nationId'
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
              setNationalIds(res.data)
              setPaginationNationalIds(res.data)
            } else {
              setNationalIds(res.data)
              setPaginationNationalIds(res.data)
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
  const handleSort = sortOrder => {
    let sortedNationalIds = JSON.parse(JSON.stringify(nationalIds))
    if (sortOrder == 'ASC') {
      sortedNationalIds = sortedNationalIds.sort((empA, empB) =>
        empA.employeeName > empB.employeeName ? 1 : empB.employeeName > empA.employeeName ? -1 : 0
      )
      setNationalIds(sortedNationalIds)
      setPaginationNationalIds(sortedNationalIds)
    } else {
      sortedNationalIds = sortedNationalIds.sort((empB, empA) =>
        empA.employeeName > empB.employeeName ? 1 : empB.employeeName > empA.employeeName ? -1 : 0
      )
      setNationalIds(sortedNationalIds)
      setPaginationNationalIds(sortedNationalIds)
    }
  }

  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  const handleSearch = (event) => {
    const filteredNationalIds = allNationalIds.filter((obj) =>
      JSON.stringify(obj)
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    if (filteredNationalIds.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setNationalIds(filteredNationalIds)
    setPaginationNationalIds(filteredNationalIds)
  };

  const [allNationalIds, setAllNationalIds] = useState([])
  const [paginationNationalIds, setPaginationNationalIds] = useState([])
  const [nationalIds, setNationalIds] = useState([])
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [filteredDepartments, setfilteredDepartments] = useState([])
  const [filteredLocations, setfilteredLocations] = useState([])
  const [allDepartments, setAllDepartments] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [selectedJoiningDate, setJoiningDate] = useState(null)
  const [filteredIdTypes, setfilteredIdTypes] = useState([])
  const [open4, setOpen4] = useState(false)
  const handleClose4 = () => {
    setOpen4(false)
  }

  useEffect(() => {
    getNationalIds()
    getDepartments()
    getLocations()
  }, [])

  const idTypes = [
    { value: 'Aadhaar Card' },
    { value: 'Indian Passport' },
    { value: 'Voter ID Card' },
    { value: 'PAN Card' },
    { value: 'Driving License' },
    { value: 'SSN' }
  ]

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

  const getNationalIds = () => {
    setBlocking(true)

    let obj = {
      reportType: 'nationId'
    }

    axios
      .post(`${BASEURL}/employee/filter`, obj)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setNationalIds(res.data)
          setAllNationalIds(res.data)
          setPaginationNationalIds(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getNationalIds err', err)
      })
  }

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

  const tableData = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100px'
  }

  const paddingTop = {
    paddingTop: '25px'
  }

  const loading = false
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
                variant="outlined"
                size="small"
                id="input-with-icon-textfield22-2"
                placeholder="Search Employee, National ID Type, Identification Number..."
                onFocus={openSearch}
                onBlur={closeSearch}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
              />
            </div>
            {navigateToDownloadResultPage ? (
              <div className='d-flex align-items-center justify-content-center'>
                <a
                  href={downloadUrl}
                  className='text-black'
                  title='Navigate To Download Results Page'
                  style={{ color: 'blue' }}>
                  Navigate To Download Results Page
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
                            ID Type
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id='combo-box-demo'
                              multiple
                              options={idTypes}
                              value={filteredIdTypes}
                              getOptionLabel={option => option.value}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select Employee ID Type'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                />
                              )}
                              onChange={(event, value) => {
                                setfilteredIdTypes(value)
                              }}
                            />
                            <br></br>
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
                                  margin='normal'
                                  placeholder='dd/mm/yyyy'
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
                          </FormControl>
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
                          setfilteredIdTypes([])
                          setfilteredLocations([])
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
                                getNationalIds()
                                setfilteredDepartments([])
                                setfilteredIdTypes([])
                                setfilteredLocations([])
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
                          setPaginationNationalIds(nationalIds);
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
                          setPaginationNationalIds(nationalIds);
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
                          setPaginationNationalIds(nationalIds);
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
                    <div className="font-weight-bold px-4 pt-4">Order(By Employee Name)</div>
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
                Employee National ID Details Report
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
                        title='Employee Id'
                        style={Object.assign(
                          { minWidth: '105px', maxWidth: '185px' },
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
                        title='ID Type'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        ID Type
                      </th>
                      <th
                        title='Identification Number'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Identification Number
                      </th>
                      <th
                        title='Expiry Date'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Expiry Date
                      </th>
                      <th
                        title='Name as Per Document'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Name as Per Document
                      </th>
                    </tr>
                  </thead>
                  {paginationNationalIds.length > 0 ? (
                    <>
                      <tbody>
                        {paginationNationalIds
                          .slice(
                            page * recordsPerPage > nationalIds.length
                              ? page === 0
                                ? 0
                                : page * recordsPerPage - recordsPerPage
                              : page * recordsPerPage - recordsPerPage,
                            page * recordsPerPage <= nationalIds.length
                              ? page * recordsPerPage
                              : nationalIds.length
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
                                      title={item.identificationType}>
                                      {item.identificationType}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      style={tableData}
                                      title={item.identification}>
                                      {item.identification}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div style={tableData} title={item.expiry}>
                                      <div>{getParsedDate(item.expiry)}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    {item.name ? (
                                      <div style={tableData} title={item.name}>
                                        {item.name}
                                      </div>
                                    ) : (
                                      <div
                                        style={tableData}
                                        title={item.nameAsPerDocument}>
                                        {item.nameAsPerDocument}
                                      </div>
                                    )}
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
              count={Math.ceil(nationalIds.length / recordsPerPage)}
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

export default connect(mapStateToProps, mapDispatchToProps)(NationalIDReport)
