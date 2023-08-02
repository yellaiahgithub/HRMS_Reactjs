import {
  Button,
  Card,
  Grid,
  TextField,
  Table,
  Collapse,
  ListItem,
  Snackbar,
  CardContent,
  Dialog,
  Box
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import CheckIcon from '@material-ui/icons/Check'
import { useDropzone } from 'react-dropzone'
import { MenuItem } from 'react-contextmenu';
import { connect } from 'react-redux'
import SelectEmployee from 'components/SelectEmployee'
import { useFormik } from 'formik';
import * as yup from 'yup';

const CreateAddWorkExperience = (props) => {
  const { countriesMasterData } = props;
  const [isSubmitted, setIsSubmitted] = useState();
  const [blocking, setBlocking] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const employeeUUID = queryParams.get('uuid') || null;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Employees Current Phone Details || Update  Employees Current Email Address ' : 'Save';
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const [IndexToBeSplice, setIndexToBeSplice] = useState()
  const [workExperienceToBeDeleted, setWorkExperienceToBeDeleted] = useState()
  const [priorWorkExperienceArray, setPriorWorkExperienceArray] = useState()
  const [files, setFiles] = useState([])
  const [filePath, setFilePath] = useState()
  const [fileName, setFileName] = useState()
  const [documentSrc, setDocumentSrc] = useState('')
  const [newDocumentUploaded, setNewDocumentUploaded] = useState(false)
  const [documentObj, setDocumentObj] = useState()
  const [employmentType, setEmploymentType] = useState();
  const [designation, setDesignation] = useState();
  const [reportingManagerName, setReportingManagerName] = useState();
  const [reasonForLeaving, setReasonForLeaving] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [city, setCity] = useState();
  const [addState, setAddState] = useState();
  const [country, setCountry] = useState();
  const [title, setTitle] = useState();
  const [companyName, setCompanyName] = useState();
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);
  const [startDateYear, setStartDateYear] = useState(yearsArray);
  const [endDateYear, setEndDateYear] = useState(yearsArray);
  const monthsArray = Array.from({ length: 12 }, (_, i) => 1 + i);
  const [startDateMonth, setStartDateMonth] = useState(monthsArray);
  const [endDateMonth, setEndDateMonth] = useState(monthsArray);
  const [workExperienceId, setWorkExperienceId] = useState();
  const [isEditNewWorkExperience, setIsEditNewWorkExperience] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  const [overAllExperience, setOverAllExperience] = useState();
  const [employeeDetail, setEmployeeDetail] = useState()
  const [modal2, setModal2] = useState(false)
  const [reportingManagerEmail, setReportingManagerEmail] = useState()

  let tempCountries = [];
  let tempStates = [];
  const [deleteModal, setDeleteModal] = useState(false)
  const deleteToggle = () => setDeleteModal(!deleteModal)

  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
  }, [])

  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    setOverAllExperience(0) // initially set 0
    let employeeSearchInput = selectedEmployee.uuid
    apicaller('get', `${BASEURL}/work-experience/byEmployeeUUID?employeeUUID=${employeeSearchInput}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log(res.data)
          let overAllExp = 0;
          let overAllExpMonths=0
          if (res.data) {
            res.data.map(item => {
              const num=splitDigitsbyDecimal(item.totalExperience);
              overAllExpMonths = overAllExpMonths + num[1]
              overAllExp = overAllExp + num[0] + Math.floor(overAllExpMonths/12)
              overAllExpMonths = overAllExpMonths % 12
            })
            overAllExp=Number(overAllExp+"."+overAllExpMonths)
            setPriorWorkExperienceArray([...res.data])
          }
          setOverAllExperience(overAllExp.toFixed(1))
          // resetState()
        }
        else {
          setPriorWorkExperienceArray([])
          resetState()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('err', err)
        setPriorWorkExperienceArray([])
        resetState()
      })
  }

  const splitDigitsbyDecimal=(num)=>{
    const number=num.toString().split('.',2);
    return [Number(number[0]),Number(number[1])]
  }
  const resetState = () => {
    setTitle('')
    setEmploymentType('')
    setCompanyName('')
    setPhoneNo('')
    setStartDateMonth('')
    setStartDateYear('')
    setEndDateMonth('')
    setEndDateYear('')
    setDesignation('')
    setReportingManagerName('')
    setReasonForLeaving('')
    setCity('')
    setCountry('')
    setFiles([])
    setAddState('')
    setIsSubmitted(false)
    setIsEditNewWorkExperience()
    setState1({ accordion: [false, false, false] })
    setCountryIndex(null);
    setStateIndex(null);
    setAllStates([]);
    setReportingManagerEmail('')
    setOverAllExperience(0)
    formik.values.phoneNumber = ''
    formik.values.email = ''
  }
  // Document upload
  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    // noClick: true,
    // noKeyboard: true,
    multiple: false,
    accept: 'application/pdf, image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
      setNewDocumentUploaded(false)
      setDocumentObj()
    }
  })
  const thumbs = files.map((file, index) => (
    <Grid item md={3} className='p-2' key={file.name}>
      <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
        {/* <iframe
       className='img-fluid img-fit-container rounded-sm'
       src={file.preview}
       height="200" width="300"></iframe> */}
        <a href={file.preview} download={file.name}>File: {file.name} </a>
        <Box textAlign="right">
          <Button
            onClick={() => deleteReleivingLetter()}
            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
            <FontAwesomeIcon icon={['fas', 'times']} className="font-size-sm" />
          </Button>
        </Box>
      </div>
    </Grid>
  ))
  // Dleete PDF cross icon
  const deleteReleivingLetter = () => {
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
  const deleteReleivingLetterFromEdit = () => {
    if (filePath) {
      setBlocking(true)
      apicaller('delete', `${BASEURL}/storage?path=` + filePath)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            if (res.data) {
              setDocumentSrc('')
              setFilePath()
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('updateSession err', err)
        })
    }
  }
  const uploadReleivingLetter = () => {
    setBlocking(true)
    let path = 'document/logo'
    let formData = new FormData()
    formData.append('file', files[0])
    // formData.append('path', path)
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
          // saveUpdate(res.data.filePath)
          console.log('res.data', res.data)
          setDocumentObj(res.data)
          let path = res.data.filePath + '/' + res.data.fileName
          setFilePath(path)
          setNewDocumentUploaded(true)
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
  const save = (e) => {
    e.preventDefault();
    //to do service call
    const yearToMonthDiff = (Number(endDateYear) - Number(startDateYear)) * 12;
    const totalEndInMonths = Number(endDateMonth) + yearToMonthDiff;
    const totalExpInMonths = totalEndInMonths - startDateMonth;
    // convert months to year.month
    const m = totalExpInMonths % 12;
    const y = Math.floor(totalExpInMonths / 12);
    const totalExperience = y + '.' + m;
    if (state1.accordion[0] && !formik.errors.phoneNumber && !formik.errors.email) {
      setIsSubmitted(true);

      let data = {
        employeeUUID: employeeDetail.uuid,
        title: title,
        employmentType: employmentType,
        companyName: companyName,
        phoneNo: formik.values.phoneNumber,
        reportingManagerEmail: formik.values.email,
        startDateMonth: startDateMonth,
        startDateYear: startDateYear,
        endDateMonth: endDateMonth,
        endDateYear: endDateYear,
        designation: designation,
        reportingManagerName: reportingManagerName,
        reasonForLeaving: reasonForLeaving,
        city: city,
        country: country,
        state: addState,
        filePath: filePath,
        fileName: fileName,
        file: documentObj ? documentObj : {},
        totalExperience: Number(totalExperience)
        // isActive: isActive,
      };
      if (isEditNewWorkExperience) {
        data.uuid = workExperienceId
        //call an API to update New Address
        apicaller('patch', `${BASEURL}/work-experience?employeeUUID=${employeeDetail.uuid}`, data)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data);
              if (res.data && res.data) {
                // To Refresh the table values
                getAllData(employeeDetail)
                // reset input fields to empty because our data is saved
                resetState()
                setState({
                  open: true,
                  message: 'Address Updated Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            }
          })
          .catch((err) => {
            // console.log('Employees Current Details err', err);
            setBlocking(false)
            console.log('err', err);
            if (err?.response?.data) {
              setState({
                open: true,
                message: err.response.data,
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
            }
          })
      } else {
        //call an API to Add New Address
        apicaller('post', `${BASEURL}/work-experience`, data)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              if (res.data && res.data[0]) {
                priorWorkExperienceArray.push(res.data[0])
                getAllData(employeeDetail)
                // reset input fields to empty because our data is saved
                resetState()
                setState({
                  open: true,
                  message: 'Address Added Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            }
          })
          .catch(err => {
            console.log('empPhoneData err', err)
            console.log('Employees Current Details err', err);
            if (err?.response?.data) {
              setState({
                open: true,
                message: err.response.data,
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
            }
          })
      }
      setIsSubmitted(true);


    }
    setIsSubmitted(true);
  }
  // Confirmation for delete
  const showConfirmDelete = (i, selected) => {
    // set files empty to empty previously selected files
    setFiles([])
    setModal2(true)
    setDeleteModal(true)
    setWorkExperienceToBeDeleted(selected)
    setIndexToBeSplice(i)
  }
  //Delete API Call  
  const handleDeleteID = () => {
    setDeleteModal(false)
    setBlocking(true)
    apicaller('delete', `${BASEURL}/work-experience?employeeUUID=${employeeDetail.uuid}&uuid=${workExperienceToBeDeleted.uuid}`)
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
          const list = [...priorWorkExperienceArray];
          list.splice(IndexToBeSplice, 1);
          setPriorWorkExperienceArray(list);
          // employeeCurrentPhoneDetailsArray.splice(index, 1);
        };
      })
      .catch(err => {
        setBlocking(false)
        console.log('err', err)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err.response.data?.message,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
  }
  const employmentTypeArray = [
    {
      value: 'Full-Time',
      label: 'Full-Time'
    },
    {
      value: 'Part-Time',
      label: 'Part-Time'
    },
    {
      value: 'Internship',
      label: 'Internship'
    },
    {
      value: 'Trainee',
      label: 'Trainee'
    },
    {
      value: 'Freelance',
      label: 'Freelance'
    },
    {
      value: 'Contract based',
      label: 'Contract based'
    }
  ];
  const handleEditIcon = (idx) => {
    // set files empty to empty previously selected files
    setFiles([])

    // Set isEditAddress true to display Input Fields
    setIsEditNewWorkExperience(true)
    // Show Accordion to display Address Input fields
    // setTrue in first accordion
    openAccordion(0)
    // assign values to edit address in input feilds.
    const workExperienceObj = priorWorkExperienceArray[idx]
    setTitle(workExperienceObj.title)
    setEmploymentType(workExperienceObj.employmentType)
    setCompanyName(workExperienceObj.companyName)
    setPhoneNo(workExperienceObj.phoneNo)
    setStartDateMonth(workExperienceObj.startDateMonth)
    setStartDateYear(workExperienceObj.startDateYear)
    setEndDateMonth(workExperienceObj.endDateMonth)
    setEndDateYear(workExperienceObj.endDateYear)
    setReportingManagerName(workExperienceObj.reportingManagerName)
    setReasonForLeaving(workExperienceObj.reasonForLeaving)
    setCity(workExperienceObj.city)
    setCountry(workExperienceObj.country)
    setAddState(workExperienceObj.state)
    setFilePath(workExperienceObj?.file?.filePath || workExperienceObj?.filePath)
    setFileName(workExperienceObj?.file?.fileName || workExperienceObj?.fileName)
    setWorkExperienceId(workExperienceObj.uuid)
    formik.values.email = workExperienceObj.reportingManagerEmail
    formik.values.phoneNumber = workExperienceObj.phoneNo
    setDesignation(workExperienceObj.designation)
    const countryIdx = countries.findIndex(
      (country) => country.name === workExperienceObj.country
    );
    if (countryIdx != -1) {
      setCountryIndex(countryIdx);
      const stateIdx = countries[countryIdx]?.states.findIndex(
        (state) => state === workExperienceObj.state
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
    checkIfDocumentUploadedOrNot(workExperienceObj)
  };
  const checkIfDocumentUploadedOrNot = workExperienceObj => {
    if (workExperienceObj.file && Object.keys(workExperienceObj.file).length > 0) {
      setBlocking(true)
      let path = workExperienceObj.file.filePath + '/' + workExperienceObj.file.fileName
      setFilePath(path)
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            // console.log('res.data', res.data)

            if (res.data) {
              let baseStr64 = res.data
              if (workExperienceObj.file.fileType == "pdf") {
                // checking condition for pdf
                baseStr64 = 'data:application/pdf;base64,' + baseStr64
              } else {
                // considering all other are images
                baseStr64 = 'data:image/jpg;base64,' + baseStr64
              }
              // Set the source of the Image to the base64 string
              setDocumentSrc(baseStr64)
              setNewDocumentUploaded(true)
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('updateSession err', err)
        })
    }
  }
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const [state1, setState1] = useState({
    accordion: [false, false, false]
  });
  const toggleAccordion = (tab) => {
    const prevState = state1.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    setState1({
      accordion: state
    });
  };
  const openAccordion = (tab) => {
    const prevState = state1.accordion;
    const state = prevState.map((x, index) => (tab === index ? true : false));
    setState1({
      accordion: state
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    // const phoneObj = companyPhoneNumbers.find(o => o.preferred === true)
  };
  const getObjByValue = (arr, value) => {
    return value ? arr.find((x) => x.value == value) : {};
  };
  const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email'),
    phoneNumber: yup
      .string('Please enter a valid Phone Number')
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
    // .phoneNumber("US", "Please enter a valid Phone Number")
    // .required("Phone Number is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      phoneNumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // Handle Submit
    },
  });

  return (
    <BlockUi
      tag="div"
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
              <div className="bg-white rounded">
                <div className='text-center my-4'>
                  <h1 className='display-4 mb-1 '>
                    Create Work Experience
                  </h1>
                </div>
                <SelectEmployee getAllData={getAllData} employeeUUID={employeeUUID} />
                <br />
                {employeeDetail && (
                  <>
                    <Card
                      style={{
                        padding: '25px',
                        border: '1px solid #c4c4c4'
                      }}>
                      <div className="card-header">
                        <div className="card-header--title">
                          <p class="m-0">
                            <b>Prior Work Experience Details</b>
                            {overAllExperience && (
                              <span className='text-grey font-weight-bold float-right' style={{ fontSize: '17px' }}>
                                Employee OverAll Experience&nbsp;
                                {overAllExperience}&nbsp;
                                Years
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div
                          className="table-responsive-md"
                          style={{ width: '100%', overflowX: 'auto' }}>
                          <Table className="table table-hover table-striped mb-0">
                            <thead className="thead-light">
                              <tr>
                                <th style={{ width: '20%' }}>Company Name
                                </th>
                                <th style={{ width: '20%' }}>Designation
                                </th>
                                <th style={{ width: '20%' }}>Start Date
                                </th>
                                <th style={{ width: '20%' }}>End Date
                                </th>
                                <th style={{ width: '10%' }}>Total Experience
                                </th>
                                <th style={{ width: '10%' }} className="px-0">&nbsp;</th>
                              </tr>
                            </thead>
                            {priorWorkExperienceArray ? (
                              <tbody>
                                {priorWorkExperienceArray?.map(
                                  (item, idx) => (
                                    <tr>
                                      <td className="px-2">
                                        {item.companyName}
                                      </td>
                                      <td className="px-2">
                                        {item.title}
                                      </td>
                                      <td className="px-2">
                                        {item.startDateMonth}/{item.startDateYear}
                                      </td>
                                      <td className="px-2">
                                        {item.endDateMonth}/{item.endDateYear}
                                      </td>
                                      <td className="px-2">
                                        {item.totalExperience}
                                      </td>
                                      <td className="text-center">
                                        <div>
                                          <Button
                                            onClick={() => handleEditIcon(idx)}
                                            className="btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                            <span className="btn-wrapper--icon d-flex">
                                              <FontAwesomeIcon
                                                icon={['fas', 'edit']}
                                                className="font-size-sm"
                                              />
                                            </span>
                                          </Button>
                                          <Button
                                            // disabled={item.preferred}
                                            onClick={() => {
                                              showConfirmDelete(idx, item)
                                            }}
                                            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                            <span className="btn-wrapper--icon d-flex">
                                              <FontAwesomeIcon
                                                icon={['fas', 'times']}
                                                className="font-size-sm"
                                              />
                                            </span>
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            ) :
                              <tbody>
                                <tr className='text-center'><td colSpan={6}>
                                  <span>No Prior Work Experience Added..
                                  </span>
                                </td>
                                </tr>
                              </tbody>
                            }
                          </Table>
                        </div>
                        <br />
                      </CardContent>
                    </Card>
                    <div className="accordion-toggle">
                      <Button
                        style={{ padding: '25px 0px 25px 0px' }}
                        className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                        onClick={() => toggleAccordion(0)}
                        aria-expanded={state1.accordion[0]}>
                        <span>{isEditNewWorkExperience ? 'Edit New Work Experience' : ' Add New Work Experience'}</span>
                        &nbsp;
                        {state1.accordion[0] ? (
                          <FontAwesomeIcon
                            icon={['fas', 'angle-down']}
                            className="font-size-xl accordion-icon"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={['fas', 'angle-right']}
                            className="font-size-xl accordion-icon"
                          />
                        )}
                      </Button>
                    </div>
                    <Collapse in={state1.accordion[0]}>
                      <div class="pr-4 pl-4">
                        <Grid container spacing={1}>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '10px' }}
                              className=" mb-2">
                              Previous Designation *
                            </label>
                            <TextField
                              id="outlined-title"
                              placeholder="Previous Designation"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={title}
                              error={isSubmitted && (title ? false : true)}
                              helperText={
                                isSubmitted &&
                                (title ? '' : 'Field is Mandatory')
                              }
                              onChange={(event) => {
                                setTitle(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Employment Type *
                            </label>
                            <Autocomplete
                              id="combo-box-demo"
                              select
                              style={{ maxWidth: '250px' }}
                              value={employmentType ? getObjByValue(
                                employmentTypeArray,
                                employmentType
                              ) : ''}
                              options={employmentTypeArray}
                              getOptionLabel={(option) => option.value}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Employment Type"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={employmentType}
                                  error={
                                    isSubmitted &&
                                    (employmentType ? false : true)
                                  }
                                  helperText={
                                    isSubmitted &&
                                    (employmentType
                                      ? ''
                                      : 'Field is Mandatory')
                                  }
                                />
                              )}
                              onChange={(event, value) => {
                                setEmploymentType(value.value);
                                // setWhenRelationshipOther(value.value)
                              }}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Company Name *
                            </label>
                            <TextField
                              id="outlined-companyName"
                              placeholder="Company Name"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={companyName}
                              onChange={(event) => {
                                setCompanyName(event.target.value);
                              }}
                              error={isSubmitted && (companyName ? false : true)}
                              helperText={
                                isSubmitted &&
                                (companyName ? '' : 'Field is Mandatory')
                              }
                            />
                          </Grid>
                          <Grid item md={12} className="mx-auto" style={{ marginTop: '15px' }}>
                            <div className=" mb-2">
                              Location
                            </div>
                          </Grid>
                          <Grid item md={6}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Country *
                            </label>
                            <Autocomplete
                              id="combo-box-demo"
                              select
                              value={
                                countryIndex != null
                                  ? countries[countryIndex] || ''
                                  : null
                              }
                              options={countries}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="select Country"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  name="country"
                                  value={
                                    countryIndex != null
                                      ? countries[countryIndex] || ''
                                      : null
                                  }
                                  error={
                                    isSubmitted && (country ? false : true)
                                  }
                                  helperText={
                                    isSubmitted &&
                                    (country ? '' : 'Field is Mandatory')
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
                          </Grid>
                          <Grid item md={6}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              State *
                            </label>
                            <Autocomplete
                              id="combo-box-demo"
                              select
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
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select State"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  name="addState"
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
                                    isSubmitted && (addState ? false : true)
                                  }
                                  helperText={
                                    isSubmitted &&
                                    (addState ? '' : 'Field is Mandatory')
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
                          </Grid>
                          <Grid item md={6}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              City
                            </label>
                            <TextField
                              id="outlined-City"
                              placeholder="city"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={city}
                              onChange={(event) => {
                                setCity(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item md={6}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Contact Number
                            </label>
                            <TextField
                              id="outlined-phoneNumber"
                              placeholder="Phone Number"
                              type="number"
                              variant="outlined"
                              fullWidth
                              required
                              size="small"
                              name='phoneNumber'
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.phoneNumber}
                              error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item md={6}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Start Date *
                            </label>
                            <div>
                              <TextField
                                id="outlined"
                                style={{ width: "calc(50% - 2px)", display: 'inline-block' }}
                                label="Month"
                                variant="outlined"
                                error={isSubmitted && (startDateMonth ? false : true)}
                                helperText={
                                  isSubmitted && (startDateMonth ? 'Field is Mandatory' : '')
                                }
                                fullWidth
                                select
                                size="small"
                                value={startDateMonth}
                                onChange={(event) => {
                                  setStartDateMonth(event.target.value);
                                }}>
                                {monthsArray.map((option) => (
                                  <ListItem key={option} value={option}>
                                    {option}
                                  </ListItem>
                                ))}
                              </TextField>
                              <TextField
                                id="outlined-status"
                                style={{ width: "calc(50% - 2px)", marginLeft: "2px", display: 'inline-block' }}
                                label="Year"
                                variant="outlined"
                                error={isSubmitted && (startDateYear ? false : true)}
                                helperText={
                                  isSubmitted && (startDateYear ? 'Field is Mandatory' : '')
                                }
                                fullWidth
                                select
                                size="small"
                                value={startDateYear}
                                onChange={(event) => {
                                  setStartDateYear(event.target.value);
                                }}>
                                {yearsArray.map((option) => (
                                  <ListItem key={option} value={option}>
                                    {option}
                                  </ListItem>
                                ))}
                              </TextField>
                            </div>
                          </Grid>
                          <Grid item md={6}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              End Date *
                            </label>
                            <div>
                              <TextField
                                id="outlined-month"
                                style={{ width: "calc(50% - 2px)", display: 'inline-block' }}
                                label="Month"
                                variant="outlined"
                                error={isSubmitted && (endDateMonth ? false : true)}
                                helperText={
                                  isSubmitted && (endDateMonth ? 'Field is Mandatory' : '')
                                }
                                fullWidth
                                select
                                size="small"
                                value={endDateMonth}
                                onChange={(event) => {
                                  setEndDateMonth(event.target.value);
                                }}>
                                {monthsArray.map((option) => (
                                  <ListItem key={option} value={option}>
                                    {option}
                                  </ListItem>
                                ))}
                              </TextField>
                              <TextField
                                id="outlined-year"
                                style={{ width: "calc(50% - 2px)", marginLeft: "2px", display: 'inline-block' }}
                                label="Year"
                                variant="outlined"
                                error={isSubmitted && (endDateYear ? false : true)}
                                helperText={
                                  isSubmitted && (endDateYear ? 'Field is Mandatory' : '')
                                }
                                fullWidth
                                select
                                size="small"
                                value={endDateYear}
                                onChange={(event) => {
                                  setEndDateYear(event.target.value);
                                }}>
                                {yearsArray.map((option) => (
                                  <ListItem key={option} value={option}>
                                    {option}
                                  </ListItem>
                                ))}
                              </TextField>
                            </div>
                          </Grid>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Reporting Manager’s Name
                            </label>
                            <TextField
                              id="outlined- reportingManager’sName"
                              placeholder="Reporting Manager’s Name"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={reportingManagerName}
                              onChange={(event) => {
                                setReportingManagerName(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Reporting Manager’s Designation
                            </label>
                            <TextField
                              id="outlined-designation"
                              placeholder="Designation"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={designation}
                              onChange={(event) => {
                                setDesignation(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Reporting Manager Email ID
                            </label>
                            <TextField
                              id="outlined-email"
                              placeholder="Email Address"
                              type="email"
                              variant="outlined"
                              fullWidth
                              size="small"
                              name='email'
                              inputProps={{ style: { textTransform: 'lowercase' } }}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                              error={formik.touched.email && Boolean(formik.errors.email)}
                              helperText={formik.touched.email && formik.errors.email}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Reason for Leaving
                            </label>
                            <TextField
                              id="outlined- reasonForLeaving"
                              placeholder="Reason For Leaving"
                              type="text"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={reasonForLeaving}
                              onChange={(event) => {
                                setReasonForLeaving(event.target.value);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </div>
                      <Card
                        style={{
                          padding: '25px',
                          border: '1px solid #c4c4c4',
                          margin: '25px'
                        }}
                        className='mt-4 p-3 p-lg-5 shadow-xxl'>
                        <div className='card-header'>
                          <div className='card-header--title'>
                            <p>
                              <b>Upload Reliving Letter</b>
                            </p>
                          </div>
                        </div>
                        {isEditNewWorkExperience && documentSrc && fileName ? (
                          <Grid item md={3} className='p-2'>
                            <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
                              <a href={documentSrc} download={fileName}
                              >File: {fileName} </a>
                              <FontAwesomeIcon
                                style={{
                                  position: 'absolute',
                                  top: '0px',
                                  right: '0px',
                                  background: 'black',
                                  color: 'white',
                                  cursor: 'pointer'
                                }}
                                icon={['fas', 'times']}
                                className='font-size-lg crossIcon'
                                onClick={() => deleteReleivingLetterFromEdit()}
                              />
                            </div>
                          </Grid>
                        ) : (
                          ''
                        )}
                        <div className='dropzone'>
                          <div {...getRootProps({ className: 'dropzone-upload-wrapper' })}>
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
                                    Some files will be rejected! Accepted only jpeg and png
                                    files
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
                              <div className='text-first text-center font-size-sm'>
                                Uploaded demo images previews will appear here!
                              </div>
                            )}
                            {thumbs.length > 0 && (
                              <div>
                                <Alert severity='success' className='text-center mb-3'>
                                  You have uploaded <b>{thumbs.length}</b> file(s)
                                </Alert>
                                <Grid container spacing={0}>
                                  {thumbs}
                                </Grid>
                                <Button
                                  style={{ marginRight: '2.5%' }}
                                  disabled={newDocumentUploaded}
                                  onClick={e => {
                                    if (documentSrc) {
                                      alert('Delete Previous File Before Uploading New Document')
                                    } else {
                                      // documentSrc should be empty before uploading new
                                      uploadReleivingLetter()
                                    }
                                  }}
                                  className='btn-primary  mb-2 mr-3 float-right'>
                                  Upload Document
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                      <div className="divider" />
                      <div
                        className="float-right"
                        style={{ marginRight: '2.5%' }}>
                        <Button
                          className="btn-primary mb-4 m-2"
                          onClick={() => {
                            toggleAccordion(0)
                            setIsEditNewWorkExperience(false)
                            setFiles([])
                            setTitle('')
                            setEmploymentType('')
                            setCompanyName('')
                            setPhoneNo('')
                            setStartDateMonth('')
                            setStartDateYear('')
                            setEndDateMonth('')
                            setEndDateYear('')
                            setDesignation('')
                            setReportingManagerName('')
                            setReasonForLeaving('')
                            setCity('')
                            setCountry('')
                            setAddState('')
                            setReportingManagerEmail('')
                            setCountryIndex(null)
                            setStateIndex(null)
                            formik.values.phoneNumber = ''
                            formik.values.email = ''
                          }}>
                          Cancel
                        </Button>
                        <Button
                          className="btn-primary mb-4 m-2"
                          type="submit"
                          onClick={(e) => save(e)}>
                          {saveButtonLabel}
                        </Button>
                      </div>
                    </Collapse>
                  </>
                )}
              </div>
              <Dialog
                open={deleteModal}
                onClose={deleteToggle}
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
                  <h4 className=' mt-4'>
                    Are you sure you want to delete this entry?
                  </h4>
                  <p className='mb-0 font-size-lg text-muted'>
                    You cannot undo this operation.
                  </p>
                  <div className='pt-4'>
                    <Button
                      onClick={deleteToggle}
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
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
                autoHideDuration={2000}
              />
            </Grid>
          </Grid>
        </form >
      </Card >
    </BlockUi >
  );
};
const mapStateToProps = (state) => ({
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreateAddWorkExperience);
