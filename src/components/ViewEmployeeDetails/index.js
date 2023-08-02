import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from 'react-redux'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import avatar5 from '../../assets/images/avatars/avatar8.png'

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
  Tooltip,
  CardContent
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
import styles from './employee.module.css'
import { useDropzone } from 'react-dropzone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone'
import CheckIcon from '@material-ui/icons/Check'
import { file } from 'jszip'

const ViewEmployeeDetails = props => {
  const { selectedEmployee } = props
  const { selectedCompany } = props
  const [showUploadImage, setShowUploadImage] = useState(false)
  const [employeeDetail, setEmployeeDetails] = useState()
  const [newDocumentUploaded, setNewDocumentUploaded] = useState(false)
  const [documentObj, setDocumentObj] = useState()
  const [filePath, setFilePath] = useState();
  const [fileName, setFileName] = useState();

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const [orgData, setOrgData] = useState()

  useEffect(() => {
    console.log(selectedEmployee)
    console.log(selectedCompany)
    if (selectedEmployee) {
      fetchEmployeesHirarchy(selectedEmployee)
      setBlocking(true)
      apicaller(
        'get',
        `${BASEURL}/employee/employee-details?uuid=${selectedEmployee.uuid}`
      )
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            if (res.data) {
              setEmployeeDetails(res.data)
              checkIfProfileImg(res.data?.file)
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          if (err.response?.data) {
          }
          console.log('get employee err', err)
        })
    }
  }, [])

  const fetchEmployeesHirarchy = employee => {
    setBlocking(true)
    apicaller(
      'post',
      `${BASEURL}/employee/fetchEmployeesHirarchy?uuid=${employee.uuid}&companyUUID=${selectedCompany.uuid}`
    )
      .then(async res => {
        if (res.status === 200) {
          setBlocking(false)
          if (res.data[0]) {
            let empArray = []

            if (res.data[0]?.file) {
              res.data[0]['imgSrc'] = await getImage(res.data[0]?.file)
            }

            if (res.data[0].managerData.length > 0) {
              for (let i = 0; i < res.data[0].managerData.length; i++) {
                if (res.data[0].managerData[i].file) {
                  res.data[0].managerData[i]['imgSrc'] = await getImage(
                    res.data[0].managerData[i].file
                  )
                } else {
                }
              }
            }

            if (res.data[0].reportees.length > 0) {
              for (let i = 0; i < res.data[0].reportees.length; i++) {
                if (res.data[0].reportees[i].file) {
                  res.data[0].reportees[i]['imgSrc'] = await getImage(
                    res.data[0].reportees[i].file
                  )
                } else {
                }
              }
            }
            setOrgData(res.data[0])
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err.response?.data) {
        }
        console.log('get employee err', err)
      })
  }

  const checkIfProfileImg = file => {
    if (file) {
      let path =
        file?.filePath +
        '/' +
        file?.fileName
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then(res => {
          if (res.status === 200) {
            if (res.data) {
              let baseStr64 = res.data
              let imgSrc64 = 'data:image/jpg;base64,' + baseStr64
              // Set the source of the Image to the base64 string
              setProfileImg(imgSrc64)
            }
          }
        })
        .catch(err => {
          console.log('updateSession err', err)
        })
    }
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
  const [files, setFiles] = useState([])
  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
    getRootProps,
    getInputProps
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
      setNewDocumentUploaded(false)
      setFilePath()
      setDocumentObj()
    }
  })
  const thumbs = files.map(file => (
    <div
      key={file.name}
      className='rounded avatar-image overflow-hidden d-140 bg-neutral-success text-center font-weight-bold text-success d-flex justify-content-center align-items-center'>
      <img
        className='img-fluid img-fit-container rounded-sm'
        src={file.preview}
        alt='...'
      />
    </div>
  ))

  const uploadDocument = () => {
    setBlocking(true)
    let path = 'document/logo'
    let formData = new FormData()
    formData.append('file', files[0])
    formData.append('documentType', files[0].name)
    apicaller(
      'post',
      `${BASEURL}/storage/uploadFile`,
      formData
    )
      .then(res => {
        console.log('res.data', res.data)
        setBlocking(false)
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setDocumentObj(res.data)
          let path = res.data.filePath + '/' + res.data.fileName
          setFilePath(path)
          setFileName(res.data.fileName)
          setNewDocumentUploaded(true)
          setShowUploadImage(false)

          saveObj({
            uuid: selectedEmployee.uuid,
            file: res.data
          })
          if (selectedEmployee.file) {
            deleteFile(selectedEmployee.file.filePath + '/' + selectedEmployee.file.fileName)
          }

          setState({
            open: true,
            message: 'File Uploaded Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('upload err', err)
        setState({
          open: true,
          message: 'err',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  }

  const saveObj = (inputObj) => {
    setBlocking(true);
    apicaller('put', `${BASEURL}/employee/update`, inputObj)
      .then((res) => {
        setBlocking(false);
        if (res.status === 200) {
          console.log('res.data', res.data);
          checkIfProfileImg(inputObj.file)
          setState({
            open: true,
            message: 'Employee Details Updated Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          });
        }
      })
      .catch((err) => {
        setBlocking(false);
        setState({
          open: true,
          message: 'Error Occured while creating Employee Details',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
        console.log('create employee err', err);
      });
  };

  const deleteFile = (filePath) => {
    if (filePath) {
      setBlocking(true)
      apicaller('delete', `${BASEURL}/storage?path=` + filePath)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            if (res.data) {
              setNewDocumentUploaded(false)
              setFiles([])
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('updateSession err', err)
        })
    }
  }
  const [profileImg, setProfileImg] = useState(null)
  const [blocking, setBlocking] = useState(false)

  const editBtn = {}

  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const getInitials = name => {
    if (name) {
      let first_name = name.charAt(0)
      let last_name = name.split(' ').pop().charAt(0)
      return first_name + last_name
    }
  }

  const getImage = file => {
    return new Promise(resolve => {
      if (file) {
        let path = file?.filePath + '/' + file?.fileName
        apicaller('get', `${BASEURL}/storage?path=` + path)
          .then(res => {
            if (res.status === 200) {
              if (res.data) {
                let baseStr64 = res.data
                let imgSrc64 = 'data:image/jpg;base64,' + baseStr64
                // Set the source of the Image to the base64 string
                resolve(imgSrc64)
              }
            }
          })
          .catch(err => {
            console.log('updateSession err', err)
          })
      }
    })
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Grid container spacing={0}>
        <Grid item md={11} lg={11} xl={11} className='mx-auto'>
          <Card className='card-box' style={{ wordWrap: 'break-word' }}>
            <div className='card-header bg-secondary'>
              <div className='card-header--title'>
                <b>Personal Details</b>
              </div>
            </div>
            <div className='scroll-area-lg shadow-overflow'>
              <PerfectScrollbar options={{ wheelPropagation: false }}>
                <div className='p-4'>
                  <Grid item container direction='row'>
                    <Grid item md={4}>
                      <Grid item container>
                        <Grid item md={5}>
                          <div className='font-size-sm mb-3'>
                            Employee Name
                          </div>
                        </Grid>
                        <Grid item md={5}>
                          <div className='opacity-8 font-size-sm mb-3'>
                            {employeeDetail?.employeeName ? employeeDetail.employeeName : <>&nbsp;</>}
                          </div>
                        </Grid>
                        <Grid item md={1}>
                          <div className='font-size-sm mb-1'>
                            <Button
                              style={editBtn}
                              component={NavLink}
                              to={"./employeeInfoHistory?type=EmployeeName&employeeUUID=" + selectedEmployee.uuid}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['far', 'edit']}
                                className='font-size-xs'
                              />
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item md={5}>
                          <div className='font-size-sm mb-3'>
                            Employee Gender
                          </div>
                        </Grid>
                        <Grid item md={5}>
                          <div className='opacity-8 font-size-sm mb-3'>
                            {employeeDetail?.gender ? employeeDetail.gender : <>&nbsp;</>}
                          </div>
                        </Grid>
                        <Grid item md={1}>
                          <div className='font-size-sm mb-1'>
                            <Button
                              style={editBtn}
                              component={NavLink}
                              to={"./employeeInfoHistory?type=EmployeeGender&employeeUUID=" + selectedEmployee.uuid}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['far', 'edit']}
                                className='font-size-xs'
                              />
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item md={5}>
                          <div className='font-size-sm mb-3'>
                            Marital Status
                          </div>
                        </Grid>
                        <Grid item md={5}>
                          <div className='opacity-8 font-size-sm mb-3'>
                            {employeeDetail?.maritalStatus ? employeeDetail.maritalStatus : <>&nbsp;</>}
                          </div>
                        </Grid>
                        <Grid item md={1}>
                          <div className='font-size-sm mb-1'>
                            <Button
                              style={editBtn}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['far', 'edit']}
                                className='font-size-xs'
                              />
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item md={5}>
                          <div className='font-size-sm mb-3'>
                            Personal Email ID
                          </div>
                        </Grid>
                        <Grid item md={5}>
                          <div className='opacity-8 font-size-sm mb-3'>
                            {employeeDetail?.employeeEmail ? employeeDetail.employeeEmail : <>&nbsp;</>}
                          </div>
                        </Grid>
                        <Grid item md={1}>
                          <div className='font-size-sm mb-1'>
                            <Button
                              style={editBtn}
                              component={NavLink}
                              to={"./employeeInfoHistory?type=EmployeeEmail&employeeUUID=" + selectedEmployee.uuid}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['far', 'edit']}
                                className='font-size-xs'
                              />
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5}>
                      <Grid item container>
                        <Grid item md={5}>
                          <div className='font-size-sm mb-3'>
                            Employee Preffered Address
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          <div className='opacity-8 font-size-sm mb-3'>
                            {employeeDetail?.employeePreferredAddress?.address1}&nbsp;
                            {employeeDetail?.employeePreferredAddress?.address2}&nbsp;
                            {employeeDetail?.employeePreferredAddress?.address3}&nbsp;
                            {employeeDetail?.employeePreferredAddress?.city}&nbsp;
                            {employeeDetail?.employeePreferredAddress?.pin}&nbsp;
                            {employeeDetail?.employeePreferredAddress?.state}&nbsp;
                            {employeeDetail?.employeePreferredAddress?.country}&nbsp;
                          </div>
                        </Grid>
                        <Grid item md={1}>
                          <div className='font-size-sm mb-1'>
                            <Button
                              style={editBtn}
                              component={NavLink}
                              to={"./employeeInfoHistory?type=EmployeeAddress&employeeUUID=" + selectedEmployee.uuid}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['far', 'edit']}
                                className='font-size-xs'
                              />
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid item md={5}>
                          <div className='font-size-sm mb-3'>
                            Personal Phone Number
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          <div className='opacity-8 font-size-sm mb-3'>
                            {employeeDetail?.employeePhone}
                          </div>
                        </Grid>
                        <Grid item md={1}>
                          <div className='font-size-sm mb-1'>
                            <Button
                              style={editBtn}
                              component={NavLink}
                              to={"./employeeInfoHistory?type=EmployeePhone&employeeUUID=" + selectedEmployee.uuid}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon
                                icon={['far', 'edit']}
                                className='font-size-xs'
                              />
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3}>
                      <Grid item container>
                        <Grid item>
                          <div className='d-flex px-4'>
                            {!showUploadImage && (
                              <div className='rounded avatar-image overflow-hidden d-140 bg-neutral-success text-center text-success d-flex justify-content-center align-items-center'>
                                {profileImg ? (
                                  <img className='img-fluid img-fit-container rounded-sm' src={profileImg} alt='...' />
                                ) : (
                                  <img className='img-fluid img-fit-container rounded-sm' src={avatar5} style={{ width: '100px', height: '100px' }}
                                    alt='...' />)}
                              </div>
                            )}
                            {showUploadImage && (
                              <>
                                <label className=' mb-2'>
                                  Add Employee Photo
                                </label>
                                <div className='py-4 d-flex'>
                                  <div className='dropzone rounded shadow-xxl'>
                                    <div
                                      {...getRootProps({
                                        className: 'dropzone-upload-wrapper'
                                      })}>
                                      <input {...getInputProps()} />
                                      <div className='dropzone-inner-wrapper d-140 rounded dropzone-avatar'>
                                        <div className='avatar-icon-wrapper d-140 rounded m-2'>
                                          <Button
                                            onClick={open}
                                            className='avatar-button badge shadow-sm btn-icon badge-position badge-position--top-right border-0 text-indent-0 d-40 badge-circle btn-second text-white'>
                                            <PublishTwoToneIcon className='d-20' />
                                          </Button>
                                          <div>
                                            {isDragAccept && (
                                              <div className='rounded overflow-hidden d-140 bg-success text-center font-weight-bold text-white d-flex justify-content-center align-items-center'>
                                                <CheckIcon className='d-40' />
                                              </div>
                                            )}
                                            {isDragReject && (
                                              <div className='rounded overflow-hidden d-140 bg-danger text-center font-weight-bold text-white d-flex justify-content-center align-items-center'>
                                                <CloseTwoToneIcon className='d-60' />
                                              </div>
                                            )}
                                            {!isDragActive && (
                                              <div className='rounded overflow-hidden d-140 bg-neutral-dark text-center font-weight-bold text-black-50 d-flex justify-content-center align-items-center'>
                                                <AccountCircleTwoToneIcon className='d-50' />
                                              </div>
                                            )}
                                          </div>

                                          {thumbs.length > 0 && <div>{thumbs}</div>}
                                        </div>
                                      </div>
                                    </div>
                                    {files[0] && !filePath && (
                                      <Button
                                        className='btn-primary mb-2 m-2'
                                        style={{ width: "-webkit-fill-available" }}
                                        type='submit'
                                        onClick={e => uploadDocument()}>
                                        Save
                                      </Button>
                                    )}

                                    {filePath && (
                                      <Button
                                        size='small'
                                        onClick={() => setFiles([])}
                                        className='btn-primary m-4'
                                        style={{ width: "-webkit-fill-available" }}>
                                        Remove
                                      </Button>
                                    )}

                                  </div>
                                </div>
                              </>
                            )}
                            <Button
                              onClick={() => setShowUploadImage(true)}
                              className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                              <FontAwesomeIcon icon={['far', 'edit']} className='font-size-xs' />
                            </Button>
                          </div>
                        </Grid>

                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <hr></hr>
                <div className='p-4 d-flex justify-content-between'>
                  <b>Emergency Contact</b>
                  <Button
                    style={editBtn}
                    component={NavLink}
                    to={"./employeeInfoHistory?type=EmployeeEmergencyContact&employeeUUID=" + selectedEmployee.uuid}
                    className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                    <FontAwesomeIcon
                      icon={['far', 'edit']}
                      className='font-size-xs'
                    />
                  </Button>
                </div>
                <div className='p-4'>
                  <Grid item container direction='row'>
                    <Grid item className="d-flex">
                      <Grid item style={{ marginRight: '10px' }}>
                        <div className='font-size-sm mb-3'>
                          Contact Name
                        </div>
                        <div className='font-size-sm mb-3'>
                          Contact Number
                        </div>
                        <div className='font-size-sm mb-3'>
                          Relationship With Employee
                        </div>
                      </Grid>
                      <Grid item>
                        <p className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.emergencyContactName ? employeeDetail.emergencyContactName : <>&nbsp;</>}
                        </p>
                        <p className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.emergencyContactNumber ? employeeDetail.emergencyContactNumber : <>&nbsp;</>}
                        </p>
                        <p className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.emergencyContact?.relationship ? employeeDetail.emergencyContact.relationship : <>&nbsp;</>}
                        </p>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <hr></hr>
                <div className='p-4 d-flex justify-content-between'>
                  <b>Biographical Details</b>
                  <Button
                    style={editBtn}
                    component={NavLink}
                    to={"./editBiographicalDetails?type=EditBiographicalDetails&employeeUUID=" + selectedEmployee.uuid}
                    className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                    <FontAwesomeIcon
                      icon={['far', 'edit']}
                      className='font-size-xs'
                    />
                  </Button>
                </div>
                <div className='p-4'>
                  <Grid container spacing={0}>
                    <Grid md={12} className="d-flex">
                      <Grid item md={3}>
                        <div className="font-size-sm mb-3">
                          Employee Birth Country
                        </div>
                        <div className="font-size-sm mb-3">
                          Employee Birth State
                        </div>
                        <div className="font-size-sm mb-3">
                          Employee Birth Place
                        </div>
                        <div className='font-size-sm mb-3'>
                          Employee Nationality
                        </div>
                      </Grid>
                      <Grid item md={3}>
                        <div className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.birthCountry ? employeeDetail?.birthCountry : <>&nbsp;</>}
                        </div>
                        <div className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.birthState ? employeeDetail?.birthState : <>&nbsp;</>}
                        </div>
                        <div className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.birthPlace ? employeeDetail.birthPlace : <>&nbsp;</>}
                        </div>
                        <div className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.nationality ? employeeDetail.nationality : <>&nbsp;</>}
                        </div>
                      </Grid>
                      <Grid item md={3}>
                        <div>
                          <div className="font-size-sm mb-3">
                            DOB
                          </div>
                          <div className='font-size-sm mb-3'>
                            Celebrates On
                          </div>
                          <div className="font-size-sm mb-3">
                            Blood Group
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={3}>
                        <p className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.dob ? getParsedDate(employeeDetail.dob) : <>&nbsp;</>}
                        </p>
                        <p className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.celebratesOn ? getParsedDate(employeeDetail.celebratesOn) : <>&nbsp;</>}
                        </p>
                        <p className='opacity-8 font-size-sm mb-3'>
                          {employeeDetail?.bloodGroup ? employeeDetail.bloodGroup : <>&nbsp;</>}
                        </p>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </PerfectScrollbar>
            </div>
          </Card>
          <br></br>
          <Card className='card-box'>
            <div className='card-header bg-secondary'>
              <div className='card-header--title'>
                <b>Org Chart</b>
              </div>
            </div>
            <Grid container spacing={0}>
              <Grid item md={12} className="mx-auto">
                <div className='scroll-area-lg shadow-overflow'>
                  <PerfectScrollbar options={{ wheelPropagation: true }}>
                    <div>
                      {orgData ? (
                        <div className={styles.orgTree}>
                          <ul style={{ paddingLeft: '0px' }}>
                            <li style={{ float: 'inherit' }}>
                              {orgData?.managerData.length > 0 ? (
                                <>
                                  {orgData?.managerData.map((managerData, idx) => (
                                    <>
                                      <div
                                        className={styles.card1}
                                        onClick={e =>
                                          fetchEmployeesHirarchy(managerData)
                                        }>
                                        <div className={styles.card1Body}>
                                          <Grid
                                            item
                                            md={12}
                                            container
                                            className='mx-auto mb-2'
                                            direction='row'>
                                            <Grid item md={3}>
                                              {managerData?.file ? (
                                                <div className='avatar-icon-wrapper avatar-icon-lg'>
                                                  <div className='avatar-icon'>
                                                    <img
                                                      src={managerData?.imgSrc}
                                                      alt={getInitials(
                                                        managerData?.employeeName
                                                      )}
                                                    />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className='avatar-icon-wrapper avatar-initials avatar-icon-lg'>
                                                  <div className='avatar-icon text-white bg-success'>
                                                    {getInitials(
                                                      managerData?.employeeName
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </Grid>{' '}
                                            <Grid
                                              item
                                              md={9}
                                              style={{
                                                paddingLeft: '10px'
                                              }}>
                                              <span
                                                style={{
                                                  textAlign: 'left'
                                                }}>
                                                <h6>
                                                  {' '}
                                                  {managerData?.employeeName} (
                                                  {managerData?.employeeID})
                                                </h6>
                                                <p> {managerData?.department}</p>
                                                <p> {managerData?.location}</p>

                                                {managerData?.employeePhone ==
                                                  'NA' ? (
                                                  ''
                                                ) : (
                                                  <p>
                                                    {managerData?.employeePhone}
                                                  </p>
                                                )}
                                                { }

                                                {managerData?.employeeEmail ==
                                                  'NA' ? (
                                                  ''
                                                ) : (
                                                  <p>
                                                    {' '}
                                                    {managerData?.employeeEmail}
                                                  </p>
                                                )}
                                              </span>
                                            </Grid>{' '}
                                          </Grid>
                                        </div>
                                        <div className={styles.cardFooter}>
                                          <p>{managerData?.designation}</p>
                                        </div>
                                        <div></div>
                                      </div>{' '}
                                    </>
                                  ))}
                                </>
                              ) : (
                                ''
                              )}
                              {orgData?.managerData.length > 0 ? (
                                <ul></ul>
                              ) : (
                                ''
                              )}
                              <div
                                className={styles.card1}
                                onClick={e => fetchEmployeesHirarchy(orgData)}>
                                <div className={styles.card1Body}>
                                  <Grid
                                    item
                                    md={12}
                                    container
                                    className='mx-auto mb-2'
                                    direction='row'>
                                    <Grid item md={3}>
                                      {orgData?.file ? (
                                        <div className='avatar-icon-wrapper avatar-icon-lg'>
                                          <div className='avatar-icon'>
                                            <img
                                              src={orgData.imgSrc}
                                              alt={getInitials(
                                                orgData?.employeeName
                                              )}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className='avatar-icon-wrapper avatar-initials avatar-icon-lg'>
                                          <div className='avatar-icon text-white bg-success'>
                                            {getInitials(orgData?.employeeName)}
                                          </div>
                                        </div>
                                      )}
                                    </Grid>{' '}
                                    <Grid
                                      item
                                      md={9}
                                      style={{ paddingLeft: '10px' }}>
                                      <span style={{ textAlign: 'left' }}>
                                        <h6>
                                          {' '}
                                          {orgData?.employeeName} (
                                          {orgData?.employeeID})
                                        </h6>
                                        <p> {orgData?.department}</p>
                                        <p> {orgData?.location}</p>
                                        {orgData?.employeePhone == 'NA' ? (
                                          ''
                                        ) : (
                                          <p> {orgData?.employeePhone} </p>
                                        )}
                                        {orgData?.employeeEmail == 'NA' ? (
                                          ''
                                        ) : (
                                          <p> {orgData?.employeeEmail} </p>
                                        )}
                                      </span>
                                    </Grid>{' '}
                                  </Grid>
                                </div>
                                <div className={styles.cardFooter}>
                                  <p>{orgData?.designation}</p>
                                </div>
                                <div></div>
                              </div>
                              {orgData?.reportees.length > 0 ? <ul></ul> : ''}
                            </li>
                          </ul>
                          <div className={styles.orgTree}>
                            <ul style={{ padding: '0px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  overflowX: 'scroll',
                                  marginLeft: '16px',
                                  marginRight: '16px',
                                  marginTop: '-17px'
                                }}>
                                {orgData?.reportees.length > 0 ? (
                                  <>
                                    {orgData?.reportees.map((item, idx) => (
                                      <>
                                        <li className='mb-4'>
                                          {' '}
                                          <div
                                            className={styles.card1}
                                            onClick={e =>
                                              fetchEmployeesHirarchy(item)
                                            }>
                                            <div className={styles.card1Body}>
                                              <Grid
                                                item
                                                md={12}
                                                container
                                                className='mx-auto mb-2'
                                                direction='row'>
                                                <Grid item md={3}>
                                                  {item?.file && item.imgSrc ? (
                                                    <div className='avatar-icon-wrapper avatar-icon-lg'>
                                                      <div className='avatar-icon'>
                                                        <img
                                                          src={item.imgSrc}
                                                          alt={getInitials(
                                                            item?.employeeName
                                                          )}
                                                        />
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className='avatar-icon-wrapper avatar-initials avatar-icon-lg'>
                                                      <div className='avatar-icon text-white bg-success'>
                                                        {getInitials(
                                                          item?.employeeName
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                </Grid>{' '}
                                                <Grid
                                                  item
                                                  md={9}
                                                  style={{
                                                    paddingLeft: '10px'
                                                  }}>
                                                  <span
                                                    style={{
                                                      textAlign: 'left'
                                                    }}>
                                                    <h6>
                                                      {' '}
                                                      {item?.employeeName} (
                                                      {item?.employeeID})
                                                    </h6>
                                                    <p> {item?.department}</p>
                                                    <p> {item?.location}</p>
                                                    {item?.employeePhone == 'NA' ? (
                                                      ''
                                                    ) : (
                                                      <p> {item?.employeePhone} </p>
                                                    )}
                                                    {item?.employeeEmail == 'NA' ? (
                                                      ''
                                                    ) : (
                                                      <p> {item?.employeeEmail} </p>
                                                    )}
                                                  </span>
                                                </Grid>{' '}
                                              </Grid>
                                            </div>
                                            <div className={styles.cardFooter}>
                                              <p>{item?.designation}</p>
                                            </div>
                                            <div></div>
                                          </div>
                                        </li>
                                      </>
                                    ))}
                                  </>
                                ) : (
                                  ''
                                )}
                              </div>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </PerfectScrollbar>
                </div>
              </Grid>
            </Grid>
          </Card>{' '}
          <br></br>
          <Card className='card-box' style={{ wordWrap: 'break-word' }}>
            <div className='card-header bg-secondary'>
              <div className='card-header--title'>
                <b>Job Details</b>
              </div>
              <Grid item md={1} sm={3} className='mx-auto'>
                <Button
                  style={editBtn}
                  component={NavLink}
                  to={"./employeeInfoHistory?type=EmployeeJobDetails&employeeUUID=" + selectedEmployee.uuid}
                  className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                  <FontAwesomeIcon
                    icon={['far', 'edit']}
                    className='font-size-xs'
                  />
                </Button>
              </Grid>
            </div>
            <div className='scroll-area-lg shadow-overflow'>
              <PerfectScrollbar options={{ wheelPropagation: false }}>
                <div className='p-4'>
                  <Grid item container direction='row'>
                    <Grid
                      item
                      md={12}
                      container
                      className='mx-auto'
                      direction='row'>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Employee ID</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.employeeID}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Job Status</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.jobStatus}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Name</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.employeeName}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Employee Status
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p
                          className='opacity-8 font-size-sm mt-1'
                          style={
                            employeeDetail?.isActive
                              ? { color: 'green' }
                              : { color: 'red' }
                          }>
                          {employeeDetail?.isActive ? 'Active' : 'InActive'}{' '}
                        </p>{' '}
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Designation</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.designation}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Department</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.department}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Reason For Hire
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {' '}
                          {employeeDetail?.reasonForHireName}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Date Of Joining
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {getParsedDate(employeeDetail?.hireDate)}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Separation Date
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'></p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Current Location
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.location}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Reporting Manger
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.managerName}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Job Grade</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>{employeeDetail?.jobGrade}</p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Official Phone Number
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.employeeOfficialPhone}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Job Band</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>{employeeDetail?.jobBand}</p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>
                          Official Email ID
                        </label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {' '}
                          {employeeDetail?.employeeOfficialEmail}{' '}
                        </p>
                      </Grid>
                      <Grid item md={2} sm={3} className='mx-auto'>
                        <label className='font-size-sm mt-1'>Job Type</label>
                      </Grid>
                      <Grid item md={4} sm={9} className='mx-auto'>
                        <p className='opacity-8 font-size-sm mt-1'>
                          {employeeDetail?.jobType}{' '}
                        </p>
                      </Grid>
                      <Grid item md={3} sm={6} className='mx-auto'></Grid>
                      <Grid item md={3} sm={6} className='mx-auto'></Grid>
                    </Grid>
                  </Grid>
                </div>
              </PerfectScrollbar>
            </div>
          </Card>
          <br></br>
          <Card className='card-box' style={{ wordWrap: 'break-word' }}>
            <div className='card-header bg-secondary'>
              <div className='card-header--title'>
                <b>Dependant/Beneficiary Details</b>
              </div>
              <Grid item md={1} sm={3} className='mx-auto'>
                <Button
                  style={editBtn}
                  component={NavLink}
                  to={"./createDependants?uuid=" + selectedEmployee.uuid}
                  className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                  <FontAwesomeIcon
                    icon={['far', 'edit']}
                    className='font-size-xs'
                  />
                </Button>
              </Grid>
            </div>
            {employeeDetail?.employeeDependantOrBeneficiary.length > 0 ? (
              <div className='scroll-area-lg shadow-overflow'>
                <PerfectScrollbar options={{ wheelPropagation: false }}>
                  <div className='p-4'>
                    <Grid item container>
                      {employeeDetail?.employeeDependantOrBeneficiary.map(
                        (item, idx) => (
                          <>
                            <Grid
                              item
                              md={6}
                              container
                              style={{ display: 'block' }}>
                              <label className='font-size-lg mt-1'>
                                {item['type']}
                              </label>
                              <br></br>
                              <br></br>
                              {item['type'] !== 'Beneficiary' ? (
                                <>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Name of the Dependant{' '}
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.name}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Relationship With Employee
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.relationWithEmployee}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Marital Status
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.maritalStatus}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Gender
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.gender}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        DOB/Age
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item.age}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Address
                                      </label>
                                    </Grid>
                                    <Grid item md={5}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.addressLineOne}
                                        <br></br>
                                        {item?.addressLineTwo}
                                        <br></br>
                                        {item?.city}
                                        <br></br>
                                        {item?.pinCode}
                                        <br></br>
                                        {item?.state}
                                        <br></br>
                                        {item?.country}
                                        <br></br>
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Student
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item.isStudent ? 'Yes' : 'No'}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Disabled
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item.disabled ? 'Yes' : 'No'}
                                      </p>
                                    </Grid>
                                  </div>
                                  <br></br>
                                  <br></br>
                                </>
                              ) : (
                                <>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Beneficiary Type
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item.beneficiaryType}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Name of the {item.beneficiaryType}
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.name}
                                      </p>
                                    </Grid>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <Grid item md={5}>
                                      <label className='font-size-sm mt-1'>
                                        Address
                                      </label>
                                    </Grid>
                                    <Grid item md={7}>
                                      <p className='opacity-8 font-size-sm mt-1'>
                                        {item?.addressLineOne}
                                        <br></br>
                                        {item?.addressLineTwo}
                                        <br></br>
                                        {item?.city}
                                        <br></br>
                                        {item?.pinCode}
                                        <br></br>
                                        {item?.state}
                                        <br></br>
                                        {item?.country}
                                        <br></br>
                                      </p>
                                    </Grid>
                                  </div>
                                  <br></br>
                                  <br></br>
                                </>
                              )}
                            </Grid>{' '}
                          </>
                        )
                      )}
                    </Grid>
                  </div>
                </PerfectScrollbar>
              </div>
            ) : (
              <div className='p-5'>
                There is no Dependant or Beneficiary Details for this employee
              </div>
            )}
          </Card>
        </Grid>
      </Grid >
    </BlockUi >
  )
}

const mapStateToProps = state => ({
  selectedEmployee: state.Auth.selectedEmployee,
  selectedCompany: state.Auth.selectedCompany
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ViewEmployeeDetails)
