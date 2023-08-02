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
  ListItem,
  List,
  Menu,
  InputAdornment,
  Dialog
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ClimbingBoxLoader } from 'react-spinners';
import BlockUi from 'react-block-ui';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import apicaller from 'helper/Apicaller';
import clsx from 'clsx';

import Pagination from '@material-ui/lab/Pagination';

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';

const CreateLocation = (props) => {
  const { countriesMasterData } = props;
  const { selectedCompany } = props;
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
  const saveButtonLabel = edit ? 'Update' : 'Create';

  const processingHubs = [
    { value: 'Hyderabad' },
    { value: 'Banglore' },
    { value: 'Delhi' },
    { value: 'Mumbai' }
  ];

  const deductorTypes = [
    { value: 'Artificial Juridical Person' },
    { value: 'Association of Person (AOP)' },
    { value: 'Association of Person (Trust)' },
    { value: 'Autonomous Body (Central Govt.)' },
    { value: 'Autonomous Body (State Govt.)' },
    { value: 'Body of Individuals' },
    { value: 'Branch/Division of Company' },
    { value: 'Central Government' },
    { value: 'Company' },
    { value: 'Firm' },
    { value: 'Individual/HUF' },
    { value: 'Local Authority (Central Govt.)' },
    { value: 'Local Authority (State Govt.)' },
    { value: 'State Government' },
    { value: 'Statutory Body(Central Govt.)' },
    { value: 'Statutory Body(State Govt.)' }
  ];

  const addressData = [
    {
      address: '',
      city: '',
      country: '',
      state: '',
      pin: ''
    }
  ];

  const [blocking, setBlocking] = useState(false);
  const statusList = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];
  const [_id, setId] = useState();
  const [address, setAddress] = useState();
  const [pin, setPinCode] = useState();
  const [locationId, setLocationId] = useState();
  const [isPTApplicable, setPtApplicable] = useState(false);
  const [isProcessingHub, setIsHub] = useState(false);
  const [processingHub, setProcessingHub] = useState();
  const [addState, setAddState] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [isESIApplicable, setESIApplicable] = useState(false);
  const [ESIOffice, setESIOffice] = useState();
  const [ESIAccount, setESIAccount] = useState();
  const [ESIDate, setESIDate] = useState(null);
  const [holidayCalendar, setHoliday] = useState();
  const [deductorType, setDeductor] = useState();
  const [shiftPattern, setShift] = useState();
  const [locationName, setLocationName] = useState();
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [status, setStatus] = useState(true);
  const [cityClassification, setCityClassification] = useState('');
  const [companyTAN, setCompanyTAN] = useState();
  const [TANDate, setTANDate] = useState(null);
  const [PFCircle, setPfCircle] = useState();
  const [isSubmitted, setIsSubmitted] = useState();
  const [validDate, setValidDate] = useState(false);
  const [checkAllDep, setCheckAllDep] = useState(false);
  const [hasNextSequence, setHasNextSequence] = useState(false);

  const [addedDepartments, setAddedDepartments] = useState([]);
  const [DepartmentsArray, setDepartments] = useState([]);

  const [paginatedDepartments, setPaginatedDepartments] = useState([]);

  const [allDepartments, setAllDepartments] = useState([]);
  const [anchorEl3, setAnchorEl3] = useState(null);

  const [anchorEl2, setAnchorEl2] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [sort, setSort] = useState('ASC');
  const [page, setPage] = useState(1);
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  let tempCountries = [];
  let tempStates = [];
  const [isExitControl,setIsExitControl]=useState(false);
  const [isProbationControl,setIsProbationControl]=useState(false);
  const [modal, setModal] = useState(false);
  const toggle3 = () => setModal(!modal);
  const currentPageType="Location";
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const history = useHistory();

  const handleSearch = (event) => {
    const filteredDepartments = allDepartments.filter(
      (department) =>
        department.name
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        department.id.toUpperCase().includes(event.target.value?.toUpperCase())
    );

    if (filteredDepartments.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      });
    }

    setDepartments(filteredDepartments);
    setPaginatedDepartments(filteredDepartments);
  };

  const handleSort = (sortOrder) => {
    let sortedDepartments = JSON.parse(JSON.stringify(DepartmentsArray));
    if (sortOrder == 'ASC') {
      sortedDepartments = sortedDepartments.sort((dep1, dep2) =>
        dep1.name > dep2.name ? 1 : dep2.name > dep1.name ? -1 : 0
      );
      setDepartments(sortedDepartments);
      setPaginatedDepartments(sortedDepartments);
    } else {
      sortedDepartments = sortedDepartments.sort((dep2, dep1) =>
        dep1.name > dep2.name ? 1 : dep2.name > dep1.name ? -1 : 0
      );
      setDepartments(sortedDepartments);
      setPaginatedDepartments(sortedDepartments);
    }
  };

  const handleChange = (event, value) => {
    // console.log(value);
    setPage(value);
  };

  const cities = [
    { value: 'Tier-1' },
    { value: 'Tier-2' },
    { value: 'Tier-3' },
    { value: 'Tier-4' },
    { value: 'Tier-5' },
    { value: 'Tier-6' }
  ];

  const holidays = [
    { value: 'New Year Day' },
    { value: 'Makar Sankranti / Pongal' },
    { value: 'Republic Day' },
    { value: 'Holi' },
    { value: 'Maha Shivaratri' },
    { value: 'Ugadi / Gudi Padwa' },
    { value: 'Good Friday' },
    { value: 'Eid-ul-Fitar' }
  ];

  const shifts = [
    {
      value: 'Permanent',
      label: 'Permanent'
    },
    {
      value: 'Rotating',
      label: 'Rotating'
    },
    {
      value: 'Continuous',
      label: 'Continuous'
    },
    {
      value: 'Discontinuous',
      label: 'Discontinuous'
    },
    {
      value: 'Swing',
      label: 'Swing'
    }
  ];

  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
    if (id) {
      getLocationData();
    } else {
      getNextLocationId();
    }
    getAllDepartments();
  }, []);

  const getLocationData = () => {
    setBlocking(true);
    apicaller('get', `${BASEURL}/location/by?locationId=` + id)
      .then((res) => {
        setBlocking(false);

        if (res.status === 200) {
          const respData = res?.data;
          setESIAccount(respData.ESIAccountNumber);
          setESIApplicable(respData.ESIApplicable);
          setESIOffice(respData.ESILocalOffice);
          setESIDate(respData.ESIStartDate);
          setPfCircle(respData.PFCircle);
          setTANDate(respData.TANRegisteredDate);
          setAddress(respData.address);
          setCity(respData.city);
          setCityClassification(respData.cityClassification);
          setCompanyTAN(respData.companyTAN);
          setCountry(respData.country);
          setDeductor(respData.deductorType);
          setHoliday(respData.holidayCalendarID);
          setStatus(respData.isActive);
          setPtApplicable(respData.isPTApplicable);
          setIsHub(respData.isProcessingHub);
          setLocationId(respData.locationId);
          setLocationName(respData.locationName);
          setId(respData._id);
          setPinCode(respData.pin);
          setProcessingHub(respData.processingHub);
          setAddState(respData.state);
          setShift(respData.timePatternID);
          setEffectiveDate(
            new Date(respData.effectiveDate).toLocaleDateString()
          );
          setAddedDepartments(respData.departmentIDs);
          const countryIdx = tempCountries.findIndex(
            (country) => country.name === respData.country
          );
          if (countryIdx != -1) {
            setCountryIndex(countryIdx);
            const stateIdx = tempCountries[countryIdx]?.states.findIndex(
              (state) => state === respData.state
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
          validateDate(respData.effectiveDate);
        }
      })
      .catch((err) => {
        setBlocking(false);
        console.log('get location err', err);
      });
  };

  const getAllDepartments = () => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then((res) => {
        if (res.status === 200) {
          console.log('res.data', res.data);
          setDepartments(res.data);
          setPaginatedDepartments(res.data);
          setAllDepartments(res.data);
        }
      })
      .catch((err) => {
        console.log('getDepartments err', err);
      });
  };

  const getNextLocationId = () => {
    apicaller('post', `${BASEURL}/autoNumbering/getNextSequence`, {
      type: 'LOC'
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setHasNextSequence(true);
          setLocationId(res.data);
          setStatus(true);
        }
      })
      .catch((err) => {
        console.log('get department err', err);
      });
  };

  const borderStyle = {
    border: '1px solid rgb(196 196 196)',
    borderRadius: '4px'
  };

  const companyCreatedDate = new Date(selectedCompany.registrationDate);

  const validateDate = (date) => {
    if (date && !isNaN(Date.parse(date))) {
      if (new Date(date) < companyCreatedDate) {
        setValidDate(false);
      } else {
        setValidDate(true);
      }
    } else {
      if (date) setValidDate(false);
      else setValidDate(true);
    }
  };

  const save = (e) => {
    e.preventDefault();
    //to do service call
    setIsSubmitted(true);
    if (
      locationId &&
      locationId !== '' &&
      locationName &&
      locationName !== '' &&
      effectiveDate &&
      effectiveDate !== null &&
      status &&
      validDate &&
      address &&
      address !== '' &&
      country &&
      country !== '' &&
      addState &&
      addState !== '' &&
      city &&
      city !== '' &&
      pin &&
      pin !== ''
    ) {
      let inputObj = {
        locationName: locationName,
        effectiveDate: effectiveDate,
        status: status,
        cityClassification: cityClassification,
        isPTApplicable: isPTApplicable,
        isProcessingHub: isProcessingHub,
        processingHub: processingHub,
        ESIApplicable: isESIApplicable,
        ESILocalOffice: ESIOffice,
        ESIAccountNumber: ESIAccount,
        ESIStartDate: ESIDate,
        companyTAN: companyTAN,
        TANRegisteredDate: TANDate,
        PFCircle: PFCircle,
        deductorType: deductorType,
        holidayCalendarID: holidayCalendar,
        timePatternID: shiftPattern,
        departmentIDs: addedDepartments,
        address: address,
        country: country,
        state: addState,
        city: city,
        pin: pin,
        _id:_id
      };
      if (inputObj._id==null) {
        setBlocking(true);
        setBlocking(true);
        apicaller('post', `${BASEURL}/location`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setBlocking(false);
              console.log('res.data', res.data);
              setId(res.data[0]._id)
              setState({
                open: true,
                message: 'Added Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
              exitControlsData();
            }
          })
          .catch((err) => {
            setBlocking(false);
            if (err?.response?.data) {
              setState({
                open: true,
                message: err,
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
              console.log('create id err', err);
            }
          });
      } else {
        setBlocking(true);
        apicaller('patch', `${BASEURL}/location/${locationId}`, inputObj)
          .then((res) => {
            if (res.status === 200) {
              setBlocking(false);
              console.log('res.data', res.data);
              setState({
                open: true,
                message: 'Location Updated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              });
            }
          })
          .catch((err) => {
            setBlocking(false);
            console.log('create company err', err);
          });
      }
    } else {
      setState({
        open: true,
        message: 'Mandatory fields are required',
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

  const addRemoveDepartments = (event, item) => {
    let newArray = [];
    let index = -1;
    for (let i = 0; i < addedDepartments.length; i++) {
      if (addedDepartments[i] === item.id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      let id = item.id;
      addedDepartments.push(id);
      setAddedDepartments(addedDepartments);

      const result = allDepartments.map((item, i) => {
        return { ...item, item };
      });
      setDepartments(result);
    } else {
      addedDepartments.splice(index, 1);
      setAddedDepartments(addedDepartments);

      const result = allDepartments.map((item, i) => {
        return { ...item, item };
      });

      setDepartments(result);
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const getObjByValue = (arr, value) => {
    return value ? arr.find((x) => x.value == value) : {};
  };

  return (
    <>
      <BlockUi
        tag="div"
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card>
          <Grid container spacing={0}>
            <Grid item md={10} lg={10} xl={10} className="mx-auto">
              <div className="bg-white p-4 rounded">
                <div className="text-center my-4">
                  <h1 className="display-4 mb-1 font-weight-normal">
                  {_id?"Update "+currentPageType:"Create "+currentPageType}
                  </h1>
                </div>
                <br />
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-noramal mb-2">Location ID *</label>
                      <TextField
                        id="outlined-location"
                        placeholder="Location ID"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        disabled={hasNextSequence || readOnly || edit || _id}
                        size="small"
                        value={locationId}
                        error={isSubmitted && !locationId}
                        helperText={
                          isSubmitted && !locationId
                            ? 'Location Id is Required'
                            : null
                        }
                        onChange={(event) => {
                          const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                          setLocationId(result.toUpperCase());
                        }}
                      />{' '}
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-noraml mb-2">
                        Location Name *
                      </label>
                      <TextField
                        id="outlined-LocationName"
                        placeholder="Location Name"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="LocationName"
                        value={locationName}
                        onChange={(event) => {
                          setLocationName(event.target.value);
                        }}
                        error={isSubmitted && (locationName ? false : true)}
                        helperText={
                          isSubmitted &&
                          (locationName ? '' : 'Location Name is Required')
                        }
                      />
                    </div>
                  </Grid>{' '}
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
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
                          minDate={companyCreatedDate}
                          fullWidth
                          size="small"
                          value={effectiveDate}
                          onChange={(event) => {
                            validateDate(event);
                            setEffectiveDate(event);
                          }}
                          error={
                            isSubmitted
                              ? effectiveDate
                                ? effectiveDate !== null &&
                                  effectiveDate instanceof Date &&
                                  new Date(effectiveDate) < companyCreatedDate
                                  ? "Effective Date Should be greater than company's created Date"
                                  : null
                                : 'Effective Date Required'
                              : effectiveDate !== null &&
                                effectiveDate instanceof Date &&
                                new Date(effectiveDate) < companyCreatedDate
                              ? "Effective Date Should be greater than company's created Date"
                              : null
                              ? !isSubmitted
                              : effectiveDate !== null &&
                                effectiveDate instanceof Date &&
                                new Date(effectiveDate) < companyCreatedDate
                              ? "Effective Date Should be greater than company's created Date"
                              : null
                          }
                          helperText={
                            isSubmitted
                              ? effectiveDate
                                ? effectiveDate !== null &&
                                  effectiveDate instanceof Date &&
                                  new Date(effectiveDate) < companyCreatedDate
                                  ? "Effective Date Should be greater than company's created Date"
                                  : null
                                : 'Effective Date Required'
                              : effectiveDate !== null &&
                                effectiveDate instanceof Date &&
                                new Date(effectiveDate) < companyCreatedDate
                              ? "Effective Date Should be greater than company's created Date"
                              : null
                              ? !isSubmitted
                              : effectiveDate !== null &&
                                effectiveDate instanceof Date &&
                                new Date(effectiveDate) < companyCreatedDate
                              ? "Effective Date Should be greater than company's created Date"
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
                    <div>
                      <label className="font-weight-normal mb-2">Status</label>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="outlined-phoneStatus"
                        select
                        label="Select"
                        size="small"
                        name="status"
                        error={isSubmitted && (status ? false : true)}
                        helperText={
                          isSubmitted && (status ? '' : 'Status is Required')
                        }
                        value={status}
                        onChange={(event) => {
                          setStatus(event.target.value);
                        }}>
                        {statusList.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-noraml mb-2">
                        City Classification
                      </label>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="outlined-industry"
                        select
                        label="Select"
                        size="small"
                        name="city"
                        value={cityClassification}
                        onChange={(event) => {
                          setCityClassification(event.target.value);
                        }}>
                        {cities.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Is PT Applicable
                      </label>
                      <br></br>
                      <div>
                        <Checkbox
                          id="outlined-isOne-to-OneJob"
                          placeholder="Is One-to-One Job"
                          variant="outlined"
                          size="small"
                          checked={isPTApplicable}
                          value={isPTApplicable}
                          onChange={(event) => {
                            setPtApplicable(event.target.checked);
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <div className="table-responsive-md">
                      <br></br>
                      <Table className="table table-hover table-striped text-nowrap mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th
                              style={{ width: '20%' }}
                              className="text-center">
                              Address *
                            </th>
                            <th
                              style={{ width: '20%' }}
                              className="text-center">
                              City *
                            </th>
                            <th
                              style={{ width: '20%' }}
                              className="text-center">
                              Country *
                            </th>
                            <th
                              style={{ width: '20%' }}
                              className="text-center">
                              State *
                            </th>
                            <th
                              style={{ width: '20%' }}
                              className="text-center">
                              Pin *
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {addressRow.map((item, idx) => ( */}
                          <tr>
                            <td className="text-center">
                              <div>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="address"
                                  value={address}
                                  onChange={(event) => {
                                    setAddress(event.target.value);
                                  }}
                                  error={
                                    isSubmitted && (address ? false : true)
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="city"
                                  value={city}
                                  onChange={(event) => {
                                    setCity(event.target.value);
                                  }}
                                  error={isSubmitted && (city ? false : true)}
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <Autocomplete
                                  id="combo-box-demo"
                                  options={countries}
                                  getOptionLabel={(option) => option.name}
                                  value={
                                    countryIndex != null
                                      ? countries[countryIndex] || ''
                                      : null
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select"
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
                            </td>
                            <td className="text-center">
                              <div>
                                <Autocomplete
                                  id="combo-box-demo"
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
                                      label="Select"
                                      variant="outlined"
                                      fullWidth
                                      size="small"
                                      name="state"
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
                            </td>
                            <td className="text-center">
                              <div>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="pin"
                                  inputProps={{ type: 'number' }}
                                  value={pin}
                                  onChange={(event) => {
                                    setPinCode(event.target.value);
                                  }}
                                  error={isSubmitted && (pin ? false : true)}
                                />
                              </div>
                            </td>
                            {/* <td className='text-center'>
                                <div>
                                  <Button
                                    onClick={handleAddRows}
                                    className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                    <FontAwesomeIcon
                                      icon={['fas', 'plus']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                  <Button
                                    onClick={() => handleRemoveRows(idx)}
                                    className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                    <FontAwesomeIcon
                                      icon={['fas', 'times']}
                                      className='font-size-sm'
                                    />
                                  </Button>
                                </div>
                              </td> */}
                          </tr>
                          {/* ))} */}
                        </tbody>
                      </Table>
                      <br></br>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Is Processing Hub
                      </label>
                      <br></br>
                      <div>
                        <Checkbox
                          id="outlined-isOne-to-OneJob"
                          placeholder="Is One-to-One Job"
                          variant="outlined"
                          size="small"
                          checked={isProcessingHub}
                          value={isProcessingHub}
                          onChange={(event) => {
                            setIsHub(event.target.checked);
                            if (event.target.checked) {
                              setProcessingHub('');
                            }
                          }}></Checkbox>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Processing Hub
                      </label>
                      <Autocomplete
                        style={{
                          background: isProcessingHub ? 'lightgrey' : ''
                        }}
                        disabled={isProcessingHub}
                        id="combo-box-demo"
                        options={processingHubs}
                        getOptionLabel={(option) => option.value}
                        value={
                          processingHub
                            ? getObjByValue(processingHubs, processingHub)
                            : ''
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="processingHub"
                            value={processingHub}
                          />
                        )}
                        onChange={(event, value) => {
                          setProcessingHub(value?.value);
                        }}></Autocomplete>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        ESI Applicable
                      </label>
                      <br></br>
                      <div>
                        <Checkbox
                          id="outlined-isOne-to-OneJob"
                          placeholder="Is One-to-One Job"
                          variant="outlined"
                          size="small"
                          checked={isESIApplicable}
                          value={isESIApplicable}
                          onChange={(event) => {
                            setESIApplicable(event.target.checked);
                          }}></Checkbox>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        ESI Local Office
                      </label>
                      <TextField
                        id="outlined-ESIOffice"
                        placeholder="ESI Local Office"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="ESIOffice"
                        value={ESIOffice}
                        onChange={(event) => {
                          setESIOffice(event.target.value);
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        ESI Account No.
                      </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        inputProps={{ type: 'number' }}
                        name="ESIAccountNo"
                        placeholder="ESI Account No."
                        value={ESIAccount}
                        onChange={(event) => {
                          setESIAccount(event.target.value);
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        ESI Start Date
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
                          // maxDate={new Date()}
                          fullWidth
                          size="small"
                          value={ESIDate}
                          onChange={(event) => {
                            // validateDate(event);
                            setESIDate(event);
                          }}
                          // helperText={
                          //   effectiveDate &&
                          //   effectiveDate instanceof Date &&
                          //   new Date(effectiveDate) > new Date()
                          //     ? "Registration Date Cannot be greater than today's Date"
                          //     : null
                          // }
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Company TAN
                      </label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        name="companyTAN"
                        placeholder="Company TAN"
                        value={companyTAN}
                        onChange={(event) => {
                          setCompanyTAN(event.target.value);
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        TAN registered Date
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
                          // maxDate={new Date()}
                          fullWidth
                          size="small"
                          value={TANDate}
                          onChange={(event) => {
                            // validateDate(event);
                            setTANDate(event);
                          }}
                          // helperText={
                          //   effectiveDate &&
                          //   effectiveDate instanceof Date &&
                          //   new Date(effectiveDate) > new Date()
                          //     ? "Registration Date Cannot be greater than today's Date"
                          //     : null
                          // }
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">PF Circle</label>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        name="PF Circle"
                        placeholder="PF Circle"
                        value={PFCircle}
                        onChange={(event) => {
                          setPfCircle(event.target.value);
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Deductor Type
                      </label>
                      <Autocomplete
                        id="combo-box-demo"
                        options={deductorTypes}
                        value={
                          deductorType
                            ? getObjByValue(deductorTypes, deductorType)
                            : ''
                        }
                        getOptionLabel={(option) => option.value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="deductorType"
                            value={deductorType}
                          />
                        )}
                        onChange={(event, value) => {
                          setDeductor(value?.value);
                        }}></Autocomplete>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Holiday Calendar ID
                      </label>
                      <Autocomplete
                        id="combo-box-demo"
                        options={holidays}
                        value={
                          holidayCalendar
                            ? getObjByValue(holidays, holidayCalendar)
                            : ''
                        }
                        getOptionLabel={(option) => option.value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="holidayCalendar"
                            value={holidayCalendar}
                          />
                        )}
                        onChange={(event, value) => {
                          setHoliday(value?.value);
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className="font-weight-normal mb-2">
                        Pattern ID
                      </label>
                      <Autocomplete
                        id="combo-box-demo"
                        options={shifts}
                        getOptionLabel={(option) => option.value}
                        value={
                          shiftPattern
                            ? getObjByValue(shifts, shiftPattern)
                            : ''
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="shiftPattern"
                            value={shiftPattern}
                          />
                        )}
                        onChange={(event, value) => {
                          setShift(value?.value);
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <br></br> <br></br> <br></br>
                <Grid container spacing={6}>
                  <Grid
                    item
                    md={12}
                    style={{
                      border: '1px solid #ebe5e5',
                      borderRadius: '0.75rem'
                    }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between p-4 py-3">
                      <div
                        className={clsx(
                          'search-wrapper search-wrapper--alternate search-wrapper--grow',
                          { 'is-active': searchOpen }
                        )}>
                        <TextField
                          variant="outlined"
                          size="small"
                          id="input-with-icon-textfield22-2"
                          placeholder="Search Departments..."
                          onFocus={openSearch}
                          onBlur={closeSearch}
                          onChange={handleSearch}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchTwoToneIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <div>
                          <Button
                            onClick={handleClick2}
                            className="btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill">
                            <SettingsTwoToneIcon className="w-50" />
                          </Button>
                          <Menu
                            anchorEl={anchorEl2}
                            keepMounted
                            getContentAnchorEl={null}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right'
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right'
                            }}
                            open={Boolean(anchorEl2)}
                            classes={{ list: 'p-0' }}
                            onClose={handleClose2}>
                            <div className="dropdown-menu-lg overflow-hidden p-0">
                              <div className="font-weight-bold px-4 pt-3">
                                Results
                              </div>
                              <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                                <ListItem
                                  button
                                  href="#/"
                                  value={recordsPerPage}
                                  onClick={(e) => {
                                    setRecordsPerPage(10);
                                    setPage(1)
                                    handleClose2()
                                    setPaginatedDepartments(allDepartments);
                                  }}>
                                  <div className="nav-link-icon mr-2">
                                    <RadioButtonUncheckedTwoToneIcon />
                                  </div>
                                  <span className="font-size-md">
                                    <b>10</b> results per page
                                  </span>
                                </ListItem>
                                <ListItem
                                  button
                                  href="#/"
                                  value={recordsPerPage}
                                  onClick={(e) => {
                                    setRecordsPerPage(20);
                                    setPage(1)
                                    handleClose2()
                                    setPaginatedDepartments(allDepartments);
                                  }}>
                                  <div className="nav-link-icon mr-2">
                                    <RadioButtonUncheckedTwoToneIcon />
                                  </div>
                                  <span className="font-size-md">
                                    <b>20</b> results per page
                                  </span>
                                </ListItem>
                                <ListItem
                                  button
                                  href="#/"
                                  value={recordsPerPage}
                                  onClick={(e) => {
                                    setRecordsPerPage(30);
                                    setPage(1)
                                    handleClose2()
                                    setPaginatedDepartments(allDepartments);
                                  }}>
                                  <div className="nav-link-icon mr-2">
                                    <RadioButtonUncheckedTwoToneIcon />
                                  </div>
                                  <span className="font-size-md">
                                    <b>30</b> results per page
                                  </span>
                                </ListItem>
                              </List>
                              <div className="divider" />
                              <div className="font-weight-bold px-4 pt-4">
                                Order
                              </div>
                              <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                                <ListItem
                                  button
                                  href="#/"
                                  onClick={(e) => {
                                    handleSort('ASC');  handleClose2()
                                  }}>
                                  <div className="mr-2">
                                    <ArrowUpwardTwoToneIcon />
                                  </div>
                                  <span className="font-size-md">
                                    Ascending
                                  </span>
                                </ListItem>
                                <ListItem
                                  button
                                  href="#/"
                                  onClick={(e) => {handleSort('DES');  handleClose2()}}>
                                  <div className="mr-2">
                                    <ArrowDownwardTwoToneIcon />
                                  </div>
                                  <span className="font-size-md">
                                    Descending
                                  </span>
                                </ListItem>
                              </List>
                            </div>
                          </Menu>
                        </div>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="p-4">
                      <div className="table-responsive-md">
                        <Table className="table table-alternate-spaced mb-0">
                          <thead className="thead-light">
                            <tr>
                              <th
                                style={{ width: '20%' }}
                                className="text-center">
                                Department ID
                              </th>
                              <th
                                style={{ width: '30%' }}
                                className="text-center">
                                Department Name
                              </th>
                              <th
                                style={{ width: '20%' }}
                                className="text-center">
                                <Checkbox
                                  color="primary"
                                  className="align-self-start"
                                  name="checkBoxAll"
                                  value={checkAllDep}
                                  onChange={(event) => {
                                    setCheckAllDep(event.target.checked);
                                    if (event.target.checked) {
                                      let ids = allDepartments.map((a) => a.id);
                                      setAddedDepartments(ids);
                                    } else {
                                      setAddedDepartments([]);
                                    }
                                  }}
                                />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedDepartments
                              .slice(
                                page * recordsPerPage > DepartmentsArray.length
                                  ? page === 0
                                    ? 0
                                    : page * recordsPerPage - recordsPerPage
                                  : page * recordsPerPage - recordsPerPage,
                                page * recordsPerPage <= DepartmentsArray.length
                                  ? page * recordsPerPage
                                  : DepartmentsArray.length
                              )
                              .map((item, idx) => (
                                <tr>
                                  <td className="text-center">
                                    <div>{item.id}</div>
                                  </td>
                                  <td className="text-center">
                                    <div>{item.name}</div>
                                  </td>
                                  <td className="text-center">
                                    <div>
                                      {' '}
                                      <Checkbox
                                        color="primary"
                                        className="align-self-start"
                                        name="preferred"
                                        value={addedDepartments.includes(
                                          item?.id
                                        )}
                                        checked={addedDepartments.includes(
                                          item?.id
                                        )}
                                        onChange={(event) => {
                                          addRemoveDepartments(event, item);
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </div>

                      <div className="d-flex  justify-content-center pt-3 mb-5">
                        <Pagination
                          className="pagination-primary"
                          count={Math.ceil(
                            DepartmentsArray.length / recordsPerPage
                          )}
                          variant="outlined"
                          shape="rounded"
                          selected={true}
                          page={page}
                          onChange={handleChange}
                          showFirstButton
                          showLastButton
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <br></br>
                <div className="divider" />
                <div className="divider" />
                <div className="float-right" style={{ marginRight: '2.5%' }}>
                  <Button
                    className="btn-primary mb-2 m-2"
                    component={NavLink}
                    to="./locations">
                    Cancel
                  </Button>
                  <Button
                    className="btn-primary mb-2 m-2"
                    type="submit"
                    onClick={(e) => save(e)}>
                    {_id?"Update "+currentPageType:"Create "+currentPageType}
                  </Button>
                </div>
              </div>
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
        </Card>{' '}
      </BlockUi>
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
  selectedCompany: state.Auth.selectedCompany,
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateLocation);
