import React, { useState, Component, useEffect } from 'react'
import avatar5 from '../../assets/images/avatars/avatar4.jpg'
import { useHistory, useLocation } from 'react-router-dom'
import {
  Grid,
  Checkbox,
  Card,
  Button,
  Table,
  ListItem,
  List,
  Menu,
  TableContainer,
  Popover,
  Snackbar,
  Box,
  Dialog
} from '@material-ui/core'

import clsx from 'clsx'

import { Alert, Pagination } from '@material-ui/lab'

import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Description, ForumRounded } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'
import apicaller from 'helper/Apicaller'

import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { CSVLink } from 'react-csv'

import { BASEURL } from 'config/conf'
import { TRUE } from 'sass'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDropzone } from 'react-dropzone'
import CheckIcon from '@material-ui/icons/Check'
import { parse } from 'papaparse'
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'

const UploadAddress = props => {
  const { selectedCompany, hideCodes, setHideCodes } = props
  const [state, setState] = useState({
    open1: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const { vertical, horizontal, open, toastrStyle, message } = state

  const toggle4 = () => setModal4(!modal4)
  const [modal4, setModal4] = useState(false)
  const [files, setFiles] = useState([])
  const [newFileUploaded, setNewFileUploaded] = useState(false)
  const [paginatedAddress, setPaginatedAddresss] = useState([])
  const [addressData, setAddressData] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const [navigateToUploadResultsPage, setNavigateToUploadResultsPage] =
    useState(false)
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults')
  const [allFilesData, allFilesDataForSave] = useState()

  useEffect(() => {
    getAddressCSVHeader()
  }, [])

  const [csvHeader, setCSVHeader] = useState()

  const getAddressCSVHeader = () => {
    apicaller('get', `${BASEURL}/address/CSVHeader`)
      .then(res => {
        if (res.status === 200) {
          setCSVHeader(res.data.CSVHeader)
        }
      })
      .catch(err => {
        console.log('get department err', err)
      })
  }

  const handleChange = (event, value) => {
    setPage(value)
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const saveAll = e => {
    let modifiedData = []

    addressData.forEach(item => {
      const data = {
        employeeId: item.Employee_Id,
        addressType: item.Address_Type,
        effectiveDate: item['Effective_Date(DD/MM/YYYY)'],
        country: item.Country,
        state: item.State,
        city: item.City,
        PIN: item.Pin_Code,
        address1: item.Address_Line_One,
        address2: item.Address_Line_Two,
        address3: item.Address_Line_Three,
        isPrimary: item.Is_Primary
      }
      modifiedData.push(data)
    })
    const fileData = {
      fileName: files[0].name,
      data: modifiedData
    }

    setNavigateToUploadResultsPage(true)
    setState({
      open: true,
      message:
        "Upload is in Queue Kindly verify the results in 'UPLOAD RESULTS' page",
      toastrStyle: 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    })

    setBlocking(true)
    apicaller('post', `${BASEURL}/address/saveAll`, fileData)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err?.response?.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizon: 'right'
          })
        }
      })
  }

  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    // noClick: true,
    // noKeyboard: true,
    multiple: false,
    accept: 'text/csv',
    onDrop: acceptedFiles => {
      acceptedFiles.forEach(async file => {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        )
        const text = await file.text()
        const result = parse(text, { header: true })
        // Removing blank rows
        const filteredArray = result.data.filter(obj => !Object.values(obj).every(val => val === ''));
        setPaginatedAddresss(filteredArray)
        setAddressData(filteredArray)
      })
      setNewFileUploaded(true)
    }
  })

  const thumbs = files.map((file, index) => (
    <Grid item md={12} className='p-2' key={file.name}>
      <div className='p-3 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
        {file.name} - {file.size}KB
        <Box textAlign='right'>
          <Button
            onClick={e => {
              files.splice(index, 1)
              thumbs.splice(index, 1)
              setPaginatedAddresss([])
              setAddressData([])
            }}
            className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center'>
            <FontAwesomeIcon icon={['fas', 'times']} className='font-size-sm' />
          </Button>
        </Box>
      </div>
    </Grid>
  ))

  const tableData = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '350px',
    minWidth: '150px'
  }

  const paddingTop = {
    paddingTop: '25px'
  }

  const csvLink = {
    filename: 'Address_Bulk_Upload_Template.csv',
    headers: csvHeader,
    data: []
  }

  const [anchorEl2, setAnchorEl2] = useState(null)
  const [blocking, setBlocking] = useState(false)
  const [ifNotValidated, setIfValidated] = useState(true)

  const handleClick2 = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const validateUploadingData = () => {
    let dataWithoutErrors = []
    let dataWithErrors = []
    setIfValidated(false)

    addressData.forEach((item, currentItemIndex) => {
      let isValid = true
      item.errors = []
      if (item.Employee_Id == null || item.Employee_Id.length == 0) {
        isValid = false
        item.errors.push('Employee Id can not be empty.\n')
      }
      if (item.Address_Type == null || item.Address_Type.length == 0) {
        isValid = false
        item.errors.push('Address Type can not be empty.\n')
      } else if (item.Address_Type.toLowerCase() !== 'home' && item.Address_Type.toLowerCase() !== 'hostel' && item.Address_Type.toLowerCase() !== 'permanent' && item.Address_Type.toLowerCase() !== 'temporary') {
        isValid = false
        item.errors.push('Address Type should be "Home", "Hostel", "Permanent" or "Temporary"')
      }
      if (
        item['Effective_Date(DD/MM/YYYY)'] == null ||
        item['Effective_Date(DD/MM/YYYY)'].length == 0
      ) {
        isValid = false
        item.errors.push('Effective Date can not be empty.\n')
      }
      if (item.Country == null || item.Country.length == 0) {
        isValid = false
        item.errors.push('Country can not be empty.\n')
      }
      if (item.State == null || item.State.length == 0) {
        isValid = false
        item.errors.push('State can not be empty.\n')
      }
      if (item.City == null || item.City.length == 0) {
        isValid = false
        item.errors.push('City can not be empty.\n')
      }
      if (item.Pin_Code == null || item.Pin_Code.length == 0) {
        isValid = false
        item.errors.push('Pin Code can not be empty.\n')
      }
      if (item.Address_Line_One == null || item.Address_Line_One.length == 0) {
        isValid = false
        item.errors.push('Address Line1 can not be empty.\n')
      }
      if (item.Address_Line_Two == null || item.Address_Line_Two.length == 0) {
        isValid = false
        item.errors.push('Address Line2 can not be empty.\n')
      }
      if (item.Address_Line_Three == null || item.Address_Line_Three.length == 0) {
        isValid = false
        item.errors.push('Address Line3 can not be empty.\n')
      }
      if (
        item.Is_Primary == null ||
        item.Is_Primary?.toLowerCase() != ('true') && item.Is_Primary?.toLowerCase() != ('false')
      ) {
        isValid = false
        item.errors.push(
          'Is Primary should be true or false. \n'
        )
      }

      if (isValid) {
        dataWithoutErrors.push(item)
      } else {
        dataWithErrors.push(item)
      }
    })
    const data = [...dataWithErrors]
    data.push(...dataWithoutErrors)
    setAddressData(data)
    setPaginatedAddresss(data)
    setState({
      open: true,
      message:
        dataWithErrors?.length > 0
          ? dataWithErrors.length +
          ' Records have errors kindly resolve them in order to save them'
          : 'No Errors found in the data you can save them',
      toastrStyle:
        dataWithErrors?.length > 0 ? 'toastr-warning' : 'toastr-success',
      vertical: 'top',
      horizontal: 'right'
    })
  }

  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <>
          {!hideCodes ? (
            <>
              <Grid container spacing={0}>
                <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
                  <Grid item container spacing={2} direction="row">
                    <Grid item md={12} className="font-size-sm d-flex align-items-center ">
                      <FontAwesomeIcon
                        icon={['far', 'file-excel']}
                        style={{ color: 'green' }}
                        className='btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill'
                      />
                      <CSVLink
                        {...csvLink}
                        style={{
                          color: 'green',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textTransform: 'capitalize',
                          '& :hover': {
                            textDecoration: 'underline'
                          }
                        }}>
                        click to Download the Template if you don't have one
                      </CSVLink>
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2} direction='row'>
                    <Grid item md={12}>
                      <Card
                        className='mt-4 p-3 p-lg-5 shadow-xxl codesCard'>
                        <div className='card-header'>
                          <div className='card-header--title'>
                            <p>
                              <b>Upload .CSV file</b>
                            </p>
                          </div>
                        </div>
                        <div className='dropzone'>
                          <div
                            {...getRootProps({
                              className: 'dropzone-upload-wrapper'
                            })}>
                            <input {...getInputProps()} />
                            <div className='dropzone-inner-wrapper bg-white'>
                              {isDragAccept && (
                                <div>
                                  <div className='d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-success mx-auto'>
                                    <svg
                                      className='d-140 opacity-2'
                                      viewBox='0 0 600 600'
                                      xmlns='http://www.w3.org/2000/svg'>
                                      <g transform='translate(300,300)'>
                                        <path
                                          d='M170.4,-137.2C213.2,-82.3,234.8,-11.9,223.6,56.7C212.4,125.2,168.5,191.9,104.3,226.6C40.2,261.3,-44.1,264,-104,229.8C-163.9,195.7,-199.4,124.6,-216.2,49.8C-233,-25.1,-231,-103.9,-191.9,-158C-152.7,-212.1,-76.4,-241.6,-6.3,-236.6C63.8,-231.6,127.7,-192.2,170.4,-137.2Z'
                                          fill='currentColor'
                                        />
                                      </g>
                                    </svg>
                                    <div className='blob-icon-wrapper'>
                                      <CheckIcon className='d-50' />
                                    </div>
                                  </div>
                                  <div className='font-size-sm text-success'>
                                    All files will be uploaded!
                                  </div>
                                </div>
                              )}
                              {isDragReject && (
                                <div>
                                  <div className='d-140 hover-scale-lg icon-blob icon-blob-animated btn-icon text-danger mx-auto'>
                                    <svg
                                      className='d-140 opacity-2'
                                      viewBox='0 0 600 600'
                                      xmlns='http://www.w3.org/2000/svg'>
                                      <g transform='translate(300,300)'>
                                        <path
                                          d='M169,-144C206.7,-87.5,216.5,-18,196.9,35.7C177.3,89.4,128.3,127.1,75.2,150.7C22,174.2,-35.4,183.5,-79.7,163.1C-124,142.7,-155.1,92.6,-164.1,40.9C-173.1,-10.7,-160.1,-64,-129,-118.9C-98,-173.8,-49,-230.4,8.3,-237.1C65.7,-243.7,131.3,-200.4,169,-144Z'
                                          fill='currentColor'
                                        />
                                      </g>
                                    </svg>
                                    <div className='blob-icon-wrapper'>
                                      <CloseTwoToneIcon className='d-50' />
                                    </div>
                                  </div>
                                  <div className='font-size-sm text-danger'>
                                    Some files will be rejected! Accepted only
                                    csv files
                                  </div>
                                </div>
                              )}
                              {!isDragActive && (
                                <div>
                                  <div className='d-140 hover-scale-lg icon-blob btn-icon text-first mx-auto'>
                                    <svg
                                      className='d-140 opacity-2'
                                      viewBox='0 0 600 600'
                                      xmlns='http://www.w3.org/2000/svg'>
                                      <g transform='translate(300,300)'>
                                        <path
                                          d='M171.2,-128.5C210.5,-87.2,223.2,-16.7,205.1,40.4C186.9,97.5,137.9,141.1,81.7,167.2C25.5,193.4,-38,202.1,-96.1,181.2C-154.1,160.3,-206.7,109.7,-217.3,52.7C-227.9,-4.4,-196.4,-68,-153.2,-110.2C-110,-152.4,-55,-173.2,5.5,-177.5C65.9,-181.9,131.9,-169.8,171.2,-128.5Z'
                                          fill='currentColor'
                                        />
                                      </g>
                                    </svg>
                                    <div className='blob-icon-wrapper'>
                                      <PublishTwoToneIcon className='d-50' />
                                    </div>
                                  </div>
                                  <div className='font-size-sm'>
                                    Drop files here or click to upload
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='card-footer p-3 bg-secondary'>
                          <div>
                            <div className='font-weight-normal mb-3 text-uppercase text-dark font-size-sm text-center'>
                              Uploaded Files
                            </div>
                            {thumbs.length <= 0 && (
                              <div className='text-first text-center font-size-sm'>
                                Uploaded demo File previews will appear here!
                              </div>
                            )}
                            {thumbs.length > 0 && (
                              <>
                                <div>
                                  <Alert
                                    severity='success'
                                    className='text-center mb-3'>
                                    You have uploaded <b>{thumbs.length}</b>{' '}
                                    files!
                                  </Alert>
                                  <Grid container spacing={0}>
                                    {thumbs}
                                  </Grid>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2} direction="row" className='mt-4'>
                    <Button
                      className="btn-primary m-2 "
                      type="submit"
                      disabled={files?.length == 0}
                      onClick={toggle4}>
                      Next
                    </Button>
                    <Button
                      className="btn-primary m-2 "
                      component={NavLink}
                      to="./dashboard">
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Dialog
                open={modal4}
                onClose={toggle4}
                classes={{ paper: 'shadow-sm-dark rounded-sm' }}>
                <div className='text-center p-5'>
                  <div className='avatar-icon-wrapper rounded-circle m-0'>
                    <div className='d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-first text-first m-0 d-130'>
                      <FontAwesomeIcon
                        icon={['far', 'keyboard']}
                        className='d-flex align-self-center display-3'
                      />
                    </div>
                  </div>
                  <h4 className='font-weight-bold mt-4'>Are you sure?</h4>
                  <p className='mb-0 text-black-50'>
                    Assuming the first row of the csv file is header
                  </p>
                  <div className='pt-4'>
                    <Button
                      onClick={toggle4}
                      className='btn-neutral-secondary btn-pill mx-1'>
                      <span className='btn-wrapper--label'>No</span>
                    </Button>
                    <Button
                      onClick={e => setHideCodes(true)}
                      className='btn-first btn-pill mx-1'>
                      <span className='btn-wrapper--label'>Yes</span>
                    </Button>
                  </div>
                </div>
              </Dialog>
            </>
          ) : (
            <>
              {paginatedAddress.length > 0 && (
                <>
                  <Box textAlign='right'>
                    <Button
                      className='btn-primary mt-3 mb-2 mr-3'
                      onClick={e => validateUploadingData()}>
                      Validate
                    </Button>

                    <Button
                      onClick={handleClick2}
                      className='mt-2 mr-3 btn-outline-primary align-items-center justify-content-center d-40 p-0 rounded-pill'>
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
                              setPaginatedAddresss(addressData)
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
                              setPaginatedAddresss(addressData)
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
                              setPaginatedAddresss(addressData)
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
                        <div className='font-weight-bold px-4 pt-4'>Order</div>
                      </div>
                    </Menu>
                  </Box>
                  <div className='p-4'>
                    <div
                      className='table-responsive-md'
                      style={{ overflow: 'auto' }}>
                      <Table className='table table-alternate-spaced mb-0'>
                        <thead>
                          <tr style={{ background: '#eeeeee' }}>
                            <th
                              title='Employee ID'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Employee ID
                            </th>
                            <th
                              title='Address Type'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Address Type
                            </th>
                            <th
                              title='Effective Date'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Effective Date
                            </th>
                            <th
                              title='Country'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Country
                            </th>
                            <th
                              title='State'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              State
                            </th>
                            <th
                              title='City'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              City
                            </th>
                            <th
                              title='Pincode'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Pincode
                            </th>
                            <th
                              title='Address Line1'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Address Line1
                            </th>
                            <th
                              title='Address Line2'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Address Line2
                            </th>
                            <th
                              title='Address Line3'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Address Line3
                            </th>
                            <th
                              title='Is Primary'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Is Primary
                            </th>
                            <th
                              title='Errors'
                              style={{
                                ...tableData,
                                ...paddingTop,
                                minWidth: '350px',
                                maxWidth: '650px'
                              }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Errors
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedAddress
                            .slice(
                              page * recordsPerPage > addressData.length
                                ? page === 0
                                  ? 0
                                  : page * recordsPerPage - recordsPerPage
                                : page * recordsPerPage - recordsPerPage,
                              page * recordsPerPage <= addressData.length
                                ? page * recordsPerPage
                                : addressData.length
                            )
                            .map((item, index) => (
                              <>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Employee_Id}>
                                          {item.Employee_Id}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Address_Type}>
                                          {item.Address_Type}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          title={
                                            item['Effective_Date(DD/MM/YYYY)']
                                          }>
                                          {item['Effective_Date(DD/MM/YYYY)']}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Country}>
                                          {item.Country}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label className='' title={item.State}>
                                          {item.State}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label className='' title={item.City}>
                                          {item.City}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Pin_Code}>
                                          {item.Pin_Code}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Address_Line_One}>
                                          {item.Address_Line_One}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Address_Line_Two}>
                                          {item.Address_Line_Two}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Address_Line_Three}>
                                          {item.Address_Line_Three}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item['Is_Primary']}>
                                          {item['Is_Primary']}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      minWidth: '350px',
                                      maxWidth: '650px'
                                    }}>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          style={
                                            item.errors?.length > 0
                                              ? { color: 'red' }
                                              : {}
                                          }
                                          className=''
                                          title={item?.errors}>
                                          {item?.errors}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className='divider'></tr>
                              </>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                    <Pagination
                      className='pagination-primary'
                      count={Math.ceil(addressData.length / recordsPerPage)}
                      variant='outlined'
                      shape='rounded'
                      selected={true}
                      page={page}
                      onChange={handleChange}
                      showFirstButton
                      showLastButton
                    />
                  </div>{' '}
                </>
              )}
              {navigateToUploadResultsPage ? (
                <div className='d-flex align-items-center justify-content-center'>
                  <a
                    href={uploadResultsUrl}
                    className='text-black'
                    title='Navigate To Upload Results Page'
                    style={{ color: 'blue' }}>
                    Navigate To Upload Results Page
                  </a>
                </div>
              ) : (
                ''
              )}
              <Box textAlign='right'>
                <Button
                  className='btn-primary mb-2 mr-3'
                  type='submit'
                  onClick={() => {
                    setHideCodes(false)
                    toggle4()
                  }}>
                  Back
                </Button>
                <Button
                  className='btn-primary mb-2 mr-3'
                  type='submit'
                  disabled={ifNotValidated}
                  onClick={e => saveAll(e)}>
                  Save all
                </Button>
              </Box>
            </>
          )}
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            key={`${vertical},${horizontal}`}
            open={open}
            classes={{ root: toastrStyle }}
            onClose={handleClose}
            message={message}
            autoHideDuration={2000}
          />
          <br></br>
        </>
      </BlockUi>
    </>
  )
}

export default UploadAddress
