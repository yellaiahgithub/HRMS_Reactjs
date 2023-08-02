import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, Snackbar, Switch, TextField } from '@material-ui/core';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { NavLink } from 'react-router-dom';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ClimbingBoxLoader } from 'react-spinners';
import BlockUi from 'react-block-ui';

const CreateInitiateActions = (props) => {
  const { user, isAdminViewEnabled } = props;
  const [blocking, setBlocking] = useState(false);
  const [resignationReasonArray, setResignationReasonArray] = useState([]);
  const [reasonResignation, setReasonResignation] = useState(null);
  const [reasonResignationIndex, setReasonResignationIndex] = useState(null);
  const [lastWorkingDay, setLastWorkingDay] = useState(null);
  const [requestEarlyExit, setRequestEarlyExit] = useState(false);
  const [reasonEarlyExit, setReasonEarlyExit] = useState();
  const [details, setDetails] = useState();
  const [autoApprove, setAutoApprove] = useState();
  const [isSubmitted, setIsSubmitted] = useState();
  const [allEmployees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState();
  const [noticePeriodDetails, setNoticePeriodDetails] = useState();
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });

  const { vertical, horizontal, open, toastrStyle, message } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const getParsedDate = (date) => {
    if (date && date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-IN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } else {
      return 'N/A';
    }
  };

  useEffect(() => {
    getEmployees();
    getReasonForResignations()
  }, []);
  const getEmployees = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then((res) => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data);
          for (const iterator of res.data) {
            iterator['nameWithId'] =
              iterator.employeeName + '-' + iterator.employeeID;
          }
          let filteredEmployees = [];
          if (isAdminViewEnabled) {
            filteredEmployees = res.data.filter(employee => employee.uuid != user.uuid)
          }
          else {
            filteredEmployees = res.data.filter(employee => employee.managerUUID == user.uuid)
          }
          setEmployees(filteredEmployees);
          setBlocking(false)
        }
      })
      .catch((err) => {
        setBlocking(false)
        console.log('getEmployees err', err);
      });
  };
  const getEmployeesNoticePeriodDetails = (employee) => {
    apicaller(
      'get',
      `${BASEURL}/separationControl/fetchNoticePeriordDetailsByEmployeeUUID/` +
      employee.uuid
    )
      .then((res) => {
        if (res.status === 200) {
          setNoticePeriodDetails(res.data);
          setResignationReasonArray(res.data.resignationReasons);
        }
      })
      .catch((err) => {
        console.log('save resignation err', err);
      });
  };
  const getNoticePeriodShortBy = (
    lastWorkingDateAsPerEmployee,
    lastWorkingDateAsPerPolicy
  ) => {
    lastWorkingDateAsPerEmployee = new Date(lastWorkingDateAsPerEmployee);
    lastWorkingDateAsPerPolicy = new Date(lastWorkingDateAsPerPolicy);
    removeTimeFromDate(lastWorkingDateAsPerEmployee);
    removeTimeFromDate(lastWorkingDateAsPerPolicy);
    const timeDifference =
      lastWorkingDateAsPerPolicy.getTime() -
      lastWorkingDateAsPerEmployee.getTime();
    const days = timeDifference / (1000 * 60 * 60 * 24);
    return days ? (days + ' Days') : '';
  };
  const removeTimeFromDate = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  };

  const save = (e) => {
    e.preventDefault();
    // Validate the notice period
    if (noticePeriodDetails === null) {
      setState({
        open: true,
        message: 'Notice Period is Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return;
    }
    setIsSubmitted(true);
    let isValid = true;
    if (employee == null || employee == 0) {
      isValid = false;
    }
    if (reasonResignation == null || reasonResignation == 0) {
      isValid = false;
    }
    const object = {
      employeeUUID: employee?.uuid,
      reasonCode: reasonResignation?.code,
      details: details,
      noticePeriodAsPerPolicy: noticePeriodDetails?.noticePeriod,
      lastWorkingDateAsPerPolicy: noticePeriodDetails?.lastWorkingDay,
      isEarlyExit: requestEarlyExit,
      lastWorkingDateAsPerEmployee: lastWorkingDay,
      submittedBy: 'Manager',
      createdBy: user?.uuid,
      lastWorkingDate: noticePeriodDetails?.lastWorkingDay,
      autoApprove: autoApprove
    };
    if (isValid) {
      apicaller('post', `${BASEURL}/resignation/save`, object)
        .then((res) => {
          if (res.status === 200) {
            setState({
              open: true,
              message: 'Resignation Submitted Sucessfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            });
          }
        })
        .catch((err) => {
          console.log('save resignation err', err);
          setState({
            open: true,
            message: err.response.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        })
    } else {
      setState({
        open: true,
        message: 'Errors exist in this form kindly resolve them before saving',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };

  const getReasonForResignations = () => {
    apicaller('get', `${BASEURL}/seperationControl/fetch?getReasons=true`)
      .then(res => {
        if (res.status === 200) {
          setResignationReasonArray(res.data);
        }
      })
      .catch(err => {
        console.log('Fetch error', err);
      })
  }

  return (
    <BlockUi
      tag="div"
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card className="card-box shadow-none">
        <div className="d-flex justify-content-between px-4 py-3" style={{ margin: '20px' }}>
          <Grid container>
            <Grid item md={12} style={{ display: 'contents' }}>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className=" mb-2">Select Employee *</label>
                    <br />
                    <div>
                      <Autocomplete
                        id="combo-box-demo"
                        options={allEmployees}
                        getOptionLabel={(option) =>
                          option.nameWithId ? option.nameWithId : ''
                        }
                        value={employee ? employee : null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="selectedEmployee"
                            error={isSubmitted && (employee ? false : true)
                            }
                            helperText={
                              isSubmitted &&
                              (employee ? '' : 'Field is Mandatory')
                            }
                          />
                        )}
                        onChange={(event, value) => {
                          setNoticePeriodDetails();
                          setReasonResignation('');
                          setReasonEarlyExit('')
                          setRequestEarlyExit(false)
                          setLastWorkingDay(null)
                          setDetails('')
                          setEmployee(value);
                          if (value) {
                            getEmployeesNoticePeriodDetails(value)
                          }
                          else {
                            setReasonResignation(null);
                            setReasonResignationIndex(null);
                          }

                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid item md={6}>
                <label
                  style={{ marginTop: '15px' }}
                  className="font-weight-normal mb-2">
                  Reason For Resignation *
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  select
                  options={resignationReasonArray}
                  value={
                    reasonResignationIndex != null
                      ? resignationReasonArray[reasonResignationIndex] || ''
                      : null
                  }
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Reason For Resignation"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={
                        reasonResignationIndex != null
                          ? resignationReasonArray[reasonResignationIndex] || ''
                          : null
                      }
                      error={isSubmitted && (reasonResignation ? false : true)}
                      helperText={
                        isSubmitted &&
                        (reasonResignation ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    const index = resignationReasonArray.findIndex(
                      (reason) => reason.name === value?.name
                    );
                    if (index != -1) {
                      setReasonResignationIndex(index);
                      setReasonResignation(resignationReasonArray[index])
                    }
                    else {
                      setReasonResignationIndex(null);
                      setReasonResignation(null)
                    }
                  }
                  }
                />
              </Grid>
              <Grid item md={12}>
                <label className="mb-2 " style={{ marginTop: '15px' }}>
                  Details *
                </label>
                <TextField
                  label="Details"
                  multiline
                  rows="4"
                  fullWidth
                  error={isSubmitted && (details ? false : true)}
                  helperText={
                    isSubmitted && (details ? '' : 'Field is Mandatory')
                  }
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  // defaultValue={this.state.value}
                  variant="outlined"
                />
              </Grid>
              {employee && (
                <>
                  <Grid item md={6}>
                    <div>
                      <label className="mb-2 " style={{ marginTop: '15px' }}>
                        Notice Period as per policy
                        <span style={{ fontWeight: '700', marginLeft: '20px' }}>
                          {noticePeriodDetails?.noticePeriod?.value}&nbsp;
                          {noticePeriodDetails?.noticePeriod?.unit}
                        </span>
                      </label>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="mb-2 " style={{ marginTop: '15px' }}>
                        Last working day as per policy
                        <span style={{ fontWeight: '700', marginLeft: '20px' }}>
                          {getParsedDate(noticePeriodDetails?.lastWorkingDay)}
                        </span>
                      </label>
                    </div>
                  </Grid>
                </>
              )}
              <Grid
                item
                container
                direction="row"
                spacing={6}
                justify="flex-end"
                alignItems="center">
                <Grid item md={12}>
                  <div className="d-flex">
                    <Grid item md={6} className='mt-4'>
                      <Switch
                        value={requestEarlyExit}
                        checked={requestEarlyExit}
                        disabled={!noticePeriodDetails?.allowEarlyExit}
                        onChange={(event) => {
                          setRequestEarlyExit(event.target.checked);
                          setLastWorkingDay(null)
                          setReasonEarlyExit('')
                        }}
                        name="requestEarlyExit"
                        color="primary"
                        className="switch-small"
                      />
                      <label className="ml-2 mb-3">Reason For early exit</label>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
              {requestEarlyExit && (
                <>
                  <Grid item md={6}>
                    <div>
                      <label style={{ marginTop: '15px' }} className="mb-2">
                        Last working day as per employee *
                      </label>
                      <MuiPickersUtilsProvider
                        utils={DateFnsUtils}
                        style={{ margin: '0%' }}>
                        <KeyboardDatePicker
                          style={{
                            margin: '0%',
                            width: '300px',
                            display: 'block'
                          }}
                          inputVariant="outlined"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          fullWidth
                          minDate={new Date()}
                          maxDate={noticePeriodDetails?.lastWorkingDay}
                          size="small"
                          value={lastWorkingDay ? lastWorkingDay : null}
                          onChange={(event) => {
                            setLastWorkingDay(event);
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                          helperText={
                            requestEarlyExit &&
                              ((isSubmitted && !lastWorkingDay) ||
                                (isSubmitted && lastWorkingDay === null))
                              ? 'DOB is required'
                              : ''
                          }
                          error={
                            requestEarlyExit &&
                              ((isSubmitted && !lastWorkingDay) ||
                                (isSubmitted && lastWorkingDay === null))
                              ? true
                              : false
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                  {lastWorkingDay && (
                    <Grid item md={6}>
                      <div>
                        <label className="mb-2 " style={{ marginTop: '15px' }}>
                          Notice Period falling short by
                          <span style={{ fontWeight: '700', marginLeft: '20px' }}>
                            {getNoticePeriodShortBy(
                              lastWorkingDay,
                              noticePeriodDetails?.lastWorkingDay
                            )}{' '}
                          </span>
                        </label>
                      </div>
                    </Grid>
                  )}
                  <Grid item md={12}>
                    <label style={{ marginTop: '15px' }} className=" mb-2">
                      Reason For Early Exit *
                    </label>
                    <TextField
                      id="outlined-city"
                      placeholder="Reason For Early Exit"
                      variant="outlined"
                      fullWidth
                      rows="4"
                      multiline
                      // size="small"
                      name="reasonEarlyExit"
                      value={reasonEarlyExit}
                      error={requestEarlyExit && (isSubmitted && (reasonEarlyExit ? false : true))}
                      helperText={
                        requestEarlyExit && (isSubmitted && (reasonEarlyExit ? '' : 'Field is Mandatory'))
                      }
                      onChange={(event) => {
                        // if (event.target && event.target.value) {
                        setReasonEarlyExit(event.target.value);
                        // }
                      }}
                    />
                  </Grid>
                </>
              )}
              <div className="divider" />
              &nbsp;
              {noticePeriodDetails && noticePeriodDetails.autoApproveByManager && (
                <Grid
                  item
                  container
                  direction="row"
                  spacing={6}
                  justify="flex-end"
                  alignItems="center">
                  <Grid item md={12}>
                    <div className="d-flex">
                      <Grid item md={6}>
                        <Switch
                          value={autoApprove}
                          checked={noticePeriodDetails && noticePeriodDetails.autoApproveByManager}
                          onChange={(event) => {
                            setAutoApprove(event.target.checked);
                          }}
                          name="autoApprove"
                          color="primary"
                          className="switch-small"
                        />
                        <label className="ml-2 mb-3">Auto Approve, Resignation Request</label>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              )}
              <div className="divider" />
              <div className="float-right" style={{ marginRight: '2.5%' }}>
                <Button
                  className="btn-primary mb-2 m-2"
                  type="submit"
                  onClick={save}>
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    setEmployee(null)
                    setReasonResignation(null)
                    setReasonResignationIndex(null)
                    setDetails('')
                    setLastWorkingDay(null)
                    setRequestEarlyExit(false)
                    setReasonEarlyExit(null)
                    setIsSubmitted(false)
                  }}
                  className="btn-primary mb-2 m-2"
                  disabled={noticePeriodDetails === null}
                >
                  Clear
                </Button>
              </div>
            </Grid>
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
        </div>
      </Card>
    </BlockUi>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.Auth.user,
    isAdminViewEnabled: state.Auth.isAdminViewEnabled
  };
};

const mapDispatchToProps = (dispatch) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateInitiateActions);
