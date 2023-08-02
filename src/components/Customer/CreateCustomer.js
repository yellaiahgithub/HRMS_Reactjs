import { Button, Card, Grid, Snackbar, TextField } from '@material-ui/core';
import axios from 'axios';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import apicaller from 'helper/Apicaller';
import { useFormik } from 'formik';
import * as yup from 'yup';
const CreateCustomer = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Customer' : 'Create Customer';
  let [validDate, setValidDate] = useState(true);
  const [customerName, setCustomerName] = useState();
  const [registrationDate, setRegistrationDate] = useState(null);
  const [superAdminName, setSuperAdminName] = useState();
  const [email, setEmail] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [customerId, setCustomerId] = useState();
  const [_id, setId] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [updatedAt, setUpdatedAt] = useState();
  const [isActive, setIsActive] = useState();
  const [isSubmitted, setIsSubmitted] = useState()
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  useEffect(() => {
    if (id) {
      getCustomer();
    }
  }, []);
  const getCustomer = () => {
    apicaller('get', `${BASEURL}/customer/byId/` + id)
      .then((res) => {
        if (res.status === 200) {
          // console.log('res.data', res.data);
          setCustomerName(res.data.customerName);
          setRegistrationDate(new Date(res.data.registrationDate).toString());
          setSuperAdminName(res.data.superAdminName);
          setEmail(res.data.email);
          setPhoneNo(res.data.phoneNo);
          setCustomerId(res.data.uuid);
          setId(res.data._id);
          setCreatedAt(res.data.createdAt);
          setUpdatedAt(res.data.updatedAt);
          setIsActive(res.data.isActive);
          validateDate(res.data.registrationDate);
        }
      })
      .catch((err) => {
        console.log('get customer err', err);
      });
  };
  const validateDate = (date) => {
    if (date && !isNaN(Date.parse(date))) {
      if (new Date(date) > new Date()) {
        setValidDate(false);
      } else {
        setValidDate(true);
      }
    } else {
      if (date) setValidDate(false);
      else setValidDate(true);
    }
  };
  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const save = (e) => {
    //to do service call
    setIsSubmitted(true)
    let inputObj = {
      customerName: customerName,
      registrationDate: registrationDate,
      superAdminName: superAdminName,
      email: formik.values.email,
      phoneNo:formik.values.phoneNumber,
      uuid: customerId,
      _id: _id,
      createdAt: createdAt,
      updatedAt: updatedAt,
      isActive: isActive
    };
    if (!edit) {
      apicaller('post', `${BASEURL}/customer/save`, inputObj)
        .then((res) => {
          if (res.status === 200) {
            console.log('res.data', res.data);
            setState({
              open: true,
              message: 'Customer Created Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            open: true,
            message: 'Error Occured while creating Customer Details',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('create customer err', err);
        });
    } else {
      apicaller('put', `${BASEURL}/customer/update`, inputObj)
        .then((res) => {
          if (res.status === 200) {
            console.log('res.data', res.data);
            setIsSubmitted(false)
            setState({
              open: true,
              message: 'Customer Details Updated Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          setState({
            open: true,
            message: 'Error Occured while updating Customer Details',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          });
          console.log('update customer err', err);
        });
    }
  }
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
    <Card>
      <br />
      <Grid container spacing={0}>
        <Grid item md={10} lg={7} xl={10} className="mx-auto">
          <div className='bg-white p-4 rounded'>
            <div className='text-center my-4'>
              <h4 className='mb-1 '>{saveButtonLabel}</h4>
            </div>
            <Grid container spacing={6}>
              <Grid item md={12}>
                <div>
                  <label className=" mb-2">
                    Customer Name *
                  </label>
                  <TextField
                    id="outlined-customerName"
                    placeholder="Customer Name"
                    type="text"
                    fullWidth
                    size="small"
                    name='customerName'
                    disabled={readOnly}
                    value={customerName}
                    onChange={(event) => {
                      setCustomerName(event.target.value);
                    }}
                    variant="outlined"
                    error={isSubmitted && (customerName ? false : true)}
                    helperText={
                      isSubmitted && (!customerName || customerName === '')
                        ? 'Customer Name is required'
                        : ''
                    }
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <div>
                  <label className=" mb-2">
                    Registration Date *
                  </label>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    style={{ margin: '0%' }}>
                    <KeyboardDatePicker
                      style={{ margin: '0%' }}
                      inputVariant="outlined"
                      format="dd/MM/yyyy"
                      placeholder="Registration Date"
                      margin="normal"
                      disabled={readOnly}
                      id="date-picker-inline"
                      maxDate={new Date()}
                      fullWidth
                      size="small"
                      value={registrationDate}
                      onChange={(event) => {
                        validateDate(event);
                        setRegistrationDate(event);
                      }}
                      error={
                        isSubmitted
                          ? registrationDate
                            ? registrationDate !== null &&
                              registrationDate instanceof Date &&
                              new Date(registrationDate) > new Date()
                              ? "Registration Date Cannot be greater than today's Date"
                              : null
                            : 'Registration Date Required'
                          : registrationDate !== null &&
                            registrationDate instanceof Date &&
                            new Date(registrationDate) > new Date()
                            ? "Registration Date Cannot be greater than today's Date"
                            : null
                              ? !isSubmitted
                              : registrationDate !== null &&
                                registrationDate instanceof Date &&
                                new Date(registrationDate) > new Date()
                                ? "Registration Date Cannot be greater than today's Date"
                                : null
                      }
                      helperText={
                        isSubmitted
                          ? registrationDate
                            ? registrationDate !== null &&
                              registrationDate instanceof Date &&
                              new Date(registrationDate) > new Date()
                              ? "Registration Date Cannot be greater than today's Date"
                              : null
                            : 'Registration Date Required'
                          : registrationDate !== null &&
                            registrationDate instanceof Date &&
                            new Date(registrationDate) > new Date()
                            ? "Registration Date Cannot be greater than today's Date"
                            : null
                              ? !isSubmitted
                              : registrationDate !== null &&
                                registrationDate instanceof Date &&
                                new Date(registrationDate) > new Date()
                                ? "Registration Date Cannot be greater than today's Date"
                                : null
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
              <Grid item md={6}>
                <label className=" mb-2">
                  Super Admin Name *
                </label>
                <TextField
                  xl={10}
                  id="outlined-superAdminName"
                  placeholder="Super Admin Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  size="small"
                  disabled={readOnly}
                  value={superAdminName}
                  onChange={(event) => {
                    setSuperAdminName(event.target.value);
                  }}
                  error={isSubmitted && (superAdminName ? false : true)}
                  helperText={
                    isSubmitted && (!superAdminName || superAdminName === '')
                      ? ' Super Admin Name is required'
                      : ''
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6} >
                <div>
                  <label className=" mb-2">
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
                </div>
              </Grid>
              <Grid item md={6} >
                <div>
                  <label className=" mb-2">
                    Email Address
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
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <br />
      <div className="float-right" style={{ marginRight: '2.5%' }}>
        <Button
          className="btn-primary mb-2 m-2"
          component={NavLink}
          to="./customer">
          Cancel
        </Button>
        <Button
          disabled={!validDate}
          onClick={(e) => save(e)}
          className="btn-primary mb-2 mr-3 m-2">
          {saveButtonLabel}
        </Button>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose}
          message={message}
          autoHideDuration={2000}
        />
      </div>
      <br />
      <br />
      <br />
    </Card>
  );
};

export default CreateCustomer;
