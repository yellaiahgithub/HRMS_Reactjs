import { Card, Grid, TextField, Button, MenuItem, Snackbar } from "@material-ui/core";
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import BlockUi from 'react-block-ui'
import { ClimbingBoxLoader } from 'react-spinners'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { connect } from "react-redux";
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';

const LeaveTypes = (props) => {
    const { selectedCompany } = props;
    const [blocking, setBlocking] = useState(false)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id') || null;
    const readOnly =
        queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
    const edit = id ? true : false;

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state

    const [leaveID, setLeaveID] = useState()
    const [isSubmitted, setIsSubmitted] = useState(false);
    let [validDate, setValidDate] = useState(true);
    const [effectiveDate, setEffectiveDate] = useState(null)
    const [name, setName] = useState()
    const [status, setStatus] = useState(true)
    const [currentEffectiveStatus, setCurrentEffectiveStatus] = useState(
        edit ?
            [{ label: 'Active', value: true }, { label: 'InActive', value: false }]
            :
            [{ label: 'Active', value: true }]
    )
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
    const handleClose= () => {
        setState({ ...state, open: false })
    }

    const save = (e) => {
        setIsSubmitted(true)      
        e.preventDefault()
        if (leaveID && effectiveDate && name && status) {
            let inputObj = {
                id: leaveID,
                effectiveDate: effectiveDate,
                name: name,
                isActive: status,
            }
            apicaller('post', `${BASEURL}/leaveType`, inputObj)
                .then(res => {
                    if (res.status === 200 && res.data) {                    
                        setCurrentEffectiveStatus([{ label: 'Active', value: true }])
                        setLeaveID('')
                        setName('')
                        setEffectiveDate(null)
                        setIsSubmitted(false)
                        setState({
                            open: true,
                            message: `Successfully Created Leave Type`,
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });

                    }
                })
                .catch(err => {
                    console.log('err', err)
                    setBlocking(false)
                    setState({
                        open: true,
                        message: err.response.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });

                })
        }
        else {
            setState({
                open: true,
                message: 'Missing fields are required',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            })
            return
        }       
    }
    return (
        <>
            <BlockUi
                tag='div'
                blocking={blocking}
                loader={
                    <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
                }>                  
                <Card
                    style={{
                        padding: '25px',
                        border: '1px solid #c4c4c4',
                        margin: '15px'
                    }}>
                    <br />
                    <Grid container className="pl-5">
                        <Grid item container spacing={0} direction="row">
                            <Grid item md={6}>
                                <label style={{ marginTop: '15px' }} className=" mb-2">
                                    Leave ID *
                                </label>
                                <TextField
                                    id="outlined-id"
                                    placeholder="Leave ID"
                                    variant="outlined"
                                    fullWidth
                                    size="small"                             
                                    value={leaveID}
                                    error={isSubmitted && (leaveID ? false : true)}
                                    helperText={
                                        isSubmitted && (leaveID ? '' : 'Leave Id is Required')
                                    }
                                    onChange={(event) => {
                                        const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                                        setLeaveID(result.toUpperCase());
                                    }}
                                />
                            </Grid>
                            <Grid item md={3} className="mx-5">
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
                                        placeholder="Effective Date"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        minDate={selectedCompany.registrationDate}
                                        fullWidth
                                        size="small"
                                        disabled={readOnly}
                                        value={effectiveDate}
                                        onChange={(event) => {
                                            validateDate(event);
                                            setEffectiveDate(event);
                                        }}
                                        error={
                                            isSubmitted &&
                                            (!effectiveDate ||
                                                (effectiveDate instanceof Date &&
                                                    new Date(effectiveDate) <
                                                    new Date(selectedCompany.registrationDate)))
                                        }
                                        helperText={
                                            isSubmitted &&
                                            (!effectiveDate
                                                ? 'Effective Date is Required'
                                                : effectiveDate instanceof Date &&
                                                    new Date(effectiveDate) <
                                                    new Date(selectedCompany.registrationDate)
                                                    ? "As of Date Cannot be Less than Company's Registered Date"
                                                    : null)
                                        }
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={0} direction="row" className="my-4">
                            <Grid item md={6} >
                                <label style={{ marginTop: '15px' }} className=" mb-2">
                                    Name of the Leave Type *
                                </label>
                                <TextField
                                    id="outlined-name"
                                    placeholder="Enter Leave Type"
                                    variant="outlined"
                                    fullWidth
                                    size="small"                             
                                    value={name}
                                    error={isSubmitted && !name}
                                    helperText={
                                        isSubmitted && !name ? 'Name is Required' : null
                                    }
                                    onChange={(event) => {
                                        setName(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item md={3} className="mx-5">
                                <label
                                    style={{ marginTop: '15px' }}
                                    className='font-weight-normal mb-2'>
                                    Effective Status *
                                </label>
                                <TextField
                                    id='outlined-effectiveStatus'                     
                                    label={status ? '' : 'Select Effective Status'}
                                    variant='outlined'
                                    fullWidth
                                    select
                                    size='small'
                                    error={isSubmitted && ((status == true || status == false) ? false : true)}
                                    helperText={isSubmitted && ((status == true || status == false) ? '' : 'Field is Mandatory')}
                                    value={status}
                                    onChange={(event) => {
                                        setStatus(event.target.value)
                                    }}
                                >
                                    {currentEffectiveStatus.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={0} direction="row" className="my-4">
                            <div
                                className='float-right'
                                style={{ marginRight: '2.5%' }}>
                                <Button
                                    className='btn-primary mb-2 m-2'
                                    onClick={() => {
                                        setLeaveID('')                                
                                        setName('')
                                        setEffectiveDate(null)
                                        setIsSubmitted(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className='btn-primary mb-2 m-2'
                                    type='submit'
                                    disabled={!validDate}
                                    onClick={e => save(e)}
                                >
                                    Save
                                </Button>
                            </div>
                        </Grid>
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
                </Card>              
            </BlockUi>
        </>
    )
}
const mapStateToProps = (state) => ({
    selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LeaveTypes);
