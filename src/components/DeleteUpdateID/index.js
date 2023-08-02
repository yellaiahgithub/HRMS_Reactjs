import React, { useState, useEffect } from 'react'
import {
  Grid,
  Checkbox,
  Card,
  MenuItem,
  TextField,
  Button,
  Snackbar
} from '@material-ui/core'
import 'date-fns'
import Autocomplete from '@material-ui/lab/Autocomplete'
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'

export default function ABC () {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const { vertical, horizontal, open, toastrStyle, message } = state

  const actions = [
    { value: 'Delete Employee ID' },
    { value: 'Update Employee ID' },
    { value: 'Delete User ID' }
  ]

    useEffect(() => {
      getEmployees()
    }, [])

  const [blocking, setBlocking] = useState(false)

  const [employeeIDs, setEmployees] = useState([])

  const getEmployees = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setEmployees(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getEmployees err', err)
      })
  }

  const templates = [
    { value: 'Template A' },
    { value: 'Template B' },
    { value: 'Template C' },
    { value: 'Template D' },
    { value: 'Template E' }
  ]

  const [action, setAction] = useState()
  const [employeeID, setEmployeeID] = useState()
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [userID, setUserId] = useState()
  const [isSubmitted, setIsSubmitted] = useState()
  const [updatedID, setUpdatedID] = useState()
  const [isMailNotify, setMailNotif] = useState(false)
  const [template, setTemplate] = useState()
  const [mailTo, setMailTo] = useState()
  const [BC, setBC] = useState()
  const [CC, setCC] = useState()

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const getUserId = id => {
    apicaller('get', `${BASEURL}/employee/get-employee-by-id/${id}`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          if (res.data?.[0]?.userId) {
            setUserId(res.data?.[0]?.userId)
          } else {
            setUserId()
            setState({
              open: true,
              message: 'User Id not found',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          }
        }
      })
      .catch(err => {
        console.log('Updated Employee ID err', err)
        if (err.response?.data) {
          setState({
            open: true,
            message: err.response?.data,
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        }
      })
  }

  const save = event => {
    event.preventDefault()
    setIsSubmitted(true)
    if (isMailNotify) {
      if (template && mailTo && BC && CC) {
      } else {
        setState({
          open: true,
          message: 'Mandatory fields are required',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
        return true
      }
    }

    if (action == 'Update Employee ID' && !updatedID) {
      setState({
        open: true,
        message: 'Mandatory fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
      return
    }

    if (action && employeeID) {
      if (action == 'Update Employee ID') {
        let inputs = selectedEmployee
        inputs['id'] = updatedID
        apicaller('put', `${BASEURL}/employee/update`, inputs)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'Employee ID Updated Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
            }
          })
          .catch(err => {
            setState({
              open: true,
              message: err,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          })
      } else if (action == 'Delete User ID') {
        let inputs = selectedEmployee
        inputs['userId'] = null

        apicaller('put', `${BASEURL}/employee/update`, inputs)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'User ID deleted Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
            }
          })
          .catch(err => {
            console.log('Delete Employee ID err', err)
            if (err?.response?.data) {
              setState({
                open: true,
                message: err,
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
              })
            }
          })
      } else if (action == 'Delete Employee ID') {
        apicaller('delete', `${BASEURL}/employee/${selectedEmployee.uuid}`)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              setState({
                open: true,
                message: 'Employee ID Deleted Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
            }
          })
          .catch(err => {
            console.log('Deleted Employee ID err', err)
            setState({
              open: true,
              message: err,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          })
      }
      setIsSubmitted(false)
      setAction('')
      setEmployeeID('')
      setSelectedEmployee('')
      setUpdatedID('')
      setUserId('')
    } else {
      setState({
        open: true,
        message: 'Mandatory fields are required',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }
  }

  const getObjByValue = (arr, value) => {
    if (employeeIDs) {
      return value ? arr.find(x => x.employeeID == value) : {}
    }
  }

  return (
    <>
      <Card
        style={{
          padding: '25px',
          border: '1px solid #c4c4c4',
          margin: '15px'
        }}>
        <br></br>
        <Grid container spacing={0}>
          <Grid item container direction='row'>
            <Grid
              item
              md={12}
              container
              className='mx-auto mb-4'
              direction='row'>
              <Grid item md={3} >
                <label className='font-size-lg font-weight-normal mt-1'>
                  Select Action *
                </label>
              </Grid>
              <Grid item md={6} className='mx-auto'>
                <TextField              
                  id='outlined-action'
                  label='Select'
                  variant='outlined'
                  fullWidth
                  select
                  size='small'
                  name='action'
                  value={action || ''}
                  onChange={event => {
                    setAction(event.target.value)
                  }}
                  helperText={
                    isSubmitted && (!action || action === '')
                      ? 'Action is required'
                      : ''
                  }
                  error={
                    isSubmitted && (!action || action === '') ? true : false
                  }>
                  {actions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid
              item
              md={12}
              container
              className='mx-auto mb-4'
              direction='row'>
              <Grid item md={3} >
                <label className='font-size-lg font-weight-normal mt-1'>
                  Select Employee ID *
                </label>
              </Grid>
              <Grid item md={6} className='mx-auto'>
                <Autocomplete
                  id='combo-box-demo'
                  options={employeeIDs}
                  getOptionLabel={option => option ? option.employeeID : ''}
                  value={
                    employeeID ? getObjByValue(employeeIDs, employeeID) :''
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='employeeID'
                      helperText={
                        isSubmitted && (!employeeID || employeeID === '')
                          ? 'Employee ID is required'
                          : ''
                      }
                      error={
                        isSubmitted && (!employeeID || employeeID === '')
                          ? true
                          : false
                      }
                    />
                  )}
                  onChange={(event, value) => {
                    setEmployeeID(value?.employeeID)
                    setSelectedEmployee(value)

                    if (action == 'Delete User ID') {
                      getUserId(value?.employeeID)
                    }
                  }}
                />
              </Grid>
            </Grid>
            {action == 'Delete User ID' ? (
              <Grid
                item
                md={12}
                container
                className='mx-auto mb-4'
                direction='row'>
                <Grid item md={3} className='mx-auto'>
                  <label className='font-size-lg font-weight-normal mt-1'>
                    Employee's User ID
                  </label>
                </Grid>
                <Grid item md={6} className='mx-auto'>
                  <TextField
                    disabled={true}
                    id='outlined-ActionBy'
                    placeholder=''
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='userID'
                    value={userID}
                  />
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            {action == 'Update Employee ID' ? (
              <Grid
                item
                md={12}
                container
                className='mx-auto mb-4'
                direction='row'>
                <Grid item md={3} className='mx-auto'>
                  <label className='font-size-lg font-weight-normal mt-1'>
                    Update Employee ID to *
                  </label>
                </Grid>
                <Grid item md={6} className='mx-auto'>
                  <TextField
                    id='outlined-updatedID'
                    placeholder=''
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='updatedID'
                    value={updatedID}
                    onChange={event => {
                      setUpdatedID(event.target.value)
                    }}
                    helperText={
                      action == 'Update Employee ID' &&
                      isSubmitted &&
                      (!updatedID || updatedID === '')
                        ? 'Update Employee ID  is required'
                        : ''
                    }
                    error={
                      action == 'Update Employee ID' &&
                      isSubmitted &&
                      (!updatedID || updatedID === '')
                        ? true
                        : false
                    }
                  />
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            <Grid
              item
              md={12}
              container
              className='mx-auto mb-4'
              direction='row'>
              <Grid item md={12}>
                <label className='font-size-lg font-weight-normal mt-1'>
                  Send a Mail Notification
                </label>
                <Checkbox
                  id='outlined-isOne-to-OneJob'
                  placeholder='Is One-to-One Job'
                  variant='outlined'
                  size='small'
                  checked={isMailNotify}
                  onChange={event => {
                    setMailNotif(event.target.checked)
                  }}
                />
              </Grid>
            </Grid>
            {isMailNotify ? (
              <>
                <Grid
                  item
                  md={12}
                  container
                  className='mx-auto mb-4'
                  direction='row'>
                  <Grid item md={3} >
                    <label className='font-size-lg font-weight-normal mt-1'>
                      Select Template *
                    </label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <Autocomplete
                      id='combo-box-demo'
                      options={templates}
                      getOptionLabel={option => option.value}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='template'
                          value={template}
                          helperText={
                            isMailNotify &&
                            isSubmitted &&
                            (!template || template === '')
                              ? 'Template is required'
                              : ''
                          }
                          error={
                            isMailNotify &&
                            isSubmitted &&
                            (!template || template === '')
                              ? true
                              : false
                          }
                        />
                      )}
                      onChange={(event, value) => {
                        setTemplate(value.value)
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={12}
                  container
                  className='mx-auto mb-4'
                  direction='row'>
                  <Grid item md={3}>
                    <label className='font-size-lg font-weight-normal mt-1'>
                      Select Recepients *
                    </label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <label>To</label>
                    <TextField
                      id='outlined-mailTo'
                      placeholder=''
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='mailTo'
                      value={mailTo}
                      onChange={event => {
                        setMailTo(event.target.value)
                      }}
                      helperText={
                        isMailNotify &&
                        isSubmitted &&
                        (!mailTo || mailTo === '')
                          ? 'To is required'
                          : ''
                      }
                      error={
                        isMailNotify &&
                        isSubmitted &&
                        (!mailTo || mailTo === '')
                          ? true
                          : false
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={12}
                  container
                  className='mx-auto mb-4'
                  direction='row'>
                  <Grid item md={3} >
                    <label className='font-size-lg font-weight-normal mt-1'></label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <label>CC</label>
                    <TextField
                      id='outlined-CC'
                      placeholder=''
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='CC'
                      value={CC}
                      onChange={event => {
                        setCC(event.target.value)
                      }}
                      helperText={
                        isMailNotify && isSubmitted && (!CC || CC === '')
                          ? 'CC is required'
                          : ''
                      }
                      error={
                        isMailNotify && isSubmitted && (!CC || CC === '')
                          ? true
                          : false
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={12}
                  container
                  className='mx-auto mb-4'
                  direction='row'>
                  <Grid item md={3} >
                    <label className='font-size-lg font-weight-normal mt-1'></label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <label>BC</label>
                    <TextField
                      id='outlined-BC'
                      placeholder=''
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='BC'
                      value={BC}
                      onChange={event => {
                        setBC(event.target.value)
                      }}
                      helperText={
                        isMailNotify && isSubmitted && (!BC || BC === '')
                          ? 'BC is required'
                          : ''
                      }
                      error={
                        isMailNotify && isSubmitted && (!BC || BC === '')
                          ? true
                          : false
                      }
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              ''
            )}
          </Grid>
          <br></br>
          <div className='float-left' style={{ marginRight: '2.5%' }}>
            <Button
              className='btn-primary mb-2 '
              type='submit'
              onClick={e => save(e)}>
              Submit
            </Button>
          </div>{' '}
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
    </>
  )
}
