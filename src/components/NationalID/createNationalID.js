import {
  Button,
  Card,
  Checkbox,
  Grid,
  MenuItem,
  Table,
  CardContent,
  TextField,
  Snackbar,
  Collapse,
  Switch,
  Dialog,
  DialogContent,
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import apicaller from 'helper/Apicaller'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { connect } from 'react-redux';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import SelectEmployee from 'components/SelectEmployee'

const NationalID = (props) => {
  const { countriesMasterData } = props;
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id') || null;
  const employeeUUID = queryParams.get('uuid') || null;
  const { vertical, horizontal, open, toastrStyle, message } = state
  const [modal2, setModal2] = useState(false)
  const toggle3 = () => setModal2(!modal2)
  const [state1, setState1] = useState({
    accordion: [false, false, false]
  })
  const [blocking, setBlocking] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState()
  const [isExpiry, setIsExpiry] = useState(true)
  const [expiry, setExpiryDate] = useState(null)
  const [country, setCountry] = useState()
  const [Identification, setIdentificationNumber] = useState()
  const [IDType, setIdentificationType] = useState()
  const [name, setIdentificationName] = useState()
  const [isPrimaryID, setIsPrimaryID] = useState(false)
  const [isUpdatedSubmitted, setIsUpdateSubmitted] = useState()
  const [isExpiryUpdate, setIsUpdateExpiry] = useState(true)
  const [updateIdentificationName, setUpdateIdentificationName] = useState()
  const [updateIdentificationNumber, setUpdateIdentificationNumber] = useState()
  const [isPrimaryIDUpdate, setIsPrimaryIDUpdate] = useState(false)
  const [expiryDateUpdate, setUpdateExpiryDate] = useState(null)
  const [_id, setUpdate_id] = useState()
  const [IdToBeUpdated, setUpdatedID] = useState()
  const [IndexToBeUpdated, setUpdatedIDIndex] = useState()
  const [IdToBeDeleted, setIDtoBeDeleted] = useState()
  const [IndexToBeSplice, setIndexToBeSplice] = useState()
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState();
  const [allStates, setAllStates] = useState([]);
  const [stateIndex, setStateIndex] = useState();
  const [employeeDetail, setEmployeeDetail] = useState()
  const [identificationRows, setIdentificationRows] = useState([])

  let tempCountries = [];
  let tempStates = [];

  const toggleAccordion = tab => {
    const prevState = state1.accordion
    const state = prevState.map((x, index) => (tab === index ? !x : false))

    setState1({
      accordion: state
    })
  }
  const IdsType = [
    { value: 'Aadhaar Card' },
    { value: 'Indian Passport' },
    { value: 'Voter ID Card' },
    { value: 'PAN Card' },
    { value: 'Driving License' },
    { value: 'SSN' }
  ]
  const employeesData = [
    {
      employeeId: '001',
      name: 'Gerry Fley',
      DOB: '13 Feb 1992',
      Department: 'Product',
      Designation: 'Product Manager',
      Location: 'Hyderabad'
    },
    {
      employeeId: '002',
      name: 'Jane Doe',
      DOB: '11 Aug 1976',
      Department: 'Product',
      Designation: 'Product Manager',
      Location: 'Delhi'
    }
  ]
  useEffect(() => {
    tempCountries = countriesMasterData;
    setCountries(tempCountries);
  }, [])

  const getAllData = selectedEmployee => {
    setEmployeeDetail(selectedEmployee)
    setBlocking(true)
    let employeeUUID = selectedEmployee?.uuid
    apicaller('get', `${BASEURL}/nationalId/by?employeeUUID=${employeeUUID} `)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          console.log('res.data', res.data)

          setIdentificationRows(res.data)
        }
        else {
          setIdentificationRows([])
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getEmployees err', err)
        setIdentificationRows([])
      })
  }
  const [open2, setOpen2] = useState(false)
  const handleClickOpen2 = (i, updateData) => {
    setOpen2(true)
    setUpdateIdentificationName(updateData.name)
    setUpdateIdentificationNumber(updateData.Identification)
    setIsPrimaryIDUpdate(updateData.isPrimary)
    setIdentificationType(updateData.identificationType)
    setUpdate_id(updateData._id)
    if (updateData.expiry) {
      setUpdateExpiryDate(updateData.expiry)
      setIsUpdateExpiry(false)
    } else {
      setUpdateExpiryDate(null)
      setIsUpdateExpiry(true)
    }
    setUpdatedID(updateData.uuid)
    setUpdatedIDIndex(i)
  }
  const handleClose2 = () => {
    setOpen2(false)
  }
  const [checked1, setChecked1] = useState(true)
  const handleChange1 = event => {
    setChecked1(event.target.checked)
  }

  const save = e => {
    e.preventDefault()
    //to do service call
    setIsSubmitted(true)

    if ((!isExpiry && !expiry) || (!isExpiry && expiry === null) || country === null || country === undefined || name === null || name === undefined) {
      setState({
        open: true,
        message: 'Missing fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }

    if (isPrimaryID) {
      const result = identificationRows.map((item, i) => {
        return { ...item, ['isPrimary']: false }
      })
      const newArray = result.map((item, i) => {
        return item
      })
      setIdentificationRows(newArray)
    }

    if (IDType && Identification) {
      let obj = {
        employeeUUID: employeeDetail.uuid,
        isPrimary: isPrimaryID,
        name: name,
        identificationType: IDType,
        Identification: Identification,
        expiry: !isExpiry ? expiry : null,
        country: country,
        isExpiry: isExpiry
      }
      setBlocking(true)
      apicaller('post', `${BASEURL}/nationalId`, obj)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            setState({
              open: true,
              message: 'Added Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
            setCountry('')
            setIdentificationName('')
            setIdentificationNumber('')
            setIdentificationType('')
            setIsExpiry(true)
            setIsPrimaryID(false)
            setIdentificationRows(identificationRows => [
              ...identificationRows,
              res.data[0]
            ])
            toggleAccordion(0)
            setIsSubmitted(false)
          }
        })
        .catch(err => {
          setBlocking(false)
          if (err?.response?.data) {
            if (
              err?.response?.data.indexOf(
                'expected `identificationType` to be unique'
              ) !== -1
            ) {
              setState({
                open: true,
                message: 'Document with same ID Type already exist!',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
            } else
              setState({
                open: true,
                message: err,
                toastrStyle: 'toastr-warning',
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
    }
  }

  const update = e => {
    e.preventDefault()
    //to do service call
    setIsUpdateSubmitted(true)
    if (
      (!isExpiryUpdate && !expiryDateUpdate) ||
      (!isExpiryUpdate && expiryDateUpdate === null)
    ) {
      setState({
        open: true,
        message: 'Missing fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }
    let newArray = []
    if (isPrimaryIDUpdate) {
      const result = identificationRows.map((item, i) => {
        if (i == IndexToBeUpdated) {
          return { ...item, ['isPrimary']: isPrimaryIDUpdate }
        } else {
          return { ...item, ['isPrimary']: !isPrimaryIDUpdate }
        }
      })
      newArray = result.map((item, i) => {
        return item
      })
      // setIdentificationRows(newArray)
    } else {
      newArray = [...identificationRows]
    }
    if (updateIdentificationName && updateIdentificationNumber) {
      let obj = {
        Identification: updateIdentificationNumber,
        employeeUUID: employeeDetail.uuid,
        expiry: !isExpiryUpdate ? expiryDateUpdate : null,
        identificationType: IDType,
        isPrimary: isPrimaryIDUpdate,
        name: updateIdentificationName,
        _id: _id,
        uuid:IdToBeUpdated
      }
      setBlocking(true)
      apicaller('patch', `${BASEURL}/nationalId/${IdToBeUpdated}`, obj)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            setState({
              open: true,
              message: 'Updated Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
            newArray[IndexToBeUpdated] = obj
            setIdentificationRows(newArray)
            setOpen2(false)
          }
        })
        .catch(err => {
          setBlocking(false)
          if (err?.response?.data) {
            setState({
              open: true,
              message: err,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            console.log('create id err', err)
          }
        })
    }
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const showConfirmDelete = (i, selected) => {
    setModal2(true)
    setIDtoBeDeleted(selected.uuid)
    setIndexToBeSplice(i)
  }

  const handleDeleteID = () => {
    setModal2(false)
    setBlocking(true)
    apicaller('delete', `${BASEURL}/nationalId/${IdToBeDeleted}`)
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
          const list = [...identificationRows]
          list.splice(IndexToBeSplice, 1)
          setIdentificationRows(list)
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err?.response?.data) {
          setState({
            open: true,
            message: err,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
          console.log('create id err', err)
        }
      })
  }

  const getParsedDate = date => {
    if (date && date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }

  const getObjByValue = (arr, value) => {
    return value ? arr.find(x => x.value == value) : {}
  }

  return (
    <BlockUi
      tag='div'
      blocking={blocking}
      loader={
        <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
      }>
      <Card>
        <Grid container spacing={0}>
          <Grid item md={10} lg={10} xl={11} className='mx-auto'>
            <div className='bg-white p-4 rounded'>
              <div className='text-center my-4'>
                <h1 className='display-4 mb-1 '>
                  Create National ID
                </h1>
              </div>            
              <SelectEmployee getAllData={getAllData} employeeUUID={employeeUUID} />
              <br />
              {employeeDetail ? (
                <>
                  <br></br>
                  <Card
                    style={{
                      padding: '25px',
                      border: '1px solid #c4c4c4'
                    }}>
                    <div className='card-header'>
                      <div className='card-header--title'>
                        <p>
                          <b>Employee's Current Identification Data</b>
                        </p>
                      </div>
                    </div>
                    <CardContent className='p-0'>
                      <div style={{ overflow: 'auto' }} className='table-responsive-md'>
                        <Table className='table table-hover table-striped text-nowrap '>
                          <thead className='thead-light'>
                            <tr>
                              <th
                                style={{ width: '20%' }}
                                className='text-center'>
                                Identification Type
                              </th>
                              <th
                                style={{ width: '20%' }}
                                className='text-center'>
                                Identification Number
                              </th>
                              <th
                                style={{ width: '20%' }}
                                className='text-center'>
                                Name as Per Document
                              </th>
                              <th
                                style={{ width: '10%' }}
                                className='text-center'>
                                Expiry Date
                              </th>
                              <th
                                style={{ width: '10%' }}
                                className='text-center'>
                                Is Primary
                              </th>
                              <th
                                style={{ width: '30%' }}
                                className='text-center'>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          {identificationRows.length > 0 ? (
                            <>
                              <tbody>
                                {identificationRows.map((item, idx) => (
                                  <tr>
                                    <td className='text-center'>
                                      <div>{item.identificationType}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>{item.Identification}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>{item.name}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>{getParsedDate(item.expiry)}</div>
                                    </td>
                                    <td className='text-center'>
                                      <div>
                                        <Checkbox
                                          checked={item?.isPrimary}
                                          color='primary'
                                          id={`phoneCheckbox${idx}`}
                                          className='align-self-start'
                                          name='isPrimary'
                                          value={item?.isPrimary}
                                          disabled={true}
                                          style={
                                            item?.isPrimary
                                              ? { color: 'blue' }
                                              : {}
                                          }
                                        />
                                      </div>
                                    </td>
                                    <td className='text-center'>
                                      <div>
                                        <Button
                                          onClick={() =>
                                            handleClickOpen2(idx, item)
                                          }
                                          className='btn-neutral-first mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                          <FontAwesomeIcon
                                            icon={['far', 'edit']}
                                            className='font-size-sm'
                                          />
                                        </Button>

                                        <Button
                                          disabled={item?.isPrimary}
                                          onClick={() =>
                                            showConfirmDelete(idx, item)
                                          }
                                          className='btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                          <FontAwesomeIcon
                                            icon={['fas', 'times']}
                                            className='font-size-sm'
                                          />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </>
                          ) : (
                            <>
                              <p>No Identification Data found</p>
                            </>
                          )}
                        </Table>
                      </div>
                      <div className='divider' />
                      <div className='divider' />
                    </CardContent>
                  </Card>
                  <div className='accordion-toggle'>
                    <Button
                      style={{ padding: '25px 0' }}
                      className='btn-link font-weight-bold d-flex align-items-center justify-content-between btn-transition-none'
                      onClick={() => toggleAccordion(0)}
                      aria-expanded={state1.accordion[0]}>
                      <span>Add New Identification Data</span>
                      &nbsp;
                      {state1.accordion[0] ? (
                        <FontAwesomeIcon
                          icon={['fas', 'angle-down']}
                          className='font-size-xl accordion-icon'
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={['fas', 'angle-right']}
                          className='font-size-xl accordion-icon'
                        />
                      )}
                    </Button>
                  </div>
                  <Collapse in={state1.accordion[0]}>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Select Country *
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
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Select'
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
                                  isSubmitted &&
                                  (country ? '' : 'Country is Required')
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
                                setStateIndex(null);
                              } else {
                                setCountryIndex(null);
                                setCountry(null);
                                setAllStates([]);
                                setStateIndex(null);
                              }
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Identification Number *
                          </label>
                          <TextField
                            variant='outlined'
                            size='small'
                            fullWidth
                            placeholder='Identification Number'
                            name='Identification Number'
                            value={Identification}
                            onChange={event => {
                              setIdentificationNumber(event.target.value)
                            }}
                            error={
                              isSubmitted && (Identification ? false : true)
                            }
                            helperText={
                              isSubmitted &&
                              (Identification
                                ? ''
                                : 'Identification Number is Required')
                            }
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            ID Type *
                          </label>
                          <TextField
                            variant='outlined'
                            fullWidth
                            id='outlined-type'
                            select
                            label='Select'
                            size='small'
                            name='idType'
                            value={IDType || ''}
                            onChange={event => {
                              setIdentificationType(event.target.value)
                            }}
                            error={isSubmitted && (IDType ? false : true)}
                            helperText={
                              isSubmitted &&
                              (IDType
                                ? ''
                                : 'Identification Number is Required')
                            }>
                            {IdsType.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      </Grid>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Name as Per Document
                          </label>
                          <TextField
                            variant='outlined'
                            size='small'
                            fullWidth
                            placeholder='Name'
                            type="text"
                            name='name'
                            value={name}
                            error={isSubmitted && (name ? false : true)}
                            helperText={
                              isSubmitted &&
                              (name ? '' : 'Name is Required')
                            }
                            onChange={event => {
                              setIdentificationName(event.target.value)
                            }}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Expiry Date
                          </label>
                          <div className='d-flex'>
                            <Grid item md={5}>
                              <Switch
                                onChange={event => {
                                  console.log(event)
                                  setIsExpiry(event.target.checked)
                                  setExpiryDate('')
                                }}
                                checked={isExpiry}
                                name='isExpiryDate'
                                color='primary'
                                className='switch-small'
                              />{' '}
                              &nbsp;{' '}
                              {!isExpiry ? '' : <small>Does Not Expire</small>}
                            </Grid>
                            <Grid item md={7}>
                              {!isExpiry ? (
                                <MuiPickersUtilsProvider
                                  utils={DateFnsUtils}
                                  style={{ margin: '0%' }}>
                                  <KeyboardDatePicker
                                    style={{ margin: '0%' }}
                                    inputVariant='outlined'
                                    format='dd/MM/yyyy'
                                    margin='normal'
                                    id='date-picker-inline'
                                    fullWidth
                                    size='small'
                                    value={expiry}
                                    onChange={event => {
                                      setExpiryDate(event)
                                    }}
                                    KeyboardButtonProps={{
                                      'aria-label': 'change date'
                                    }}
                                    helperText={
                                      (!isExpiry && isSubmitted && !expiry) ||
                                        (!isExpiry &&
                                          isSubmitted &&
                                          expiry === null)
                                        ? 'Expiry Date is required'
                                        : ''
                                    }
                                    error={
                                      (!isExpiry && isSubmitted && !expiry) ||
                                        (!isExpiry &&
                                          isSubmitted &&
                                          expiry === null)
                                        ? true
                                        : false
                                    }
                                  />{' '}
                                </MuiPickersUtilsProvider>
                              ) : (
                                ''
                              )}
                            </Grid>
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Consider this as a Primary Card
                          </label>
                          <br></br>
                          <div>
                            <Checkbox
                              id='outlined-isOne-to-OneJob'
                              placeholder='Is One-to-One Job'
                              variant='outlined'
                              size='small'
                              checked={isPrimaryID}
                              value={isPrimaryID}
                              onChange={event => {
                                setIsPrimaryID(event.target.checked)
                              }}></Checkbox>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    <div className='divider' />
                    <div className='divider' />
                    <div
                      className='float-right'
                      style={{ marginRight: '2.5%' }}>
                      <Button
                        className='btn-primary mb-2 m-2'
                        component={NavLink}
                        to='./nationalIDs'>
                        Cancel
                      </Button>
                      <Button
                        className='btn-primary mb-2 m-2'
                        type='submit'
                        onClick={e => save(e)}>
                        Save
                      </Button>
                    </div>
                  </Collapse>
                </>
              ) : (
                ''
              )}
            </div>
          </Grid>
        </Grid>
        <Dialog
          classes={{
            paper: 'modal-content rounded border-0 bg-white p-3 p-xl-0'
          }}
          fullWidth
          maxWidth='lg'
          open={open2}
          onClose={handleClose2}
          aria-labelledby='form-dialog-title2'>
          <DialogContent className='p-4'>
            <div>
              <div className='border-0'>
                <div className='bg-white p-4 rounded'>
                  <div className='text-center my-4'>
                    <h1 className='display-4 mb-1 '>
                      Update National ID
                    </h1>
                  </div>
                </div>
                <div className='card-body px-lg-5 py-lg-5'>
                  <>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Name as Per Document
                          </label>
                          <TextField
                            variant='outlined'
                            size='small'
                            fullWidth
                            placeholder='Name'
                            name='Name'
                            value={updateIdentificationName}
                            onChange={event => {
                              setUpdateIdentificationName(event.target.value)
                            }}
                          />
                        </div>{' '}
                      </Grid>
                      <Grid item md={6}>
                        <div>
                          <label className='font-weight-bold mb-2'>
                            Identification Number
                          </label>
                          <TextField
                            variant='outlined'
                            size='small'
                            fullWidth
                            placeholder='Identification Number'
                            name='Identification Number'
                            value={updateIdentificationNumber}
                            onChange={event => {
                              setUpdateIdentificationNumber(event.target.value)
                            }}
                            error={
                              isUpdatedSubmitted &&
                              (updateIdentificationNumber ? false : true)
                            }
                            helperText={
                              isUpdatedSubmitted &&
                              (updateIdentificationNumber
                                ? ''
                                : 'Identification Number is Required')
                            }
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Expiry Date
                          </label>
                          <div className='d-flex'>
                            <Grid item md={5}>
                              <Switch
                                onChange={event => {
                                  console.log(event)
                                  setIsUpdateExpiry(event.target.checked)
                                  setUpdateExpiryDate('')
                                }}
                                checked={isExpiryUpdate}
                                name='isExpiryDate'
                                color='primary'
                                className='switch-small'
                              />{' '}
                              &nbsp;{' '}
                              {!isExpiryUpdate ? (
                                ''
                              ) : (
                                <small>Does Not Expire</small>
                              )}
                            </Grid>
                            <Grid item md={7}>
                              {!isExpiryUpdate ? (
                                <MuiPickersUtilsProvider
                                  utils={DateFnsUtils}
                                  style={{ margin: '0%' }}>
                                  <KeyboardDatePicker
                                    style={{ margin: '0%' }}
                                    inputVariant='outlined'
                                    format='dd/MM/yyyy'
                                    margin='normal'
                                    id='date-picker-inline'
                                    fullWidth
                                    size='small'
                                    value={expiryDateUpdate}
                                    onChange={event => {
                                      setUpdateExpiryDate(event)
                                    }}
                                    KeyboardButtonProps={{
                                      'aria-label': 'change date'
                                    }}
                                    helperText={
                                      (!isExpiryUpdate &&
                                        isUpdatedSubmitted &&
                                        !expiryDateUpdate) ||
                                        (!isExpiryUpdate &&
                                          isUpdatedSubmitted &&
                                          expiryDateUpdate === null)
                                        ? 'Expiry Date is required'
                                        : ''
                                    }
                                    error={
                                      (!isExpiryUpdate &&
                                        isUpdatedSubmitted &&
                                        !expiryDateUpdate) ||
                                        (!isExpiryUpdate &&
                                          isUpdatedSubmitted &&
                                          expiryDateUpdate === null)
                                        ? true
                                        : false
                                    }
                                  />{' '}
                                </MuiPickersUtilsProvider>
                              ) : (
                                ''
                              )}
                            </Grid>
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={6}>
                        <div>
                          <label className=' mb-2'>
                            Consider this as a Primary Card
                          </label>
                          <div>
                            <Checkbox
                              id='outlined-isOne-to-OneJob'
                              placeholder='Is One-to-One Job'
                              variant='outlined'
                              size='small'
                              checked={isPrimaryIDUpdate}
                              value={isPrimaryIDUpdate}
                              onChange={event => {
                                setIsPrimaryIDUpdate(event.target.checked)
                              }}></Checkbox>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </>
                </div>
                <br></br>
                <div className='divider' />
                <div className='divider' />
                <div className='float-right' style={{ marginRight: '2.5%' }}>
                  <Button
                    className='btn-primary mb-2 m-2'
                    type='submit'
                    onClick={e => update(e)}>
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={modal2}
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
      </Card>
    </BlockUi>
  )
}

const mapStateToProps = (state) => ({
  countriesMasterData: state.Auth.countriesMasterData
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(NationalID);
