import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Snackbar,
  Switch,
  Collapse
} from '@material-ui/core';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResignationRequests = (props) => {
  const {
    user,
    setCurrentResignation,
    currentResignation,
    approverUUID,
    pendingResignationApprovals,
    setPendingResignationApprovals,
    isAdminViewEnabled,
    resignationRequests,
    setResignationRequests
  } = props;

  const [isSubmitted, setIsSubmitted] = useState();
  const [relievingDate, setRelievingDate] = useState(null);
  const [acceptResignation, setAcceptResignation] = useState(true);
  const [acceptDate, setAcceptDate] = useState(null);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [comments, setComments] = useState(undefined);
  const [blocking, setBlocking] = useState(false);
  const [resignationDetails, setResignationDetails] = useState();
  const [noticePeriod, setNoticePeriod] = useState(null);
  const [isRelievingDateDisabled, setIsRelievingDateDisabled] = useState(false);
  const [noticePeriodAsPerEmployee, setNoticePeriodAsPerEmployee] =
    useState('');
  const [currentAccordinIndex, setCurrentAccordinIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(true);
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

  const [acceptanceCriterias, setAcceptanceCriterias] = useState([
    {
      value: 'As per policy',
      label: 'As per policy'
    },
    {
      value: 'As per manager’s date',
      label: 'As per manager’s date'
    }
  ]);
  const [state1, setState1] = useState({
    accordion: [false]
  });
  const toggleAccordion = (tab) => {
    const prevState = state1.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    setState1({
      accordion: state
    });
  };
  const getParsedDate = (date) => {
    if (date && date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } else {
      return 'N/A';
    }
  };
  const handleCancel = () => {
    setComments('');
    setAcceptanceCriteria('');
    setRelievingDate(null);
    setCurrentResignation(null);
  };
  useEffect(() => {
    let url;
    if (currentResignation.approver.toLowerCase() != 'Reporting Manager'.toLowerCase()) {
      url = `${BASEURL}/resignation/fetchByUUID/${currentResignation?.resignationUUID}?approverUUID=${approverUUID}&getHistory=${true}&type=${currentResignation.approver}`;
      getResignationDetails(url, true);
      setShowHistory(true);
    } else {
      url = `${BASEURL}/resignation/fetchByUUID/${currentResignation?.resignationUUID}`;
      getResignationDetails(url, false);
      setShowHistory(false);
    }
  }, []);
  const getResignationDetails = (url, showHistory) => {
    setBlocking(true);

    apicaller('get', url)
      .then((res) => {
        setBlocking(false);
        if (res.status === 200) {
          if (res.data[0].isEarlyExit) {
            const daysForNoticePeriodAsPerEmployee = getDateDifference(
              res.data[0].submittedOn,
              res.data[0].lastWorkingDateAsPerEmployee
            );
            setNoticePeriodAsPerEmployee(
              daysForNoticePeriodAsPerEmployee + ' Days'
            );
            const criterias = [
              ...acceptanceCriterias,
              {
                value: 'As per employee’s date',
                label: 'As per employee’s date'
              }
            ];
            setAcceptanceCriterias(criterias);
          }
          setResignationDetails(res.data[0]);
          const index = showHistory ? res.data[0].adminHistoryData.length : 0;
          const array = Array.from({ length: index + 1 }, (i) => (i = false));
          array[index] = true;
          setState1({
            accordion: array
          });
          setCurrentAccordinIndex(index);
        }
      })
      .catch((err) => {
        setBlocking(false);
        console.log('err', err);
      });
  };
  const getDateDifference = (startDate, endDate) => {
    // Convert the dates to milliseconds
    var startMillis = new Date(startDate);
    var endMillis = new Date(endDate);
    startMillis.setUTCHours(0, 0, 0, 0);
    endMillis.setUTCHours(0, 0, 0, 0);
    // Calculate the difference in milliseconds
    var differenceMillis =
      startMillis.getTime() > endMillis.getTime()
        ? startMillis.getTime() - endMillis.getTime()
        : endMillis.getTime() - startMillis.getTime();
    // Convert milliseconds to days
    var days = Math.floor(differenceMillis / (1000 * 60 * 60 * 24));
    return isNaN(days) ? 'N/A' : days;
  };
  const handleChangeAcceptanceCriteria = (criteria) => {
    if (criteria === 'As per policy') {
      setRelievingDate(resignationDetails?.lastWorkingDateAsPerPolicy);
      setIsRelievingDateDisabled(true);
      setNoticePeriod(
        resignationDetails?.noticePeriodAsPerPolicy.value +
        ' ' +
        resignationDetails?.noticePeriodAsPerPolicy.unit
      );
    }
    if (criteria === 'As per employee’s date') {
      setRelievingDate(resignationDetails?.lastWorkingDateAsPerEmployee);
      setIsRelievingDateDisabled(true);
      const days = getDateDifference(
        resignationDetails?.submittedOn,
        resignationDetails?.lastWorkingDateAsPerEmployee
      );
      setNoticePeriod(days + ' Days');
    }
    if (criteria === 'As per manager’s date') {
      setIsRelievingDateDisabled(false);
    }
  };
  const handleChangeRelievingDate = (relievingDate) => {
    if(new Date(resignationDetails?.submittedOn)<new Date(relievingDate))
    {
      const days = getDateDifference(
        resignationDetails?.submittedOn,
        relievingDate
      );
      setNoticePeriod(days + ' Days');
    }
    else{
      setNoticePeriod("Invalid");
    }
  };
  const save = (event) => {
    setIsSubmitted(true);
    let isValid=true, errors=[];
    if(acceptResignation && acceptanceCriteria==null||acceptanceCriteria.length==0){
      isValid=false;
      errors.push("Acceptance Criteria is Mandatory.")
    }
    if(comments==null||comments.length==0){
      isValid=false;
      errors.push("Comments are Mandatory.")
    }
    if(acceptResignation && relievingDate==null||relievingDate.length==0){
      isValid=false;
      errors.push("Relieving Date is Mandatory.")
    }
    else{
      const date= new Date(relievingDate)
      const submittedOn=new Date(resignationDetails.submittedOn)
      if(!(date instanceof Date && !isNaN(date))){
          isValid=false;
          errors.push("Invalid Relieving Date")
      }
      if((date<submittedOn)) {
          isValid=false;
          errors.push("Relieving Date Can not be Less than Submission Date")
      }                                  
  }
  if(!isValid){
    setState({
      open: true,
      message: errors.toString(),
      toastrStyle: 'toastr-warning',
      vertical: 'top',
      horizontal: 'right'
    });
    return;
  }
    let inputObj = {
      resignationUUID: currentResignation?.resignationUUID,
      approverUUID: approverUUID,
      resignationHistoryUUID: currentResignation?.resignationHistoryUUID,
      approvalStatus: acceptResignation ? 'Approved' : 'Rejected',
      acceptanceCriteria: acceptanceCriteria,
      comments: comments,
      relievingDate: relievingDate,
      approver: currentResignation?.approver
    };
    if (
      (acceptResignation
        ? acceptanceCriteria &&
        acceptanceCriteria !== '' &&
        relievingDate &&
        relievingDate !== ''
        : true) &&
      comments &&
      comments !== ''
    ) {
      saveObj(inputObj);
      setState({
        open: true,
        message: 'Resignation Approved Successfully',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      });
    } else {
      // saveObj(inputObj);
      setState({
        open: true,
        message: 'Mandatory fields are Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }
  };

  const saveObj = (inputObj) => {
    setBlocking(true);
    apicaller('put', `${BASEURL}/resignationApprovalHistory/update`, inputObj)
      .then((res) => {
        setBlocking(false);
        if (res.status === 200) {
          console.log('res.data', res.data);
          setCurrentResignation(null);
          if (!isAdminViewEnabled) {
            const filteredResigantion = pendingResignationApprovals.filter(
              (resignation) =>
                resignation.resignationUUID !=
                currentResignation?.resignationUUID
            );
            setPendingResignationApprovals(filteredResigantion);
          }
          const filteredResigantionReq = resignationRequests.filter(
            (resignation) =>
              resignation.resignationUUID != currentResignation?.resignationUUID
          );
          setResignationRequests(filteredResigantionReq);
          setState({
            open: true,
            message: 'Resignation Details Updated Successfully',
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
  const getNoticePeriod = (relievingDate, submittedOn) => {
    if (!relievingDate) return 'N/A';
    else {
      const lastDate = new Date(relievingDate);
      const resignationDate = new Date(submittedOn);
      lastDate.setUTCHours(0, 0, 0, 0);
      resignationDate.setUTCHours(0, 0, 0, 0);
      const timeDiff = lastDate.getTime() - resignationDate.getTime();
      return timeDiff / (60 * 60 * 1000) + 'Days';
    }
  };
  return (
    <>
      <Card
        style={{
          padding: '25px',
          border: '1px solid #c4c4c4',
          margin: '15px'
        }}>
        <Grid container spacing={0}>
          <Grid item md={12} style={{ display: 'contents' }}>
            <Grid item md={7}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Request Submission Date
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {getParsedDate(resignationDetails?.submittedOn)}{' '}
                </div>
              </div>
            </Grid>
            <Grid item md={5}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Reason For Resignation
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {resignationDetails?.reasonForResignation}
                </div>
              </div>
            </Grid>
            <Grid item md={7}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ minWidth: '225px' }}>
                  Resignation Details
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {resignationDetails?.details?.length>100?resignationDetails?.details.slice(0,100)+"...":resignationDetails?.details}
                </div>
              </div>
            </Grid>
            <Grid item md={5}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Notice Period As Per Policy
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {resignationDetails?.noticePeriodAsPerPolicy.value}{' '}
                  {resignationDetails?.noticePeriodAsPerPolicy.unit}
                </div>
              </div>
            </Grid>
            <Grid item md={7}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Last Date As Per Policy
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {getParsedDate(
                    resignationDetails?.lastWorkingDateAsPerPolicy
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={5}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Employee Requested for Early Exit
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {resignationDetails?.isEarlyExit ? 'Yes' : 'No'}
                </div>
              </div>
            </Grid>
            <Grid item md={7}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Last Date As Per Employee
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {getParsedDate(
                    resignationDetails?.lastWorkingDateAsPerEmployee
                  )}{' '}
                </div>
              </div>
            </Grid>
            <Grid item md={5}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Notice Period As Per Employee
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {noticePeriodAsPerEmployee}
                </div>
              </div>
            </Grid>
            <Grid item md={7}>
              <div className="d-flex ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Is It A Critical Job
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {resignationDetails?.isCritical ? 'Yes' : 'No'}
                </div>
              </div>
            </Grid>
            <Grid item md={5}>
              <div className="d-flex  ">
                <div
                  className="font-size-sm my-3 justify-content-between"
                  style={{ width: '225px' }}>
                  Is It A One-to-One Job
                </div>
                <div
                  className=" text-grey font-weight-bold my-3"
                  style={{ overflowWrap: 'break-word',  }}>
                  {resignationDetails?.isOneToOne ? 'Yes' : 'No'}
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Card>
      {showHistory && (
        <>
          {resignationDetails?.adminHistoryData?.map((item, idx) => (
            <>
              {/* <br /> */}
              {item?.approver.toLowerCase() != 'Admin'.toLowerCase() && (
                <>
                  <div
                    className="accordion-toggle"
                    style={{ marginTop: '10px' }}>
                    <Button
                      className="btn-link font-weight-bold d-flex  justify-content-between btn-transition-none"
                      onClick={(e) => toggleAccordion(idx)}
                      aria-expanded={state1.accordion[idx]}>
                      <span>{item.approver}</span>
                      &nbsp;
                      {state1.accordion[idx] ? (
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
                  <Collapse in={state1.accordion[idx]}>
                    <Card
                      style={{
                        padding: '25px',
                        border: '1px solid #c4c4c4',
                        margin: '15px'
                      }}>
                      <Grid container spacing={0}>
                        <Grid item md={12} style={{ display: 'contents' }}>
                          <Grid item md={6}>
                            <div className="d-flex ">
                              <div
                                className="font-size-sm my-3 justify-content-between"
                                style={{ width: '225px' }}>
                                Manager’s Action
                              </div>
                              <div
                                className=" text-grey font-weight-bold my-3"
                                style={{
                                  overflowWrap: 'break-word',
                                  
                                }}>
                                {item?.approvalStatus
                                  ? item?.approvalStatus
                                  : 'N/A'}
                              </div>
                            </div>
                            <div className="d-flex ">
                              <div
                                className="font-size-sm my-3 justify-content-between"
                                style={{ width: '225px' }}>
                                Approved As Per
                              </div>
                              <div
                                className=" text-grey font-weight-bold my-3"
                                style={{
                                  overflowWrap: 'break-word',
                                  
                                }}>
                                {item?.acceptanceCriteria
                                  ? item?.acceptanceCriteria
                                  : 'N/A'}
                              </div>
                            </div>
                          </Grid>
                          <Grid item md={6}>
                            <div className="d-flex ">
                              <div
                                className="font-size-sm my-3 justify-content-between"
                                style={{ width: '225px' }}>
                                Last WorkingDate As Per Manager
                              </div>
                              <div
                                className=" text-grey font-weight-bold my-3"
                                style={{
                                  overflowWrap: 'break-word',
                                  
                                }}>
                                {item?.relievingDate
                                  ? new Date(
                                      item?.relievingDate
                                    )?.toLocaleDateString()
                                  : 'N/A'}
                              </div>
                            </div>
                            <div className="d-flex ">
                              <div
                                className="font-size-sm my-3 justify-content-between"
                                style={{ width: '225px' }}>
                                Notice Period As Per Manager
                              </div>
                              <div
                                className=" text-grey font-weight-bold my-3"
                                style={{
                                  overflowWrap: 'break-word',
                                  
                                }}>
                                {getNoticePeriod(
                                  item?.relievingDate,
                                  resignationDetails?.submittedOn
                                )}
                              </div>
                            </div>
                          </Grid>
                          <Grid item md={12} className="mx-auto">
                            <label className="mb-2">Manager's Comments</label>
                            <TextField
                              id="outlined-description-1"
                              placeholder="Manager Comment's"
                              type="text"
                              variant="outlined"
                              fullWidth
                              multiline
                              rows={8}
                              // maxRows={8}
                              disabled={true}
                              size="small"
                              value={item?.comments}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>
                  </Collapse>
                  <div className="divider" />
                  <div className="divider" />
                </>
              )}
            </>
          ))}
        </>
      )}
      <div className="accordion-toggle" style={{ marginTop: '10px' }}>
        <Button
          className="btn-link font-weight-bold d-flex  justify-content-between btn-transition-none"
          onClick={(e) => toggleAccordion(currentAccordinIndex)}
          aria-expanded={state1.accordion[currentAccordinIndex]}>
          <span>{currentResignation?.approver}</span>
          &nbsp;
          {state1.accordion[currentAccordinIndex] ? (
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
      <Collapse in={state1.accordion[currentAccordinIndex]}>
        <Card
          style={{
            padding: '25px',
            border: '1px solid #c4c4c4',
            margin: '15px'
          }}>
          <Grid container>
            <Grid item md={12} style={{ display: 'contents' }}>
              <Grid item md={12}>
                <div>
                  <Grid container spacing={0}>
                    <Grid
                      item
                      md={3.5}
                      style={{ display: 'flex', alignItems: 'center' }}>
                      <Switch
                        onChange={(event) => {
                          console.log(event);
                          setAcceptResignation(event.target.checked);
                          setAcceptDate(null);
                        }}
                        checked={acceptResignation}
                        name="Accepted"
                        color="primary"
                        className="switch-small"
                      />
                      &nbsp;&nbsp;
                      <label>Accept Resignation Request</label>
                    </Grid>
                    <Grid item md={8}>
                      {acceptResignation ? (
                        <Grid className="d-flex ">
                          <Grid item md={4} className="mx-2">
                            <TextField
                              id="outlined-acceptanceCriteria"
                              label="Select"
                              variant="outlined"
                              fullWidth
                              select
                              size="small"
                              name="acceptanceCriteria"
                              value={acceptanceCriteria}
                              onChange={(event) => {
                                setAcceptanceCriteria(event.target.value);
                                handleChangeAcceptanceCriteria(
                                  event.target.value
                                );
                              }}
                              helperText={
                                isSubmitted &&
                                (acceptanceCriteria && acceptResignation
                                  ? ''
                                  : 'Acceptance Criteria is Required')
                              }
                              error={
                                isSubmitted &&
                                (acceptanceCriteria && acceptResignation
                                  ? false
                                  : true)
                              }>
                              {acceptanceCriterias.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}>
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item md={4} className="mx-2">
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
                                value={relievingDate}
                                minDate={
                                  new Date(resignationDetails?.submittedOn)
                                }
                                disabled={
                                  isRelievingDateDisabled || !acceptanceCriteria
                                }
                                onChange={(event) => {
                                  setRelievingDate(event);
                                  handleChangeRelievingDate(event);
                                }}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date'
                                }}
                                helperText={
                                  isSubmitted? ( acceptResignation ? (!relievingDate
                                        ? 'Date is required'
                                        :new Date(relievingDate) instanceof Date && !isNaN(new Date(relievingDate))?(new Date(resignationDetails.submittedOn)>new Date(relievingDate)?"Relieving Date Can not be Less Than Resignation Submission Date": ""):"Invalid Date")
                                      :'')
                                    :''
                                  }
                                error={
                                  (isSubmitted && acceptResignation &&(!relievingDate || !(new Date(relievingDate) instanceof Date ) || isNaN(new Date(relievingDate)) ||(new Date(resignationDetails.submittedOn)>new Date(relievingDate)) ))? true : false
                                }
                              />{' '}
                            </MuiPickersUtilsProvider>
                          </Grid>
                          {noticePeriod && (
                            <Grid
                              item
                              className="d-flex  mx-2"
                              md={4}
                              style={{ alignItems: 'center' }}>
                              <div className="font-size-md  justify-content-between">
                                Notice Period &nbsp;
                              </div>
                              <span className=" text-grey font-weight-bold ">
                                {noticePeriod}
                              </span>
                            </Grid>
                          )}
                        </Grid>
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={0} className="mt-3">
                    <Grid item md={4}>
                      <Switch
                        onChange={(event) => {
                          console.log(event);
                          setAcceptResignation(!event.target.checked);
                          setRelievingDate(null);
                          setAcceptanceCriteria(null);
                          setNoticePeriod(null);
                        }}
                        checked={!acceptResignation}
                        name="Rejected"
                        color="primary"
                        className="switch-small"
                      />
                      &nbsp;&nbsp;
                      <label className=" mb-2">
                        Reject Resignation Request
                      </label>
                    </Grid>
                  </Grid>
                  <Grid container spacing={0} className="mt-5">
                    <Grid item md={12} className="mx-auto">
                      <label className="mb-2">Manager's Comments</label>
                      <TextField
                        id="outlined-description-2"
                        placeholder="write a comments"
                        type="text"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={8}
                        // maxRows={8}
                        // disabled={readOnly}
                        size="small"
                        value={comments}
                        onChange={(event) => {
                          setComments(event.target.value);
                        }}
                        helperText={
                          isSubmitted && (comments ? '' : 'Comment is Required')
                        }
                        error={isSubmitted && (comments ? false : true)}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Collapse>
      <div className="divider" />
      <div className="divider" />
      <div className="float-left">
        <Button
          className="btn-primary mb-4 m-2 px-5"
          type="submit"
          onClick={(e) => save(e)}>
          Submit
        </Button>
        <Button
          className="btn-primary mb-4 m-2 px-5"
          // component={NavLink}
          // to='./locations'
          onClick={(e) => handleCancel}>
          Cancel
        </Button>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.Auth.user,
  isAdminViewEnabled: state.Auth.isAdminViewEnabled
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResignationRequests);
