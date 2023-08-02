import React from "react";
import {
    Button,
    Card,
    Checkbox,
    Grid,
    TextField,
    Table,
    Collapse,
    Snackbar,
    Dialog,
    InputAdornment
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import avatar4 from '../../assets/images/avatars/avatar4.jpg';
import { connect } from 'react-redux';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';


const EmployeeEmailHistory = (props) => {
    const {
        selectedEmployeeInfoHistory,
        create,
        employeeUUID,
        savedEmployeeInfoHistoryDetails,
        setSavedEmployeeInfoHistoryDetails,
        setEmployeeInfoHistoryDetails,
        setSelectedEmployeeInfoHistory,
        setState
    } = props;

    const [typeEmail, setTypeEmail] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState();
    const [isPrimaryIdEmail, setIsPrimaryIdEmail] = useState(false);
    const [email, setEmail] = useState();
    const [effectiveDate, setEffectiveDate] = useState(new Date());
    const [isSubmitted, setIsSubmitted] = useState();
    const [reason, setReason] = useState();


    const [deleteModal, setDeleteModal] = useState(false);
    const deleteModaltoggle = () => setDeleteModal(!deleteModal);
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


    //For Email validation
    const validationSchema = yup.object({
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
    })

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            // Handle Submit
        },
    });
    const getObjByValue = (arr, value) => {
        return value ? arr.find((x) => x.value == value) : {};
    };


    useEffect(() => {
        if (create != null && !create) {
            setTypeEmail(selectedEmployeeInfoHistory.historyObject.type);
            setEmail(selectedEmployeeInfoHistory.historyObject.email)
            formik.values.email = selectedEmployeeInfoHistory.historyObject.email
            setEffectiveDate(
                new Date(selectedEmployeeInfoHistory.effectiveDate));
            setIsPrimaryIdEmail(selectedEmployeeInfoHistory.historyObject.isPreferred)
            setReason(selectedEmployeeInfoHistory.reason);
        }
    }, []);
    const save = () => {
        setIsSubmitted(true);
        const emailHistoryObj = {
            employeeUUID: employeeUUID,
            email: formik.values.email,
            type: typeEmail,
            isPreferred: isPrimaryIdEmail,
            effectiveDate: effectiveDate,
            reason: reason
        };
        
        saveHistoryObject(emailHistoryObj)
    }

    const saveHistoryObject = (emailHistoryObj) => {
        if (create) {
            apicaller('post', `${BASEURL}/employeeEmail/save`, emailHistoryObj)
                .then((res) => {
                    if (res.status === 200) {
                        let emailhistory = {
                            uuid: res.data.historyUUID,
                            documentUUID: res.data.uuid,
                            effectiveDate: emailHistoryObj.effectiveDate,
                            reason: emailHistoryObj.reason,
                            historyObject: {
                                type: res.data.type,
                                email: res.data.email,
                                isPreferred: res.data.isPreferred
                            }
                        }
                        setEmployeeInfoHistoryDetails([
                            null,
                            emailhistory,
                            ...savedEmployeeInfoHistoryDetails
                        ]);
                        setSavedEmployeeInfoHistoryDetails([
                            emailhistory,
                            ...savedEmployeeInfoHistoryDetails
                        ]);
                        setSelectedEmployeeInfoHistory(emailhistory);
                        setState({
                            open: true,
                            message: 'Employee Email Created Sucessfully',
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });
                    }
                })
                .catch((err) => {
                    console.log('getEmployeeInfoHistory err', err);
                    setState({
                        open: true,
                        message: 'Error occured while creating Employee Email '+err?.response?.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                });
        }
        else {
            emailHistoryObj.historyUUID = selectedEmployeeInfoHistory.uuid;
            emailHistoryObj.uuid = selectedEmployeeInfoHistory.documentUUID;
            apicaller('put', `${BASEURL}/employeeEmail/update`, emailHistoryObj)
                .then((res) => {
                    if (res.status === 200) {
                        selectedEmployeeInfoHistory.historyObject.type = typeEmail;
                        selectedEmployeeInfoHistory.historyObject.email = formik.values.email;
                        selectedEmployeeInfoHistory.historyObject.isPreferred = isPrimaryIdEmail;
                        selectedEmployeeInfoHistory.effectiveDate = effectiveDate;
                        selectedEmployeeInfoHistory.reason = reason;
                        if(isPrimaryIdEmail){
                            savedEmployeeInfoHistoryDetails.forEach(
                                (historyDetail) =>{
                                    historyDetail.historyObject.isPreferred = historyDetail == selectedEmployeeInfoHistory
                                    }
                            );
                        }
                        setState({
                            open: true,
                            message: 'Employee Email Corrected Sucessfully',
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });
                    }
                })
                .catch((err) => {
                    console.log('getEmployeeInfoHistory err', err);
                    setState({
                        open: true,
                        message: 'Error occured while Correcting Employee Email '+err?.response?.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                });
        }
    };
    const deleteEmail = () => {
        setDeleteModal(false);
        apicaller(
            'delete',
            `${BASEURL}/employeeEmail/delete/` +
            selectedEmployeeInfoHistory.documentUUID,
            { reason: reason }
        )
            .then((res) => {
                if (res.status === 200) {
                    const filteredHistory = savedEmployeeInfoHistoryDetails.filter(
                        (historyDetail) =>
                            historyDetail.uuid != selectedEmployeeInfoHistory.uuid
                    );
                    setEmployeeInfoHistoryDetails([null, ...filteredHistory]);
                    setSavedEmployeeInfoHistoryDetails(filteredHistory);
                    setSelectedEmployeeInfoHistory(null);
                    setState({
                        open: true,
                        message: 'Employee Email History Deleted Sucessfully',
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                }
            })
            .catch((err) => {
                console.log('getEmployeeInfoHistory err', err);
                setState({
                    open: true,
                    message: err?.response?.data?.message,
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                });
            });
    };
    return (

        <Grid item lg={12}>
            <div>
                <h4 style={{
                    color: 'blue'
                }}>Change Employee's Email</h4>
                <br />
                <Grid container spacing={2}>
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
                            defaultValue={getObjByValue(emailTypeArray, typeEmail)}
                            value={getObjByValue(emailTypeArray, typeEmail)}
                            getOptionLabel={(option) => (option.value ? option.value : '')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="select Email Type"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="typeEmail"
                                    // value={typeEmail}
                                    error={
                                        isEmailSubmitted && (typeEmail ? false : true)
                                    }
                                    helperText={
                                        isEmailSubmitted &&
                                        (typeEmail ? '' : 'Field is Mandatory')
                                    }
                                />
                            )}
                            onChange={(event, value) => {
                                setTypeEmail(value.value);
                            }}
                        />
                    </Grid>
                    <Grid item md={6}>
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
                            helperText={formik.touched.email ? (formik.values.email.length == 0 ? "Field is Required" : Boolean(formik.errors.email) ? "Invalid Email" : null) : null}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <label className=" mb-2">Effective As of *</label>
                        <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            style={{ margin: '0%' }}>
                            <KeyboardDatePicker
                                style={{ margin: '0%' }}
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="outlined-effectiveDate"
                                fullWidth
                                size="small"
                                value={effectiveDate}
                                name='effectiveDate'
                                onChange={(event) => {
                                    setEffectiveDate(event);
                                }}
                                error={isSubmitted && (effectiveDate ? false : true)}
                                helperText={
                                    isSubmitted &&
                                    (effectiveDate ? '' : 'Effective Date is Mandatory')
                                }
                                KeyboardButtonProps={{
                                    'aria-label': 'change date'
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item md={6}  >
                        <div style={{
                            bottom: '10px',
                            position: 'absolute'
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
                    <Grid item md={6}>
                        <label className=" mb-2">Reason for Change *</label>
                        <TextField
                            id="outlined-reason"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="reason"
                            value={reason}
                            onChange={(event) => {
                                setReason(event.target.value);
                            }}
                            helperText={
                                isSubmitted && (!reason || reason === '')
                                    ? 'Reason is required'
                                    : ''
                            }
                            error={
                                isSubmitted && (!reason || reason === '') ? true : false
                            }
                        />
                    </Grid>
                </Grid>
                <br />
                <div className="float-left">
                    <Button className="btn-primary mb-2 m-2" onClick={(e) => save(e)}>
                        {create ? 'Add New Email' : 'Correct History'}
                    </Button>
                    {!(
                        create ||
                        savedEmployeeInfoHistoryDetails[
                            savedEmployeeInfoHistoryDetails.length - 1
                        ].uuid == selectedEmployeeInfoHistory.uuid
                    ) && (
                            <Button
                                className="btn-primary mb-2 m-2"
                                onClick={(e) => setDeleteModal(true)}>
                                Delete History
                            </Button>
                        )}
                    <Button
                        className="btn-primary mb-2 mr-3 m-2"
                        component={NavLink}
                        to={'./employeeDetails'}>
                        Cancel
                    </Button>
                </div>
            </div>
            <Dialog
                open={deleteModal}
                onClose={deleteModaltoggle}
                classes={{ paper: 'shadow-lg rounded' }}>
                <div className="text-center p-5">
                    <div className="avatar-icon-wrapper rounded-circle m-0">
                        <div className="d-inline-flex justify-content-center p-0 rounded-circle btn-icon avatar-icon-wrapper bg-neutral-danger text-danger m-0 d-130">
                            <FontAwesomeIcon
                                icon={['fas', 'times']}
                                className="d-flex align-self-center display-3"
                            />
                        </div>
                    </div>
                    <h4 className="font-weight-bold mt-4">
                        Are you sure you want to delete this History?
                    </h4>
                    <p className="mb-0 font-size-lg text-muted">
                        You cannot undo this operation.
                    </p>
                    <div className="pt-4">
                        <Button
                            onClick={deleteModaltoggle}
                            className="btn-neutral-secondary btn-pill mx-1">
                            <span className="btn-wrapper--label">Cancel</span>
                        </Button>
                        <Button
                            onClick={(e) => deleteEmail(e)}
                            className="btn-danger btn-pill mx-1">
                            <span className="btn-wrapper--label">Delete</span>
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Grid>
    )
}
const mapStateToProps = (state) => ({
    selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeEmailHistory);
