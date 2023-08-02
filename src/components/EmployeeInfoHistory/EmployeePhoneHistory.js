import React from "react";
import {
    Button,
    Checkbox,
    Grid,
    TextField,
    Dialog,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BlockUi from 'react-block-ui';
import { connect } from 'react-redux';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useFormik } from 'formik';
import * as yup from 'yup';
const EmployeePhoneHistory = (props) => {
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
    const [isPhoneSubmitted, setIsPhoneSubmitted] = useState();
    const [typePhone, setTypePhone] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();
    const [isPrimaryIdPhoneNumber, setIsPrimaryIdPhoneNumber] = useState(false);
    const [effectiveDate, setEffectiveDate] = useState(new Date());
    const [isSubmitted, setIsSubmitted] = useState();
    const [reason, setReason] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteModaltoggle = () => setDeleteModal(!deleteModal);

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

    //For Phone validation
    const validationSchema = yup.object({
        phoneNumber: yup
            .string('Please enter a valid phone number')
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(10, 'Must be exactly 10 digits')
            .max(10, 'Must be exactly 10 digits')
            // .phoneNumber("US", "Please enter a valid phone number")
            .required("A phone number is required"),
    });

    const formik = useFormik({
        initialValues: {
            phoneNumber: '',
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
            setTypePhone(selectedEmployeeInfoHistory.historyObject.type);
            formik.values.phoneNumber = selectedEmployeeInfoHistory.historyObject.phoneNumber
            setEffectiveDate(
                new Date(selectedEmployeeInfoHistory.effectiveDate));
            setIsPrimaryIdPhoneNumber(selectedEmployeeInfoHistory.historyObject.isPreferred)
            setReason(selectedEmployeeInfoHistory.reason);
        }
    }, [])

    const save = () => {
        setIsSubmitted(true);
        const phoneHistoryObj = {
            employeeUUID: employeeUUID,
            phoneNumber: formik.values.phoneNumber,
            type: typePhone,
            isPreferred: isPrimaryIdPhoneNumber,
            effectiveDate: effectiveDate,
            reason: reason
        };
        saveHistoryObject(phoneHistoryObj)
    }

    const saveHistoryObject = (phoneHistoryObj) => {
        if (create) {
            apicaller('post', `${BASEURL}/employeePhone/save`, phoneHistoryObj)
                .then((res) => {
                    if (res.status === 200) {
                        let phonehistory = {
                            uuid: res.data.historyUUID,
                            documentUUID: res.data.uuid,
                            effectiveDate: phoneHistoryObj.effectiveDate,
                            reason: phoneHistoryObj.reason,
                            historyObject: {
                                type: res.data.type,
                                phoneNumber: res.data.phoneNumber,
                                isPreferred: res.data.isPreferred
                            }
                        }
                        setEmployeeInfoHistoryDetails([
                            null,
                            phonehistory,
                            ...savedEmployeeInfoHistoryDetails
                        ]);
                        setSavedEmployeeInfoHistoryDetails([
                            phonehistory,
                            ...savedEmployeeInfoHistoryDetails
                        ]);
                        setSelectedEmployeeInfoHistory(phonehistory);
                        setState({
                            open: true,
                            message: 'Employee Phone Number Created Sucessfully',
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
                        message: 'Error occured while creating Employee Phone Number '+err?.response?.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                });
        }
        else {
            phoneHistoryObj.historyUUID = selectedEmployeeInfoHistory.uuid;
            phoneHistoryObj.uuid = selectedEmployeeInfoHistory.documentUUID;
            apicaller('put', `${BASEURL}/employeePhone/update`, phoneHistoryObj)
                .then((res) => {
                    if (res.status === 200) {
                        selectedEmployeeInfoHistory.historyObject.type = typePhone;
                        selectedEmployeeInfoHistory.historyObject.phoneNumber = formik.values.phoneNumber;
                        selectedEmployeeInfoHistory.historyObject.isPreferred = isPrimaryIdPhoneNumber;
                        selectedEmployeeInfoHistory.effectiveDate = effectiveDate;
                        selectedEmployeeInfoHistory.reason = reason;
                        if(isPrimaryIdPhoneNumber){
                            savedEmployeeInfoHistoryDetails.forEach(
                                (historyDetail) =>{
                                    historyDetail.historyObject.isPreferred = historyDetail == selectedEmployeeInfoHistory
                                    }
                            );
                        }
                        setState({
                            open: true,
                            message: 'Employee Phonenumber Corrected Sucessfully',
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
                        message: 'Error occured while Correcting Employee Phone Number '+err?.response?.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                });
        }
    };
    const deletePhone = () => {
        setDeleteModal(false);
        apicaller(
            'delete',
            `${BASEURL}/employeePhone/delete/` +
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
                        message: 'Employee Phone Number History Deleted Sucessfully',
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
        <Grid lg={12}>
            <div>
                <h4
                    style={{
                        color: 'blue'
                    }}>
                    Change Employee's PhoneNumber
                </h4>
                <Grid container spacing={2}>
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
                            defaultValue={getObjByValue(phoneTypeArray, typePhone)}
                            value={getObjByValue(phoneTypeArray, typePhone)}
                            getOptionLabel={(option) => (option.value ? option.value : '')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Phone Type"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="typePhone"
                                    // value={typePhone}
                                    error={
                                        isPhoneSubmitted &&
                                        (typePhone ? false : true)
                                    }
                                    helperText={
                                        isPhoneSubmitted &&
                                        (typePhone
                                            ? ''
                                            : 'Field is Mandatory')
                                    }
                                />
                            )}
                            onChange={(event, value) => {
                                setTypePhone(value.value);
                            }}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <label
                            style={{ marginTop: '15px' }}
                            className=" mb-2">
                            Phone Number *
                        </label>
                        <TextField
                            id="outlined-phoneNumber"
                            placeholder="phoneNumber"
                            type="text"
                            variant="outlined"
                            fullWidth
                            required
                            size="small"
                            name='phoneNumber'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phoneNumber}
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                            helperText={formik.touched.phoneNumber ? (formik.values.phoneNumber?.length == 0 ? 'Field is Required' : Boolean(formik.errors.phoneNumber) ? 'Invalid Phone Number' : null) : null}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <label className=" mb-2">Effective As of</label>
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
                                    id="outlined-isPrimaryPhone"
                                    className="align-self-start"
                                    placeholder="Consider this as a Primary Card"
                                    variant="outlined"
                                    size="small"
                                    style={{ padding: '0px' }}
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
                    <Grid item md={8}>
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
                        {create ? 'Add New Phone' : 'Correct History'}
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
                            onClick={(e) => deletePhone(e)}
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
)(EmployeePhoneHistory);

