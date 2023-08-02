import {
  Button,
  Card,
  Checkbox,
  Grid,
  TextField,
  Table,
  Collapse,
  Dialog,
  Snackbar,
  Switch,
  CardContent,
  ListItem,
  Box
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import Pagination from '@material-ui/lab/Pagination';
import { ClimbingBoxLoader } from 'react-spinners';
import avatar4 from '../../assets/images/avatars/avatar4.jpg';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { date, object } from 'yup';
import { Alert } from '@material-ui/lab';
import PublishTwoToneIcon from '@material-ui/icons/PublishTwoTone'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import CheckIcon from '@material-ui/icons/Check'
import DateFnsUtils from '@date-io/date-fns';
import { useDropzone } from 'react-dropzone'
import { MenuItem } from 'react-contextmenu';
import { TrendingUpTwoTone } from '@material-ui/icons';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import SelectEmployee from 'components/SelectEmployee';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Value } from 'sass';



// toast.configure()

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const CreateAddCertificateLicense = ({ employeeDetails }) => {
  const [isSubmitted, setIsSubmitted] = useState();
  const [blocking, setBlocking] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const employeeUUID = queryParams.get('uuid') || null;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Certificate License' : 'Save'
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const [allEmployees, setEmployees] = useState([])
  const [employee, setEmployee] = useState();
  const [employeeSearchInput, setEmployeeSearchInput] = useState();
  // const [employeeNameValue, setEmployeeNameValue] = useState();
  const [certificateLicenseDetailsArray, setCertificateLicenseDetailsArray] = useState()
  //     setEmployeeCurrentPhoneDetailsArray(newArray);

  const [files, setFiles] = useState([])
  const [documentSrc, setDocumentSrc] = useState('')
  const [newDocumentUploaded, setNewDocumentUploaded] = useState(false)
  const [documentObj, setDocumentObj] = useState()
  // const [inputs, setInputs] = useState({})
  const [typeAs, setTypeAs] = useState();
  const [nameOfTheCertificateOrLicense, setNameOfTheCertificateOrLicense] = useState();
  const [status, setStatus] = useState(true);
  const [statusArray, setStatusArray] = useState([{ label: 'Active', value: true }])
  const [effectiveDate, setEffectiveDate] = useState();
  const [levelOfCertification, setLevelOfCertification] = useState();
  const [dateOfIssue, setDateOfIssue] = useState();
  const [validity, setValidity] = useState();
  const [validityFrom, setValidityFrom] = useState();
  const [validityUntil, setValidityUntil] = useState();
  const [hasAnnotation, setHasAnnotation] = useState();
  const [annotationFilePath, setAnnotationFilePath] = useState();
  const [annotationFileName, setAnnotationFileName] = useState();
  const [certificateFilePath, setCertificateFilePath] = useState();
  const [certificateFileName, setCertificateFileName] = useState();
  const [issuingAuthority, setIssuingAuthority] = useState();

  const [editCertificateLicenseID, setEditCertificateLicenseID] = useState();
  const [isEditCertificateLicenseDetails, setIsEditCertificateLicenseDetails] = useState();
  const [checkboxEnable, setCheckboxEnable] = useState([]);

  const [IndexToBeSplice, setIndexToBeSplice] = useState()
  const [certificateToBeDeleted, setCertificateToBeDeleted] = useState()
  const [certificateOrLicenseArray, setCertificateOrLicenseArray] = useState([]);
  const [employeeDetail, setEmployeeDetail] = useState()


  const reState = () => {
    setTypeAs('')
    setNameOfTheCertificateOrLicense('')
    setStatus(true)
    setStatusArray([{ label: 'Active', value: true }, { label: 'InActive', value: false }])
    setEffectiveDate('')
    setLevelOfCertification('')
    setDateOfIssue('')
    setValidity('')
    setValidityFrom('')
    setValidityUntil('')
    // setHasAnnotation('')
    setIssuingAuthority('')
    setIsSubmitted(false)
    setState1({ accordion: [false, false, false] })
    setFiles([])
    setIsEditCertificateLicenseDetails(false)
    setIsSubmitted(false)
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
        acceptedFiles.map(certificateFile =>
          Object.assign(certificateFile, {
            preview: URL.createObjectURL(certificateFile)
          })
        )
      )
      setNewDocumentUploaded(false)
      setCertificateFilePath()
      setDocumentObj()
    }
  })

  const thumbs = files.map((certificateFile, index) => (
    <Grid item md={3} className='p-2' key={certificateFile.name}>
      <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
        {/* <iframe
            className='img-fluid img-fit-container rounded-sm'
            src={file.preview}
            height="200" width="300"></iframe> */}
        <a href={certificateFile.preview} download={certificateFile.name}>File: {certificateFile.name} </a>
        <Box textAlign="right">
          <Button
            onClick={() => deleteCertificate()}
            className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-right justify-content-center">
            <FontAwesomeIcon icon={['fas', 'times']} className="font-size-sm" />
          </Button>
        </Box>
      </div>
    </Grid>
  ))
  useEffect(() => {
    // getCertificateItemByType()
    // licenseFetchByType()
  }, [])
  // Dleete PDF cross icon
  const deleteCertificate = () => {
    // setFiles([])
    if (certificateFilePath) {
      setBlocking(true)
      apicaller('delete', `${BASEURL}/storage?path=` + certificateFilePath)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            if (res.data) {
              // setDocumentSrc('')
              // setCertificateFilePath()
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
  const deleteCertificateFromEdit = () => {
    if (certificateFilePath) {
      setBlocking(true)
      apicaller('delete', `${BASEURL}/storage?path=` + certificateFilePath)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            if (res.data) {
              setDocumentSrc('')
              setCertificateFilePath()
              setNewDocumentUploaded(false)
            }
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('updateSession err', err)
        })
    }
  }
  const uploadDocument = () => {
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
          setCertificateFilePath(path)
          setCertificateFileName(res.data.fileName)
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
  const checkIfDocumentUploadedOrNot = certificateLicenseObj => {
    if (certificateLicenseObj.certificateFile && Object.keys(certificateLicenseObj.certificateFile).length > 0) {
      setBlocking(true)
      let path = certificateLicenseObj.certificateFile.filePath + '/' + certificateLicenseObj.certificateFile.fileName
      setCertificateFilePath(path)
      apicaller('get', `${BASEURL}/storage?path=` + path)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            // console.log('res.data', res.data)
            if (res.data) {
              let baseStr64 = res.data
              if (certificateLicenseObj.certificateFile.fileType == "pdf") {
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
  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    let employeeSearchInput = selectedEmployee?.uuid
    apicaller('get', `${BASEURL}/certificate-license/byEmployeeUUID?employeeUUID=${employeeSearchInput}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setBlocking(false)
          console.log(res.data)
          setCertificateLicenseDetailsArray([...res.data])
          reState()
        }
        else {
          setCertificateLicenseDetailsArray([])
          reState()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get employee err', err)
        setCertificateLicenseDetailsArray([])
        reState()
      })
  }
  const licenseFetchByType = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/certificate-license/fetchByType/${typeAs}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setBlocking(false)
          console.log(res.data)
          setCertificateLicenseDetailsArray([...res.data])
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get employee err', err)
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
  const save = selectedEmployee => {
    // e.preventDefault();
    setIsSubmitted(true)
    // const saveUpdate = (filePath) => {
    //to do service call
    let data = {
      employeeUUID: employeeDetail.uuid,
      type: typeAs,
      nameOfTheCertificateOrLicense: nameOfTheCertificateOrLicense,
      status: status,
      effectiveDate: effectiveDate,
      levelOfCertification: levelOfCertification,
      dateOfIssue: dateOfIssue,
      validity: validity,
      validityFrom: validityFrom,
      validityUntil: validityUntil,
      // hasAnnotation: hasAnnotation,
      // annotationFilePath: annotationFilePath,
      // annotationFileName: annotationFileName,
      certificateFilePath: certificateFilePath,
      certificateFileName: certificateFileName,
      issuingAuthority: issuingAuthority,
      certificateFile: documentObj ? documentObj : {}
      // city: city,
      // country: country,
      // state: selectState,
      // filePath: filePath,
      // fileName: fileName,
      // isActive: isActive,
    };
    if (isEditCertificateLicenseDetails) {
      data.filePath = data.filePath ? data.filePath :
        data.uuid = editCertificateLicenseID
      //call an API to update New Address
      apicaller('patch', `${BASEURL}/certificate-license?uuid=${editCertificateLicenseID}`, data)
        .then(res => {
          if (res.status === 200) {
            console.log('res.data', res.data);
            if (res.data && res.data) {
              getAllData(employeeDetail)
              // reset input fields to empty because our data is saved
              reState()
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
        .catch((err) => {
          console.log('Employees Current Details err', err);
          setBlocking(false)
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
      apicaller('post', `${BASEURL}/certificate-license`, data)
        .then(res => {
          if (res.status === 200) {
            console.log('res.data', res.data)
            if (res.data && res.data[0]) {
              getAllData(employeeDetail)
              // reset input fields to empty because our data is saved
              reState()
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
        .catch(err => {
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
    }
    setIsSubmitted(true);
  }
  const typeArray = [{ value: 'Certificate' }, { value: 'License' }]
  const validityArray = [
    {
      value: 'Permanent',
      label: 'Permanent'
    },
    {
      value: 'Temporary',
      label: 'Temporary'
    },
    {
      value: 'Renewable',
      label: 'Renewable'
    },
    {
      value: 'Others',
      label: 'Others'
    }
  ];

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteToggle = () => setDeleteModal(!deleteModal)
  const handleEditIcon = (idx) => {
    // remove index
    if (checkboxEnable.indexOf(idx) > -1) {
      checkboxEnable.splice(idx, 1)
    }
    else {
      // add index
      checkboxEnable.push(idx)
    }
    setCheckboxEnable([...checkboxEnable])
    // Set isEditAddress true to display Input Fields
    setIsEditCertificateLicenseDetails(true)
    // Show Accordion to display Address Input fields
    // setTrue in first accordion
    openAccordion(0)
    // assign values to edit address in input feilds.
    const certificateLicenseObj = certificateLicenseDetailsArray[idx]
    setStatusArray([{ label: 'Active', value: true }, { label: 'InActive', value: false }])
    // find relationship in relationshipListArray to check if exist or not
    // if not exist means user has selected 'other'
    const foundTypeObj = getObjByValue(typeArray, certificateLicenseObj.typeAs);
    if (!foundTypeObj) {
      // set 'other' if not found
      setTypeAs('License')
    } else {
      setTypeAs(certificateLicenseObj.typeAs)
    }
    setTypeAs(certificateLicenseObj.type)
    getCertificateItemByType(certificateLicenseObj.type)
    setNameOfTheCertificateOrLicense(certificateLicenseObj.nameOfTheCertificateOrLicense)
    setStatus(certificateLicenseObj.status)
    setEffectiveDate(getParsedDate(certificateLicenseObj.effectiveDate))
    setLevelOfCertification(certificateLicenseObj.levelOfCertification)
    setDateOfIssue(getParsedDate(certificateLicenseObj.dateOfIssue))
    setValidity(certificateLicenseObj.validity)
    setValidityFrom(getParsedDate(certificateLicenseObj.validityFrom))
    setValidityUntil(getParsedDate(certificateLicenseObj.validityUntil))
    setHasAnnotation(certificateLicenseObj.hasAnnotation)
    setAnnotationFilePath(certificateLicenseObj.annotationFilePath)
    setAnnotationFileName(certificateLicenseObj.annfileotationFileName)
    setCertificateFilePath(certificateLicenseObj?.certificateFile?.filePath || certificateLicenseObj?.certificateFilePath)
    setCertificateFileName(certificateLicenseObj?.certificateFile?.fileName || certificateFileName?.certificateFileName)
    setIssuingAuthority(certificateLicenseObj.issuingAuthority)
    setEditCertificateLicenseID(certificateLicenseObj.uuid)
    checkIfDocumentUploadedOrNot(certificateLicenseObj)
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const [state1, setState1] = useState({
    accordion: [false, false, false]
  });
  // Confirmation for delete
  const showConfirmDelete = (i, selected) => {
    setFiles([])
    setDeleteModal(true)
    setCertificateToBeDeleted(selected)
    setIndexToBeSplice(i)
  }
  //Delete API Call 
  const handleDeleteID = () => {
    setDeleteModal(false)
    setBlocking(true)
    apicaller('delete', `${BASEURL}/certificate-license?employeeUUID=${employeeDetail.uuid}&type=${certificateToBeDeleted.type}&nameOfTheCertificateOrLicense=${certificateToBeDeleted.nameOfTheCertificateOrLicense}`)
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
          const list = [...certificateLicenseDetailsArray];
          list.splice(IndexToBeSplice, 1);
          setCertificateLicenseDetailsArray(list);
          // employeeCurrentPhoneDetailsArray.splice(index, 1);
        };
      })
      .catch(err => {
        setBlocking(false)
        console.log('create id err', err)
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
  const getParsedDate = date => {
    if (date !== null && date !== '') {
      return new Date(date).toLocaleDateString('af-ZA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }
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
  const notify = () => {
    //  toast('Hello Geeks')
  };
  const getObjByValue = (arr, value) => {
    return value ? arr.find((x) => x.value == value) : {};
  };

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
            <Grid item md={10} lg={10} xl={11} className="mx-auto">
              <div className="bg-white p-4 rounded">
                <div className='text-center my-4'>
                  <h1 className='display-4 mb-1 '>
                    Create Certificate And License
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
                            <b>Certificate/License Details</b>
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
                                <th style={{ width: '15%' }}>Type
                                </th>
                                <th style={{ width: '15%' }}>Name
                                </th>
                                <th style={{ width: '20%' }}>Level
                                </th>
                                <th style={{ width: '20%' }}>Valid From
                                </th>
                                <th style={{ width: '20%' }}>Valid UpTo
                                </th>
                                <th style={{ width: '10%' }} className="px-0">&nbsp;</th>
                              </tr>
                            </thead>
                            {certificateLicenseDetailsArray ? (
                              <tbody>
                                {certificateLicenseDetailsArray?.map(
                                  (item, idx) => (
                                    <tr>
                                      <td className="px-2">
                                        {item.type}
                                      </td>
                                      <td className="px-2">
                                        {item.nameOfTheCertificateOrLicense}
                                      </td>
                                      <td className="px-2">
                                        {item.levelOfCertification}
                                      </td>
                                      <td className="px=2">
                                        {getParsedDate(item.validityFrom)}
                                      </td>
                                      <td className="px=2">
                                        {getParsedDate(item.validityUntil)}
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
                                  <span>No certificate License Details Added..</span></td></tr>
                              </tbody>
                            }
                          </Table>
                        </div>
                        <br />
                      </CardContent>
                    </Card>
                    <div className="accordion-toggle">
                      <Button
                        style={{ padding: '25px 0px 0px 0px' }}
                        className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                        onClick={() => toggleAccordion(0)}
                        aria-expanded={state1.accordion[0]}>
                        <span>{isEditCertificateLicenseDetails ? 'Edit Certificate/License Details' : 'Add Certificate/License Details'}</span>
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
                      <Grid container spacing={6}>
                        <Grid item md={6}>
                          {/* <div> */}
                          <div>
                            <label
                              style={{ marginTop: '15px' }}
                              className=" mb-2">
                              Type
                            </label>
                            <TextField
                              id="outlined-new"
                              label='Select'
                              variant="outlined"
                              fullWidth
                              select
                              size="small"
                              name='New'
                              value={typeAs || ''}
                              onChange={(event) => {
                                getCertificateItemByType(event.target.value)
                                // set to show in select box
                                setTypeAs(event.target.value);
                                // set in typeAs if anything selected License than ''
                                if (event.target.value !== 'License') {
                                  setTypeAs(event.target.value)
                                }
                                licenseFetchByType()
                              }}
                              error={isSubmitted && (typeAs ? false : true)}
                              helperText={
                                isSubmitted && (typeAs ? '' : 'Field is Mandatory')
                              }
                            >
                              {typeArray.map(option => (
                                <ListItem key={option.value} value={option.value}>
                                  {option.value}
                                </ListItem>
                              ))}
                            </TextField>
                          </div>
                        </Grid>
                      </Grid>
                      {typeAs && (
                        <>
                          <Grid container spacing={1}>
                            <Grid item md={12}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                {(typeAs == 'License') ? 'Name of the License *' : 'Name Of the Certificate *'}
                              </label>
                              <Autocomplete
                                id="combo-box-demo"
                                select
                                // style={{ maxWidth: '250px' }}                               
                                value={nameOfTheCertificateOrLicense}
                                options={certificateOrLicenseArray}
                                getOptionLabel={(option) => (option.description ? option.description : option)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={nameOfTheCertificateOrLicense}
                                    error={
                                      isSubmitted &&
                                      (nameOfTheCertificateOrLicense ? false : true)
                                    }
                                    helperText={
                                      isSubmitted &&
                                      (nameOfTheCertificateOrLicense
                                        ? ''
                                        : 'Field is Mandatory')
                                    }
                                  />
                                )}
                                onChange={(event, value) => {
                                  if (value.description) {
                                    setNameOfTheCertificateOrLicense(value.description);
                                  } else {
                                    setNameOfTheCertificateOrLicense(value.option)
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item md={6}>
                              <div>
                                <label
                                  style={{ marginTop: '15px' }}
                                  className=" mb-2">
                                  Status
                                </label>
                                <TextField
                                  id="outlined-status"
                                  // required
                                  label={status ? '' : 'Select Status'}
                                  variant="outlined"
                                  error={isSubmitted && (status ? false : true)}
                                  helperText={
                                    isSubmitted && (status ? '' : 'Field is Mandatory')
                                  }
                                  fullWidth
                                  select
                                  size="small"
                                  value={status ? true : false}
                                  onChange={(event) => {
                                    setStatus(event.target.value);
                                  }}>
                                  {statusArray.map((option) => (
                                    <ListItem key={option.value} value={option.value}>
                                      {option.label}
                                    </ListItem>
                                  ))}
                                </TextField>
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=' mb-2'>
                                Effective Date *
                              </label>
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                style={{ margin: '0%' }}>
                                <KeyboardDatePicker
                                  style={{ margin: '0%' }}
                                  inputVariant="outlined"
                                  format="dd/MM/yyyy"
                                  margin="normal"
                                  id="date-picker-inline"
                                  fullWidth
                                  size="small"
                                  value={effectiveDate}
                                  onChange={(event) => {
                                    setEffectiveDate(event);
                                  }}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                  }}
                                  error={(isSubmitted && (effectiveDate ? false : true))}
                                  helperText={(isSubmitted && (effectiveDate ? "" : "Field is Mandatory"))}
                                />
                              </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={6}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                Level Of Certification *
                              </label>
                              <TextField
                                id="outlined-levelOfCertification"
                                placeholder="Select Level"
                                type="text"
                                variant="outlined"
                                fullWidth
                                error={isSubmitted && (levelOfCertification ? false : true)}
                                helperText={
                                  isSubmitted &&
                                  (levelOfCertification ? '' : 'Field is Mandatory')
                                }
                                size="small"
                                value={levelOfCertification}
                                onChange={(event) => {
                                  setLevelOfCertification(event.target.value);
                                }}
                              />
                            </Grid>
                            <Grid item md={6}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=' mb-2'>
                                Date Of Issue *
                              </label>
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                style={{ margin: '0%' }}>
                                <KeyboardDatePicker
                                  style={{ margin: '0%' }}
                                  inputVariant="outlined"
                                  format="dd/MM/yyyy"
                                  margin="normal"
                                  id="date-picker-inline"
                                  fullWidth
                                  size="small"
                                  value={dateOfIssue}
                                  onChange={(event) => {
                                    setDateOfIssue(event);
                                  }}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                  }}
                                  error={(isSubmitted && (dateOfIssue ? false : true))}
                                  helperText={(isSubmitted && (dateOfIssue ? "" : "Field is Mandatory"))}
                                />
                              </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={6}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                Validity *
                              </label>
                              <Autocomplete
                                id="combo-box-validity"
                                select
                                value={validity ? getObjByValue(
                                  validityArray,
                                  validity
                                ) : ''}
                                options={validityArray}
                                getOptionLabel={(option) => (option.value ? option.value : '')}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={validity}
                                    error={
                                      isSubmitted &&
                                      (validity ? false : true)
                                    }
                                    helperText={
                                      isSubmitted &&
                                      (validity
                                        ? ''
                                        : 'Field is Mandatory')
                                    }
                                  />
                                )}
                                onChange={(event, value) => {
                                  setValidity(value.value);
                                }}
                              />
                            </Grid>
                            <Grid item md={6}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=' mb-2'>
                                Valid From *
                              </label>
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                style={{ margin: '0%' }}>
                                <KeyboardDatePicker
                                  style={{ margin: '0%' }}
                                  inputVariant="outlined"
                                  format="dd/MM/yyyy"
                                  margin="normal"
                                  id="date-picker-inline"
                                  fullWidth
                                  size="small"
                                  value={validityFrom}
                                  onChange={(event) => {
                                    setValidityFrom(event)
                                  }}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                  }}
                                  error={(isSubmitted && (validityFrom ? false : true))}
                                  helperText={(isSubmitted && (validityFrom ? "" : "Field is Mandatory"))}
                                />
                              </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={6}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=' mb-2'>
                                Valid Until *
                              </label>
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                style={{ margin: '0%' }}>
                                <KeyboardDatePicker
                                  style={{ margin: '0%' }}
                                  inputVariant="outlined"
                                  format="dd/MM/yyyy"
                                  margin="normal"
                                  disabled={validity == 'Permanent'}
                                  id="date-picker-inline"
                                  fullWidth
                                  size="small"
                                  value={validityUntil}
                                  onChange={(event) => {
                                    setValidityUntil(event)
                                  }}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                  }}
                                  error={(isSubmitted && (validityUntil ? false : true))}
                                  helperText={(isSubmitted && (validityUntil ? "" : "Field is Mandatory"))}
                                />
                              </MuiPickersUtilsProvider>

                            </Grid>
                            <Grid item md={12}>
                              <label
                                style={{ marginTop: '15px' }}
                                className=" mb-2">
                                Issuing Authority *
                              </label>
                              <TextField
                                id="outlined-issuingAuthority"
                                placeholder="Select Issuing Authority"
                                type="text"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={issuingAuthority}
                                onChange={(event) => {
                                  setIssuingAuthority(event.target.value);
                                }}
                                error={isSubmitted && (issuingAuthority ? false : true)}
                                helperText={
                                  isSubmitted &&
                                  (issuingAuthority ? '' : 'Field is Mandatory')
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {typeAs && (
                        <>
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
                                  <b>Upload Certificate</b>
                                </p>
                              </div>
                            </div>
                            {isEditCertificateLicenseDetails && documentSrc && certificateFileName ? (
                              <Grid item md={3} className='p-2'>
                                <div className='p-2 bg-white shadow-xxl border-dark card-box d-flex overflow-hidden rounded-sm'>
                                  <a href={documentSrc} download={certificateFileName}
                                  >File: {certificateFileName} </a>
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
                                    onClick={() => deleteCertificateFromEdit()}
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
                                        Some files will be rejected! Accepted png, jpeg and pdf files
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
                                    Uploaded demo File previews will appear here!
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
                                          uploadDocument()
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
                              className="btn-primary mb-2 m-2"
                              onClick={() => {
                                toggleAccordion(0)
                                setIsEditCertificateLicenseDetails(false)
                                setFiles([])
                                setTypeAs('')
                                setNameOfTheCertificateOrLicense('')
                                setStatus(true)
                                setStatusArray([{ label: 'Active', value: true }])
                                setEffectiveDate('')
                                setLevelOfCertification('')
                                setDateOfIssue('')
                                setValidity('')
                                setValidityFrom('')
                                setValidityUntil('')
                                setHasAnnotation('')
                                setIssuingAuthority('')
                              }}>
                              Cancel
                            </Button>
                            <Button
                              className="btn-primary mb-2 m-2"
                              type="submit"
                              // disabled={employeeData ? false : true}
                              onClick={(e) => save(e)}>
                              {saveButtonLabel}
                            </Button>
                          </div>
                        </>
                      )}
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

export default CreateAddCertificateLicense;