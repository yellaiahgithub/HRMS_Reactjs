import React, { useState, useEffect } from 'react'
import {
    Button,
    Card,
    Grid,
    Snackbar,
    Switch,
    TextField,

} from '@material-ui/core';
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'
import BlockUi from 'react-block-ui'
import { connect } from 'react-redux'
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const SubmitRegistration = ({ employeeDetails }) => {
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };
    const [reasonResignation, setReasonResignation] = useState(null);
    const [details, setDetails] = useState('');
    const [lastWorkingDateEmployee, setLastWorkingDateEmployee] = useState(null);
    const [requestEarlyExit, setRequestEarlyExit] = useState(false);
    const [reasonEarlyExit, setReasonEarlyExit] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState();
    const [allowEarlyExit, setAllowEarlyExit] = useState();
    const [lastWorkingDayAsPerPolicy, setLastWorkingDayAsPerPolicy] = useState();
    const [noticePeriodAsPerPolicy, setNoticePeriodAsPerPolicy] = useState({ value: '', unit: '' });
    const [resignationReasons, setResignationReasons] = useState([]);
    const [noticePeriodAsPerFallingDays, setNoticePeriodAsPerFallingDays] = useState(null);
    const [todaysDate,setTodaysDate]=useState();
    useEffect(() => {
        const date=new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        setTodaysDate(date)
        getReasonForResignation();
    }, []);

    const getReasonForResignation = () => {
        apicaller('get', `${BASEURL}/separationControl/fetchNoticePeriordDetailsByEmployeeUUID/${employeeDetails.uuid}`)
            .then(res => {
                if (res.status === 200) {
                    setAllowEarlyExit(res.data.allowEarlyExit)
                    setLastWorkingDayAsPerPolicy(res.data.lastWorkingDay)
                    setNoticePeriodAsPerPolicy(res.data.noticePeriod)
                    setResignationReasons(res.data.resignationReasons)
                }
            })
            .catch(err => {
                console.log('Fetch error', err);
            })
    }

    const save = (e) => {
        e.preventDefault();
        
        setIsSubmitted(true);
        let isValid = true;
        if(requestEarlyExit){
            if ( (lastWorkingDateEmployee == null || lastWorkingDateEmployee.length == 0)) {
                isValid = false;
            }
            else if(new Date(lastWorkingDateEmployee) < todaysDate){
                isValid=false;
            }
            if (reasonEarlyExit == null || reasonEarlyExit.length == 0) {
                isValid = false;
            }
        }
        if (reasonResignation == null || reasonResignation == 0) {
            isValid = false;
        }
        if (details == null || details.length == 0) {
            isValid = false;
        }
        //to do service call
        const data = {
            employeeUUID: employeeDetails.uuid,
            reasonCode: reasonResignation?.code,
            details: details,
            noticePeriodAsPerPolicy: noticePeriodAsPerPolicy,
            lastWorkingDateAsPerPolicy: new Date(lastWorkingDayAsPerPolicy),
            isEarlyExit: requestEarlyExit,
            lastWorkingDateAsPerEmployee: requestEarlyExit ? lastWorkingDateEmployee : null,
            reasonForEarlyExit: requestEarlyExit ? reasonEarlyExit : '',
            submittedBy: "Employee",
            createdBy: employeeDetails.uuid,
            lastWorkingDate: requestEarlyExit ? lastWorkingDateEmployee : new Date(lastWorkingDayAsPerPolicy)
        }
        if (isValid) {
            apicaller('post', `${BASEURL}/resignation/save`, data)
                .then(res => {
                    if (res.status === 200) {
                        setState({
                            open: true,
                            message: 'Resignation Submitted Sucessfully',
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        })
                        resetForm()
                    }
                })
                .catch(err => {
                    console.log('Error', err);
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
    }

    const getDateDifference = (startDate, endDate) => {
        // Convert the dates to milliseconds
        var startMillis = new Date(startDate)
        var endMillis = new Date(endDate)
        startMillis.setUTCHours(0, 0, 0, 0);
        endMillis.setUTCHours(0, 0, 0, 0);
        // Calculate the difference in milliseconds
        var differenceMillis = startMillis.getTime() > endMillis.getTime() ? startMillis.getTime() - endMillis.getTime() : endMillis.getTime() - startMillis.getTime();

        // Convert milliseconds to days
        var days = Math.floor(differenceMillis / (1000 * 60 * 60 * 24));
        setNoticePeriodAsPerFallingDays(days)
        // return days;
    }


    const getParsedDate = date => {
        if (date !== null && date !== '') {
            return new Date(date).toLocaleDateString('af-ZA', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            })
        } else {
            return ''
        }
    }

    const resetForm = () => {
        setReasonResignation(null)
        setDetails("")
        setLastWorkingDateEmployee(null)
        setRequestEarlyExit(false)
        setReasonEarlyExit(null)
        // getReasonForResignation()
        setIsSubmitted(false)
    }
    return (
        <>
            <Card className="card-box shadow-none">
                <div className="d-flex justify-content-between px-4 py-3">

                    <Grid container>
                        <Grid item md={12} style={{ display: 'contents' }}>
                            <Grid item md={6}>
                                <label
                                    style={{ marginTop: '15px' }}
                                    className='font-weight-normal mb-2'>
                                    Reason For Resignation *
                                </label>
                                <Autocomplete
                                    id='combo-box-demo'
                                    select
                                    options={resignationReasons}
                                    getOptionLabel={option =>
                                        option.name
                                    }
                                    value={reasonResignation}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label='Select Reason For Resignation'
                                            variant='outlined'
                                            fullWidth
                                            size='small'
                                            value={reasonResignation}
                                            error={isSubmitted && (reasonResignation ? false : true)}
                                            helperText={
                                                isSubmitted && (reasonResignation ? '' : 'Field is Mandatory')
                                            }
                                        />
                                    )}
                                    onChange={(event, value) => {
                                        setReasonResignation(value)
                                    }}
                                />
                            </Grid>
                            <Grid item md={12}>
                                <label className='mb-2 ' style={{ marginTop: '15px' }}>
                                    Details *
                                </label>
                                <TextField
                                    placeholder="Details"
                                    multiline
                                    rows="4"
                                    fullWidth
                                    error={isSubmitted && (details ? false : true)}
                                    helperText={
                                        isSubmitted && (details ? '' : 'Field is Mandatory')
                                    }
                                    value={details}
                                    onChange={(event) => setDetails(event.target.value)
                                        // if (event.target && event.target.value) {
                                        //     setDetails(event.target.value);
                                        //         }
                                    }
                                    // defaultValue={this.state.value}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item md={6}>
                                <div>
                                    <label className='mb-2 ' style={{ marginTop: '15px' }}>
                                        Notice Period as per policy
                                        <span style={{ fontWeight: '700', marginLeft: '20px' }}>
                                            {noticePeriodAsPerPolicy?.value} {noticePeriodAsPerPolicy?.unit}
                                        </span>
                                    </label>
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <div>
                                    <label className='mb-2 ' style={{ marginTop: '15px' }}>
                                        Last working day as per policy
                                        <span style={{ fontWeight: '700', marginLeft: '20px' }}>
                                            {getParsedDate(lastWorkingDayAsPerPolicy)}
                                        </span>
                                    </label>
                                </div>
                            </Grid>
                            {allowEarlyExit && (
                                <Grid item container direction="row" spacing={6} justify="flex-end" alignItems="center">
                                    <Grid item md={12}>
                                        <div className='d-flex'>
                                            <Grid item md={6}>
                                                <Switch
                                                    value={requestEarlyExit}
                                                    checked={requestEarlyExit}
                                                    onChange={(event) => {
                                                        setRequestEarlyExit(event.target.checked);
                                                        if(!event.target.checked){
                                                            setLastWorkingDateEmployee(null);
                                                            setReasonEarlyExit(null);
                                                            setNoticePeriodAsPerFallingDays(null);
                                                        }
                                                    }}
                                                    name='requestEarlyExit'
                                                    color='primary'
                                                    className="switch-small"
                                                />
                                                <label className="ml-3 mb-3">
                                                    Request For early exit
                                                </label>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>
                            )}
                            {requestEarlyExit && (
                                <>
                                    <Grid item md={6}>
                                        <div>
                                            <label style={{ marginTop: "15px" }} className="mb-2">
                                                Last working day as per employee *
                                            </label>
                                            <MuiPickersUtilsProvider
                                                utils={DateFnsUtils}
                                                style={{ margin: '0%' }}>
                                                <KeyboardDatePicker
                                                    style={{
                                                        margin: '0%', width: '300px',
                                                        display: 'block'
                                                    }}
                                                    disableToolbar
                                                    inputVariant='outlined'
                                                    format='dd/MM/yyyy'
                                                    margin='normal'
                                                    minDate={todaysDate}
                                                    id='date-picker-inline'
                                                    placeholder='Last Working Date'
                                                    fullWidth
                                                    size='small'
                                                    value={lastWorkingDateEmployee}
                                                    onChange={event => {
                                                        setLastWorkingDateEmployee(event);
                                                        getDateDifference(lastWorkingDayAsPerPolicy, event)
                                                    }}
                                                    error={
                                                        isSubmitted && requestEarlyExit && (todaysDate>new Date(lastWorkingDateEmployee)|| lastWorkingDateEmployee==null ||lastWorkingDateEmployee.length==0) ? true : false
                                                    }
                                                    helperText={
                                                        isSubmitted && requestEarlyExit ? ((lastWorkingDateEmployee==null ||lastWorkingDateEmployee.length==0) ? 'Field is Mandatory' : todaysDate>new Date(lastWorkingDateEmployee)?`Last working Date can not be less than today's date`:``):''
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
                                            {lastWorkingDateEmployee && lastWorkingDayAsPerPolicy && (
                                                <label className='mb-2 ' style={{ marginTop: '15px' }}>
                                                    Notice Period falling short by
                                                    <span style={{ fontWeight: '700', marginLeft: '20px' }}>
                                                        {noticePeriodAsPerFallingDays}&nbsp;Days
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item md={12}>
                                        <label
                                            style={{ marginTop: '15px' }}
                                            className=" mb-2">
                                            Reason For Early Exit *
                                        </label>
                                        <TextField
                                            id="outlined-city"
                                            placeholder="Reason For Early Exit"
                                            variant="outlined"
                                            fullWidth
                                            rows="4"
                                            multiline
                                            name="reasonEarlyExit"
                                            value={reasonEarlyExit}
                                            error={
                                                isSubmitted && requestEarlyExit && (reasonEarlyExit==null ||reasonEarlyExit.length==0) ? true : false
                                            }
                                            helperText={
                                                isSubmitted && requestEarlyExit && (reasonEarlyExit==null ||reasonEarlyExit.length==0) ? 'Field is Mandatory' :''
                                            }
                                            onChange={(event) => {
                                                setReasonEarlyExit(event.target.value);
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                            <div className="divider" />
                            <div
                                className="float-right pt-3"
                                style={{ marginRight: '2.5%' }}>
                                <Button
                                    className="btn-primary mb-2 m-2"
                                    type="submit"
                                    onClick={save}>
                                    Submit
                                </Button>
                                <Button
                                    onClick={resetForm}
                                    className="btn-secondary mb-2 m-2">
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
                    </Grid >
                </div>
            </Card >
        </>
    )
}
const mapStateToProps = state => ({
    user: state.Auth.user,
})
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(SubmitRegistration)