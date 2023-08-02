import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux'
import apicaller from 'helper/Apicaller'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Table,
  Grid,
  InputAdornment,
  MenuItem,
  Card,
  Menu,
  List,
  Button,
  ListItem,
  TextField,
  FormControl,
  TableContainer,
  Select,
  Snackbar,
} from '@material-ui/core'
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

const CreateEmployeeCertificateOrLicenseReports = props => {
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

  const [allCertificateOrLicense, setAllCertificateOrLicense] = useState([])
  const [paginationCertificateOrLicense, setPaginationCertificateOrLicense] = useState([])
  const [CertificateOrLicense, setCertificateOrLicense] = useState([])
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [filteredDepartments, setfilteredDepartments] = useState([])
  const [filteredLocations, setfilteredLocations] = useState([])
  const [allDepartments, setAllDepartments] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [nameOfTheCertificateOrLicense, setNameOfTheCertificateOrLicense] = useState([]);
  const [certificateOrLicenseArray, setCertificateOrLicenseArray] = useState([]);
  const [open4, setOpen4] = useState(false)
  const handleClose4 = () => {
    setOpen4(false)
  }
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || null;

  useEffect(() => {
    getCertificateOrLicense()
    getDepartments()
    getCertificateItemByType(type)
    getLocations()
  }, [])

  const getCertificateOrLicense = () => {
    setBlocking(true)
    let obj = {
      reportType: type
    }
    axios
      .post(`${BASEURL}/employee/filter`, obj)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setCertificateOrLicense(res.data)
          setAllCertificateOrLicense(res.data)
          setPaginationCertificateOrLicense(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getCertificateOrLicense err', err)
      })
  }
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
  const getCertificateItemByType = (type) => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/itemCatalogue/fetchByType/${type}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200 && res.data && res.data.length > 0) {
          setCertificateOrLicenseArray(res.data)
        }
        else {
          setState({
            open: true,
            message: `No ${type}s found`,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get emergency contact err', err)
      })
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

  const handleFilter = detailsType => {
    let departments
    let location
    let certificates
    let obj = {}

    if (filteredDepartments?.length > 0) {
      departments = filteredDepartments.map(a => a.id)
    }
    if (filteredLocations?.length > 0) {
      location = filteredLocations.map(a => a.locationId)
    }
    if (nameOfTheCertificateOrLicense?.length > 0) {
      certificates = nameOfTheCertificateOrLicense.map(a => a.description)
    }


    obj = {
      department: departments,
      nameOfTheCertificateOrLicense: certificates,
      location: location,
      reportType: type
    }

    if (detailsType == 'excel') {
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
          if (detailsType == 'excel') {
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
              setCertificateOrLicense(res.data)
              setPaginationCertificateOrLicense(res.data)
            } else {
              setCertificateOrLicense(res.data)
              setPaginationCertificateOrLicense(res.data)
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
    let sortedCertificateOrLicense = JSON.parse(JSON.stringify(CertificateOrLicense))
    if (sortOrder == 'ASC') {
      sortedCertificateOrLicense = sortedCertificateOrLicense.sort((empA, empB) =>
        empA.employeeName > empB.employeeName ? 1 : empB.employeeName > empA.employeeName ? -1 : 0
      )
      setCertificateOrLicense(sortedCertificateOrLicense)
      setPaginationCertificateOrLicense(sortedCertificateOrLicense)
    } else {
      sortedCertificateOrLicense = sortedCertificateOrLicense.sort((empB, empA) =>
        empA.employeeName > empB.employeeName ? 1 : empB.employeeName > empA.employeeName ? -1 : 0
      )
      setCertificateOrLicense(sortedCertificateOrLicense)
      setPaginationCertificateOrLicense(sortedCertificateOrLicense)
    }
  }

  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  const handleSearch = event => {
    const filteredCertificateOrLicense = allCertificateOrLicense.filter(obj =>
      JSON.stringify(obj)
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    )

    if (filteredCertificateOrLicense.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }

    setCertificateOrLicense(filteredCertificateOrLicense)
    setPaginationCertificateOrLicense(filteredCertificateOrLicense)
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
                variant='outlined'
                size='small'
                id='input-with-icon-textfield22-2'
                placeholder='Search Employee, National ID Type, Identification Number...'
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
                            {(type == 'License') ? 'License' : 'Certificate'}
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
                            <Autocomplete
                              id="combo-box-demo"
                              select
                              multiple
                              // style={{ maxWidth: '250px' }}
                              value={nameOfTheCertificateOrLicense}
                              options={certificateOrLicenseArray}
                              getOptionLabel={(option) => (option.description ? option.description : '')}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                />
                              )}
                              onChange={(event, value) => {
                                setNameOfTheCertificateOrLicense(value);
                              }}
                            />
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
                          setfilteredLocations([])
                          setNameOfTheCertificateOrLicense([])
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
                                getCertificateOrLicense()
                                setfilteredDepartments([])
                                setfilteredLocations([])
                                setNameOfTheCertificateOrLicense([])
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
                          setPaginationCertificateOrLicense(CertificateOrLicense);
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
                          setPaginationCertificateOrLicense(CertificateOrLicense);
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
                          setPaginationCertificateOrLicense(CertificateOrLicense);
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
          {type == 'Certificate' && (
            <>
              <div className='p-4'>
                <div className='text-center my-4'>
                  <span className='display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize'>
                    Employee Certificate Details
                  </span>
                </div>
                <div className='table-responsive-md'>
                  <TableContainer>
                    <Table className='table table-alternate-spaced mb-0'>
                      <thead style={{ background: '#eeeeee' }}>
                        <tr>
                          <th
                            title='SI.No.'
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
                            title='Name of the Certificate'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Name of the Certificate
                          </th>
                          <th
                            title='Validity'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Validity
                          </th>
                        </tr>
                      </thead>
                      {paginationCertificateOrLicense.length > 0 ? (
                        <>
                          <tbody>
                            {paginationCertificateOrLicense
                              .slice(
                                page * recordsPerPage > CertificateOrLicense.length
                                  ? page === 0
                                    ? 0
                                    : page * recordsPerPage - recordsPerPage
                                  : page * recordsPerPage - recordsPerPage,
                                page * recordsPerPage <= CertificateOrLicense.length
                                  ? page * recordsPerPage
                                  : CertificateOrLicense.length
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
                                          title={item.department}>
                                          {item.department}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.location}>
                                          {item.location}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.nameOfTheCertificateOrLicense}>
                                          {item.nameOfTheCertificateOrLicense}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.validity}>
                                          {item.validity}
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
                  count={Math.ceil(CertificateOrLicense.length / recordsPerPage)}
                  variant='outlined'
                  shape='rounded'
                  selected={true}
                  page={page}
                  onChange={handleChange}
                  showFirstButton
                  showLastButton
                />
              </div>
            </>
          )}
          {type == 'License' && (
            <>
              <div className='p-4'>
                <div className='text-center my-4'>
                  <span className='display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize'>
                    Employee License Details
                  </span>
                </div>
                <div style={{ overflow: 'auto' }} className='table-responsive-md'>
                  <Table className='table table-alternate-spaced mb-0'>
                    <thead style={{ background: '#eeeeee' }}>
                      <tr>
                        <th
                          title='Sl.No'
                          style={Object.assign(
                            { minWidth: '75px', maxWidth: '135px' },
                            paddingTop
                          )}
                          className='font-size-sm font-weight-bold pb-4 text-capitalize '
                          scope='col'>
                          Sl.No.
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
                          title='Name of the License'
                          style={{ ...tableData, ...paddingTop }}
                          className='font-size-sm font-weight-bold pb-4 text-capitalize '
                          scope='col'>
                          Name of the License
                        </th>
                        <th
                          title='Validity'
                          style={{ ...tableData, ...paddingTop }}
                          className='font-size-sm font-weight-bold pb-4 text-capitalize '
                          scope='col'>
                          Validity
                        </th>
                      </tr>
                    </thead>
                    {paginationCertificateOrLicense.length > 0 ? (
                      <>
                        <tbody>
                          {paginationCertificateOrLicense
                            .slice(
                              page * recordsPerPage > CertificateOrLicense.length
                                ? page === 0
                                  ? 0
                                  : page * recordsPerPage - recordsPerPage
                                : page * recordsPerPage - recordsPerPage,
                              page * recordsPerPage <= CertificateOrLicense.length
                                ? page * recordsPerPage
                                : CertificateOrLicense.length
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
                                        title={item.department}>
                                        {item.department}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div
                                        style={tableData}
                                        title={item.location}>
                                        {item.location}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div
                                        style={tableData}
                                        title={item.nameOfTheCertificateOrLicense}>
                                        {item.nameOfTheCertificateOrLicense}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div
                                        style={tableData}
                                        title={item.validity}>
                                        {item.validity}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className='divider'></tr>
                                <tr className="divider"></tr>
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
                </div>
              </div>
              <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                <Pagination
                  className='pagination-primary'
                  count={Math.ceil(CertificateOrLicense.length / recordsPerPage)}
                  variant='outlined'
                  shape='rounded'
                  selected={true}
                  page={page}
                  onChange={handleChange}
                  showFirstButton
                  showLastButton
                />
              </div>
            </>
          )}
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
      </BlockUi >
    </>
  )
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployeeCertificateOrLicenseReports)
