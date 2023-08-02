import {
    Button,
    Card,
    Checkbox,
    Grid,
    MenuItem,
    TextField,
    Table,
    CardContent,
    Collapse,
    Dialog,
    Snackbar
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { NavLink, useHistory } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
    BrowserRouter as Router, Link,
     useLocation
} from "react-router-dom";
import { ClimbingBoxLoader } from 'react-spinners';
import { connect } from 'react-redux'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import SelectEmployee from 'components/SelectEmployee';

const CreateAddAddress = (props) => {
    const history = useHistory()
    const { countriesMasterData } = props;
    const [isSubmitted, setIsSubmitted] = useState();
    const [blocking, setBlocking] = useState(false);
    const queryParams = new URLSearchParams(useLocation().search);
    const id = queryParams.get('id') || null;
    const employeeUUID = queryParams.get('uuid') || null;
    const edit = id ? true : false;
    const saveButtonLabel = edit ? 'Update Employees Current Contact Details' : 'Save';
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const [addressType, setAddressType] = useState();
    const [status, setStatus] = useState(true);
    const [currentStatus, setCurrentStatus] = useState([{ label: 'Active', value: true }])
    const [isPrimaryID, setIsPrimaryID] = useState(false);
    const [addState, setAddState] = useState();
    const [country, setCountry] = useState();
    const [city, setCity] = useState();
    const [addressLine1, setAddressLine1] = useState();
    const [addressLine2, setAddressLine2] = useState();
    const [addressLine3, setAddressLine3] = useState();
    const [PIN, setPIN] = useState();
    const [effectiveDate, setEffectiveDate] = useState(null);
    const [checkboxEnable, setCheckboxEnable] = useState([]);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [addressId, setAddressId] = useState();
    const [IndexToBeSplice, setIndexToBeSplice] = useState()
    const [addressToBeDeleted, setAddressToBeDeleted] = useState()
    const [countries, setCountries] = useState([]);
    const [countryIndex, setCountryIndex] = useState();
    const [allStates, setAllStates] = useState([]);
    const [stateIndex, setStateIndex] = useState();
    const [employeeDetail, setEmployeeDetail] = useState()
    const [addressSameAsEmployee, setAddressSameAsEmployee] = useState();
    const [primaryAddress, setPrimaryAddress] = useState(null)

    let tempCountries = [];
    let tempStates = [];

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const [employeesCurrentContactDetailsArray, setEmployeesCurrentContactDetailsArray] =
        useState();

    const [deleteModal, setDeleteModal] = useState(false)
    const toggle3 = () => setDeleteModal(!deleteModal)

    const reState = () => {
        setAddressType('')
        setEffectiveDate(null)
        setStatus(true)
        setIsPrimaryID('')
        setCountry('')
        setCity('')
        setAddState('')
        setPIN('')
        setAddressLine1('')
        setAddressLine2('')
        setAddressLine3('')
        setAddressSameAsEmployee(false)
        setIsSubmitted(false)
        setIsEditAddress(false)
        setState1({ accordion: [false, false, false] })
        setCountryIndex(null);
        setStateIndex(null);
        setAllStates([]);
    }
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
        setIsEditAddress(true)
        // Show Accordion to display Address Input fields
        // setTrue in first accordion
        openAccordion(0)
        // assign values to edit address in input feilds.
        const addressObj = employeesCurrentContactDetailsArray[idx]
        setAddressType(addressObj.addressType)
        setIsPrimaryID(addressObj.isPrimary)
        setStatus(addressObj.status)
        setCurrentStatus([{ label: 'Active', value: true }, { label: 'InActive', value: false }])
        setEffectiveDate(getParsedDate(addressObj.effectiveDate))
        setCountry(addressObj.country)
        setAddressSameAsEmployee(addressObj.addressSameAsEmployee)
        setAddState(addressObj.state)
        setCity(addressObj.city)
        setPIN(addressObj.PIN)
        setAddressLine1(addressObj.address1)
        setAddressLine2(addressObj.address2)
        setAddressLine3(addressObj.address3)
        setAddressId(addressObj.uuid)
        const countryIdx = countries.findIndex(
            (country) => country.name === addressObj.country
        );
        if (countryIdx != -1) {
            setCountryIndex(countryIdx);
            const stateIdx = countries[countryIdx]?.states.findIndex(
                (state) => state === addressObj.state
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

    };

    useEffect(() => {
        tempCountries = countriesMasterData;
        setCountries(tempCountries);
    }, [])

    const getAllData = selectedEmployee => {
        setEmployeeDetail(selectedEmployee)
        setBlocking(true)
        let employeeSearchInput = selectedEmployee.uuid
        apicaller('get', `${BASEURL}/address/by/${employeeSearchInput}`)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    setBlocking(false)
                    console.log(res.data)
                    setEmployeesCurrentContactDetailsArray(res.data)
                    setPrimaryAddress(res.data[res.data.length - 1])
                    reState()
                }
                else {
                    setEmployeesCurrentContactDetailsArray([])
                    setPrimaryAddress(null)
                    reState()
                }
            })
            .catch(err => {
                setBlocking(false)
                setEmployeesCurrentContactDetailsArray([])
                setPrimaryAddress(null)
                reState()
                console.log('get employee err', err)
            })
    }

    const save = (e,) => {
        e.preventDefault();
        //to do service call
        let data = {
            addressType: addressType,
            effectiveDate: effectiveDate,
            isActive: status,
            address1: addressLine1,
            address2: addressLine2,
            address3: addressLine3,
            country: country,
            state: addState,
            city: city,
            PIN: PIN,
            addressSameAsEmployee: addressSameAsEmployee ? true : false,
            isPrimary: isPrimaryID ? true : false,
            employeeUUID: employeeDetail.uuid
        };

        if (isEditAddress) {
            data.uuid = addressId
            //call an API to update New Address
            apicaller('patch', `${BASEURL}/address?uuid=${addressId}`, data)
                .then(res => {
                    if (res.status === 200) {
                        console.log('res.data', res.data);
                        if (res.data && res.data) {
                            // To Refresh the table values
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
                .catch((err) => {
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
            apicaller('post', `${BASEURL}/address`, data)
                .then(res => {
                    if (res.status === 200) {
                        console.log('res.data', res.data);
                        if (res.data) {
                            // To Refresh the table values
                            getAllData(employeeDetail)

                            // reset input fields to empty because our data is saved in Add New Address
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
                    setBlocking(false)
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
    // Confirmation for delete
    const showConfirmDelete = (i, selected) => {
        setDeleteModal(true)
        setAddressToBeDeleted(selected)
        setIndexToBeSplice(i)
    }

    // Delete API Call 
    const handleDeleteID = () => {
        setDeleteModal(false)
        setBlocking(true)
        apicaller('delete', `${BASEURL}/address?uuid=${addressToBeDeleted.uuid}`)
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
                    const list = [...employeesCurrentContactDetailsArray];
                    list.splice(IndexToBeSplice, 1);
                    setEmployeesCurrentContactDetailsArray(list);
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

    const addressTypeArray = [

        {
            value: 'Permanent', label: 'Permanent'
        },
        {
            value: 'Current', label: 'Current'
        }

    ];
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

    const [state1, setState1] = useState({
        accordion: [false, false, false]
    });

    const toggleAccordion = (tab) => {
        const prevState = state1.accordion;
        const state = prevState.map((x, index) => (tab === index ? !x : false));

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
        const a = arr.find((x) => (x.value + '') == (value + ''));
        return a;
        // return value ? arr.find((x) => x.value == value) : {};
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
                                        Create Address
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
                                                        <b>Employee's Address Details</b>
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
                                                                <th style={{ width: '20%' }}>Address Type</th>
                                                                <th style={{ width: '20%' }}>Effective Date</th>
                                                                <th style={{ width: '10%' }}>Status</th>
                                                                {/* <th style={{ width: '10%' }}>Action</th> */}
                                                                <th style={{ width: '20%' }}>Address</th>
                                                                <th style={{ width: '10%' }}>Preferred</th>
                                                                <th style={{ width: '10%' }}></th>
                                                            </tr>
                                                        </thead>
                                                        {employeesCurrentContactDetailsArray ? (
                                                            <tbody>
                                                                {employeesCurrentContactDetailsArray?.map(
                                                                    (item, idx) => (
                                                                        <tr>
                                                                            <td>
                                                                                <div>{item.addressType}</div>
                                                                            </td>

                                                                            <td>
                                                                                <div>{getParsedDate(item.effectiveDate)}</div>
                                                                            </td>

                                                                            <td>
                                                                                <div>{item.status ? 'Active' : 'InActive'}</div>
                                                                            </td>

                                                                            <td>
                                                                                <div>
                                                                                    {item.address1} {item.address2} {item.address3}{' '}
                                                                                    {item.city} {item.state}{' '}
                                                                                    {item.country} {' '}
                                                                                    {item.PIN}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div>
                                                                                    <Checkbox
                                                                                        style={item.isPrimary ? { color: 'blue' } : {}}
                                                                                        color="primary"
                                                                                        className="align-self-start"
                                                                                        name={`isPrimary${idx}`}
                                                                                        id={`phoneCheckbox${idx}`}
                                                                                        checked={item.isPrimary}
                                                                                        value={item.isPrimary}
                                                                                        disabled={true}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div>
                                                                                    <Button
                                                                                        onClick={() => handleEditIcon(idx)}
                                                                                        disabled={item?.isPrimary}
                                                                                        className="btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                                                                        <span className="btn-wrapper--icon d-flex">
                                                                                            <FontAwesomeIcon
                                                                                                icon={['fas', 'edit']}
                                                                                                className="font-size-sm"
                                                                                            />
                                                                                        </span>
                                                                                    </Button>
                                                                                    <Button
                                                                                        disabled={item?.isPrimary}
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
                                                                    <span>No Employee's Current Details Added..
                                                                    </span></td></tr>
                                                            </tbody>
                                                        }
                                                    </Table>
                                                </div>

                                                <div className="divider" />
                                                <div className="divider" />
                                            </CardContent>
                                        </Card>

                                        <div className="accordion-toggle">
                                            <Button
                                                style={{ padding: '25px 0' }}
                                                className="btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none"
                                                onClick={() => toggleAccordion(0)}
                                                aria-expanded={state1.accordion[0]}>
                                                <span>{isEditAddress ? 'Edit Address' : 'Add New Address'}</span>
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
                                            <Grid container spacing={1}>
                                                <Grid item md={6}>
                                                    <label
                                                        style={{ marginTop: '15px' }}
                                                        className=" mb-2">
                                                        Address Type *
                                                    </label>
                                                    <Autocomplete
                                                        id="combo-box-demo"
                                                        select
                                                        options={addressTypeArray}
                                                        value={addressType ? getObjByValue(
                                                            addressTypeArray,
                                                            addressType
                                                        ) : ''}
                                                        getOptionLabel={(option) => (option.value ? option.value : '')}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Select Address Type"
                                                                variant="outlined"
                                                                fullWidth
                                                                size="small"
                                                                value={addressType}
                                                                error={
                                                                    isSubmitted &&
                                                                    (addressType ? false : true)
                                                                }
                                                                helperText={
                                                                    isSubmitted &&
                                                                    (addressType
                                                                        ? ''
                                                                        : 'Field is Mandatory')
                                                                }
                                                            />
                                                        )}
                                                        onChange={(event, value) => {
                                                            if (value.value) setAddressType(value.value);
                                                            // setWhenRelationshipOther(value.value)
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={6} >
                                                    <div className='d-flex mt-5 align-items-center'>
                                                        <Checkbox
                                                            id="outlined-isPrimaryContact"
                                                            placeholder="Consider this as a Primary Id"
                                                            variant="outlined"
                                                            size="small"
                                                            style={{ padding: '0px' }}
                                                            checked={isPrimaryID}
                                                            // onChange={handleChange1}
                                                            value={isPrimaryID}
                                                            color="primary"
                                                            onChange={(event) => {
                                                                setIsPrimaryID(event.target.checked)
                                                            }
                                                            }
                                                        />
                                                        &nbsp;
                                                        <label >
                                                            Consider this as a Preferred
                                                        </label>
                                                    </div>
                                                </Grid>
                                                <br />
                                                <div className="divider" />
                                                {primaryAddress && (
                                                    <Grid container spacing={0}>
                                                        <Grid item xs={6}>
                                                            <Checkbox
                                                                id="outlined-addressSameAsEmployee"
                                                                variant="outlined"
                                                                style={addressSameAsEmployee ? { color: 'blue' } : {}}
                                                                size="small"
                                                                checked={addressSameAsEmployee ? true : false}
                                                                value={addressSameAsEmployee ? true : false}
                                                                // disabled={true}
                                                                onChange={(event) => {
                                                                    setAddressSameAsEmployee(event.target.checked);
                                                                    if (event.target.checked) {                                                                        
                                                                        setAddressLine1(primaryAddress.address1)
                                                                        setAddressLine2(primaryAddress.address2)
                                                                        setAddressLine3(primaryAddress.address3)
                                                                        setEffectiveDate(primaryAddress.effectiveDate)
                                                                        setStatus(primaryAddress.isActive)
                                                                        setIsPrimaryID(primaryAddress.isPrimary)
                                                                        setCountry(primaryAddress.country)
                                                                        setAddState(primaryAddress.state)
                                                                        const countryIdx = countries.findIndex(
                                                                            (country) => country.name === primaryAddress.country
                                                                        );
                                                                        if (countryIdx != -1) {
                                                                            setCountryIndex(countryIdx);
                                                                            const stateIdx = countries[countryIdx]?.states.findIndex(
                                                                                (state) => state === primaryAddress.state
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
                                                                        setCity(primaryAddress.city)
                                                                        setPIN(primaryAddress.PIN)
                                                                    }
                                                                    else {
                                                                        setAddressLine1('')
                                                                        setAddressLine2('')
                                                                        setCountryIndex(null);
                                                                        setCountry(null);
                                                                        setAllStates([]);
                                                                        setAddState(null);
                                                                        setStateIndex(null);
                                                                        setCity('')
                                                                        setPIN('')
                                                                    }
                                                                }}
                                                            />
                                                            &nbsp;
                                                            <label
                                                                style={{ marginTop: '15px' }}
                                                                className=" mb-2">
                                                                Address Same as {primaryAddress.addressType} Address
                                                            </label>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                                <Grid item md={6}>
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
                                                        error={isSubmitted && ((status === '') ? true : false)}
                                                        helperText={
                                                            isSubmitted && ((status === '') ? 'Field is Mandatory' : '')
                                                        }
                                                        fullWidth
                                                        select
                                                        size="small"
                                                        value={(status === '') ? '' : (status ? true : false)}
                                                        onChange={(event) => {
                                                            setStatus(event.target.value);
                                                        }}>
                                                        {currentStatus.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
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
                                                                label="Select Country"
                                                                variant="outlined"
                                                                fullWidth
                                                                size="small"
                                                                name="country"
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
                                                        City *
                                                    </label>
                                                    <TextField
                                                        id="outlined-city"
                                                        placeholder="Select City"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        name="city"
                                                        value={city}
                                                        error={
                                                            isSubmitted && (city ? false : true)
                                                        }
                                                        helperText={
                                                            isSubmitted &&
                                                            (city ? '' : 'Field is Mandatory')
                                                        }
                                                        onChange={(event) => {
                                                            setCity(event.target.value);
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <label
                                                        style={{ marginTop: '15px' }}
                                                        className=" mb-2">
                                                        Pin Code
                                                    </label>
                                                    <TextField
                                                        id="outlined-PIN"
                                                        placeholder="Select Pin Code"
                                                        type="text"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        value={PIN}
                                                        onChange={(event) => {
                                                            setPIN(event.target.value);
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <label
                                                        style={{ marginTop: '15px' }}
                                                        className=" mb-2">
                                                        Address Line 1
                                                    </label>
                                                    <TextField
                                                        id="outlined-addressLine1"
                                                        placeholder="Address Line 1"
                                                        type="text"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        value={addressLine1}
                                                        onChange={(event) => {
                                                            setAddressLine1(event.target.value);
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <label
                                                        style={{ marginTop: '15px' }}
                                                        className=" mb-2">
                                                        Address Line 2
                                                    </label>
                                                    <TextField
                                                        id="outlined-addressLine2"
                                                        placeholder="Address Line 2"
                                                        type="text"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        value={addressLine2}
                                                        onChange={(event) => {
                                                            setAddressLine2(event.target.value);
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={6}>
                                                    <label
                                                        style={{ marginTop: '15px' }}
                                                        className="mb-2">
                                                        Address Line 3
                                                    </label>
                                                    <TextField
                                                        id="outlined-addressLine3"
                                                        placeholder="Address Line 3"
                                                        type="text"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        value={addressLine3}
                                                        onChange={(event) => {
                                                            setAddressLine3(event.target.value);
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <div className="divider" />
                                            <div className="divider" />
                                            <div
                                                className="float-right"
                                                style={{ marginRight: '2.5%' }}>
                                                <Button
                                                    className="btn-primary mb-2 m-2"
                                                    onClick={() => {
                                                        toggleAccordion(0)
                                                        setIsEditAddress(false)
                                                        setCurrentStatus([{ label: 'Active', value: true }])
                                                        setAddressType('')
                                                        setEffectiveDate(null)
                                                        setStatus(true)
                                                        setIsPrimaryID('')
                                                        setCountry('')
                                                        setCity('')
                                                        setAddState('')
                                                        setPIN('')
                                                        setAddressLine1('')
                                                        setAddressLine2('')
                                                        setAddressLine3('')
                                                        setAddressSameAsEmployee(false)
                                                        reState()
                                                    }}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="btn-primary mb-2 m-2"
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
                                onClose={toggle3}
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
                                            onClick={toggle3}
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
                </form>
            </Card>
        </BlockUi >
    );
};

const mapStateToProps = (state) => ({
    countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreateAddAddress);
