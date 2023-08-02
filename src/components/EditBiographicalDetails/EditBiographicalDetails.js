import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Snackbar,
  Switch
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ClimbingBoxLoader } from 'react-spinners';
import BlockUi from 'react-block-ui';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import {
  BrowserRouter as Router,
  Link,
  useHistory,
  useLocation
} from 'react-router-dom';
const EditBiographicalDetails = (props) => {
  const { countriesMasterData } = props;
  const history = useHistory();
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employeeUUID = queryParams.get('employeeUUID') || null;
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const [blocking, setBlocking] = useState(false);
  const [celebratesOn, setCelebratesOn] = useState(true);
  const [celebrationDate, setCelebratesOnDate] = useState(null);
  const [DOB, setDOB] = useState(null);
  const [age, setAge] = useState('')
  const [bloodGroup, setBloodGroup] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState();
  const [nationality, setNationality] = useState();
  const [birthCountry, setBirthCountry] = useState();
  const [birthPlace, setBirthPlace] = useState();
  const [birthState, setBirthState] = useState();
  const [stateIndex, setStateIndex] = useState();
  const [dob, setDob] = useState(null);
  const [countryIndex, setCountryIndex] = useState();
  const [countries, setCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  let tempCountries = [];
  let tempStates = [];
  const bloodGroupList = [
    'A+ve',
    'A-ve',
    'B+ve',
    'B-ve',
    'O+ve',
    'O-ve',
    'AB+ve',
    'AB-ve'
  ];
  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
    getEmployeeUUID();

  }, []);
  // Function to calculate age based on current date
  const calculateAge = (event) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthYear = new Date(event).getFullYear();
    let age = (currentYear - birthYear)
    if (!isNaN(age)) setAge(age)
  }
  const getEmployeeUUID = () => {
    apicaller(
      'get',
      `${BASEURL}/employee/fetchEmployeeByUserId?uuid=${employeeUUID}&isLite="true"`
    )
      .then((res) => {
        if (res.status === 200) {
          setBirthCountry(
            res.data[0].birthCountry ? res.data[0].birthCountry : ''
          );
          setBirthState(res.data[0].birthState ? res.data[0].birthState : '');
          setBirthPlace(res.data[0].birthPlace ? res.data[0].birthPlace : '');
          setNationality(
            res.data[0].nationality ? res.data[0].nationality : ''
          );
          setDOB(res.data[0].dob ? res.data[0].dob : '');
          setCelebratesOn(
            res.data[0].celebratesOn ? res.data[0].celebratesOn : ''
          );
          setBloodGroup(res.data[0].bloodGroup ? res.data[0].bloodGroup : '');
          const countryIdx = tempCountries.findIndex(
            (country) => country.name === res.data[0].birthCountry
          );
          if (countryIdx != -1) {
            setCountryIndex(countryIdx);
            const stateIdx = tempCountries[countryIdx]?.states.findIndex(
              (state) => state === res.data[0].birthState
            );
            tempStates = tempCountries[countryIdx].states;
            setAllStates(tempStates);
            if (stateIdx != -1) {
              setStateIndex(stateIdx);
            } else {
              setStateIndex(null);
            }
          } else {
            setCountryIndex(null);
            setStateIndex(null);
            setAllStates([]);
          }
        }
      })
      .catch((err) => {
        setState({
          open: true,
          message: err.response.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
        console.log('getEmployeeInfoHistory err', err);
      });
  };
  const save = (event) => {
    setIsSubmitted(true);
    let inputObj;
    inputObj = {
      celebratesOn: celebratesOn ? DOB : celebrationDate,
      birthCountry: birthCountry,
      birthState: birthState,
      birthPlace: birthPlace,
      nationality: nationality,
      dob: DOB,
      uuid: employeeUUID,
      bloodGroup: bloodGroup,
      age: age
    };
    if (
      birthCountry &&
      birthCountry !== '' &&
      birthState &&
      birthState !== '' &&
      birthPlace &&
      birthPlace !== '' &&
      nationality &&
      nationality !== '' &&
      dob &&
      dob !== ''
    ) {
      setState({
        open: true,
        message: 'Mandatory fields are Required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    } else {
      saveObj(inputObj);
    }
  };
  const saveObj = (inputObj) => {
    setBlocking(true);
    apicaller('put', `${BASEURL}/employee/update?id=updateBiographicalDetails`, inputObj)
      .then((res) => {
        setBlocking(false);
        if (res.status === 200) {
          console.log('res.data', res.data);
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
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  return (
    <BlockUi
      tag="div"
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <Grid container spacing={0}>
          <Grid item md={10} lg={10} xl={10} className="mx-auto">
            <div className="py-5">
              {' '}
              <h4 className="text-dark">Edit Biographical Details</h4>{' '}
            </div>
            <b> </b>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <div>
                  <label className=" mb-2">Birth Country *</label>
                  <Autocomplete
                    id="combo-box-demo"
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
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="country"
                        value={
                          countryIndex != null
                            ? countries[countryIndex] || ''
                            : null
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      const index = countries.findIndex(
                        (country) => country.name === value?.name
                      );
                      if (index != -1) {
                        setCountryIndex(index);
                        setBirthCountry(countries[index].name);
                        setAllStates(countries[index].states);
                        setBirthState(null);
                        setStateIndex(null);
                      } else {
                        setCountryIndex(null);
                        setBirthCountry(null);
                        setAllStates([]);
                        setBirthState(null);
                        setStateIndex(null);
                      }
                    }}
                  />
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <label className=" mb-2">Birth State *</label>
                  <Autocomplete
                    id="combo-box-demo"
                    options={allStates}
                    getOptionLabel={(option) => option}
                    value={
                      countryIndex != null
                        ? stateIndex != null
                          ? countries[countryIndex].states[stateIndex] || ''
                          : null
                        : null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="state"
                        value={birthState}
                        helperText={
                          (isSubmitted && !birthState) ||
                            (isSubmitted && birthState === null)
                            ? 'State is required'
                            : ''
                        }
                        error={
                          (isSubmitted && !birthState) ||
                            (isSubmitted && birthState === null)
                            ? true
                            : false
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      const index = allStates.findIndex(
                        (state) => state === value
                      );
                      if (index != -1) {
                        setStateIndex(index);
                        setBirthState(countries[countryIndex].states[index]);
                      } else {
                        setStateIndex(null);
                        setBirthState(null);
                      }
                    }}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <div>
                  <label className="mb-2">Birth Location *</label>
                  <TextField
                    id="outlined-POB"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="birthPlace"
                    value={birthPlace}
                    onChange={(event) => {
                      setBirthPlace(event.target.value);
                    }}
                    helperText={
                      (isSubmitted && !birthPlace) ||
                        (isSubmitted && birthPlace === null)
                        ? 'Nationality is required'
                        : ''
                    }
                    error={
                      (isSubmitted && !birthPlace) ||
                        (isSubmitted && birthPlace === null)
                        ? true
                        : false
                    }
                  />
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <label className="mb-2">Nationality *</label>
                  <TextField
                    id="outlined-nationality"
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="nationality"
                    value={nationality}
                    onChange={(event) => {
                      setNationality(event.target.value);
                    }}
                    helperText={
                      (isSubmitted && !nationality) ||
                        (isSubmitted && nationality === null)
                        ? 'Nationality is required'
                        : ''
                    }
                    error={
                      (isSubmitted && !nationality) ||
                        (isSubmitted && nationality === null)
                        ? true
                        : false
                    }
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <div>
                  <label className=" mb-2">Date of Birth *</label>
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
                      value={DOB}
                      onChange={(event) => {
                        setDOB(event);
                        calculateAge(event)
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      helperText={
                        (isSubmitted && !DOB) || (isSubmitted && DOB === null)
                          ? 'DOB is required'
                          : ''
                      }
                      error={
                        (isSubmitted && !DOB) || (isSubmitted && DOB === null)
                          ? true
                          : false
                      }
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Grid>
              <Grid item md={6}>
                <div>
                  <label className=" mb-2">Celebrates On</label>
                  <Grid container spacing={0}>
                    <Grid item md={7}>
                      <Switch
                        onChange={(event) => {
                          console.log(event);
                          setCelebratesOn(event.target.checked);
                          setCelebratesOnDate(null);
                        }}
                        checked={celebratesOn}
                        name="EmailId"
                        color="primary"
                        className="switch-small"
                      />{' '}
                      &nbsp; {!celebratesOn ? '' : 'Same as Date Of Birth'}
                    </Grid>
                    <Grid item md={5}>
                      {!celebratesOn ? (
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
                            value={celebrationDate}
                            onChange={(event) => {
                              setCelebratesOnDate(event);
                            }}
                            KeyboardButtonProps={{
                              'aria-label': 'change date'
                            }}
                            helperText={
                              (!celebratesOn &&
                                isSubmitted &&
                                !celebrationDate) ||
                                (!celebratesOn &&
                                  isSubmitted &&
                                  celebrationDate === null)
                                ? 'Celebration Date is required'
                                : ''
                            }
                            error={
                              (!celebratesOn &&
                                isSubmitted &&
                                !celebrationDate) ||
                                (!celebratesOn &&
                                  isSubmitted &&
                                  celebrationDate === null)
                                ? true
                                : false
                            }
                          />{' '}
                        </MuiPickersUtilsProvider>
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <div>
                  <label className=" mb-2">Blood Group</label>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="outlined-bloodGroup"
                    select
                    size="small"
                    name="bloodGroup"
                    value={bloodGroup}
                    onChange={(event) => {
                      setBloodGroup(event.target.value);
                    }}>
                    {bloodGroupList.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <br></br>
        <br></br>
        <br></br>
        <div className="divider" />
        <div className="divider" />
        <div className="float-left" style={{ marginLeft: '6.5%' }}>
          <Button
            className="btn-primary mb-4 m-2"
            type="submit"
            onClick={(e) => save(e)}>
            Save
          </Button>
          <Button
            className="btn-primary mb-4 m-2"
            component={NavLink}
            to="./employeeDetails">
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
      </Card>
    </BlockUi>
  );
};
const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany,
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBiographicalDetails);
