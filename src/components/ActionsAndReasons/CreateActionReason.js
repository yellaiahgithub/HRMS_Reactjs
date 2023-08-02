import { Box, Button, Card, Grid, MenuItem, TextField, Snackbar } from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router, Link,
    useLocation, NavLink, useHistory
} from "react-router-dom";
import apicaller from 'helper/Apicaller';
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';

// toast.configure()

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
const CreateActionReason = (props) => {
    const { selectedCompany } = props;
    const history = useHistory()

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
    const [asOfDateValidationError, setasOfDateValidationError] = useState();
    const [isSubmitted, setIsSubmitted] = useState();

    const [selectAction, setSelectAction] = useState();
    const [reasonCode, setReasonCode] = useState();
    const [reasonName, setReasonName] = useState();
    const [description, setDescription] = useState();
    const [asOfDate, setAsOfDate] = useState(null);
    const [status, setStatus] = useState(true);
    const [statusArray, setStatusArray] = useState([{ label: 'Active', value: true }])
    const [blocking, setBlocking] = useState(false)
    const companyRegDate = new Date(selectedCompany.registrationDate);
    const [actionsArr, setActionsArr] = useState([])
    const handleClose = () => {
        setState({ ...state, open: false })
    }

    useEffect(() => {
        getActions();
    }, []);

    const getActions = () => {
        setBlocking(true)
        apicaller('get', `${BASEURL}/action/find`)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    setActionsArr(res.data)
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('err', err)
              })
    }

    let query = null;//new URLSearchParams(useLocation().search);
    // console(query); 
    // const id=query?.get("id")||null
    const save = (e) => {
        e.preventDefault();
        //to do service call

        setIsSubmitted(true);

        if (!selectAction && !reasonCode && !reasonCode && !asOfDate && !status) {
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
            actionCode: selectAction,
            reasonCode: reasonCode,
            reasonName: reasonName,
            description: description ? description : "",
            effectiveDate: asOfDate,
            status: (status === 'active' || status === true) ? true : false
        }
        apicaller('post', `${BASEURL}/reason`, inputObj)
            .then(res => {
                if (res.status === 200) {
                    // console.log('res.data', res.data)
                    setState({
                        open: true,
                        message: 'Reason Created Successfully',
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
                console.log('create reason err', err)
                setState({
                    open: true,
                    message: err.response.data,
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                })
            })
    }
    return (
        <>
            <BlockUi
                className='p-5'
                tag='div'
                blocking={blocking}
                loader={
                    <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
                }>
                <Card>
                    <h5 className='m-4'>
                        <center>Create Action Reason</center>
                    </h5>
                    <br />
                    <Grid container spacing={0} >
                        <Grid item md={10} lg={7} xl={8} className="mx-auto">
                            <label style={{ marginTop: "15px" }} className="mb-2">
                                Select Action *
                            </label>
                            <TextField
                                id="outlined-selectAction"
                                // required
                                label={selectAction ? "" : "Select Action"}
                                variant="outlined"
                                error={isSubmitted && (selectAction ? false : true)}
                                helperText={isSubmitted && (selectAction ? "" : "Field is Mandatory")}
                                fullWidth
                                select
                                size="small"
                                value={selectAction}
                                onChange={(event) => {
                                    setSelectAction(event.target.value);
                                }}
                            >
                                {actionsArr.map((item) => (
                                    <MenuItem key={item.actionCode} value={item.actionCode}>
                                        {item.actionName}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <div>
                                <label style={{ marginTop: "15px" }} className="mb-2">
                                    Reason Code *
                                </label>
                                <TextField
                                    id="outlined-reasonCode"
                                    placeholder="Reason Code"
                                    type="text"
                                    variant="outlined"
                                    error={isSubmitted && (reasonCode ? false : true)}
                                    helperText={isSubmitted && (reasonCode ? "" : "Field is Mandatory")}
                                    fullWidth
                                    size="small"
                                    value={reasonCode}
                                    onChange={(event) => {
                                        const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                                        setReasonCode(result.toUpperCase());
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ marginTop: "15px" }} className="mb-2">
                                    Reason Name *
                                </label>
                                <TextField
                                    id="outlined-reasonName"
                                    placeholder="Reason Name"
                                    type="text"
                                    variant="outlined"
                                    error={isSubmitted && (reasonName ? false : true)}
                                    helperText={isSubmitted && (reasonName ? "" : "Field is Mandatory")}
                                    fullWidth
                                    size="small"
                                    value={reasonName}
                                    onChange={(event) => {
                                        setReasonName(event.target.value);
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ marginTop: "15px" }} className="mb-2">
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
                                    <label style={{ marginTop: "15px" }} className="mb-2">
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
                                            placeholder=' As Of Date '
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
                                            } />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>
                                        <label style={{ marginTop: "15px" }} className="mb-2">
                                            Status *
                                        </label>
                                        <TextField
                                            id="outlined-status"
                                            // required
                                            label={status ? "" : "Select Status"}
                                            variant="outlined"
                                            error={isSubmitted && (status ? false : true)}
                                            helperText={isSubmitted && (status ? "" : "Field is Mandatory")}
                                            fullWidth
                                            select
                                            size="small"
                                            value={status}
                                            onChange={(event) => {
                                                setStatus(event.target.value);
                                            }}
                                        >
                                            {statusArray.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </Grid>
                            </Grid>

                            <br />
                            <Box textAlign='right'>
                            <Button className="btn-primary mb-2  mr-3" component={NavLink} to="./ActionsAndReasons">
                                    Cancel
                                </Button>
                                <Button onClick={(e) => save(e)} className="btn-primary mb-2 mr-3">
                                    Create Reason
                                </Button>                               
                            </Box>
                        </Grid>
                    </Grid>
                    {/* </Grid> */}
                    <br />
                    <br />
                </Card>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    key={`${vertical},${horizontal}`}
                    open={open}
                    classes={{ root: toastrStyle }}
                    onClose={handleClose}
                    message={message}
                    autoHideDuration={2000}
                />
            </BlockUi>
        </>
    );
}

const mapStateToProps = (state) => ({
    selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateActionReason);