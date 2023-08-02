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
import { NavLink } from 'react-router-dom'
import apicaller from 'helper/Apicaller'
import Autocomplete from '@material-ui/lab/Autocomplete'
import BlockUi from 'react-block-ui'
import { ClimbingBoxLoader } from 'react-spinners'
import { connect } from 'react-redux'
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const CreateBranches = props => {
  const { countriesMasterData } = props
  const [isSubmitted, setIsSubmitted] = useState()
  const [blocking, setBlocking] = useState(false)
  const saveButtonLabel = 'Create Branch'
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state
  const [bankUUID, setBankUUID] = useState()
  const [branchCode, setBranchCode] = useState()
  const [status, setStatus] = useState(true)
  const [currentStatus, setCurrentStatus] = useState([
    { label: 'Active', value: true }
  ])
  const [branchName, setBranchName] = useState()
  const [addState, setAddState] = useState()
  const [ifscCode, setIFSCCode] = useState()
  const [micrCode, setMICRCode] = useState()
  const [country, setCountry] = useState()
  const [city, setCity] = useState()
  const [addressLine1, setAddressLine1] = useState()
  const [addressLine2, setAddressLine2] = useState()
  const [PIN, setPIN] = useState()
  const [asOfDate, setAsOfDate] = useState(null)
  const [countries, setCountries] = useState([])
  const [countryIndex, setCountryIndex] = useState()
  const [allStates, setAllStates] = useState([])
  const [stateIndex, setStateIndex] = useState()
  let tempCountries = []

  const handleClose = () => {
    setState({ ...state, open: false })
  }
  const [bankNameArray, setBankArray] = useState([])
  useEffect(() => {
    getBanks()
    tempCountries = countriesMasterData
    setCountries(tempCountries)
  }, [])

  const getBanks = () => {
    apicaller('get', `${BASEURL}/bank`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setBankArray(res.data)
        }
      })
      .catch(err => {
        console.log('getBanks err', err)
      })
  }

  const save = e => {
    e.preventDefault()
    setIsSubmitted(true)
    // to do service call
    if (
      bankUUID &&
      branchName &&
      branchCode &&
      ifscCode &&
      addressLine1 &&
      addressLine2 &&
      country &&
      state &&
      city &&
      PIN
    ) {
      let data = {
        bankUUID: bankUUID,
        branchCode: branchCode,
        name: branchName,
        branchId: branchCode,
        ifscCode: ifscCode,
        micrCode: micrCode,
        asOfDate: asOfDate,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        country: country,
        state: addState,
        city: city,
        pinCode: PIN
      }

      apicaller('post', `${BASEURL}/bankBranch`, data)
        .then(res => {
          if (res.status === 200) {
            setBranchName('')
            setBranchCode('')
            setBranchName('')
            setIFSCCode('')
            setMICRCode('')
            setAsOfDate('')
            setCurrentStatus([{ label: 'Active', value: true }])
            setCountry('')
            setAddState('')
            setCity('')
            setPIN('')
            setAddressLine1('')
            setAddressLine2('')
            setCountryIndex(null);
            setStateIndex(null);
            setAllStates([]);
            setIsSubmitted(false)
            setBlocking(false)
            console.log('res.data', res.data)
            setState({
              open: true,
              message: 'Added Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
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
                <Grid item md={12}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Bank Name *
                  </label>
                  <Autocomplete
                    id='combo-box-demo'
                    select
                    options={bankNameArray}
                    getOptionLabel={option =>
                      option.name
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Select Bank Name'
                        variant='outlined'
                        fullWidth
                        size='small'
                        value={bankUUID}
                        error={isSubmitted && (bankUUID ? false : true)}
                        helperText={
                          isSubmitted && (bankUUID ? '' : 'Field is Mandatory')
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      if (value) setBankUUID(value.uuid)
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Branch Code *
                  </label>
                  <TextField
                    id='outlined-branchCode'
                    placeholder='Branch Code'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='branchCode'
                    value={branchCode}
                    error={isSubmitted && (branchCode ? false : true)}
                    helperText={
                      isSubmitted && (branchCode ? '' : 'Field is Mandatory')
                    }
                    onChange={event => {
                      if (event.target) {
                        setBranchCode(event.target.value)
                      }
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Branch Name *
                  </label>
                  <TextField
                    id='outlined-branchName'
                    placeholder='Branch Name'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='branchName'
                    value={branchName}
                    error={isSubmitted && (branchName ? false : true)}
                    helperText={
                      isSubmitted && (branchName ? '' : 'Field is Mandatory')
                    }
                    onChange={event => {
                      if (event.target) {
                        setBranchName(event.target.value)
                      }
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    IFSC Code *
                  </label>
                  <TextField
                    id='outlined-IFSCCode'
                    placeholder='IFSC Code'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='ifscCode'
                    value={ifscCode}
                    onChange={event => {
                      if (event.target) {
                        setIFSCCode(event.target.value)
                      }
                    }}
                    error={isSubmitted && (ifscCode ? false : true)}
                    helperText={
                      isSubmitted && (ifscCode ? '' : 'Field is Mandatory')
                    }
                  />
                </Grid>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    MICR Code
                  </label>
                  <TextField
                    id='outlined-MICRCode'
                    placeholder='MICR Code'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='micrCode'
                    value={micrCode}
                    onChange={event => {
                      if (event.target) {
                        setMICRCode(event.target.value)
                      }
                    }}
                  />
                </Grid>

                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
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
                      id="date-picker-inline"
                      fullWidth
                      size="small"
                      value={asOfDate}
                      onChange={(event) => {
                        setAsOfDate(event);
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      error={(isSubmitted && (asOfDate ? false : true))}
                      helperText={(isSubmitted && (asOfDate ? "" : "Field is Mandatory"))}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Status
                  </label>
                  <TextField
                    id='outlined-status'
                    // required
                    label={status ? '' : 'Select Status'}
                    variant='outlined'
                    error={isSubmitted && (status === '' ? true : false)}
                    helperText={
                      isSubmitted && (status === '' ? 'Field is Mandatory' : '')
                    }
                    fullWidth
                    select
                    size='small'
                    value={status === '' ? '' : status ? true : false}
                    onChange={event => {
                      setStatus(event.target.value)
                    }}>
                    {currentStatus.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Country *
                    </label>
                    <Autocomplete
                      id='combo-box-demo'
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
                          label='Select Country'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='country'
                          value={
                            countryIndex != null
                              ? countries[countryIndex] || ''
                              : null
                          }
                          error={isSubmitted && (country ? false : true)}
                          helperText={
                            isSubmitted && (country ? '' : 'Field is Mandatory')
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = countries.findIndex(
                          (country) => country.name === value?.name
                        )
                        if (index != -1) {
                          setCountryIndex(index)
                          setCountry(countries[index].name)
                          setAllStates(countries[index].states)
                          setAddState(null)
                          setStateIndex(null)
                        } else {
                          setCountryIndex(null)
                          setCountry(null)
                          setAllStates([])
                          setAddState(null)
                          setStateIndex(null)
                        }
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      State *
                    </label>
                    <Autocomplete
                      id='combo-box-demo'
                      select
                      options={allStates}
                      getOptionLabel={option => option}
                      value={
                        countryIndex != null
                          ? stateIndex != null
                            ? countries[countryIndex].states[stateIndex] || ''
                            : null
                          : null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select State'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='addState'
                          value={
                            countryIndex != null
                              ? stateIndex != null
                                ? countries[countryIndex].states[stateIndex] ||
                                ''
                                : null
                              : null
                          }
                          error={isSubmitted && (addState ? false : true)}
                          helperText={
                            isSubmitted &&
                            (addState ? '' : 'Field is Mandatory')
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        const index = allStates.findIndex(
                          state => state === value
                        )
                        if (index != -1) {
                          setStateIndex(index)
                          setAddState(countries[countryIndex].states[index])
                        } else {
                          setStateIndex(null)
                          setAddState(null)
                        }
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      City *
                    </label>
                    <TextField
                      id='outlined-city'
                      placeholder='City'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='city'
                      value={city}
                      error={isSubmitted && (city ? false : true)}
                      helperText={
                        isSubmitted && (city ? '' : 'Field is Mandatory')
                      }
                      onChange={event => {
                        if (event.target) {
                          setCity(event.target.value)
                        }
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Pin Code *
                    </label>
                    <TextField
                      id='outlined-PIN'
                      placeholder='Pin Code'
                      type='text'
                      variant='outlined'
                      fullWidth
                      size='small'
                      value={PIN}
                      onChange={event => {
                        setPIN(event.target.value)
                      }}
                      error={isSubmitted && (PIN ? false : true)}
                      helperText={
                        isSubmitted && (PIN ? '' : 'Field is Mandatory')
                      }
                    />
                  </Grid>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Address Line 1 *
                    </label>
                    <TextField
                      id='outlined-addressLine1'
                      placeholder='Address Line 1'
                      type='text'
                      variant='outlined'
                      fullWidth
                      size='small'
                      value={addressLine1}
                      onChange={event => {
                        setAddressLine1(event.target.value)
                      }}
                      error={isSubmitted && (addressLine1 ? false : true)}
                      helperText={
                        isSubmitted &&
                        (addressLine1 ? '' : 'Field is Mandatory')
                      }
                    />
                  </Grid>
                  <Grid item md={6}>
                    <label
                      style={{ marginTop: '15px' }}
                      className='font-weight-normal mb-2'>
                      Address Line 2 *
                    </label>
                    <TextField
                      id='outlined-addressLine2'
                      placeholder='Address Line 2'
                      type='text'
                      variant='outlined'
                      fullWidth
                      size='small'
                      value={addressLine2}
                      onChange={event => {
                        setAddressLine2(event.target.value)
                      }}
                      error={isSubmitted && (addressLine2 ? false : true)}
                      helperText={
                        isSubmitted &&
                        (addressLine2 ? '' : 'Field is Mandatory')
                      }
                    />
                  </Grid>
                </Grid>

                <div className='divider' />
                <div className='divider' />
                <div className='w-100'>
                  <div className='float-right' style={{ marginRight: '2.5%' }}>
                    <Button
                      className='btn-primary mb-2 m-2'
                      type='submit'
                      // disabled={employeeData ? false : true}
                      onClick={e => save(e)}>
                      {saveButtonLabel}
                    </Button>
                    <Button
                      className='btn-primary mb-2 m-2'
                      component={NavLink}
                      to='./bankBranches'>
                      Cancel
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateBranches)
