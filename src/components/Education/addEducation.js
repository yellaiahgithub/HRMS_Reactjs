import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Container,
  MenuItem,
  Table,
  CardContent,
  MenuList,
  TextField,
  Snackbar,
  Collapse,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Alert from '@material-ui/lab/Alert'
import { connect } from 'react-redux'


import 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import apicaller from 'helper/Apicaller'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { useDropzone } from 'react-dropzone'
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import CheckIcon from '@material-ui/icons/Check'
import SelectEmployee from 'components/SelectEmployee'
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';

const AddEducationDetail = props => {
  const { countriesMasterData } = props;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const employeeUUID = queryParams.get('uuid') || null;
  const edit = id ? true : false;
  const { selectedCompany } = props
  const [files, setFiles] = useState([])
  const [imgSrc, SetImageSrc] = useState('')
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
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  })
  const thumbs = files.map(file => (
    <Grid item md={3} className='p-2' key={file.name}>
      <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
        <img
          className='img-fluid img-fit-container rounded-sm'
          src={file.preview}
          alt='...'
        />
        <FontAwesomeIcon
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            background: 'black',
            color: 'white'
          }}
          icon={['fas', 'times']}
          className='font-size-lg crossIcon'
          onClick={() => deleteCertificateImage()}
        />
      </div>
    </Grid>
  ))
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state
  const toggleAccordion = tab => {
    const prevState = state1.accordion
    const state = prevState.map((x, index) => (tab === index ? !x : false))
    setCountryIndex(null);
    setCountry(null);
    setAddState(null);
    setStateIndex(null);
    setAllStates([]);
    setState1({
      accordion: state
    })
  }
  const [state1, setState1] = useState({
    accordion: [false, false, false]
  })

  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
  }, [])
  const educationRowData = [
    {
      level: 'School',
      mode: 'Regular',
      isHighest: true,
      yop: '2013',
      aggregate: '82',
      name: 'St. Joseph'
    },
    {
      level: 'College',
      mode: 'Distance',
      isHighest: false,
      yop: '1995',
      aggregate: '85',
      name: 'Dental'
    }
  ]

  const [allEmployees, setEmployees] = useState([])
  const [blocking, setBlocking] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState()
  const [educationRows, setEducationRows] = useState([])
  const [filePath, setFilePath] = useState()

  const [levelOfEdt, setLevelOfEdt] = useState()
  const [modeOfEdt, setModeOfEdt] = useState()
  const [isHighest, setIsHighestEdt] = useState(true)
  const [degreeName, setDegreeName] = useState()
  const [OfAggregate, setOfAggregate] = useState()
  const [aggregate, setAggregate] = useState()
  const [ofOtherAggregate, setOfOtherAggregate] = useState()
  const [yop, setYOP] = useState()
  const [isCollege, setIsCollege] = useState()
  const [boardName, setBoardName] = useState()
  const [collegeName, setCollegeName] = useState()
  const [addState, setAddState] = useState()
  const [country, setCountry] = useState()
  const [city, setCity] = useState()
  const [isTime, setIsTime] = useState()
  const [showDegree, setNotToShowDegree] = useState(true)
  const [schlClgLable, setLabelForSchClg] = useState('Name of the College *')
  const [boardUniversityLable, setLabelForBoardUniversity] = useState(
    'Name of the University *'
  )
  const [modal2, setModal2] = useState(false)
  const [IndexToBeSplice, setIndexToBeSplice] = useState()
  const [dataToDelete, setDataToDelete] = useState()
  const [updatedRowIndex, setUpdatedRowIndex] = useState()
  const [isUpdatedSubmitted, setUpdatedSubmitted] = useState(false)
  const [updateEducationData, setEditEducation] = useState({})
  const [open2, setOpen2] = useState(false)
  const [imgObj, setImageObj] = useState()
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  const [employeeDetail, setEmployeeDetail] = useState()

  let tempCountries = [];
  let tempStates = [];

  const levels = [
    { value: '10th' },
    { value: '10+2' },
    { value: 'Polytechnic' },
    { value: 'Intermediate' },
    { value: 'Pre-University' },
    { value: 'Diploma' },
    { value: 'Graduation' },
    { value: 'Graduate Diploma' },
    { value: 'Vocational Course' },
    { value: 'Professional Course' },
    { value: 'Post Graduation' },
    { value: 'Post Graduation Diploma' },
    { value: 'M.Phil' },
    { value: 'PhD' },
    { value: 'Post Doctorate' }
  ]

  const aggregateTypes = [
    { value: '10 OGPA' },
    { value: 'Percentage' },
    { value: 'Others' }
  ]

  const modes = [{ value: 'Regular' }, { value: 'Distance' }]
  const currentYear = new Date().getFullYear()
  const passingYears = Array.from(
    { length: currentYear - 1899 },
    (v, i) => currentYear - i
  )
  const collegeTypes = [
    { value: 'Affiliated' },
    { value: 'Recognised' },
    { value: ' College' },
    { value: ' Accreditated' },
    { value: 'Autonomous Body' }
  ]

  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    let employeeUUID = selectedEmployee?.uuid
    apicaller(
      'get',
      `${BASEURL}/education/byEmployeeUUID?employeeUUID=${employeeUUID} `
    )
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setEducationRows(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getEmployees err', err)
      })
  }
  const getParsedDate = date => {
    if (date !== null && date !== '' && date !== undefined) {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }
  const handleClose = () => {
    setState({ ...state, open: false })
  }
  const handleClickOpen2 = idx => {
    let educationData = educationRows[idx]
    setEditEducation({ ...educationData })
    getCertificateImg(educationData)
    setUpdatedRowIndex(idx)
    setOpen2(true)
    setFiles([])
    if (
      educationData.levelOfEducation == '10th' ||
      educationData.levelOfEducation == '10+2' ||
      educationData.levelOfEducation == 'Intermediate'
    ) {
      if (
        educationData.levelOfEducation == '10th' ||
        educationData.levelOfEducation == '10+2'
      ) {
        setLabelForSchClg('Name of the School')
        setLabelForBoardUniversity('Name of the Board')
      } else {
        setLabelForSchClg('Name of the College')
        setLabelForBoardUniversity('Name of the University')
      }
      setNotToShowDegree(false)
    } else {
      setNotToShowDegree(true)
      if (educationData.levelOfEducation == 'Post Doctorate') {
        setLabelForSchClg('Name of the College/Organization')
      } else if (educationData.levelOfEducation == 'Pre-University') {
        setLabelForBoardUniversity('Name of the University')
      } else {
        setLabelForSchClg('Name of the College')
        setLabelForBoardUniversity('Name of the University')
      }
    }
    const countryIdx = countries.findIndex(
      (country) => country.name === educationData.country
    );
    if (countryIdx != -1) {
      setCountryIndex(countryIdx);
      const stateIdx = countries[countryIdx]?.states.findIndex(
        (state) => state === educationData.state
      );
      tempStates = countries[countryIdx].states;
      setAllStates(tempStates);
      if (stateIdx != -1) {
        setStateIndex(stateIdx);
      }
      else {
        setStateIndex(null);
      }
    }
    else {
      setCountryIndex(null);
      setStateIndex(null);
      setAllStates([]);
    }

  }
  const showConfirmDelete = (i, selected) => {
    setModal2(true)
    setIndexToBeSplice(i)
    setDataToDelete(selected)
  }
  const save = () => {
    setIsSubmitted(true)

    if (isHighest) {
      const result = educationRows.map((item, i) => {
        return { ...item, ['isHighestEducation']: false }
      })
      const newArray = result.map((item, i) => {
        return item
      })
      setEducationRows(newArray)
    }
    if (!files[0]) {
      setState({
        open: true,
        message: 'Certificate is required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    } else if (files[0] && !imgObj) {
      setState({
        open: true,
        message: 'Please upload image first',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }
    if (levelOfEdt && modeOfEdt && city && country && addState) {
      if (showDegree && !degreeName) {
        setState({
          open: true,
          message: 'Mandatory fields required',
          toastrStyle: 'toastr-success',
          vertical: 'top',
          horizontal: 'right'
        })
      } else {
        let obj = {
          employeeUUID: employeeDetail.uuid,
          levelOfEducation: levelOfEdt,
          modeOfEducation: modeOfEdt,
          nameOfDegree: degreeName ? degreeName : levelOfEdt,
          isHighestEducation: isHighest,
          aggregate: aggregate,
          fullTimeOrPartTime: isTime,
          yearOfPassing: yop,
          istheCollege: isCollege,
          nameofTheCollegeOrSchoolOrOrganization: collegeName,
          nameOfBoard: boardName,
          city: city,
          country: country,
          state: addState,
          file: imgObj
        }
        setBlocking(true)
        apicaller('post', `${BASEURL}/education`, obj)
          .then(res => {
            if (res.status === 200) {
              setBlocking(false)
              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'Added Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              setIsSubmitted(false)
              setImageObj()
              toggleAccordion(0)
              setLevelOfEdt('')
              setModeOfEdt('')
              setDegreeName('')
              setIsHighestEdt(true)
              setAggregate('')
              setOfAggregate('')
              setOfOtherAggregate('')
              setIsTime('')
              setYOP('')
              setIsCollege('')
              setBoardName('')
              setCollegeName('')
              setAddState('')
              setCountry('')
              setCity('')
              setFiles([])
              setFilePath()
              setEducationRows(educationRows => [...educationRows, res.data[0]])
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
              setState({
                open: true,
                message: err,
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              console.log('create id err', err)
            }
          })
      }
    } else {
      setState({
        open: true,
        message: 'Mandatory Fields Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }
  const update = event => {
    setUpdatedSubmitted(true)
    console.log('hhh')
    if (Object.keys(updateEducationData.file).length === 0) {
      setState({
        open: true,
        message: 'Certicate is required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }
    setBlocking(true)
    apicaller('patch', `${BASEURL}/education`, updateEducationData)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setState({
            open: true,
            message: 'Updated Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          if (updateEducationData.isHighestEducation) {
            const result = educationRows.map((item, i) => {
              if (i !== updatedRowIndex) {
                return { ...item, ['isHighestEducation']: false }
              } else {
                return { ...item, ['isHighestEducation']: true }
              }
            })
            const newArray = result.map((item, i) => {
              return item
            })
            setEducationRows(newArray)
          }
          setOpen2(false)
          educationRows[updatedRowIndex] = updateEducationData
          const result = educationRows.map((item, i) => {
            return item
          })
          setEducationRows(result)
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err,
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
        console.log('create id err', err)
      })
  }
  const handleClose2 = () => {
    SetImageSrc('')
    setImageObj()
    setCountryIndex(null);
    setCountry(null);
    setAddState(null);
    setStateIndex(null);
    setAllStates([]);
    setOpen2(false)
  }
  const getObjByValue = (arr, value) => {
    return value ? arr.find(x => x.value == value) : {}
  }
  const toggle3 = () => setModal2(!modal2)
  const handleDeleteID = () => {
    setModal2(false)
    setBlocking(true)
    apicaller(
      'delete',
      `${BASEURL}/education?employeeUUID=${dataToDelete.employeeUUID}&levelOfEducation=${dataToDelete.levelOfEducation}&nameOfDegree=${dataToDelete.nameOfDegree}`
    )
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          setState({
            open: true,
            message: 'Deleted Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          const list = [...educationRows]
          list.splice(IndexToBeSplice, 1)
          setEducationRows(list)
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err,
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
        console.log('create id err', err)
      })
  }
  const deleteCertificateImage = () => {
    setFiles([])
    if (filePath) {
      setBlocking(true)
      apicaller('delete', `${BASEURL}/storage?path=` + filePath)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)

            if (res.data) {
              SetImageSrc('')
            }
            updateEducationData.file = {}
          }
        })
        .catch(err => {
          setBlocking(false)
          if (err?.response?.data) {
            setState({
              open: true,
              message: err,
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
          }
          console.log('updateSession err', err)
        })
    }
  }
  const getCertificateImg = educationData => {
    setBlocking(true)
    let path = educationData.file.filePath + '/' + educationData.file.fileName
    setFilePath(path)
    apicaller('get', `${BASEURL}/storage?path=` + path)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)
          if (res.data) {
            let baseStr64 = res.data
            let imgSrc64 = 'data:image/jpg;base64,' + baseStr64
            // Set the source of the Image to the base64 string
            SetImageSrc(imgSrc64)
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('updateSession err', err)
      })
  }
  const uploadImage = () => {
    setBlocking(true)
    let path = selectedCompany + employeeDetail.uuid + '/education'
    let formData = new FormData()
    formData.append('file', files[0])
    formData.append('employeeUUID', employeeDetail.uuid)
    formData.append('documentType', 'education')
    apicaller('post', `${BASEURL}/storage/uploadFile`, formData)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setImageObj(res.data)
          let path = res.data.filePath + '/' + res.data.fileName
          setFilePath(path)
          if (Object.keys(updateEducationData).length !== 0) {
            updateEducationData.file = res.data
          }
          setState({
            open: true,
            message: 'Image Uploaded Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('Iamge Upload err', err)
        setState({
          open: true,
          message: 'err',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <Grid container spacing={0}>
          <Grid item md={10} lg={10} xl={11} className='mx-auto'>
            <div className='bg-white p-4 rounded'>
              <div className='text-center my-4'>
                <h1 className='display-4 mb-1 font-weight-normal'>
                  Create Education
                </h1>
              </div>
              <SelectEmployee getAllData={getAllData} employeeUUID={employeeUUID} />
              <br />
              {employeeDetail ? (
                <>
                  <Card
                    style={{
                      padding: '25px',
                      border: '1px solid #c4c4c4'
                    }}>
                    <div className='card-header'>
                      <div className='card-header--title'>
                        <p>
                          <b>Employee's Educational Detail</b>
                        </p>
                      </div>
                    </div>
                    <CardContent className='p-0'>
                      <div
                        className='table-responsive-md'
                        style={{ overflow: 'auto' }}>
                        <Table className='table table-hover table-striped text-nowrap mb-0'>
                          <thead className='thead-light'>
                            <tr>
                              <th
                                style={{ width: '20%' }}
                                className='text-center'>
                                Level of Education
                              </th>
                              <th
                                style={{ width: '20%' }}
                                className='text-center'>
                                Mode of Education
                              </th>
                              <th
                                style={{ width: '20%' }}
                                className='text-center'>
                                Is Highest
                              </th>
                              <th
                                style={{ width: '10%' }}
                                className='text-center'>
                                Year of Passing
                              </th>
                              <th
                                style={{ width: '10%' }}
                                className='text-center'>
                                Aggregate %
                              </th>
                              <th
                                style={{ width: '10%' }}
                                className='text-center'>
                                Name of School/College/University
                              </th>
                              <th
                                style={{ width: '30%' }}
                                className='text-center'>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          {educationRows.length > 0 ? (
                            <>
                              <tbody>
                                {educationRows.map((item, idx) => (
                                  <tr>
                                    <td className='text-center'>
                                      <div>{item?.levelOfEducation}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>{item?.modeOfEducation}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>
                                        {item?.isHighestEducation}
                                        <Checkbox
                                          checked={item?.isHighestEducation}
                                          color='primary'
                                          id={`phoneCheckbox${idx}`}
                                          className='align-self-start'
                                          name='isHighestEducation'
                                          value={item?.isHighestEducation}
                                          disabled={true}
                                          style={
                                            item?.isHighestEducation
                                              ? { color: 'blue' }
                                              : {}
                                          }
                                        />
                                      </div>
                                    </td>
                                    <td className='text-center'>
                                      <div>{item?.yearOfPassing}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>{item?.aggregate}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>
                                        {
                                          item?.nameofTheCollegeOrSchoolOrOrganization
                                        }
                                      </div>
                                    </td>
                                    <td className='text-center'>
                                      <div>
                                        <Button
                                          onClick={() =>
                                            handleClickOpen2(idx, item)
                                          }
                                          className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                          <FontAwesomeIcon
                                            icon={['far', 'edit']}
                                            className='font-size-sm'
                                          />
                                        </Button>
                                        <Button
                                          disabled={item?.isHighestEducation}
                                          onClick={() =>
                                            showConfirmDelete(idx, item)
                                          }
                                          className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                          <FontAwesomeIcon
                                            icon={['fas', 'times']}
                                            className='font-size-sm'
                                          />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </>
                          ) : (
                            <>
                              <p>No Education Data found</p>
                            </>
                          )}
                        </Table>
                      </div>
                      <div className='divider' />
                      <div className='divider' />
                    </CardContent>
                  </Card>
                  <div className='accordion-toggle'>
                    <Button
                      style={{ padding: '25px 0' }}
                      className='btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none'
                      onClick={() => toggleAccordion(0)}
                      aria-expanded={state1.accordion[0]}>
                      <span>Add New Education Details</span>
                      &nbsp;
                      {state1.accordion[0] ? (
                        <FontAwesomeIcon
                          icon={['fas', 'angle-down']}
                          className='font-size-xl accordion-icon'
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={['fas', 'angle-right']}
                          className='font-size-xl accordion-icon'
                        />
                      )}
                    </Button>
                  </div>
                  <Collapse in={state1.accordion[0]}>
                    <Grid container spacing={6}>
                      <Grid item xs={6}>
                        <div>
                          <label className='font-weight-normal mb-2'>
                            Level of Education *
                          </label>
                          <TextField
                            id='outlined-new'
                            label='Select'
                            variant='outlined'
                            fullWidth
                            select
                            size='small'
                            name='New'
                            value={levelOfEdt || ''}
                            onChange={event => {
                              setLevelOfEdt(event.target.value)
                              if (
                                event.target.value == '10th' ||
                                event.target.value == '10+2' ||
                                event.target.value == 'Intermediate'
                              ) {
                                if (
                                  event.target.value == '10th' ||
                                  event.target.value == '10+2'
                                ) {
                                  setLabelForSchClg('Name of the School')
                                  setLabelForBoardUniversity(
                                    'Name of the Board'
                                  )
                                } else {
                                  setLabelForSchClg('Name of the College')
                                  setLabelForBoardUniversity(
                                    'Name of the University'
                                  )
                                }
                                setNotToShowDegree(false)
                              } else {
                                setNotToShowDegree(true)
                                if (event.target.value == 'Post Doctorate') {
                                  setLabelForSchClg(
                                    'Name of the College/Organization'
                                  )
                                } else if (
                                  event.target.value == 'Pre-University'
                                ) {
                                  setLabelForBoardUniversity(
                                    'Name of the University'
                                  )
                                } else {
                                  setLabelForSchClg('Name of the College')
                                  setLabelForBoardUniversity(
                                    'Name of the University'
                                  )
                                }
                              }
                            }}
                            error={isSubmitted && (levelOfEdt ? false : true)}
                            helperText={
                              isSubmitted &&
                              (levelOfEdt ? '' : 'Level is Required')
                            }>
                            {levels.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div>
                          <label className='font-weight-normal mb-2'>
                            Mode of Education *
                          </label>
                          <TextField
                            id='outlined-new'
                            label='Select'
                            variant='outlined'
                            fullWidth
                            select
                            size='small'
                            name='New'
                            value={modeOfEdt || ''}
                            onChange={event => {
                              setModeOfEdt(event.target.value)
                            }}
                            error={isSubmitted && (modeOfEdt ? false : true)}
                            helperText={
                              isSubmitted &&
                              (modeOfEdt ? '' : 'Mode is Required')
                            }>
                            {modes.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      {showDegree ? (
                        <Grid item xs={6}>
                          <label
                            style={{ marginTop: '15px' }}
                            className='font-weight-normal mb-2'>
                            Name of Degree *
                          </label>
                          <TextField
                            id='outlined-degreeName'
                            // placeholder='Address Line 1'
                            type='text'
                            placeholder='Name of Degree'
                            variant='outlined'
                            fullWidth
                            size='small'
                            value={degreeName}
                            onChange={event => {
                              setDegreeName(event.target.value)
                            }}
                            error={isSubmitted && (degreeName ? false : true)}
                            helperText={
                              isSubmitted &&
                              (degreeName ? '' : 'Name is Required')
                            }
                          />
                        </Grid>
                      ) : (
                        ''
                      )}
                      <Grid item xs={6} className='mt-4'>
                        <label
                          style={{ marginTop: '15px' }}
                          className='font-weight-normal mb-2'>
                          Is Highest Education
                        </label>
                        <Checkbox
                          id='outlined- isHighest'
                          variant='outlined'
                          size='small'
                          checked={isHighest}
                          value={isHighest}
                          onChange={event => {
                            setIsHighestEdt(event.target.checked)
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={6} className='align-items-center justify-content-center'>
                      <Grid item md={6}>
                        <Grid container spacing={0}>
                          <Grid item md={5}>
                            <label className='font-weight-normal mb-2'>
                              Aggregate *
                            </label>
                            <div>
                              <TextField
                                id='outlined-degreeName'
                                // placeholder='Address Line 1'
                                type='text'
                                variant='outlined'
                                fullWidth
                                placeholder='Aggregate'
                                size='small'
                                value={aggregate}
                                onChange={event => {
                                  setAggregate(event.target.value)
                                }}
                              />
                            </div>
                          </Grid>
                          <Grid item md={2}>
                            <label className='font-weight-normal mb-2 pt-4'></label>
                            <div className='text-center'>of</div>
                          </Grid>
                          <Grid item md={5} className='mt-2'>
                            <label className='font-weight-normal mb-2'></label>
                            <div>
                              <TextField
                                id='outlined-new'
                                label='Select'
                                variant='outlined'
                                fullWidth
                                select
                                size='small'
                                name='New'
                                value={OfAggregate || ''}
                                onChange={event => {
                                  setOfAggregate(event.target.value)
                                }}>
                                {aggregateTypes.map(option => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                          </Grid>
                          {OfAggregate == 'Others' ? (
                            <Grid item md={5}>
                              <label className='font-weight-normal mt-2'>
                                Add Others
                              </label>
                              <div>
                                <TextField
                                  id='outlined-new'
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='New'
                                  value={ofOtherAggregate}
                                  onChange={event => {
                                    setOfOtherAggregate(event.target.value)
                                  }}></TextField>
                              </div>
                            </Grid>
                          ) : (
                            ''
                          )}
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid item md={6} className='mt-4'>
                          <Radio
                            checked={isTime === 'isFullTime'}
                            onChange={event => {
                              setIsTime(event.target.value)
                            }}
                            value='isFullTime'
                            name='radio-isFullTime'
                            inputProps={{ 'aria-label': 'isFullTime' }}
                            label='isFullTime'
                          />
                          <label>Full Time</label>
                          <Radio
                            checked={isTime === 'isPartTime'}
                            name='radio-isPartTime'
                            inputProps={{ 'aria-label': 'isPartTime' }}
                            onChange={event => {
                              setIsTime(event.target.value)
                            }}
                            value='isPartTime'
                            label='isPartTime'
                          />
                          <label>Part Time</label>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <label
                          style={{ marginTop: '15px' }}
                          className='font-weight-normal mb-2'>
                          Year of Passing *
                        </label>
                        <TextField
                          id='outlined-yop'
                          label='Select'
                          variant='outlined'
                          fullWidth
                          select
                          size='small'
                          name='yop'
                          value={yop || ''}
                          onChange={event => {
                            setYOP(event.target.value)
                          }}>
                          {passingYears.map(option => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={6}>
                        <label
                          style={{ marginTop: '15px' }}
                          className='font-weight-normal mb-2'>
                          Is the College *
                        </label>
                        <TextField
                          id='outlined-isCollege'
                          label='Select'
                          variant='outlined'
                          fullWidth
                          select
                          size='small'
                          name='IsCollege'
                          value={isCollege || ''}
                          onChange={event => {
                            setIsCollege(event.target.value)
                          }}>
                          {collegeTypes.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.value}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item md={12}>
                        <div>
                          <label className='font-weight-normal mb-2'>
                            {schlClgLable}
                          </label>
                          <TextField
                            id='outlined-collegeName'
                            placeholder='Name of College'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='collegeName'
                            value={collegeName}
                            onChange={event => {
                              setCollegeName(event.target.value)
                            }}></TextField>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item md={12}>
                        <label
                          style={{ marginTop: '15px' }}
                          className='font-weight-normal mb-2'>
                          {boardUniversityLable}
                        </label>
                        <TextField
                          id='outlined-boardName'
                          placeholder='Name of the University'
                          type='text'
                          variant='outlined'
                          fullWidth
                          size='small'
                          value={boardName}
                          onChange={event => {
                            setBoardName(event.target.value)
                          }}
                        />
                      </Grid>
                    </Grid>
                    <br></br>
                    <div className='card-header--title'>
                      <p>
                        <b>Place of Education</b>
                      </p>
                    </div>
                    <Grid container spacing={6}>
                      <Grid item md={4}>
                        <div>
                          <div>
                            <label className='font-weight-normal mb-2'>
                              City *
                            </label>
                            <TextField
                              id='outlined-City'
                              placeholder='City'
                              variant='outlined'
                              fullWidth
                              size='small'
                              name='POB'
                              value={city}
                              onChange={event => {
                                setCity(event.target.value)
                              }}
                              error={isSubmitted && (city ? false : true)}
                              helperText={
                                isSubmitted && (city ? '' : 'City is Required')
                              }
                            />
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={4}>
                        <div>
                          <label className='font-weight-normal mb-2'>
                            Country *
                          </label>
                          <Autocomplete
                            id='combo-box-demo'
                            value={
                              countryIndex != null
                                ? countries[countryIndex] || ''
                                : null
                            }
                            options={countries}
                            getOptionLabel={(option) => option.name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Select'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='country'
                                value={
                                  countryIndex != null
                                    ? countries[countryIndex] || ''
                                    : null
                                }
                                error={isSubmitted && (country ? false : true)}
                                helperText={
                                  isSubmitted &&
                                  (country ? '' : 'Country is Required')
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              const index = countries.findIndex(
                                (country) => country.name === value?.name
                              );
                              if (index != -1) {
                                setCountryIndex(index);
                                setCountry(countries[index].name);
                                setAllStates(countries[index].states);
                                setAddState(null);
                                setStateIndex(null);
                              } else {
                                setCountryIndex(null);
                                setCountry(null);
                                setAllStates([]);
                                setAddState(null);
                                setStateIndex(null);
                              }
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item md={4}>
                        <div>
                          <label className='font-weight-normal mb-2'>State *</label>
                          <Autocomplete
                            id='combo-box-demo'
                            options={allStates}
                            getOptionLabel={(option) => option}
                            value={
                              countryIndex != null
                                ? stateIndex != null
                                  ? countries[countryIndex].states[
                                  stateIndex
                                  ] || ''
                                  : null
                                : null
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Select'
                                variant='outlined'
                                fullWidth
                                size='small'
                                name='state'
                                value={
                                  countryIndex != null
                                    ? stateIndex != null
                                      ? countries[countryIndex].states[
                                      stateIndex
                                      ] || ''
                                      : null
                                    : null
                                }
                                error={isSubmitted && (addState ? false : true)}
                                helperText={
                                  isSubmitted &&
                                  (addState ? '' : 'State is Required')
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              const index = allStates.findIndex(
                                (state) => state === value
                              );
                              if (index != -1) {
                                setStateIndex(index);
                                setAddState(
                                  countries[countryIndex].states[index]
                                );
                              } else {
                                setStateIndex(null);
                                setAddState(null);
                              }
                            }}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <Card
                      style={{
                        border: '1px solid #c4c4c4',
                        margin: '25px 0'
                      }}
                      className='mt-4 p-3 p-lg-5 shadow-xxl'>
                      <div className='card-header'>
                        <div className='card-header--title'>
                          <p>
                            <b>Upload Certificate *</b>
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
                                  jpeg and png files
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
                          <div className='font-weight-bold mb-3 text-uppercase text-dark font-size-sm text-center'>
                            Uploaded Files
                          </div>
                          {thumbs.length <= 0 && (
                            <>
                              <div className='text-first text-center font-size-sm'>
                                Uploaded demo images previews will appear here!
                              </div>{' '}
                            </>
                          )}
                          {thumbs.length > 0 && (
                            <div>
                              <Alert
                                severity='success'
                                className='text-center mb-3'>
                                You have uploaded <b>{thumbs.length}</b> files!
                              </Alert>
                              <Grid container spacing={0}>
                                {thumbs}
                              </Grid>
                              <Button
                                style={{ marginRight: '2.5%' }}
                                onClick={e => {
                                  uploadImage()
                                }}
                                className='btn-primary font-weight-normal mb-2 mr-3 float-right'>
                                Upload Image
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                    <br></br>
                    <Dialog
                      classes={{
                        paper:
                          'modal-content rounded border-0 bg-white p-3 p-xl-0'
                      }}
                      fullWidth
                      maxWidth='lg'
                      open={open2}
                      onClose={handleClose2}
                      aria-labelledby='form-dialog-title2'>
                      <DialogContent className='p-4'>
                        <div>
                          <div className='card-body px-lg-5 py-lg-5'>
                            <Grid container spacing={6}>
                              <Grid item xs={6}>
                                <div>
                                  <label className='font-weight-narmal mb-2'>
                                    Level of Education
                                  </label>
                                  <TextField
                                    id='outlined-new'
                                    label='Select'
                                    variant='outlined'
                                    fullWidth
                                    select
                                    size='small'
                                    name='New'
                                    defaultValue={
                                      updateEducationData?.levelOfEducation
                                    }
                                    onChange={event => {
                                      updateEducationData.levelOfEducation =
                                        event.target.value
                                      if (
                                        updateEducationData.levelOfEducation ==
                                        '10th' ||
                                        updateEducationData.levelOfEducation ==
                                        '10+2' ||
                                        updateEducationData.levelOfEducation ==
                                        'Intermediate'
                                      ) {
                                        if (
                                          updateEducationData.levelOfEducation ==
                                          '10th' ||
                                          updateEducationData.levelOfEducation ==
                                          '10+2'
                                        ) {
                                          setLabelForSchClg(
                                            'Name of the School'
                                          )
                                          setLabelForBoardUniversity(
                                            'Name of the Board'
                                          )
                                        } else {
                                          setLabelForSchClg(
                                            'Name of the College'
                                          )
                                          setLabelForBoardUniversity(
                                            'Name of the University'
                                          )
                                        }
                                        setNotToShowDegree(false)
                                      } else {
                                        setNotToShowDegree(true)
                                        if (
                                          updateEducationData.levelOfEducation ==
                                          'Post Doctorate'
                                        ) {
                                          setLabelForSchClg(
                                            'Name of the College/Organization'
                                          )
                                        } else if (
                                          updateEducationData.levelOfEducation ==
                                          'Pre-University'
                                        ) {
                                          setLabelForBoardUniversity(
                                            'Name of the University'
                                          )
                                        } else {
                                          setLabelForSchClg(
                                            'Name of the College'
                                          )
                                          setLabelForBoardUniversity(
                                            'Name of the University'
                                          )
                                        }
                                      }
                                    }}
                                    error={
                                      isUpdatedSubmitted &&
                                      (updateEducationData.levelOfEducation
                                        ? false
                                        : true)
                                    }
                                    helperText={
                                      isUpdatedSubmitted &&
                                      (updateEducationData.levelOfEducation
                                        ? ''
                                        : 'Level is Required')
                                    }>
                                    {levels.map(option => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.value}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </div>
                              </Grid>
                              <Grid item xs={6}>
                                <div>
                                  <label className='font-weight-normal mb-2'>
                                    Mode of Education
                                  </label>
                                  <TextField
                                    id='outlined-new'
                                    label='Select'
                                    variant='outlined'
                                    fullWidth
                                    select
                                    size='small'
                                    name='New'
                                    defaultValue={
                                      updateEducationData?.modeOfEducation
                                    }
                                    onChange={event => {
                                      updateEducationData.modeOfEducation =
                                        event.target.value
                                    }}
                                    error={
                                      isUpdatedSubmitted &&
                                      (updateEducationData.modeOfEducation
                                        ? false
                                        : true)
                                    }
                                    helperText={
                                      isUpdatedSubmitted &&
                                      (updateEducationData.modeOfEducation
                                        ? ''
                                        : 'Mode is Required')
                                    }>
                                    {modes.map(option => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.value}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </div>
                              </Grid>
                            </Grid>
                            <Grid container spacing={6}>
                              {showDegree ? (
                                <Grid item xs={6}>
                                  <label
                                    style={{ marginTop: '15px' }}
                                    className='font-weight-normal mb-2'>
                                    Name of Degree
                                  </label>
                                  <TextField
                                    id='outlined-degreeName'
                                    // placeholder='Address Line 1'
                                    type='text'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    // value={updateEducationData.nameOfDegree}
                                    defaultValue={
                                      updateEducationData?.nameOfDegree
                                    }
                                    onChange={event => {
                                      updateEducationData.nameOfDegree =
                                        event.target.value
                                    }}
                                    error={
                                      isUpdatedSubmitted &&
                                      (updateEducationData.nameOfDegree
                                        ? false
                                        : true)
                                    }
                                    helperText={
                                      isUpdatedSubmitted &&
                                      (updateEducationData.nameOfDegree
                                        ? ''
                                        : 'Name is Required')
                                    }
                                  />
                                </Grid>
                              ) : (
                                ''
                              )}
                              <Grid item xs={6}>
                                <label
                                  style={{ marginTop: '15px' }}
                                  className='font-weight-normal mb-2'>
                                  Is Highest Education
                                  {updateEducationData.isHighestEducation}
                                </label>
                                <br></br>
                                <Checkbox
                                  id='outlined- isHighest'
                                  variant='outlined'
                                  size='small'
                                  // checked ={
                                  //   updateEducationData.isHighestEducation
                                  // }
                                  defaultChecked={
                                    updateEducationData.isHighestEducation
                                  }
                                  onChange={event => {
                                    updateEducationData.isHighestEducation =
                                      event.target.checked
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={6}>
                              <Grid item md={6}>
                                <label className='font-weight-normal mb-2'>
                                  Aggregate
                                </label>
                                <div>
                                  <TextField
                                    id='outlined-degreeName'
                                    // placeholder='Address Line 1'
                                    type='text'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    // value={updateEducationData.aggregate}
                                    defaultValue={
                                      updateEducationData?.aggregate
                                    }
                                    onChange={event => {
                                      updateEducationData.aggregate =
                                        event.target.value
                                    }}
                                  />
                                </div>
                              </Grid>
                              <Grid item md={6} className='mt-4'>
                                <Radio
                                  defaultChecked={
                                    updateEducationData?.fullTimeOrPartTime ===
                                    'isFullTime'
                                  }
                                  onChange={event => {
                                    updateEducationData.fullTimeOrPartTime =
                                      event.target.value
                                  }}
                                  value='isFullTime'
                                  name='radio-isFullTime'
                                  inputProps={{ 'aria-label': 'isFullTime' }}
                                  label='isFullTime'
                                />
                                <label>Full Time</label>
                                <Radio
                                  defaultChecked={
                                    updateEducationData?.fullTimeOrPartTime ===
                                    'isPartTime'
                                  }
                                  name='radio-isPartTime'
                                  inputProps={{ 'aria-label': 'isPartTime' }}
                                  onChange={event => {
                                    updateEducationData.fullTimeOrPartTime =
                                      event.target.value
                                  }}
                                  value='isPartTime'
                                  label='isPartTime'
                                />
                                <label>Part Time</label>
                              </Grid>
                            </Grid>
                            <Grid container spacing={6}>
                              <Grid item md={6}>
                                <label
                                  style={{ marginTop: '15px' }}
                                  className='font-weight-normal mb-2'>
                                  Year of Passing
                                </label>
                                <TextField
                                  id='outlined-yop'
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  select
                                  size='small'
                                  name='yop'
                                  // value={updateEducationData.yearOfPassing}
                                  defaultValue={
                                    updateEducationData?.yearOfPassing
                                  }
                                  onChange={event => {
                                    updateEducationData.yearOfPassing =
                                      event.target.value
                                  }}>
                                  {passingYears.map(option => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item md={6}>
                                <label
                                  style={{ marginTop: '15px' }}
                                  className='font-weight-normal mb-2'>
                                  Is the College
                                </label>
                                <TextField
                                  id='outlined-isCollege'
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  select
                                  size='small'
                                  name='IsCollege'
                                  // value={updateEducationData.istheCollege}
                                  defaultValue={
                                    updateEducationData?.istheCollege
                                  }
                                  onChange={event => {
                                    updateEducationData.istheCollege =
                                      event.target.value
                                  }}>
                                  {collegeTypes.map(option => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}>
                                      {option.value}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            </Grid>
                            <Grid container spacing={6}>
                              <Grid item md={12}>
                                <div>
                                  <label className='font-weight-normal mb-2'>
                                    {schlClgLable}
                                  </label>
                                  <TextField
                                    id='outlined-collegeName'
                                    placeholder='Name of College'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    name='collegeName'
                                    // value={
                                    //   updateEducationData.nameofTheCollegeOrSchoolOrOrganization
                                    // }
                                    defaultValue={
                                      updateEducationData?.nameofTheCollegeOrSchoolOrOrganization
                                    }
                                    onChange={event => {
                                      updateEducationData.nameofTheCollegeOrSchoolOrOrganization =
                                        event.target.value
                                    }}></TextField>
                                </div>
                              </Grid>
                            </Grid>
                            <Grid container spacing={6}>
                              <Grid item md={12}>
                                <label
                                  style={{ marginTop: '15px' }}
                                  className='font-weight-normal mb-2'>
                                  {boardUniversityLable}
                                </label>
                                <TextField
                                  id='outlined-nameOfBoard'
                                  placeholder='Board Name'
                                  type='text'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  // value={updateEducationData.nameOfBoard}
                                  defaultValue={
                                    updateEducationData?.nameOfBoard
                                  }
                                  onChange={event => {
                                    updateEducationData.nameOfBoard =
                                      event.target.value
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <br></br>
                            <div className='card-header--title'>
                              <p>
                                <b>Place of Education</b>
                              </p>
                            </div>
                            <Grid container spacing={6}>
                              <Grid item md={4}>
                                <div>
                                  <div>
                                    <label className='font-weight-normal mb-2'>
                                      City
                                    </label>
                                    <TextField
                                      id='outlined-City'
                                      placeholder='City'
                                      variant='outlined'
                                      fullWidth
                                      size='small'
                                      name='POB'
                                      defaultValue={updateEducationData.city}
                                      onChange={event => {
                                        updateEducationData.city =
                                          event.target.value
                                      }}
                                      error={
                                        isUpdatedSubmitted &&
                                        (updateEducationData.city
                                          ? false
                                          : true)
                                      }
                                      helperText={
                                        isUpdatedSubmitted &&
                                        (updateEducationData.city
                                          ? ''
                                          : 'City is Required')
                                      }
                                    />
                                  </div>
                                </div>
                              </Grid>
                              <Grid item md={4}>
                                <div>
                                  <label className='font-weight-normal mb-2'>
                                    Country
                                  </label>
                                  <Autocomplete
                                    id='combo-box-demo'
                                    value={
                                      countryIndex != null
                                        ? countries[countryIndex] || ''
                                        : null
                                    }
                                    options={countries}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={params => (
                                      <TextField
                                        {...params}
                                        label='Select'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        name='country'
                                        value={
                                          countryIndex != null
                                            ? countries[countryIndex] || ''
                                            : null
                                        }
                                        error={
                                          isUpdatedSubmitted &&
                                          (updateEducationData.country
                                            ? false
                                            : true)
                                        }
                                        helperText={
                                          isUpdatedSubmitted &&
                                          (updateEducationData.country
                                            ? ''
                                            : 'Country is Required')
                                        }
                                      />
                                    )}
                                    onChange={(event, value) => {
                                      const index = countries.findIndex(
                                        (country) => country.name === value?.name
                                      );
                                      if (index != -1) {
                                        setCountryIndex(index);
                                        setCountry(countries[index].name);
                                        setAllStates(countries[index].states);
                                        setAddState(null);
                                        setStateIndex(null);
                                      } else {
                                        setCountryIndex(null);
                                        setCountry(null);
                                        setAllStates([]);
                                        setAddState(null);
                                        setStateIndex(null);
                                      }
                                    }}
                                  />
                                </div>
                              </Grid>
                              <Grid item md={4}>
                                <div>
                                  <label className='font-weight-normal mb-2'>
                                    State
                                  </label>
                                  <Autocomplete
                                    id='combo-box-demo'
                                    options={allStates}
                                    getOptionLabel={(option) => option}
                                    value={
                                      countryIndex != null
                                        ? stateIndex != null
                                          ? countries[countryIndex].states[
                                          stateIndex
                                          ] || ''
                                          : null
                                        : null
                                    }
                                    renderInput={params => (
                                      <TextField
                                        {...params}
                                        label='Select'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        name='state'
                                        value={
                                          countryIndex != null
                                            ? stateIndex != null
                                              ? countries[countryIndex].states[
                                              stateIndex
                                              ] || ''
                                              : null
                                            : null
                                        }
                                        error={
                                          isUpdatedSubmitted &&
                                          (updateEducationData.state
                                            ? false
                                            : true)
                                        }
                                        helperText={
                                          isUpdatedSubmitted &&
                                          (updateEducationData.state
                                            ? ''
                                            : 'State is Required')
                                        }
                                      />
                                    )}
                                    onChange={(event, value) => {
                                      const index = allStates.findIndex(
                                        (state) => state === value
                                      );
                                      if (index != -1) {
                                        setStateIndex(index);
                                        setAddState(
                                          countries[countryIndex].states[index]
                                        );
                                      } else {
                                        setStateIndex(null);
                                        setAddState(null);
                                      }
                                    }}
                                  />
                                </div>
                              </Grid>
                            </Grid>
                            <br></br>
                            {/* <Card
                                style={{
                                  // border: '1px solid #c4c4c4',
                                  margin: '25px 0'
                                }}
                                className='mt-4 p-3 p-lg-5 shadow-xxl'> */}
                            <div className='card-header'>
                              <div className='card-header--title'>
                                <p>
                                  <b>Uploaded Certificate</b>
                                </p>
                              </div>
                            </div>
                            {imgSrc !== '' ? (
                              <Grid item md={3} className='p-2'>
                                <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
                                  <img
                                    className='img-fluid img-fit-container rounded-sm'
                                    src={imgSrc}
                                    alt='...'
                                  />
                                  <FontAwesomeIcon
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      right: '0px',
                                      background: 'black',
                                      color: 'white'
                                    }}
                                    icon={['fas', 'times']}
                                    className='font-size-lg crossIcon'
                                    onClick={e => {
                                      deleteCertificateImage()
                                    }}
                                  />
                                </div>
                              </Grid>
                            ) : (
                              ''
                            )}
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
                                        Some files will be rejected! Accepted
                                        only jpeg and png files
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
                                <div className='font-weight-bold mb-3 text-uppercase text-dark font-size-sm text-center'>
                                  Uploaded Files
                                </div>
                                {thumbs.length <= 0 && (
                                  <>
                                    <div className='text-first text-center font-size-sm'>
                                      Uploaded demo images previews will appear
                                      here!
                                    </div>{' '}
                                  </>
                                )}
                                {thumbs.length > 0 && (
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
                                    <Button
                                      style={{ marginRight: '2.5%' }}
                                      onClick={e => {
                                        uploadImage()
                                      }}
                                      className='btn-primary font-weight-normal mb-2 mr-3 float-right'>
                                      Upload Image
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* </Card> */}
                          </div>
                          <br />
                          <div className='text-center'>
                            <Button
                              onClick={e => {
                                update()
                              }}
                              className='btn-primary font-weight-normal mb-2 mr-3'>
                              Update
                            </Button>
                            <Button
                              className='btn-primary font-weight-normal mb-2'
                              onClick={e => {
                                handleClose2()
                              }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={modal2}
                      onClose={toggle3}
                      classes={{ paper: 'shadow-lg rounded' }}>
                      <div className='text-center p-5'>
                        <div className='avatar-icon-wrapper rounded-circle m-0'>
                          <div className='d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130'>
                            <FontAwesomeIcon
                              icon={['fas', 'times']}
                              className='d-flex align-self-center display-3'
                            />
                          </div>
                        </div>
                        <h4 className='font-weight-normal mt-4'>
                          Are you sure you want to delete this entry?
                        </h4>
                        <p className='mb-0 font-size-lg text-muted'>
                          You cannot undo this operation.
                        </p>
                        <div className='pt-4'>
                          <Button
                            onClick={toggle3}
                            className='btn-neutral-secondary btn-pill mx-1'>
                            <span className='btn-wrapper--label'>Cancel</span>
                          </Button>
                          <Button
                            onClick={handleDeleteID}
                            className='btn-danger btn-pill mx-1'>
                            <span className='btn-wrapper--label'>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </Dialog>
                    <div className='divider' />
                    <div className='divider' />
                    <div className='float-left' style={{ marginRight: '2.5%' }}>
                      <Button
                        className='btn-primary mb-2 m-2'
                        component={NavLink}
                        to='./dashboard'>
                        Cancel
                      </Button>
                      <Button
                        className='btn-primary mb-2 m-2'
                        type='submit'
                        onClick={e => save(e)}>
                        Save
                      </Button>
                    </div>
                  </Collapse>
                </>
              ) : (
                ''
              )}
            </div>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
    </BlockUi>
  )
}

const mapStateToProps = state => ({
  countriesMasterData: state.Auth.countriesMasterData,
  user: state.Auth.user
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(AddEducationDetail)
