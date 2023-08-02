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
import { connect } from 'react-redux'

const UploadJobGrade = props => {
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
  const [paginatedJobGrade, setPaginatedJobGrades] = useState([])
  const [jobGradeData, setJobGradeData] = useState([])
  const [recordsPerPage, setRecordsPerPage] = useState(5)
  const [page, setPage] = useState(1)
  const [navigateToUploadResultsPage, setNavigateToUploadResultsPage] =
    useState(false)
  const [uploadResultsUrl, setUploadResultsUrl] = useState('/uploadResults')
  const [allFilesData, allFilesDataForSave] = useState()

  useEffect(() => {
    getJobGradeCSVHeader()
  }, [])

  const [csvHeader, setCSVHeader] = useState()

  const getJobGradeCSVHeader = () => {
    apicaller('get', `${BASEURL}/jobGrade/CSVHeader`)
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

    jobGradeData.forEach(item => {
      const data = {
        gradeId: item.JobGrade_Id,
        gradeName: item.JobGrade_Name,
        effectiveDate: item['Effective_Date(DD/MM/YYYY)'],
        status: item.Effective_Status.toLowerCase() == 'true' ? true : false,
        description: item.Description,
        gradeSalaryRangeMinimum: item.Grade_Salary_Range_Minimum,
        gradeSalaryRangeMidPoint: item.Grade_Salary_Range_MidPoint,
        gradeSalaryRangeMaximum: item.Grade_Salary_Range_Maximum,
        progressionByService: item.Progression_By_Service.toLowerCase() == 'yes' ? true : false,
        minimumService: item.Minimum_Service,
        maximumService: item.Maximum_Service,
        progressionByReviewsRatings: item.Progression_By_Reviews_and_Ratings.toLowerCase() == 'yes' ? true : false,
        minimumNumberOfReviews: item.Minimum_Number_Of_Reviews,
        minimumRating: item.Minimum_Rating,
        averageRating: item.Average_Rating,
        finalRating: item.Final_Rating,
        progressionByAge: item['Progression_By_Age'].toLowerCase() == 'yes' ? true : false,
        minimumAge: item.MinimumAge,
        nextGrade: item.NextGrade
      }
      modifiedData.push(data)
    })
    const fileData = {
      fileName: files[0].name,
      data: modifiedData,
      forValidationOnly: false
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
    apicaller('post', `${BASEURL}/jobGrade/saveAll`, fileData)
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
        const filteredArray = result.data.filter(
          obj => !Object.values(obj).every(val => val === '')
        )
        setPaginatedJobGrades(filteredArray)
        setJobGradeData(filteredArray)
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
              setPaginatedJobGrades([])
              setJobGradeData([])
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
    filename: 'JobGrade_Bulk_Upload_Template.csv',
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

    jobGradeData.forEach((item, currentItemIndex) => {
      let isValid = true
      item.errors = []
      if (item.JobGrade_Id == null || item.JobGrade_Id.length == 0) {
        isValid = false
        item.errors.push('Grade ID can not be empty.\n')
      }

      if (item.JobGrade_Name == null || item.JobGrade_Name.length == 0) {
        isValid = false
        item.errors.push('Grade Name can not be empty.\n')
      }

      if (
        item['Effective_Date(DD/MM/YYYY)'] == null ||
        item['Effective_Date(DD/MM/YYYY)'].length == 0
      ) {
        isValid = false
        item.errors.push('Effective Date can not be empty.\n')
      }

      if (
        new Date(item['As_Of_Date(DD/MM/YYYY)']) <
        new Date(selectedCompany.registrationDate)
      ) {
        isValid = false
        item.errors.push(
          "As Of Date can not be before Company's Registration Date.\n"
        )
      }

      if (
        item.Effective_Status == null ||
        (item.Effective_Status?.toLowerCase() != 'true' &&
          item.Effective_Status?.toLowerCase() != 'false')
      ) {
        isValid = false
        item.errors.push(
          'Status should not be empty, It Should be true or false. \n'
        )
      }

      if (
        item.Progression_By_Service == null ||
        (item.Progression_By_Service?.toLowerCase() != 'yes' &&
          item.Progression_By_Service?.toLowerCase() != 'no')
      ) {
        isValid = false
        item.errors.push(
          'Progression By Service should not be empty, It Should be YES or No. \n'
        )
      }

      if (
        item.Progression_By_Service?.toLowerCase() == 'yes' &&
        (item.Minimum_Service == null ||
          item.Minimum_Service.length == 0 ||
          item.Maximum_Service == null ||
          item.Maximum_Service.length == 0)
      ) {
        isValid = false
        item.errors.push(
          'Progression By Service is set as Yes. So, Minimum and Maximum Services can not be empty. \n'
        )
      }

      if (
        item.Progression_By_Reviews_and_Ratings == null ||
        (item.Progression_By_Reviews_and_Ratings?.toLowerCase() != 'yes' &&
          item.Progression_By_Reviews_and_Ratings?.toLowerCase() != 'no')
      ) {
        isValid = false
        item.errors.push(
          'Progression By Ratings & Reviews should not be empty, It Should be YES or No. \n'
        )
      }

      if (
        item.Progression_By_Reviews_and_Ratings?.toLowerCase() == 'yes' &&
        (item.Minimum_Rating == null ||
          (item.Minimum_Rating.length == 0 &&
            item.Average_Rating == null &&
            item.Average_Rating.length == 0 &&
            item.Final_Rating == null &&
            item.Final_Rating.length == 0))
      ) {
        isValid = false
        item.errors.push(
          'Progression By Reviews and Ratings is set as Yes. So, Minimum or Average or Final(Any one) Rating should be there. \n'
        )
      }

      if (
        item['Progression_By_Age'] == null ||
        (item['Progression_By_Age']?.toLowerCase() != 'yes' &&
          item['Progression_By_Age']?.toLowerCase() != 'no')
      ) {
        isValid = false
        item.errors.push(
          'Progression By Age should not be empty, It Should be YES or No. \n'
        )
      }

      if (
        item['Progression_By_Age']?.toLowerCase() == 'yes' &&
        (item.MinimumAge == null || item.MinimumAge.length == 0)
      ) {
        isValid = false
        item.errors.push(
          'Progression By Age is set as Yes. So, Minimum Age can not be empty. \n'
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
    setJobGradeData(data)
    setPaginatedJobGrades(data)
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
              {paginatedJobGrade.length > 0 && (
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
                              setPaginatedJobGrades(jobGradeData)
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
                              setPaginatedJobGrades(jobGradeData)
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
                              setPaginatedJobGrades(jobGradeData)
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
                              title='GRADE ID'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              GRADE ID
                            </th>
                            <th
                              title='GRADE NAME'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              GRADE NAME
                            </th>
                            <th
                              title='Effective Date'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Effective Date
                            </th>
                            <th
                              title='Status'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Status
                            </th>
                            <th
                              title='Description'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Description
                            </th>
                            <th
                              title='Grade Salary Range Minimum'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Grade Salary Range Minimum
                            </th>
                            <th
                              title='Grade Salary Range MidPoint'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Grade Salary Range MidPoint
                            </th>
                            <th
                              title='Grade Salary Range Maximum'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Grade Salary Range Maximum
                            </th>
                            <th
                              title='Progression By Service'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Progression By Service
                            </th>
                            <th
                              title='Minimum Service'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Minimum Service
                            </th>
                            <th
                              title='Maximum Service'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Maximum Service
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Progression By Number of Reviews And Ratings
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Minimum Number of Reviews
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize'
                              scope='col'>
                              Minimum Rating
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize'
                              scope='col'>
                              Average Rating
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Final Rating
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Progression By Age
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Minimum Age
                            </th>
                            <th
                              title='Progression By Number of Reviews And Ratings'
                              style={{ ...tableData, ...paddingTop }}
                              className='font-size-sm font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Next Grade
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
                          {paginatedJobGrade
                            .slice(
                              page * recordsPerPage > jobGradeData.length
                                ? page === 0
                                  ? 0
                                  : page * recordsPerPage - recordsPerPage
                                : page * recordsPerPage - recordsPerPage,
                              page * recordsPerPage <= jobGradeData.length
                                ? page * recordsPerPage
                                : jobGradeData.length
                            )
                            .map((item, index) => (
                              <>
                                <tr>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.JobGrade_Id}>
                                          {item.JobGrade_Id}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.JobGrade_Name}>
                                          {item.JobGrade_Name}
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
                                          title={item.Effective_Status}>
                                          {item.Effective_Status}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Description}>
                                          {item.Description}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={
                                            item.Grade_Salary_Range_Minimum
                                          }>
                                          {item.Grade_Salary_Range_Minimum}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={
                                            item.Grade_Salary_Range_MidPoint
                                          }>
                                          {item.Grade_Salary_Range_MidPoint}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={
                                            item.Grade_Salary_Range_Maximum
                                          }>
                                          {item.Grade_Salary_Range_Maximum}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Progression_By_Service}>
                                          {item.Progression_By_Service}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Minimum_Service}>
                                          {item.Minimum_Service}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Maximum_Service}>
                                          {item.Maximum_Service}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={
                                            item.Progression_By_Reviews_and_Ratings
                                          }>
                                          {
                                            item.Progression_By_Reviews_and_Ratings
                                          }
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={
                                            item.Minimum_Number_Of_Reviews
                                          }>
                                          {item.Minimum_Number_Of_Reviews}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Minimum_Rating}>
                                          {item.Minimum_Rating}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Average_Rating}>
                                          {item.Average_Rating}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.Final_Rating}>
                                          {item.Final_Rating}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item['Progression_By_Age']}>
                                          {item['Progression_By_Age']}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.MinimumAge}>
                                          {item.MinimumAge}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <div>
                                        <label
                                          className=''
                                          title={item.NextGrade}>
                                          {item.NextGrade}
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
                      count={Math.ceil(jobGradeData.length / recordsPerPage)}
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
                    setIfValidated(true)
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

const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(UploadJobGrade)
