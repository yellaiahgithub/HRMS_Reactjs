import React, { useEffect, useState } from "react";
import {
    Card,
    Grid,
    TextField,
    CardContent,
    Table,
    Button,
    MenuItem,
    Checkbox,
    TableContainer,
    Snackbar
} from "@material-ui/core";
import { NavLink, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'
import { Autocomplete } from "@material-ui/lab";
import noResults from '../assets/images/composed-bg/no_result.jpg'

const CreateLeaveAccumulation = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const editUUID = queryParams.get('uuid') || null;   
    const [uuid, setUUID] = useState(null);
    const [blocking, setBlocking] = useState(false)
    const [accumulationID, setAcculumationID] = useState()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [description, setDescription] = useState()
    const [leaveTypeArray, setleaveTypeArray] = useState([])
    const [leaveTypeIndex, setLeaveTypeIndex] = useState()
    const [leaveTypeUUID, setLeaveTypeUUID] = useState()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClose = () => {
        setState({ ...state, open: false })
        setAnchorEl(null)
    }

    let tempLeaveTypes = []
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;

    useEffect(() => {
        setUUID(editUUID);
        getAllLeaves()

    }, [])

    const getDataByUUID = () => {
        apicaller('get', `${BASEURL}/leaveAccumulationPolicy/fetch?uuid=` + editUUID)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data
                    setAcculumationID(data.id)
                    setLeaveTypeUUID(data.leaveTypeUUID)
                    setDescription(data.description)
                    const rules = [];
                    data.rules.forEach(rule => {
                        const ruleObj = {
                            fromService: rule.fromService,
                            toService: rule.toService,
                            carryForwardLimitValue: rule.carryForwardLimit.value,
                            carryForwardLimitUnit: rule.carryForwardLimit.unit,
                            allowAccumulation: rule.allowAccumulation,
                            accumulationLimitValue: rule.accumulationLimit.value,
                            accumulationLimitUnit: rule.accumulationLimit.unit,
                            onReachingLimit: rule.onReachingLimit
                        }
                        rules.push(ruleObj)
                    })
                    setAccumulationRulesArray(rules)
                    const tempLeaveIndx = tempLeaveTypes.findIndex(leaveType => leaveType.uuid === data.leaveTypeUUID)
                    if (tempLeaveIndx != -1) {
                        setLeaveTypeIndex(tempLeaveIndx)
                    }
                }
            })
            .catch((err) => {
                console.log('get customer err', err);
            });
    };

    const handleChangeAccumulationRules = index => e => {
        const input = e.target.value;
        let isValid = true;
        if (e.target.name === 'fromService' || e.target.name === 'toService') {
            // Check if the input is a valid positive number            
            if ((/^\d*$/.test(input)) && input === '' || (parseInt(input) > 0 && parseInt(input) <= 70)) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }
        if (e.target.name === 'carryForwardLimitValue' || e.target.name === 'accumulationLimitValue') {
            // Check if the input is a valid positive number
            if (/^\d*$/.test(input) || input === '') {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }
        if (isValid) {
            const newArray = accumulationRulesArray.map((item, i) => {
                if (index === i && e.target.name === 'allowAccumulation') {
                    return { ...item, [e.target.name]: e.target.checked }
                }
                if (index === i) {
                    return { ...item, [e.target.name]: e.target.value }
                }
                else {
                    return item
                }
            }
            )
            setAccumulationRulesArray(newArray)
        }
    }

    const carryForwardLimitUnitType = [
        { label: 'Days', value: 'Days' },
        { label: 'Weeks', value: 'Weeks' },
        { label: 'Months', value: 'Months' }
    ]
    const accumulationLimitUnitType = [
        { label: 'Days', value: 'Days' },
        { label: 'Weeks', value: 'Weeks' },
        { label: 'Months', value: 'Months' }
    ]
    const reachingLimitType = [
        { label: 'Let Lapse', value: 'Let Lapse' }
    ]
    const accumulationData = [
        {
            fromService: '',
            toService: '',
            carryForwardLimitValue: '',
            carryForwardLimitUnit: '',
            allowAccumulation: '',
            accumulationLimitValue: '',
            accumulationLimitUnit: '',
            onReachingLimit: ''
        },
    ]

    const [accumulationRulesArray, setAccumulationRulesArray] = useState(accumulationData)
    const handleAddAccumulation = () => {
        setAccumulationRulesArray([
            ...accumulationRulesArray,
            {
                fromService: '',
                toService: '',
                carryForwardLimitValue: '',
                carryForwardLimitUnit: '',
                allowAccumulation: '',
                accumulationLimitValue: '',
                accumulationLimitUnit: '',
                onReachingLimit: ''
            }
        ])
    }

    const handleRemoveAccumulation = i => {
        if (accumulationRulesArray.length !== 1) {
            const list = [...accumulationRulesArray]
            list.splice(i, 1)
            setAccumulationRulesArray(list)
        }
    }

    const getAllLeaves = () => {
        apicaller('get', `${BASEURL}/leaveType`)
            .then(res => {
                if (res.status === 200 && res.data) {
                    console.log('res.data', res.data)
                    tempLeaveTypes = res.data
                    setleaveTypeArray(res.data)
                    if (editUUID) {
                        getDataByUUID()
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const save = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
        // Check if any value is empty      
        let ifValid = true
        if ((accumulationID === null || accumulationID === undefined) &&
            (description === null || description === undefined) &&
            (leaveTypeUUID === null || leaveTypeUUID === undefined)) {
            ifValid = false
        }
        // Chheck if any value is empty        
        accumulationRulesArray.some(objt => {
            if (objt.fromService === '' || objt.toService === '' || objt.carryForwardLimitValue === '' || objt.carryForwardLimitUnit === '') {
                ifValid = false
            }
            if (objt.allowAccumulation !== '' && objt.allowAccumulation === true) {
                if (objt.accumulationLimitValue === '' || objt.accumulationLimitUnit === '' || objt.onReachingLimit === '') {
                    ifValid = false
                }
            }
        })
        if (!ifValid) {
            let msg = 'Mandatory fields are required'
            setState({
                open: true,
                message: msg,
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            })
            return
        }
        let rules = [];
        accumulationRulesArray.forEach(rule => {
            const newRule = {
                fromService: Number(rule.fromService),
                toService: Number(rule.toService),
                carryForwardLimit: {
                    value: Number(rule.carryForwardLimitValue),
                    unit: rule.carryForwardLimitUnit,
                },

                allowAccumulation: rule.allowAccumulation,
                accumulationLimit: {
                    value: Number(rule.accumulationLimitValue),
                    unit: rule.accumulationLimitUnit
                },
                onReachingLimit: rule.onReachingLimit
            }
            rules.push(newRule)
        })       
        let inputObj = {
            id: accumulationID,
            leaveTypeUUID: leaveTypeUUID,
            description: description,
            rules: rules
        }
        if (!uuid) {
            apicaller('post', `${BASEURL}/leaveAccumulationPolicy/save`, inputObj)
                .then(res => {
                    setIsSubmitted(true)
                    if (res.status === 200 && res.data) {
                        setUUID(res.data[0].uuid)          
                        setState({
                            open: true,
                            message: `Successfully Created Leave Accumulation`,
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });
                    }
                })
                .catch(err => {
                    console.log('err', err)
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
            inputObj.uuid = uuid          
            apicaller('put', `${BASEURL}/leaveAccumulationPolicy/update`, inputObj)
                .then(res => {
                    if (res.status === 200) {
                        setState({
                            open: true,
                            message: `Successfully Updated Leave Accumulation`,
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });
                    }
                })
                .catch(err => {
                    console.log('err', err)
                    setState({
                        open: true,
                        message: err.response.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    });

                })
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
                    <Grid container spacing={0}>
                        <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
                            <h4 className="m-2 text-center">{uuid ? "Update Leave Accumulation Policy" : "Create Leave Accumulation Policy"}</h4>
                            <Grid item container spacing={0} direction="row">
                                <Grid item md={3}>
                                    <label style={{ marginTop: '15px' }} className=" mb-2">
                                        Accumulation ID *
                                    </label>
                                    <TextField
                                        id="outlined-id"
                                        placeholder="Accumuation ID"
                                        disabled={!uuid ? false : true}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={accumulationID}

                                        error={isSubmitted && !accumulationID}
                                        helperText={
                                            isSubmitted && !accumulationID ? 'Accumulation Id is Required' : null
                                        }
                                        onChange={(event) => {
                                            const result = event.target.value.replace(/[^a-z0-9]/gi, '');
                                            setAcculumationID(result.toUpperCase());
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container spacing={0} direction="row">
                                <Grid item md={3} >
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className='font-weight-normal mb-2'>
                                        Leave Type *
                                    </label>
                                    <Autocomplete
                                        id='combo-box-demo'
                                        select
                                        options={leaveTypeArray}
                                        value={leaveTypeIndex != null ? leaveTypeArray[leaveTypeIndex] : ''}
                                        getOptionLabel={option => option?.name}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                variant='outlined'                                              
                                                placeholder="Leave Type"
                                                fullWidth
                                                size='small'
                                                error={
                                                    isSubmitted &&
                                                    (leaveTypeUUID ? false : true)
                                                }
                                                helperText={
                                                    isSubmitted &&
                                                    (leaveTypeUUID
                                                        ? ''
                                                        : 'Leave Type is Required')
                                                }
                                            />
                                        )}
                                        onChange={(event, value) => {
                                            const tempLeaveIndx = leaveTypeArray.findIndex(leaveType => leaveType.uuid === value?.uuid)
                                            if (tempLeaveIndx != -1) {
                                                setLeaveTypeIndex(tempLeaveIndx)
                                                setLeaveTypeUUID(value.uuid)
                                            }
                                            else {
                                                setLeaveTypeIndex(null)
                                                setLeaveTypeUUID(null)
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item md={6} >
                                <label style={{ marginTop: '15px' }} className=" mb-2">
                                    Accumulation Description *
                                </label>
                                <TextField
                                    id="outlined-name"
                                    placeholder="Enter Description"
                                    variant="outlined"
                                    fullWidth
                                    value={description}
                                    error={isSubmitted && !description}
                                    helperText={
                                        isSubmitted && !description ? 'Description is Required' : null
                                    }
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                />
                            </Grid>
                            <div className="mt-5">
                                <Card
                                    style={{
                                        padding: '25px',
                                        border: '1px solid #c4c4c4'
                                    }}>
                                    <CardContent className='p-0'>
                                        <div className='table-responsive-md'>
                                            <TableContainer>
                                                <Table className='table table-hover table-striped mb-0'>
                                                    <thead className='thead-light'>
                                                        <tr>
                                                            <th>From Service(Yrs)</th>
                                                            <th>To Service(Yrs)</th>
                                                            <th>Carry Forward Limit per Year</th>
                                                            <th>Allow Accumulation</th>
                                                            <th>Overall Limit of Accumulation</th>
                                                            <th>On Reaching Limit</th>
                                                            <th>Add</th>
                                                            <th>Remove</th>
                                                        </tr>
                                                    </thead>
                                                    {accumulationRulesArray.length > 0 ? (
                                                        <tbody>
                                                            {accumulationRulesArray.map((item, idx) => (
                                                                <tr>
                                                                    <td>
                                                                        <div>
                                                                            <TextField
                                                                                variant='outlined'
                                                                                id='outlined-From Service'
                                                                                size='small'
                                                                                name='fromService'
                                                                                type="number"
                                                                                value={item?.fromService}
                                                                                error={
                                                                                    isSubmitted && !item?.fromService
                                                                                }
                                                                                helperText={
                                                                                    isSubmitted && !item?.fromService ? true : false
                                                                                }
                                                                                onChange={handleChangeAccumulationRules(idx)}
                                                                            >
                                                                            </TextField>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            <TextField
                                                                                variant='outlined'
                                                                                id='outlined-TO Service'
                                                                                size='small'
                                                                                name='toService'
                                                                                type="number"
                                                                                value={item?.toService}
                                                                                onChange={handleChangeAccumulationRules(idx)}
                                                                                error={
                                                                                    isSubmitted && !item?.toService
                                                                                }
                                                                                helperText={
                                                                                    isSubmitted && !item?.toService ? true : false
                                                                                }
                                                                            >
                                                                            </TextField>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex">
                                                                            <div className="px-2" style={{ width: '140px' }}>
                                                                                <TextField
                                                                                    variant='outlined'
                                                                                    id='outlined-Carry Forward Limit'
                                                                                    size='small'
                                                                                    type="number"
                                                                                    name='carryForwardLimitValue'
                                                                                    value={item?.carryForwardLimitValue}
                                                                                    onChange={handleChangeAccumulationRules(idx)}
                                                                                    error={
                                                                                        isSubmitted && !item?.carryForwardLimitValue
                                                                                    }
                                                                                    helperText={
                                                                                        isSubmitted && !item?.carryForwardLimitValue ? true : false
                                                                                    }
                                                                                >
                                                                                </TextField>
                                                                            </div>
                                                                            <div>
                                                                                <TextField
                                                                                    style={{ width: '110px' }}
                                                                                    variant='outlined'
                                                                                    id='outlined-Carry Forward LimitFrequency'
                                                                                    select
                                                                                    size='small'
                                                                                    type="number"
                                                                                    name='carryForwardLimitUnit'
                                                                                    value={item?.carryForwardLimitUnit}
                                                                                    onChange={handleChangeAccumulationRules(idx)}
                                                                                    error={
                                                                                        isSubmitted && !item?.carryForwardLimitUnit
                                                                                    }
                                                                                    helperText={
                                                                                        isSubmitted && !item?.carryForwardLimitUnit ? true : false
                                                                                    }
                                                                                >
                                                                                    {carryForwardLimitUnitType.map(option => (
                                                                                        <MenuItem
                                                                                            key={option.value}
                                                                                            value={option.value}>
                                                                                            {option.value}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            <Checkbox
                                                                                color="primary"
                                                                                id="outlined-Primary"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                name="allowAccumulation"
                                                                                checked={item?.allowAccumulation}
                                                                                onChange={handleChangeAccumulationRules(idx)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex">
                                                                            <div style={{ width: '70px' }}>
                                                                                <TextField
                                                                                    variant='outlined'
                                                                                    id='outlined-Accumulation Limit'
                                                                                    size='small'
                                                                                    type="number"
                                                                                    disabled={item?.allowAccumulation ? false : true}
                                                                                    name='accumulationLimitValue'
                                                                                    value={item?.accumulationLimitValue}
                                                                                    onChange={handleChangeAccumulationRules(idx)}
                                                                                    error={
                                                                                        isSubmitted && !item?.accumulationLimitValue
                                                                                    }
                                                                                    helperText={
                                                                                        item?.allowAccumulation && isSubmitted && !item?.accumulationLimitValue ? true : false
                                                                                    }
                                                                                >
                                                                                </TextField>
                                                                            </div>
                                                                            <div className=" px-2">
                                                                                <TextField
                                                                                    variant='outlined'
                                                                                    id='outlined-Accumulation Limit Frequency'
                                                                                    select
                                                                                    size='small'
                                                                                    type="number"
                                                                                    disabled={item?.allowAccumulation ? false : true}
                                                                                    name='accumulationLimitUnit'
                                                                                    value={item?.accumulationLimitUnit}
                                                                                    onChange={handleChangeAccumulationRules(idx)}
                                                                                    error={
                                                                                        isSubmitted && !item?.accumulationLimitUnit
                                                                                    }
                                                                                    helperText={
                                                                                        item?.allowAccumulation && isSubmitted && !item?.accumulationLimitUnit ? true : false
                                                                                    }
                                                                                >
                                                                                    {accumulationLimitUnitType.map(option => (
                                                                                        <MenuItem
                                                                                            key={option.value}
                                                                                            value={option.value}>
                                                                                            {option.value}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </TextField>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div style={{ width: '140px' }}>
                                                                            <TextField
                                                                                style={{ width: '140px' }}
                                                                                variant='outlined'
                                                                                id='outlined-On Reaching Limit'
                                                                                select
                                                                                size='small'
                                                                                type="number"
                                                                                name='onReachingLimit'
                                                                                disabled={item?.allowAccumulation ? false : true}
                                                                                value={item?.onReachingLimit}
                                                                                onChange={handleChangeAccumulationRules(idx)}
                                                                                error={
                                                                                    isSubmitted && !item?.onReachingLimit
                                                                                }
                                                                                helperText={
                                                                                    item?.allowAccumulation && isSubmitted && !item?.onReachingLimit ? true : false
                                                                                }
                                                                            >
                                                                                {reachingLimitType.map(option => (
                                                                                    <MenuItem
                                                                                        key={option.value}
                                                                                        value={option.value}>
                                                                                        {option.value}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </TextField>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <Button
                                                                            onClick={handleAddAccumulation}
                                                                            className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                                                            <FontAwesomeIcon
                                                                                icon={['fas', 'plus']}
                                                                                className='font-size-sm'
                                                                            />
                                                                        </Button>
                                                                    </td>
                                                                    <td>
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleRemoveAccumulation(idx)
                                                                            }
                                                                            disabled={accumulationRulesArray.length === 1}
                                                                            className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                                                            <FontAwesomeIcon
                                                                                icon={['fas', 'times']}
                                                                                className='font-size-sm'
                                                                            />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    ) : (
                                                        <tbody className='text-center'>
                                                            <div>
                                                                <img
                                                                    alt='...'
                                                                    src={noResults}
                                                                    style={{ maxWidth: '600px' }}
                                                                />
                                                            </div>
                                                        </tbody>
                                                    )}
                                                </Table>
                                            </TableContainer>
                                        </div>
                                        <div className='divider' />
                                        <div className='divider' />
                                    </CardContent>
                                </Card>
                            </div>
                            <div
                                className='float-right'
                                style={{ marginRight: '2.5%' }}>
                                <Button
                                    className='btn-primary m-2'
                                    component={NavLink}
                                    to="/LeaveAccumulation"
                                >
                                    <span className="btn-wrapper--label px-3 ">Cancel</span>
                                </Button>
                                <Button
                                    onClick={save}
                                    className="btn-primary  m-2">
                                    <span className="btn-wrapper--label px-3 ">{!uuid ? "Create" : "Update"}</span>
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
            </BlockUi >
        </>
    )
}
export default CreateLeaveAccumulation;