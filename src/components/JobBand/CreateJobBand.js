import {
    Button,
    Card,
    Grid,
    MenuItem,
    TextField,
    Snackbar
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation, useHistory } from 'react-router-dom'
import apicaller from 'helper/Apicaller'
import DateFnsUtils from '@date-io/date-fns';
import BlockUi from 'react-block-ui'
import { ClimbingBoxLoader } from 'react-spinners'
import { connect } from 'react-redux'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const CreateJobBand = props => {
    const { countriesMasterData } = props
    const [isSubmitted, setIsSubmitted] = useState()
    const [blocking, setBlocking] = useState(false)
    const history = useHistory();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id') || null;
    const readOnly =
        queryParams.get('readOnly')?.toLowerCase() == 'true' || false;
    const edit = id ? true : false;

    const saveButtonLabel = 'Save';
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
    const [bandUuid, setBandUuid] = useState()
    const [bandId, setBandID] = useState()
    const [bandName, setBandName] = useState()
    const [effectiveDate, setEffectiveDate] = useState(null)
    const [status, setStatus] = useState(true)
    const [currentEffectiveStatus, setCurrentEffectiveStatus] = useState(
        edit ?
            [{ label: 'Active', value: true }, { label: 'InActive', value: false }]
            :
            [{ label: 'Active', value: true }]
    )
    const [countries, setCountries] = useState([])
    const [description, setDescription] = useState()
    let tempCountries = []
    const handleClose = () => {
        setState({ ...state, open: false })
    }
    useEffect(() => {
        if (id) {
            getJobBand()
        }

        tempCountries = countriesMasterData
        setCountries(tempCountries)
    }, [])

    const getJobBand = () => {
        apicaller('get', `${BASEURL}/jobBand/fetchByBandId/` + id)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    setBandName(res.data.bandName);
                    setStatus(res.data.status)
                    setEffectiveDate(new Date(res.data.effectiveDate)?.toLocaleDateString());
                    setBandID(res.data.bandId);
                    setDescription(res.data.description)
                    setBandUuid(res.data.uuid)
                }
            })
            .catch(err => {
                console.log('getJobBand err', err)
            })
    }

    const save = e => {
        e.preventDefault()
        setIsSubmitted(true)
        // to do service call
        if (
            bandId &&
            bandName &&
            effectiveDate &&
            (status == true || status == false) &&
            description
        ) {
            let data = {
                bandId: bandId,
                bandName: bandName,
                effectiveDate: effectiveDate,
                status: status,
                description: description,

            }

            if (edit) {
                data.uuid = bandUuid
                apicaller('put', `${BASEURL}/jobBand/update`, data)
                    .then(res => {
                        if (res.status === 200) {
                            console.log('res.data', res.data)
                            setBandID('')
                            setBandName('')
                            setEffectiveDate('')
                            setStatus(true)
                            setDescription('')
                            setCurrentEffectiveStatus([{ label: 'Active', value: true }])
                            setIsSubmitted(false)
                            setBlocking(false)
                            setState({
                                open: true,
                                message: 'Added Successfully',
                                toastrStyle: 'toastr-success',
                                vertical: 'top',
                                horizontal: 'right'
                            })
                            history.push('/jobBand');
                        }
                    })
                    .catch(err => {
                        setBlocking(false)
                        if (err?.response?.data) {
                            if (
                                err?.response?.data.indexOf(
                                    'to be unique'
                                ) !== -1
                            ) {
                                setState({
                                    open: true,
                                    message: err?.response?.data,
                                    toastrStyle: 'toastr-warning',
                                    vertical: 'top',
                                    horizontal: 'right'
                                })
                            } else
                                setState({
                                    open: true,
                                    message: err,
                                    toastrStyle: 'toastr-success',
                                    vertical: 'top',
                                    horizontal: 'right'
                                })
                            console.log('create id err', err)
                        }
                    })

            } else {
                apicaller('post', `${BASEURL}/jobBand/save`, data)
                    .then(res => {
                        if (res.status === 200) {
                            console.log('res.data', res.data)
                            setBandID('')
                            setBandName('')
                            setEffectiveDate('')
                            setStatus(true)
                            setDescription('')
                            setCurrentEffectiveStatus([{ label: 'Active', value: true }])
                            setIsSubmitted(false)
                            setBlocking(false)
                            setState({
                                open: true,
                                message: 'Added Successfully',
                                toastrStyle: 'toastr-success',
                                vertical: 'top',
                                horizontal: 'right'
                            })
                            history.push('/jobBand');
                        }
                    })
                    .catch(err => {
                        setBlocking(false)
                        if (err?.response?.data) {
                            if (
                                err?.response?.data.indexOf(
                                    'to be unique'
                                ) !== -1
                            ) {
                                setState({
                                    open: true,
                                    message: err?.response?.data,
                                    toastrStyle: 'toastr-warning',
                                    vertical: 'top',
                                    horizontal: 'right'
                                })
                            } else
                                setState({
                                    open: true,
                                    message: err,
                                    toastrStyle: 'toastr-success',
                                    vertical: 'top',
                                    horizontal: 'right'
                                })
                            console.log('create id err', err)
                        }
                    })
            }
        } else {
            setState({
                open: true,
                message: 'Missing fields are required',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            })
            return
        }
        setIsSubmitted(true)
    }

    const handleSubmit = event => {
        event.preventDefault()
        setIsSubmitted(true)
    }

    return (
        <BlockUi
            tag='div'
            blocking={blocking}
            loader={
                <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
            }>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid item md={12} lg={12} xl={12} className='mx-auto'>
                        <div className='bg-white p-4 rounded'>
                            <Grid container spacing={1}>
                                <Grid item md={6}>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className='font-weight-normal mb-2'>
                                        Band ID *
                                    </label>
                                    <TextField
                                        id='outlined-bandId'
                                        placeholder='Band ID'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        disabled={edit}
                                        name='bandId'
                                        value={bandId}
                                        error={isSubmitted && (bandId ? false : true)}
                                        helperText={
                                            isSubmitted && (bandId ? '' : 'Field is Mandatory')
                                        }
                                        onChange={event => {
                                            if (event.target) {
                                                setBandID(event.target.value)
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className='font-weight-normal mb-2'>
                                        Band Name *
                                    </label>
                                    <TextField
                                        id='outlined-bandName'
                                        placeholder='Band Name'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        name='bandName'
                                        value={bandName}
                                        error={isSubmitted && (bandName ? false : true)}
                                        helperText={
                                            isSubmitted && (bandName ? '' : 'Field is Mandatory')
                                        }
                                        onChange={event => {
                                            if (event.target) {
                                                setBandName(event.target.value)
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className='font-weight-normal mb-2'>
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
                                        className='font-weight-normal mb-2'>
                                        Effective Status
                                    </label>
                                    <TextField
                                        id='outlined-effectiveStatus'
                                        // required
                                        label={status ? '' : 'Select Effective Status'}
                                        variant='outlined'
                                        error={isSubmitted && ((status == true || status == false) ? false : true)}
                                        helperText={isSubmitted && ((status == true || status == false) ? '' : 'Field is Mandatory')}
                                        fullWidth
                                        select
                                        size='small'
                                        value={status}
                                        onChange={(event) => {
                                            setStatus(event.target.value)
                                        }}>
                                        {currentEffectiveStatus.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item md={12}>
                                    <label
                                        style={{ marginTop: '15px' }}
                                        className='font-weight-normal mb-2'>
                                        Description
                                    </label>
                                    <TextField
                                        id='outlined-description'
                                        placeholder='Description'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        name='description'
                                        value={description}
                                        onChange={event => {
                                            if (event.target) {
                                                setDescription(event.target.value)
                                            }
                                        }}
                                    />
                                </Grid>
                                <div className='divider' />
                                <div className='divider' />
                                <div className='w-100'>
                                    <div className='float-right' style={{ marginRight: '2.5%' }}>                                     
                                        <Button
                                            className='btn-primary mb-2 m-2'
                                            component={NavLink}
                                            to='./jobBand'>
                                            Cancel
                                        </Button>
                                        <Button
                                            className='btn-primary mb-2 m-2'
                                            type='submit'
                                            onClick={e => save(e)}>
                                            {saveButtonLabel}
                                        </Button>
                                    </div>
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
                            </Grid>
                        </div>
                    </Grid>
                </form>
            </Card>
        </BlockUi>
    )
}

const mapStateToProps = state => ({
    countriesMasterData: state.Auth.countriesMasterData
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CreateJobBand)
