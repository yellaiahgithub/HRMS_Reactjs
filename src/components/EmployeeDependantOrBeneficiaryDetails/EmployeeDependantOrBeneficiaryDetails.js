import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Grid,
  InputAdornment,
  Card,
  Menu,
  MenuItem,
  Snackbar,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  TableContainer,
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import axios from 'axios';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import { CSVLink } from 'react-csv';
import Dependants from 'pages/CreateDependants';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'

const EmployeeDependantOrBeneficiaryDetails = props => {
  const history = useHistory();
  const { user } = props
  const { selectedCompany } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults')
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const handleClose3 = () => {
    setState({ ...state, open: false });
  };

  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const [employeeDependantOrBeneficiaryDetails, setEmployeeDependantOrBeneficiaryDetails] = useState([]);
  const [allEmployeeDependantOrBeneficiaryDetails, setAllEmployeeDependantOrBeneficiaryDetails] = useState([]);
  const [paginationEmployeeDependantOrBeneficiaryDetails, setpaginationEmployeeDependantOrBeneficiaryDetails] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState('/downloadResults')
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] = useState(false);
  const [CSVHeader, setCSVHeader] = useState([]);
  const [filteredDepartments, setfilteredDepartments] = useState([])
  const [filteredLocations, setfilteredLocations] = useState([])
  const [allDepartments, setAllDepartments] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [selectedReportToDate, setReportToDate] = useState(null)
  const [selectedReportFromDate, setReportFromDate] = useState(null)


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || null;

  useEffect(() => {
    // window.location.reload();
    getDependantOrBeneficiaryDetails()
    getDepartments()
    getLocations()
  }, []);

  const getDependantOrBeneficiaryDetails = () => {
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
          setEmployeeDependantOrBeneficiaryDetails(res.data)
          setAllEmployeeDependantOrBeneficiaryDetails(res.data)
          setpaginationEmployeeDependantOrBeneficiaryDetails(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getDependantOrBeneficiaryDetails err', err)
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
    let obj = {}

    if (filteredDepartments?.length > 0) {
      departments = filteredDepartments.map(a => a.id)
    }
    if (filteredLocations?.length > 0) {
      location = filteredLocations.map(a => a.locationId)
    }

    obj = {
      department: departments,
      location: location,
      reportType: type
    }
    const reportToDate = selectedReportToDate ? selectedReportToDate : null
    const reportFromDate = selectedReportFromDate ? selectedReportFromDate : null

    if (reportToDate) {
      obj['reportToDate'] = reportToDate
    }
    if (reportFromDate) {
      obj['reportFromDate'] = reportFromDate
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
              setEmployeeDependantOrBeneficiaryDetails(res.data)
              setpaginationEmployeeDependantOrBeneficiaryDetails(res.data)
            } else {
              setEmployeeDependantOrBeneficiaryDetails(res.data)
              setpaginationEmployeeDependantOrBeneficiaryDetails(res.data)
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

  const handleSort = (sortOrder) => {
    let sortedEmployeeDependantOrBeneficiaryDetails = JSON.parse(JSON.stringify(employeeDependantOrBeneficiaryDetails));
    if (sortOrder == 'ASC') {
      sortedEmployeeDependantOrBeneficiaryDetails = sortedEmployeeDependantOrBeneficiaryDetails.sort((desA, desB) =>
        desA.name > desB.name
          ? 1
          : desB.name > desA.name
            ? -1
            : 0
      );
      setEmployeeDependantOrBeneficiaryDetails(sortedEmployeeDependantOrBeneficiaryDetails);
      setpaginationEmployeeDependantOrBeneficiaryDetails(sortedEmployeeDependantOrBeneficiaryDetails);
    } else {
      sortedEmployeeDependantOrBeneficiaryDetails = sortedEmployeeDependantOrBeneficiaryDetails.sort((desB, desA) =>
        desA.name > desB.name
          ? 1
          : desB.name > desA.name
            ? -1
            : 0
      );
      setEmployeeDependantOrBeneficiaryDetails(sortedEmployeeDependantOrBeneficiaryDetails);
      setpaginationEmployeeDependantOrBeneficiaryDetails(sortedEmployeeDependantOrBeneficiaryDetails);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    const filteredEmployeeDependantOrBeneficiaryDetails = allEmployeeDependantOrBeneficiaryDetails.filter(obj =>
      JSON.stringify(obj).toLowerCase().includes(event.target.value.toLowerCase())
    );

    if (filteredEmployeeDependantOrBeneficiaryDetails.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setEmployeeDependantOrBeneficiaryDetails(filteredEmployeeDependantOrBeneficiaryDetails);
    setpaginationEmployeeDependantOrBeneficiaryDetails(filteredEmployeeDependantOrBeneficiaryDetails);
  };

  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card className="card-box shadow-none">
          <div className="d-flex flex-column flex-md-row justify-content-between px-4 py-3">
            <div
              className={clsx(
                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                { 'is-active': searchOpen }
              )}>
              <TextField
                variant="outlined"
                size="small"
                id="input-with-icon-textfield22-2"
                placeholder="Search Employee, Beneficiary, Dependant..."
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
                  className="btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill">
                  <FilterListTwoToneIcon className="w-50" />
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
                  <div className="dropdown-menu-xxl overflow-hidden p-0">
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
                        <br></br>
                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block mt-4'>
                            Report from Date
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
                              id='outlined-reportFromDate'
                              fullWidth
                              size='small'
                              value={selectedReportFromDate}
                              onChange={event => {
                                setReportFromDate(event)
                              }}
                              KeyboardButtonProps={{
                                'aria-label': 'change date'
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <br></br>
                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block mt-4'>
                            Report To Date
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
                              id='outlined-reportToDate'
                              fullWidth
                              size='small'
                              value={selectedReportToDate}
                              onChange={event => {
                                setReportToDate(event)
                              }}
                              KeyboardButtonProps={{
                                'aria-label': 'change date'
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                    </div>
                    <div className="divider" />
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
                          setReportFromDate(null)
                          setReportToDate(null)
                        }}
                        size="small">
                        Clear Filters
                      </Button>
                    </div>
                    <div className="divider" />
                    <div className='p-3'>
                      <Grid container spacing={6}>
                        <Grid item md={12}>
                          <List className='nav-neutral-danger flex-column p-0'>
                            <ListItem
                              button
                              className='d-flex rounded-sm justify-content-center'
                              href='#/'
                              onClick={e => {
                                getDependantOrBeneficiaryDetails()
                                setfilteredDepartments([])
                                setfilteredLocations([])
                                setReportFromDate(null)
                                setReportToDate(null)
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
                  className="btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill">
                  <SettingsTwoToneIcon className="w-50" />
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
                  <div className="dropdown-menu-md overflow-hidden p-0">
                    <div className="font-weight-bold px-4 pt-3">Results</div>
                    <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                      <ListItem
                        button
                        href="#/"
                        onClick={(e) => {
                          setRecordsPerPage(10);
                          setPage(1)
                          setpaginationEmployeeDependantOrBeneficiaryDetails(employeeDependantOrBeneficiaryDetails);
                          handleClose2();
                        }}>
                        <div className="nav-link-icon mr-2">
                          <RadioButtonUncheckedTwoToneIcon />
                        </div>
                        <span className="font-size-md">
                          <b>10</b> results per page
                        </span>
                      </ListItem>
                      <ListItem
                        button
                        href="#/"
                        onClick={(e) => {
                          setRecordsPerPage(20);
                          setPage(1)
                          setpaginationEmployeeDependantOrBeneficiaryDetails(employeeDependantOrBeneficiaryDetails);
                          handleClose2();
                        }}>
                        <div className="nav-link-icon mr-2">
                          <RadioButtonUncheckedTwoToneIcon />
                        </div>
                        <span className="font-size-md">
                          <b>20</b> results per page
                        </span>
                      </ListItem>
                      <ListItem
                        button
                        href="#/"
                        onClick={(e) => {
                          setRecordsPerPage(30);
                          setPage(1)
                          setpaginationEmployeeDependantOrBeneficiaryDetails(employeeDependantOrBeneficiaryDetails);
                          handleClose2();
                        }}>
                        <div className="nav-link-icon mr-2">
                          <RadioButtonUncheckedTwoToneIcon />
                        </div>
                        <span className="font-size-md">
                          <b>30</b> results per page
                        </span>
                      </ListItem>
                    </List>
                    <div className="divider" />
                    <div className="font-weight-bold px-4 pt-4"> {type == 'Dependant' ? "Order(By Dependant Name)" : "Order(By Beneficiary Name)"}</div>
                    <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                      <ListItem
                        button
                        href="#/"
                        onClick={(e) => { handleSort('ASC'); handleClose2(); }}>
                        <div className="mr-2">
                          <ArrowUpwardTwoToneIcon />
                        </div>
                        <span className="font-size-md">Ascending</span>
                      </ListItem>
                      <ListItem
                        button
                        href="#/"
                        onClick={(e) => { handleSort('DES'); handleClose2(); }}>
                        <div className="mr-2">
                          <ArrowDownwardTwoToneIcon />
                        </div>
                        <span className="font-size-md">Descending</span>
                      </ListItem>
                    </List>
                  </div>
                </Menu>
              </div>
            </div>
          </div>
          <div className="divider" />
          {type == 'Dependant' && (
            <>
              <div className="p-4">
                <div className='text-center my-4'>
                  <span className='display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize'>
                    Employee Dependant Details
                  </span>
                </div>
                <div className="table-responsive-md">
                  <TableContainer>
                    <Table className="table table-alternate-spaced mb-0">
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
                            title='Relationship with Employee'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Relationship with Employee
                          </th>
                          <th
                            title='Name of Dependant'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Name of Dependant
                          </th>
                          <th
                            title='Gender'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Gender
                          </th>
                          <th
                            title='Marital Status'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Marital Status
                          </th>
                          <th
                            title='Age'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Age
                          </th>
                          <th
                            title='Dependant Address'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Dependant Address
                          </th>
                          <th
                            title='Is Disabled'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Is Disabled
                          </th>
                          <th
                            title='Is Student'
                            style={{ ...tableData, ...paddingTop }}
                            className='font-size-sm font-weight-bold pb-4 text-capitalize '
                            scope='col'>
                            Is Student
                          </th>
                        </tr>
                      </thead>
                      {paginationEmployeeDependantOrBeneficiaryDetails.length > 0 ? (
                        <>
                          <tbody>
                            {paginationEmployeeDependantOrBeneficiaryDetails
                              .slice(
                                page * recordsPerPage > employeeDependantOrBeneficiaryDetails.length
                                  ? page === 0
                                    ? 0
                                    : page * recordsPerPage - recordsPerPage
                                  : page * recordsPerPage - recordsPerPage,
                                page * recordsPerPage <= employeeDependantOrBeneficiaryDetails.length
                                  ? page * recordsPerPage
                                  : employeeDependantOrBeneficiaryDetails.length
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
                                          title={item.relationWithEmployee}>
                                          {item.relationWithEmployee}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.name}>
                                          {item.name}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.gender}>
                                          {item.gender}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.maritalStatus}>
                                          {item.maritalStatus}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.age}>
                                          {item.age}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.address}>
                                          {item.address}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.disabled}>
                                          {item.disabled ? 'Yes' : 'No'}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className='d-flex align-items-center'>
                                        <div
                                          style={tableData}
                                          title={item.isStudent}>
                                          {item.isStudent ? 'Yes' : 'No'}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
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
                  </TableContainer>
                </div>
                {paginationEmployeeDependantOrBeneficiaryDetails.length > 0 && (
                  <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                    <Pagination
                      className="pagination-primary"
                      count={Math.ceil(employeeDependantOrBeneficiaryDetails.length / recordsPerPage)}
                      variant="outlined"
                      shape="rounded"
                      selected={true}
                      page={page}
                      onChange={handleChange}
                      showFirstButton
                      showLastButton
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {type == 'Beneficiary' && (
            <div className="p-4">
              <div className='text-center my-4'>
                <span className='display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize'>
                  Employee Beneficiary Details
                </span>
              </div>

              <div style={{ overflow: 'auto' }} className='table-responsive-md'>
                <Table className="table table-alternate-spaced mb-0">
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
                        title='Beneficiary Type'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Beneficiary Type
                      </th>
                      <th
                        title='Beneficiary Name'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Beneficiary Name
                      </th>
                      <th
                        title='Beneficiary Address'
                        style={{ ...tableData, ...paddingTop }}
                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Beneficiary Address
                      </th>
                    </tr>
                  </thead>
                  {paginationEmployeeDependantOrBeneficiaryDetails.length > 0 ? (
                    <>
                      <tbody>
                        {paginationEmployeeDependantOrBeneficiaryDetails
                          .slice(
                            page * recordsPerPage > employeeDependantOrBeneficiaryDetails.length
                              ? page === 0
                                ? 0
                                : page * recordsPerPage - recordsPerPage
                              : page * recordsPerPage - recordsPerPage,
                            page * recordsPerPage <= employeeDependantOrBeneficiaryDetails.length
                              ? page * recordsPerPage
                              : employeeDependantOrBeneficiaryDetails.length
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
                                      title={item.beneficiaryType}>
                                      {item.beneficiaryType}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      style={tableData}
                                      title={item.name}>
                                      {item.name}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div
                                      style={tableData}
                                      title={item.address}>
                                      {item.address}
                                    </div>
                                  </div>
                                </td>
                              </tr>
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
              {paginationEmployeeDependantOrBeneficiaryDetails.length > 0 && (
                <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                  <Pagination
                    className="pagination-primary"
                    count={Math.ceil(employeeDependantOrBeneficiaryDetails.length / recordsPerPage)}
                    variant="outlined"
                    shape="rounded"
                    selected={true}
                    page={page}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                  />
                </div>
              )}
            </div>
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
      </BlockUi>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.Auth.user
  }
}
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDependantOrBeneficiaryDetails);
