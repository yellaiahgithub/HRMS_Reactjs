import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Snackbar
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import DateFnsUtils from '@date-io/date-fns'
import { connect } from 'react-redux';
import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { BrowserRouter as Router, Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const CreateAction = (props) => {
  const { selectedCompany } = props;
  const history = useHistory()

  const [isSubmitted, setIsSubmitted] = useState();
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const [asOfDateValidationError, setasOfDateValidationError] = useState();

  const [actionCode, setActionCode] = useState();
  const [actionName, setActionName] = useState();
  const [description, setDescription] = useState();
  const [asOfDate, setAsOfDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [createActionStatus, setCreateActionStatus] = useState([{ label: 'Active', value: true }])
  const [employeeStatus, setEmployeeStatus] = useState([]);
  const [validIfJobTypeIs, setValidIfJobTypeIs] = useState([]);

  const companyRegDate = new Date(selectedCompany.registrationDate);

  const createActionEmployeeStatus = [
    {
      value: 'Active',
      label: 'Active'
    },
    {
      value: 'Deceased',
      label: 'Deceased'
    },
    {
      value: 'Retired',
      label: 'Retired'
    },
    {
      value: 'Separated',
      label: 'Separated'
    },
    {
      value: 'Separated With Pay',
      label: 'Separated With Pay'
    },
    {
      value: 'Suspended',
      label: 'Suspended '
    },
  ]


  const createActionValidIfJobTypeIs = [
    {
      value: 'Employee',
      label: 'Employee'
    },
    {
      value: 'Consultant',
      label: 'Consultant'
    },
    {
      value: 'Contractor',
      label: 'Contractor'
    }
  ];

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const save = (e) => {
    e.preventDefault();
    //to do service call
    setIsSubmitted(true);

    let employeeStatusArr = [];
    for (let i in employeeStatus[0]) {
      employeeStatusArr.push(employeeStatus[0][i].value)
    }

    let validIfJobTypeIsArr = [];
    for (let i in validIfJobTypeIs[0]) {
      validIfJobTypeIsArr.push(validIfJobTypeIs[0][i].value)
    }

    if (!actionCode && !actionName && !asOfDate && !status && employeeStatusArr.length === 0 && validIfJobTypeIsArr.length === 0) {
      setState({
        open: true,
        message: 'Please fill all the required fields',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return;
    }
    let inputObj = {
      actionCode: actionCode,
      actionName: actionName,
      description: description ? description : "",
      effectiveDate: asOfDate,
      status: (status === 'active' || status === true) ? true : false,
      employeeStatus: employeeStatusArr,
      jobType: validIfJobTypeIsArr
    };
    apicaller('post', `${BASEURL}/action`, inputObj)
      .then(res => {
        if (res.status === 200) {
          // console.log('res.data', res.data)
          setState({
            open: true,
            message: 'Action Created Successfully',
            toastrStyle: 'toastr-success',
            vertical: 'top',
            horizontal: 'right'
          })
          setTimeout(() => {
            history.push('/ActionsAndReasons')
          }, 1000);
        }
      })
      .catch(err => {
        console.log('create action err', err)
        setState({
          open: true,
          message: err.response.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      })
  };
  return (
    <Card>
      <h5 className="m-4">
        <center>
          Create Action
        </center>
      </h5>
      <br />
      <Grid container spacing={0}>
        <Grid item md={10} lg={7} xl={8} className="mx-auto">
          <label
            style={{ marginTop: '15px' }}
            className="mb-2">
            Action Code *
          </label>
          <TextField
            id="outlined-actionCode"
            placeholder="Action Code"
            error={isSubmitted && (actionCode ? false : true)}
            helperText={isSubmitted && (actionCode ? '' : 'Field is Mandatory')}
            // error ={designation ? "": "Field is Mandatory"}
            type="text"
            variant="outlined"
            fullWidth
            required
            size="small"
            value={actionCode}
            onChange={(event) => {
              const result = event.target.value.replace(/[^a-z0-9]/gi, '');
              setActionCode(result.toUpperCase());
            }}
          />
          <label
            style={{ marginTop: '15px' }}
            className="mb-2">
            Action Name *
          </label>
          <TextField
            id="outlined-actionName"
            placeholder="Action Name"
            error={isSubmitted && (actionName ? false : true)}
            helperText={isSubmitted && (actionName ? '' : 'Field is Mandatory')}
            // error ={designation ? "": "Field is Mandatory"}
            type="text"
            variant="outlined"
            fullWidth
            required
            size="small"
            value={actionName}
            onChange={(event) => {
              setActionName(event.target.value);
            }}
          />
          <div>
            <label
              style={{ marginTop: '15px' }}
              className="mb-2">
              Description
            </label>
            <TextField
              id="outlined-description"
              placeholder="Description"
              type="text"
              variant="outlined"
              fullWidth
              size="small"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label
                style={{ marginTop: '15px' }}
                className="mb-2">
                As Of Date *
              </label>
              <MuiPickersUtilsProvider
                utils={DateFnsUtils}
                style={{ margin: '0%' }}>
                <KeyboardDatePicker
                  style={{ margin: '0%' }}
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  margin="normal"
                  placeholder="As Of Date "
                  id="date-picker-inline"
                  fullWidth
                  size="small"
                  value={asOfDate}
                  onChange={(event) => {
                    const asofdatechoosen = event
                    setAsOfDate(event);
                    if (asofdatechoosen && new Date(asofdatechoosen) > companyRegDate) {
                      setasOfDateValidationError(false);
                    } else {
                      setasOfDateValidationError(
                        ' The effective date should be greater than company creation date.'
                      );
                    }
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  helperText={
                    asOfDateValidationError ||
                    (isSubmitted && asOfDate === null && (asOfDate ? '' : 'Field is Mandatory'))
                  }
                  error={
                    asOfDateValidationError ||
                    (isSubmitted && (asOfDate ? false : true))
                  }

                />
              </MuiPickersUtilsProvider>
              
            </Grid>
            <Grid item xs={6}>
              <div>
                <label
                  style={{ marginTop: '15px' }}
                  className="mb-2">
                  Status *
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
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                  }}>
                  {createActionStatus.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div>
                {/* <InputLabel id="demo-mutiple-name-label">Name</InputLabel> */}
                <label
                  style={{ marginTop: '15px' }}
                  className="mb-2">
                  Employee Status *
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  options={createActionEmployeeStatus}
                  // defaultValue={createActionEmployeeStatus[employeeStatus]}
                  // value={createActionEmployeeStatus[employeeStatus]}
                  getOptionLabel={(option) => option.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Employee Status"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={employeeStatus}
                      error={isSubmitted && (employeeStatus.length > 0 ? false : true)}
                      helperText={
                        isSubmitted &&
                        (employeeStatus.length > 0 ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    employeeStatus.splice(0)
                    employeeStatus.push(value)
                    setEmployeeStatus(employeeStatus);
                  }}
                />
              </div>
            </Grid>

            <Grid item xs={6}>
              <div>
                <label
                  style={{ marginTop: '15px' }}
                  className="mb-2">
                  Valid if Job Type is *
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  options={createActionValidIfJobTypeIs}
                  // defaultValue={createActionValidIfJobTypeIs[validIfJobTypeIs]}
                  // value={createActionValidIfJobTypeIs[validIfJobTypeIs]}
                  getOptionLabel={(option) => option.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Valid Job Type"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={validIfJobTypeIs}
                      error={isSubmitted && (validIfJobTypeIs.length > 0 ? false : true)}
                      helperText={
                        isSubmitted &&
                        (validIfJobTypeIs.length > 0 ? '' : 'Field is Mandatory')
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    validIfJobTypeIs.splice(0)
                    validIfJobTypeIs.push(value)
                    setValidIfJobTypeIs(validIfJobTypeIs);
                  }}
                />
              </div>
            </Grid>
          </Grid>
          <br />
          <Box textAlign="right">
          <Button
              className="btn-primary mb-2 mr-3"
              component={NavLink}
              to="./Actions">
              cancel
            </Button>
            <Button
              type='submit'
              onClick={(e) => save(e)}
              className="btn-primary mb-2 mr-3">
              Create Action
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* </Grid> */}
      <br />
      <br />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAction);