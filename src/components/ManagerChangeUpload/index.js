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

const UploadManagerChange = props => {
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
  const [paginationManagerChange, setPaginationManagerChange] = useState([])
  const [addressData, setAddressData] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const [navigateToUploadResultsPage, setNavigateToUploadResultsPage] =
    useState(false)
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults')

  useEffect(() => {
    getManagerCSVHeader()
  }, [])

  const [csvHeader, setCSVHeader] = useState()

  const getManagerCSVHeader = () => {
    apicaller('get', `${BASEURL}/employee/managerUpload/CSVHeader`)
      .then(res => {
        if (res.status === 200) {
          setCSVHeader(res.data.CSVHeader)
        }
      })
      .catch(err => {
        console.log('get Manager Change err', err)
      })
  }

  const handleChange = (event, value) => {
    setPage(value)
  }

  const handleClose = () => {
    setState({ ...state, open: false })
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
      if (item.Action == null || item.Action.length == 0) {
        isValid = false
        item.errors.push('Action can not be empty.\n')
      }
      if (item.Action_Reason == null || item.Action_Reason.length == 0) {
        isValid = false
        item.errors.push('Action Reason can not be empty.\n')
      }
      if (
        item['Effective_Date'] == null ||
        item['Effective_Date'].length == 0
      ) {
        isValid = false
        item.errors.push('Effective As Of Date can not be empty.\n')
      }
      if (item.Manager_ID == null || item.Manager_ID.length == 0) {
        isValid = false
        item.errors.push('Manager ID can not be empty.\n')
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
    setPaginationManagerChange(data)
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

  const saveAll = e => {
    let modifiedData = []

    addressData.forEach(item => {
      const data = {
        employeeId: item.Employee_Id,
        actionCode: item.Action,
        actionReason: item.Action_Reason,
        effectiveDate: item['Effective_Date'],
        managerId: item.Manager_ID
      }
      modifiedData.push(data)
    })
    const fileData = {
      fileName: files[0].name,
      data: modifiedData,
      forValidationOnly: false,
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
    apicaller('post', `${BASEURL}/employee/uploadUpdateEmployee`, fileData)
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
        setPaginationManagerChange(filteredArray)
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
              setPaginationManagerChange([])
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
    filename: 'Manager_Change_Bulk_Upload_Template.csv',
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
                <Grid item xs={10} md={10} lg={10} xl={11} className='mx-auto'>
                  <Grid item container spacing={2} direction='row'>
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
                        Click to Download the Template if you don't have one
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
              {paginationManagerChange.length > 0 && (
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
                              setPaginationManagerChange(addressData)
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
                              setPaginationManagerChange(addressData)
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
                              setPaginationManagerChange(addressData)
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
                              title='Action'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Action
                            </th>
                            <th
                              title='Action Reason'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Action Reason
                            </th>
                            <th
                              title='Effective Date'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Effective Date
                            </th>
                            <th
                              title='Manager ID'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Manager ID
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
                          {paginationManagerChange
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
                                          title={item.Action}>
                                          {item.Action}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Action_Reason}>
                                          {item.Action_Reason}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          title={
                                            item['Effective_Date']
                                          }>
                                          {item['Effective_Date']}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Manager_ID}>
                                          {item.Manager_ID}
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

export default UploadManagerChange
