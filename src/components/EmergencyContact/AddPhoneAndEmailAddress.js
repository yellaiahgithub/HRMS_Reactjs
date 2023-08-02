import {
  Button,
  Card,
  Checkbox,
  Grid,
  TextField,
  TableContainer,
  Table,
  Collapse,
  Snackbar,
  Dialog,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import SelectEmployee from 'components/SelectEmployee';

// import "yup-phone";
const CreateAddPhoneAndEmailAddress = ({ user }) => {
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState();
  const [isEmailSubmitted, setIsEmailSubmitted] = useState();
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
  const [isPrimaryIdPhoneNumber, setIsPrimaryIdPhoneNumber] = useState(false);
  const [isPrimaryIdEmail, setIsPrimaryIdEmail] = useState(false);
  const [employeeCurrentEmailAddressArray, setEmployeeCurrentEmailAddressArray] = useState()
  const [employeeCurrentPhoneDetailsArray, setEmployeeCurrentPhoneDetailsArray] = useState();
  const [IndexToBeSplicePhone, setIndexToBeSplicePhone] = useState()
  const [phoneToBeDeleted, setPhoneToBeDeleted] = useState()
  const [IndexToBeSpliceEmail, setIndexToBeSpliceEmail] = useState()
  const [emailToBeDeleted, setEmailToBeDeleted] = useState()
  const [employeeDetail, setEmployeeDetail] = useState()
  const [emailTypeIndex, setEmailTypeIndex] = useState()
  const [phoneTypeIndex, setPhoneTypeIndex] = useState()
  const [OfficialPhoneTypeIndex, setOfficialPhoneTypeIndex] = useState()
  const [OfficialEmailTypeIndex, setOfficialEmailTypeIndex] = useState()

  useEffect(() => {
    const phoneIndex = phoneTypeArray.findIndex(phoneType => phoneType.value.toLowerCase() === 'Official'.toLowerCase())
    if (phoneIndex != -1) {
      setPhoneTypeIndex(phoneIndex)
      setOfficialPhoneTypeIndex(phoneIndex)
    }
    else {
      setPhoneTypeIndex(null)
      setOfficialPhoneTypeIndex(null)
    }
    const emailIndex = emailTypeArray.findIndex(emailType => emailType.value.toLowerCase() === 'Official'.toLowerCase())
    if (emailIndex != -1) {
      setEmailTypeIndex(emailIndex)
      setOfficialEmailTypeIndex(emailIndex)
    }
    else {
      setEmailTypeIndex(null)
      setOfficialEmailTypeIndex(null)
    }
  }, [])
  const reStatePhone = () => {
    setPhoneTypeIndex(OfficialPhoneTypeIndex)
    formik.values.phoneNumber = ''
    setIsPrimaryIdPhoneNumber(false)
    setIsPhoneSubmitted(false)
    setState1({ accordion: [false, false, false] })
  }
  const reStateEmail = () => {
    setEmailTypeIndex(OfficialEmailTypeIndex)
    formik.values.email = ''
    setIsPrimaryIdEmail(false)
    setIsEmailSubmitted(false)
    setState1({ accordion: [false, false, false] })
  }

  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    let employeeSearchInput = selectedEmployee.uuid
    apicaller('get', `${BASEURL}/employeePhone/fetchByEmployeeUUID/${employeeSearchInput}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setEmployeeCurrentPhoneDetailsArray(res.data)
          reStatePhone()
        }
        else {
          setEmployeeCurrentPhoneDetailsArray([])
          reStatePhone()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('Phone err', err)
        setEmployeeCurrentPhoneDetailsArray([])
        reStatePhone()
      })
    apicaller('get', `${BASEURL}/employeeEmail/fetchByEmployeeUUID/${employeeSearchInput}`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setEmployeeCurrentEmailAddressArray(res.data)
          reStateEmail()
        }
        else {
          setEmployeeCurrentEmailAddressArray([])
          reStateEmail()
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('Email err', err)
        setEmployeeCurrentEmailAddressArray([])
        reStateEmail()
      })
  }
  const save = (e) => {
    e.preventDefault();
    //to do service call
    // phone save in db
    if (state1.accordion[0] && !formik.errors.phoneNumber) {
      setIsPhoneSubmitted(true);
      if (formik.values.phoneNumber && phoneTypeArray[phoneTypeIndex]) {
        const empPhoneData = {
          type: phoneTypeArray[phoneTypeIndex].value,
          phoneNumber: formik.values.phoneNumber,
          isPreferred: isPrimaryIdPhoneNumber,
          employeeUUID: employeeDetail.uuid
        }
        apicaller('post', `${BASEURL}/employeePhone/save`, empPhoneData)
          .then(res => {
            if (res.status === 200) {
              console.log('res.empPhoneData', res.data)
              if (res.data) {
                getAllData(employeeDetail)
                // reset input fields to empty because our data is saved
                reStatePhone()
                setState({
                  open: true,
                  message: 'Record Added Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            }
          })
          .catch(err => {
            setBlocking(false)
            console.log('err', err)
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
        // show error phone and type are required to save
        console.log('phone and type are required to save')
      }
    }
    if (state1.accordion[1] && !formik.errors.email) {
      setIsEmailSubmitted(true);
      // email save in db
      if (formik.values.email && emailTypeArray[emailTypeIndex]) {
        const empEmailData = {
          type: emailTypeArray[emailTypeIndex].value,
          email: formik.values.email,
          isPreferred: isPrimaryIdEmail,
          employeeUUID: employeeDetail.uuid
        }
        apicaller('post', `${BASEURL}/employeeEmail/save`, empEmailData)
          .then(res => {
            if (res.status === 200) {
              console.log('res.empEmailData', res.data)
              if (res.data) {
                getAllData(employeeDetail)
                reStateEmail()
                // toggleAccordion(0)
                setState({
                  open: true,
                  message: 'Record Added Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
              }
            }
          }
          )
          .catch(err => {
            console.log('err', err)
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
        // show error email and type are required to save
        console.log('email and type are required to save')
      }
    }
  };

  const [deleteModalPhone, setDeleteModalPhone] = useState(false)
  const togglePhone = () => setDeleteModalPhone(!deleteModalPhone)
  // Confirmation for delete
  const showConfirmDeletePhone = (i, selected) => {
    setDeleteModalPhone(true)
    setPhoneToBeDeleted(selected)
    setIndexToBeSplicePhone(i)
  }
  // Delete API Call  for Phone Details
  const handleDeleteIDPhone = () => {
    setDeleteModalPhone(false)
    setBlocking(true)
    apicaller('delete', `${BASEURL}/employeePhone/delete/${phoneToBeDeleted.uuid}`)
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
          const list = [...employeeCurrentPhoneDetailsArray];
          list.splice(IndexToBeSplicePhone, 1);
          setEmployeeCurrentPhoneDetailsArray(list);
          // employeeCurrentPhoneDetailsArray.splice(index, 1);
        };
      })
      .catch(err => {
        setBlocking(false)
        console.log('err', err)
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
  const [deleteModalEmail, setDeleteModalEmail] = useState(false)
  const toggleEmail = () => setDeleteModalEmail(!deleteModalEmail)
  // Confirmation for delete
  const showConfirmDeleteEmail = (i, selected) => {
    setDeleteModalEmail(true)
    setEmailToBeDeleted(selected)
    setIndexToBeSpliceEmail(i)
  }
  // Delete API Call  for Email Details
  const handleDeleteIDEmail = () => {
    setDeleteModalEmail(false)
    setBlocking(true)
    apicaller('delete', `${BASEURL}/employeeEmail/delete/${emailToBeDeleted.uuid}`)
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
          const list = [...employeeCurrentEmailAddressArray];
          list.splice(IndexToBeSpliceEmail, 1);
          setEmployeeCurrentEmailAddressArray(list);
          // employeeCurrentEmailAddressArray.splice(index, 1);
        };
      })
      .catch(err => {
        setBlocking(false)
        console.log('err', err)
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
  const phoneTypeArray = [
    {
      value: 'Mobile',
      label: 'Mobile'
    },
    {
      value: 'Residence',
      label: 'Residence'
    },
    {
      value: 'Public',
      label: 'Public'
    },
    {
      value: 'Official',
      label: 'Official'
    }
  ];
  const defaultPhoneType = 'Official';

  const emailTypeArray = [
    {
      value: 'Official',
      label: 'Official'
    },
    {
      value: 'Personal',
      label: 'Personal'
    },
    {
      value: 'Confidential',
      label: 'Confidential'
    }
  ];
  const emailAddressArray = [
    {
      value: 'Test123@gmil.com',
      label: 'Test123@gmil.com'
    },
    {
      value: 'Test456@gmil.com',
      label: 'Test456@gmil.com'
    },
    {
      value: 'Test789@gmil.com',
      label: 'Test789@gmil.com'
    }
  ];


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

  const handleSubmit = (event) => {
    event.preventDefault();

    // setIsSubmitted(true);
    // const phoneObj = companyPhoneNumbers.find(o => o.preferred === true)
  };

  //For email validation
  const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    phoneNumber: yup
      .string('Please enter a valid Phone Number')
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
      // .phoneNumber("US", "Please enter a valid Phone Number")
      .required("Phone Number is required"),
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
              <div className='bg-white p-4 rounded'>
                <div className='text-center my-4'>
                  <h1 className='display-4 mb-1 '>
                    Create Phone And Email
                  </h1>
                </div>
                <SelectEmployee getAllData={getAllData} employeeUUID={employeeUUID} />
                <br />
                {console.log(employeeDetail)}
                {employeeDetail && (
                  <>
                    <div className="mb-spacing-6">
                      <Grid container spacing={1}>
                        <Grid item md={6}>
                          <Card className="card-box">
                            <div className="font-size-md px-3 py-2 font-weight-bold">
                              Employee's Current Phone Details
                            </div>
                            <div className="table-responsive-md">
                              <TableContainer>
                                <Table className="table text-nowrap mb-0">
                                  <thead>
                                    <tr>
                                      <th style={{ width: '30%' }} className="text-uppercase bg-secondary">
                                        Phone Type
                                      </th>
                                      <th style={{ width: '30%' }} className="text-uppercase bg-secondary">
                                        Phone Number
                                      </th>
                                      <th style={{ width: '20%' }} className="text-uppercase bg-secondary">
                                        Preferred
                                      </th>
                                      <th style={{ width: '20%' }}>&nbsp;</th>
                                    </tr>
                                  </thead>
                                  {employeeCurrentPhoneDetailsArray ? (
                                    <tbody>
                                      {employeeCurrentPhoneDetailsArray?.map(
                                        (item, idx) => (
                                          <tr>
                                            <td>
                                              {item.type}
                                            </td>
                                            <td>
                                              {item.phoneNumber}
                                            </td>
                                            <td>
                                              <div>
                                                <Checkbox
                                                  style={item.isPreferred ? { color: 'blue' } : {}}
                                                  color="primary"
                                                  className="align-self-start"
                                                  name={`preferred${idx}`}
                                                  id={`phoneCheckbox${idx}`}
                                                  checked={item.isPreferred}
                                                  value={item.isPreferred}
                                                  disabled={true}
                                                />
                                              </div>
                                            </td>
                                            <td className="text-center">
                                              <Button
                                                disabled={item.isPreferred}
                                                onClick={() => {
                                                  showConfirmDeletePhone(idx, item)
                                                  // if (!item.preferred) handleRemovePhone(idx)
                                                }}
                                                className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                                <span className="btn-wrapper--icon d-flex">
                                                  <FontAwesomeIcon
                                                    icon={['fas', 'times']}
                                                    className="font-size-sm"
                                                  />
                                                </span>
                                              </Button>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  ) :
                                    <tbody>
                                      <tr className='text-center'><td colSpan={6}>
                                        <span>
                                          No Employee's Current Phone Address Added..
                                        </span>
                                      </td></tr>
                                    </tbody>
                                  }
                                </Table>
                              </TableContainer>
                            </div>
                          </Card>
                        </Grid>
                        <Grid item md={6}>
                          <Card className="card-box">
                            <div className="font-size-md px-3 py-2 font-weight-bold">
                              Employee's Current Email Address
                            </div>
                            <div className="table-responsive-md">
                              <TableContainer>
                                <Table className="table text-nowrap mb-0">
                                  <thead>
                                    <tr>
                                      <th style={{ width: '20%' }} className="text-uppercase bg-secondary">
                                        Email Type
                                      </th>
                                      <th style={{ width: '30%' }} className="text-uppercase bg-secondary">
                                        Email ID
                                      </th>
                                      <th style={{ width: '10%' }} className="text-uppercase bg-secondary">
                                        Preferred
                                      </th>
                                      <th style={{ width: '10%' }}>&nbsp;</th>
                                    </tr>
                                  </thead>
                                  {employeeCurrentEmailAddressArray ? (
                                    <tbody>
                                      {employeeCurrentEmailAddressArray?.map(
                                        (item, idx) => (
                                          <tr>
                                            <td>
                                              {item.type}
                                            </td>
                                            <td>
                                              {item.email}
                                            </td>
                                            <td>
                                              <div>
                                                <Checkbox
                                                  style={item.isPreferred ? { color: 'blue' } : {}}
                                                  color="primary"
                                                  className="align-self-start"
                                                  name={`preferred${idx}`}
                                                  id={`emailCheckbox${idx}`}
                                                  checked={item.isPreferred}
                                                  value={item.isPreferred}
                                                  disabled={true}
                                                />
                                              </div>
                                            </td>
                                            <td className="text-center">
                                              <Button
                                                disabled={item.isPreferred}
                                                onClick={() => {
                                                  showConfirmDeleteEmail(idx, item)
                                                }}
                                                className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                                <span className="btn-wrapper--icon d-flex">
                                                  <FontAwesomeIcon
                                                    icon={['fas', 'times']}
                                                    className="font-size-sm"
                                                  />
                                                </span>
                                              </Button>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  ) :
                                    <tbody>
                                      <tr className='text-center'><td colSpan={6}>
                                        <span>No Employee's Current Email Address Added..</span>
                                      </td></tr>
                                    </tbody>
                                  }
                                </Table>
                              </TableContainer>
                            </div>
                          </Card>
                        </Grid>
                      </Grid>
                    </div>
                    <div className="divider" />
                    <div className="divider" />
                    <div className="mb-spacing-6">
                      <Grid container spacing={1}>
                        <Grid item md={6}>
                          <div className="accordion-toggle">
                            <Button
                              style={{ padding: '25px 0' }}
                              className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                              onClick={() => toggleAccordion(0)}
                              aria-expanded={state1.accordion[0]}>
                              <span>Add New Phone Number</span>
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
                            <div className="mb-spacing-6">
                              <Grid container spacing={1}>
                                <Grid item md={6}>
                                  <label
                                    style={{ marginTop: '15px' }}
                                    className=" mb-2">
                                    Phone Type *
                                  </label>
                                  <Autocomplete
                                    id="combo-box-demo"
                                    select
                                    options={phoneTypeArray}
                                    value={phoneTypeIndex != null ? phoneTypeArray[phoneTypeIndex] : null}
                                    getOptionLabel={(option) => (option.value ? option.value : '')}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Phone Type"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        name='typePhone'
                                        error={
                                          isPhoneSubmitted &&
                                            !phoneTypeArray[phoneTypeIndex] ? true : false
                                        }
                                        helperText={
                                          isPhoneSubmitted &&
                                            !phoneTypeArray[phoneTypeIndex]
                                            ? 'Field is Mandatory'
                                            : ''

                                        }
                                      />
                                    )}
                                    onChange={(event, value) => {
                                      const phoneIndex = phoneTypeArray.findIndex(phoneType => phoneType.value.toLowerCase() === value?.value.toLowerCase())
                                      if (phoneIndex != -1) {
                                        setPhoneTypeIndex(phoneIndex)
                                      }
                                      else {
                                        setPhoneTypeIndex(null)
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item>
                                  <label
                                    style={{ marginTop: '15px' }}
                                    className=" mb-2">
                                    Phone Number *
                                  </label>
                                  <TextField
                                    id="outlined-phoneNumber"
                                    placeholder="Phone Number"
                                    type="text"
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
                                <Grid item>
                                  <div style={{
                                  }}>
                                    <div>
                                      <Checkbox
                                        id="outlined-isPrimaryPhoneNumber"
                                        placeholder="Consider this as a Primary Card"
                                        variant="outlined"
                                        size="small"
                                        checked={isPrimaryIdPhoneNumber}
                                        value={isPrimaryIdPhoneNumber}
                                        color="primary"
                                        onChange={(event) => {
                                          setIsPrimaryIdPhoneNumber(event.target.checked)
                                        }}
                                      />
                                      &nbsp;
                                      <label className=" mb-2">
                                        Consider this as a Primary ID
                                      </label>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </div>
                          </Collapse>
                        </Grid>
                        <Grid item md={6}>
                          <div className="accordion-toggle">
                            <Button
                              style={{ padding: '25px 0' }}
                              className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                              onClick={() => toggleAccordion(1)}
                              aria-expanded={state1.accordion[1]}>
                              <span>Add New Email Address</span>
                              &nbsp;
                              {state1.accordion[1] ? (
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
                          <Collapse in={state1.accordion[1]}>
                            <div className="mb-spacing-6">
                              <Grid container spacing={1}>
                                <Grid item md={6}>
                                  <label
                                    style={{ marginTop: '15px' }}
                                    className=" mb-2">
                                    Email Type *
                                  </label>
                                  <Autocomplete
                                    id="combo-box-demo"
                                    select
                                    options={emailTypeArray}
                                    value={emailTypeIndex != null ? emailTypeArray[emailTypeIndex] : null}
                                    getOptionLabel={(option) => (option.value ? option.value : '')}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="select Email Type"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        name="typeEmail"
                                        error={
                                          isEmailSubmitted && !emailTypeArray[emailTypeIndex] ? true : false
                                        }
                                        helperText={
                                          isEmailSubmitted &&
                                            !emailTypeArray[emailTypeIndex] ? 'Field is Mandatory' : ''
                                        }
                                      />
                                    )}
                                    onChange={(event, value) => {
                                      const emailIndex = emailTypeArray.findIndex(emailType => emailType.value.toLowerCase() === value?.value.toLowerCase())
                                      if (emailIndex != -1) {
                                        setEmailTypeIndex(emailIndex)
                                      }
                                      else {
                                        setEmailTypeIndex(null)
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item>
                                  <label
                                    style={{ marginTop: '15px' }}
                                    className=" mb-2">
                                    Email Address *
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
                                <Grid item>
                                  <div style={{
                                  }}>
                                    <div>
                                      <Checkbox
                                        id="outlined-isPrimaryEmail"
                                        className="align-self-start"
                                        placeholder="Consider this as a Primary Card"
                                        variant="outlined"
                                        size="small"
                                        style={{ padding: '0px' }}
                                        checked={isPrimaryIdEmail}
                                        value={isPrimaryIdEmail}
                                        color="primary"
                                        onChange={(event) => {
                                          setIsPrimaryIdEmail(event.target.checked)
                                        }}
                                      />
                                      &nbsp;
                                      <label className=" mb-2">
                                        Consider this as a Primary ID
                                      </label>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            </div>
                          </Collapse>
                        </Grid>
                      </Grid>
                      <div
                        className="float-right"
                        style={{ marginRight: '2.5%' }}>
                        <Button
                          className="btn-primary mb-2 m-2"
                          onClick={() => {
                            reStateEmail()
                            reStatePhone()
                          }}>
                          Cancel
                        </Button>
                        <Button
                          className="btn-primary mb-2 m-2"
                          type="submit"
                          // disabled={employeeDetail ? false : true}
                          onClick={(e) => save(e)}>
                          {saveButtonLabel}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Dialog
                open={deleteModalPhone}
                onClose={togglePhone}
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
                      onClick={togglePhone}
                      className='btn-neutral-secondary btn-pill mx-1'>
                      <span className='btn-wrapper--label'>Cancel</span>
                    </Button>
                    <Button
                      onClick={(e) => handleDeleteIDPhone()}
                      className='btn-danger btn-pill mx-1'>
                      <span className='btn-wrapper--label'>Delete</span>
                    </Button>
                  </div>
                </div>
              </Dialog>
              <Dialog
                open={deleteModalEmail}
                onClose={toggleEmail}
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
                      onClick={toggleEmail}
                      className='btn-neutral-secondary btn-pill mx-1'>
                      <span className='btn-wrapper--label'>Cancel</span>
                    </Button>
                    <Button
                      onClick={(e) => handleDeleteIDEmail()}
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
        </form>
      </Card>
    </BlockUi>
  );
};

export default CreateAddPhoneAndEmailAddress;