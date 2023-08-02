import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Snackbar,
  Container,
  MenuItem,
  MenuList,
  TextField,
  Dialog
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import apicaller from 'helper/Apicaller';

const CreateDesignation = (props) => {
  const { selectedCompany } = props;
  const history = useHistory();
  const [isSubmitted, setIsSubmitted] = useState();

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const readOnly =
    queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
  const edit = id ? true : false;
  const saveButtonLabel = edit ? 'Update Designation' : 'Create Designation';

  const [designationID, setDesignationID] = useState();
  const [designation, setDesignation] = useState();
  const [description, setDescription] = useState();
  const [asOfDate, setAsOfDate] = useState();
  const [jobGrade, setJobGrade] = useState();
  const [jobGradeIndex, setJobGradeIndex] = useState();
  const [isOneToOne, setIsOneToOne] = useState(false);
  const [status, setStatus] = useState(true);
  const [jobLevel, setJobLevel] = useState();
  const [jobLevelIndex, setJobLevelIndex] = useState();
  const [isCriticalJob, setIsCritical] = useState(false);
  const [_id, setId] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [hasNextSequence, setHasNextSequence] = useState(false);
  const [designationJobLevel, setDesignationJobLevel] = useState([]);
  const [designationJobGrade, setDesignationJobGrade] = useState([]);
  let tempDesignationJobLevel = [];
  let tempDesignationJobGrade = [];
  const [isExitControl,setIsExitControl]=useState(false);
  const [isProbationControl,setIsProbationControl]=useState(false);
  const [modal, setModal] = useState(false);
  const toggle3 = () => setModal(!modal);
  const currentPageType="Designation";
  const designationStatus = [
    {
      value: 'Active',
      code: true
    },
    {
      value: 'Inactive',
      code: false
    }
  ];

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  useEffect(() => {
    getJobBands();
  }, []);
  const getJobBands = () => {
    apicaller('get', `${BASEURL}/jobBand/fetchAll`)
      .then((res) => {
        if (res.status === 200) {
          tempDesignationJobLevel = res.data;
          setDesignationJobLevel(res.data, getJobGrades());
        }
      })
      .catch((err) => {
        console.log('getEmployees err', err);
      });
  };
  const getJobGrades = () => {
    apicaller('get', `${BASEURL}/jobGrade/fetchAll`)
      .then((res) => {
        if (res.status === 200) {
          tempDesignationJobGrade = res.data.data;
          if (id) {
            setDesignationJobGrade(res.data.data, getDesignation());
          } else {
            setDesignationJobGrade(res.data.data, getNextDesignationId());
          }
        }
      })
      .catch((err) => {
        console.log('getDesignation err', err);
      });
  };
  const getNextDesignationId = () => {
    apicaller('post', `${BASEURL}/autoNumbering/getNextSequence`, {
      type: 'DES'
    })
      .then((res) => {
        if (res.status === 200 && res.data?.length > 0) {
          setHasNextSequence(true);
          setDesignationID(res.data);
        }
        setAsOfDate(new Date());
        setStatus(true);
      })
      .catch((err) => {
        console.log('get department err', err);
      });
  };

  const getDesignation = () => {
    apicaller('get', `${BASEURL}/designation/fetchById/` + id)
      .then((res) => {
        if (res.status === 200) {
          setDesignation(res.data.name);
          setAsOfDate(new Date(res.data?.asOfDate)?.toString());
          setDescription(res.data?.description);
          setDesignationID(res.data?.id);
          setId(res.data?._id);
          setCreatedAt(res.data?.createdAt);
          setJobGrade(res.data?.jobGrade);
          setJobLevel(res.data?.jobLevel);
          setIsCritical(res.data?.isCritical);
          setIsOneToOne(res.data?.isOneToOne);
          setStatus(res.data?.status);
          setJobGradeIndex(
            tempDesignationJobGrade.findIndex(
              (jobGrade) =>
                jobGrade.gradeId.toLowerCase() ===
                res.data?.jobGrade?.toLowerCase()
            )
          );
          setJobLevelIndex(
            tempDesignationJobLevel.findIndex(
              (joblevel) =>
                joblevel.bandId.toLowerCase() ===
                res.data?.jobLevel?.toLowerCase()
            )
          );
        }
      })
      .catch((err) => {
        console.log('create deignation err', err);
      });
  };

  const save = (e) => {
    e.preventDefault();
    //to do service call

    setIsSubmitted(true);

    let inputObj = {
      id: designationID,
      name: designation,
      description: description,
      asOfDate: asOfDate,
      jobGrade: jobGrade,
      isOneToOne: isOneToOne,
      status: status,
      jobLevel: jobLevel,
      isCritical: isCriticalJob,
      _id: _id,
      createdAt: createdAt
    };
    console.log(inputObj);
    let isValid = false;
    isValid = new Date(asOfDate) > new Date(selectedCompany.registrationDate);
    if (isValid) {
      if (inputObj._id == null) {
        apicaller('post', `${BASEURL}/designation/save`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setId(res.data[0]._id)
              console.log('res.data', res.data);
              setState({
                open: true,
                message: 'Designation Created Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
              exitControlsData()
            }
          })
          .catch((err) => {
            setState({
              open: true,
              message: 'Error Occured while creating Designation Details',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            });
            console.log('create Designation err', err);
          });
      } else {
        apicaller('put', `${BASEURL}/designation/update`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              console.log('res.data', res.data);
              setState({
                open: true,
                message: 'Designation Updated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
            }
          })
          .catch((err) => {
            setState({
              open: true,
              message: 'Error Occured while updating Designation Details',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            });
            console.log('update Designation err', err);
          });
      }
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
  const exitControlsData = ()=>{
    apicaller('get', `${BASEURL}/separationControl/fetch?getSetupBy=true`)
    .then((res) => {
      if (res.status === 200) {
        if(res.data.toLowerCase()==currentPageType.toLowerCase()){
          setIsExitControl(true,probationSetupData(true))
        }
        else{
          probationSetupData(false)
        }
      }
    })
    .catch((err) => {
      console.log('get Exit control setup by err', err);
    });
  }
  const probationSetupData = (isExitControl)=>{
    apicaller('get', `${BASEURL}/probationSetup?getSetupBy=true`)
    .then((res) => {
      if (res.status === 200) {
        if(res.data.toLowerCase()==currentPageType.toLowerCase()){
          setIsProbationControl(true,toggle3())
        }
        else if(isExitControl){
          toggle3()
        }
      }
    })
    .catch((err) => {
      console.log('get probation setup by', err);
    });
  }

  return (
    <Card>
      <br />
      <Grid container spacing={0}>
        <Grid item xs={10} md={10} lg={7} xl={11} className="mx-auto">
          <h4 className="m-2 text-center">{_id?"Update "+currentPageType:"Create "+currentPageType}</h4>
          <br />
          <Grid container>
            <Grid item container spacing={2} direction="row">
              <Grid item md={6} className="mx-auto">
                <label className="mb-2">Designation ID *</label>
                <TextField
                  id="outlined-designation"
                  placeholder="Designation ID"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={hasNextSequence || readOnly || edit || _id}
                  size="small"
                  value={designationID}
                  error={isSubmitted && !designationID}
                  helperText={
                    isSubmitted && !designationID
                      ? 'Designation Id is Required'
                      : null
                  }
                  onChange={(event) => {
                    const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                    setDesignationID(result.toUpperCase());
                  }}
                />{' '}
              </Grid>
              <Grid item md={6} lg={6} xl={6} className="mx-auto">
                <label className="mb-2">Designation *</label>
                <TextField
                  id="outlined-designation"
                  placeholder="Designation"
                  error={isSubmitted && (designation ? false : true)}
                  helperText={
                    isSubmitted && (designation ? '' : 'Field is Mandatory')
                  }
                  // error ={designation ? "": "Field is Mandatory"}
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={readOnly}
                  size="small"
                  value={designation}
                  onChange={(event) => {
                    setDesignation(event.target.value);
                  }}
                />
              </Grid>
              <Grid item md={12} className="mx-auto">
                <label className="mb-2">Description</label>
                <TextField
                  id="outlined-description"
                  placeholder="Description"
                  type="text"
                  variant="outlined"
                  fullWidth
                  disabled={readOnly}
                  size="small"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
              </Grid>{' '}
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={6}>
                <label style={{ marginTop: '15px' }} className="mb-2">
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
                    id="date-picker-inline"
                    // minDate={selectedCompany.registrationDate}
                    fullWidth
                    size="small"
                    disabled={readOnly}
                    value={asOfDate}
                    onChange={(event) => {
                      // validateDate(event);
                      setAsOfDate(event);
                    }}
                    error={
                      !asOfDate ||
                      (asOfDate instanceof Date &&
                        new Date(asOfDate) <
                          new Date(selectedCompany.registrationDate))
                    }
                    helperText={
                      !asOfDate
                        ? 'Date is Required'
                        : asOfDate instanceof Date &&
                          new Date(asOfDate) <
                            new Date(selectedCompany.registrationDate)
                        ? "As of Date Cannot be Less than Company's Registered Date"
                        : null
                    }
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <label style={{ marginTop: '15px' }} className="mb-2">
                    Status
                  </label>
                  <TextField
                    id="outlined-status"
                    // required
                    label={status ? '' : 'Select Status'}
                    variant="outlined"
                    fullWidth
                    select
                    size="small"
                    value={status}
                    disabled={readOnly}
                    onChange={(event) => {
                      setStatus(event.target.value);
                    }}>
                    {designationStatus.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Grid>
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={6}>
                <label style={{ marginTop: '15px' }} className="mb-2">
                  Job Grade
                </label>
                <Autocomplete
                  id="outlined-jobGrade"
                  options={designationJobGrade}
                  getOptionLabel={(option) => option.gradeName}
                  disabled={readOnly}
                  value={
                    jobGradeIndex != null
                      ? designationJobGrade[jobGradeIndex] || ''
                      : null
                  }
                  noOptionsText={'Unavailable'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      defaultValue={jobGrade}
                      value={
                        jobGradeIndex != null
                          ? designationJobGrade[jobGradeIndex] || ''
                          : null
                      }
                      disabled={readOnly}
                      placeholder="Select Grade"
                    />
                  )}
                  onChange={(event, value) => {
                    const index = designationJobGrade.findIndex(
                      (jobGrade) => jobGrade.gradeId === value?.gradeId
                    );
                    setJobGradeIndex(index);
                    setJobGrade(designationJobGrade[index].gradeId);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <label style={{ marginTop: '15px' }} className="mb-2">
                  Job Band
                </label>
                <Autocomplete
                  id="outlined-jobLevel"
                  options={designationJobLevel}
                  value={
                    jobLevelIndex != null
                      ? designationJobLevel[jobLevelIndex] || ''
                      : null
                  }
                  getOptionLabel={(option) => option.bandName}
                  disabled={readOnly}
                  noOptionsText={'Unavailable'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      defaultValue={jobLevel}
                      value={
                        jobLevelIndex != null
                          ? designationJobLevel[jobLevelIndex] || ''
                          : null
                      }
                      disabled={readOnly}
                      placeholder="Select Level"
                    />
                  )}
                  onChange={(event, value) => {
                    const index = designationJobLevel.findIndex(
                      (joblevel) => joblevel.bandId === value?.bandId
                    );
                    setJobLevelIndex(index);
                    setJobLevel(designationJobLevel[index].bandId);
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2} direction="row">
              <Grid item xs={6}>
                <label style={{ marginTop: '15px' }} >
                  Is One-to-One Job
                </label>
                <Checkbox
                  id="outlined-isOne-to-OneJob"
                  placeholder="Is One-to-One Job"
                  variant="outlined"
                  size="small"
                  checked={isOneToOne}
                  disabled={readOnly}
                  onChange={(event) => {
                    setIsOneToOne(event.target.checked);
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <label style={{ marginTop: '15px' }} >
                  Is Critical Job
                </label>
                <Checkbox
                  id="outlined-isCriticalJob"
                  placeholder="Is Critical Job"
                  variant="outlined"
                  size="small"
                  checked={isCriticalJob}
                  disabled={readOnly}
                  onChange={(event) => {
                    setIsCritical(event.target.checked);
                  }}
                />
              </Grid>
            </Grid>
            <br />
          </Grid>
          <Box textAlign="right">
            {/* <Button
              onClick={(e) => save(e)}
              className="btn-primary mb-2 mr-3">
              Create designation
            </Button> */}
            <Button
              className="btn-primary mb-2 mr-3"
              component={NavLink}
              to="./designation">
              Cancel
            </Button>
            <Button
              className="btn-primary mb-2 mr-3"
              type="submit"
              onClick={(e) => save(e)}>
              {_id?"Update "+currentPageType:"Create "+currentPageType}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={modal}
        onClose={toggle3}
        classes={{ paper: 'shadow-lg rounded' }}>
        <div className="p-5">
        {isExitControl&&<p className="text-center">
            {"Exit Control Setup is based on "+currentPageType+"."}
            <a style={{ color: 'blue' }} href={"./exitControl"}>
                Update this Setup
              </a>
          </p>}
          <br/>
          {isProbationControl&&
            <p className="text-center">
              {"Probation Setup is based on "+currentPageType+"."}
              <a style={{ color: 'blue' }} href={"./probationPeriodSetup"}>
                Update this Setup
              </a>
            </p>
          }
          <div className="pt-4 d-flex justify-content-center">
            <Button
              onClick={toggle3}
              className="btn-neutral-primary btn-pill mx-1">
              <span className="btn-wrapper--label">OK</span>
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
      {/* </Grid> */}
      <br />
      <br />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDesignation);
