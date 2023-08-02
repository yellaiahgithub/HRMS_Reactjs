import {
  Button,
  Card,
  Grid,
  MenuItem,
  Table,
  CardContent,
  TextField,
  Snackbar,
  Switch,
  FormControl,
  ListItem,
  List,
  Menu,
  InputAdornment
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import apicaller from 'helper/Apicaller'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { NavLink, useLocation, useHistory } from 'react-router-dom'

const ProbationControl = props => {
  const { selectedCompany } = props

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const history = useHistory()

  const { vertical, horizontal, open, toastrStyle, message } = state
  const [blocking, setBlocking] = useState()
  const [isSubmitted, setIsSubmitted] = useState()
  const [autoConfirmProbation, setAutoConfirmProbation] = useState(false)
  const [autoConfirmProbationAfter, setAutoConfirmProbationAfter] = useState('')
  const [remindAdmin, setRemindAdmin] = useState(false)
  const [remindAdminPrior, setRemindAdminPrior] = useState('')

  const [remainderNotificationTemplate, setRemainderNotificationTemplate] =
    useState('')

  const [sendRemainderNotifications, setSendRemainderNotifications] =
    useState(false)

  const [sendConfirmationNotifications, setSendConfirmationNotifications] =
    useState(false)

  const [confirmationNotificationsTo, setConfirmationNotificationsTo] =
    useState([])

  const [
    confirmationNotificationTemplate,
    setConfirmationNotificationTemplate
  ] = useState('')

  const [remainderNotificationsTo, setRemainderNotificationsTo] = useState([])

  const [postDateRemainders, setPostDateRemainders] = useState(false)

  const [postDateRemaindersAfterEvery, setPostDateRemaindersAfterEvery] =
    useState('')

  const [postDateRemaindersTo, setPostDateRemaindersTo] = useState([])

  const [
    postDateRemainderNotificationTemplate,
    setPostDateRemainderNotificationTemplate
  ] = useState('')
  const [saveButtonLabel, setSaveButtonLabel] = useState('Save')
  const [updatedData, setUpdatedData] = useState()
  const [docUUID, setDocUUID] = useState('')
  const [notificationTemplates, setNotificationTemplates] = useState([])

  const sentToArray = [{ name: 'Admin' }, { name: 'Employee' }]

  useEffect(() => {
    setBlocking(true)

    apicaller('get', `${BASEURL}/sendMail/getallMailTemplate`)
      .then(res => {
        setBlocking()
        if (res.status === 200) {
          console.log('res.data', res.data)
          setNotificationTemplates(res.data)
        }
      })
      .catch(err => {
        setBlocking()
        console.log('getNotificationTemplates err', err)
      })

    apicaller('get', `${BASEURL}/probationControlSetup`)
      .then(res => {
        if (res.status === 200) {
          setBlocking()
          setSaveButtonLabel('Update')
          setUpdatedData(res.data)
          setDocUUID(res.data.uuid)
          setAutoConfirmProbation(res.data.autoConfirmProbation)
          setAutoConfirmProbationAfter(res.data.autoConfirmProbationAfter)
          setRemindAdmin(res.data.remindAdmin)
          setRemindAdminPrior(res.data.remindAdminPrior)
          setRemainderNotificationTemplate(
            res.data.remainderNotificationTemplate
          )
          setSendRemainderNotifications(res.data.sendRemainderNotifications)
          setSendConfirmationNotifications(
            res.data.sendConfirmationNotifications
          )

          setConfirmationNotificationTemplate(
            res.data.confirmationNotificationTemplate
          )
          setPostDateRemainders(res.data.postDateRemainders)
          setPostDateRemaindersAfterEvery(res.data.postDateRemaindersAfterEvery)
          setPostDateRemainderNotificationTemplate(
            res.data.postDateRemainderNotificationTemplate
          )

          sentToArray.find(opt => {
            res.data.confirmationNotificationsTo.forEach(element => {
              if (opt.name == element) confirmationNotificationsTo.push(opt)
              setConfirmationNotificationsTo(
                confirmationNotificationsTo.map(a => a)
              )
            })
          })

          sentToArray.find(opt => {
            res.data.remainderNotificationsTo.forEach(element => {
              if (opt.name == element) remainderNotificationsTo.push(opt)
              setRemainderNotificationsTo(remainderNotificationsTo.map(a => a))
            })
          })

          sentToArray.find(opt => {
            res.data.postDateRemaindersTo.forEach(element => {
              if (opt.name == element) postDateRemaindersTo.push(opt)
              setPostDateRemaindersTo(postDateRemaindersTo.map(a => a))
            })
          })
        }
      })
      .catch(err => {
        console.log('getcontrols err', err)
      })
  }, [])

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const save = e => {
    setIsSubmitted(true)
    let isValid = true

    if (
      !autoConfirmProbation &&
      !remindAdmin &&
      !sendRemainderNotifications &&
      !sendConfirmationNotifications &&
      !postDateRemainders
    ) {
      setState({
        open: true,
        message: 'Switch on the toggles',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    } else {
      if (autoConfirmProbation && autoConfirmProbation == '') {
        isValid = false
      }
      if (
        (remindAdmin && remindAdminPrior == '') ||
        (remindAdmin && remainderNotificationTemplate == '')
      ) {
        isValid = false
      }
      if (sendRemainderNotifications && remainderNotificationsTo.length == 0) {
        isValid = false
      }
      if (
        sendConfirmationNotifications &&
        confirmationNotificationsTo.length == 0
      ) {
        isValid = false
      }
      if (
        (postDateRemainders && postDateRemaindersAfterEvery == '') ||
        (postDateRemainders && postDateRemainderNotificationTemplate == '') ||
        (postDateRemainders && postDateRemaindersTo.length == 0)
      ) {
        isValid = false
      }

      if (isValid == false) {
        setState({
          open: true,
          message: 'Mandatory fields are Required',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      } else {
        let remainderNotifications = remainderNotificationsTo.map(a => a.name)
        let confirmationNotifications = confirmationNotificationsTo.map(
          a => a.name
        )
        let postDateToRemainders = postDateRemaindersTo.map(a => a.name)

        let obj = {
          autoConfirmProbation: autoConfirmProbation,
          autoConfirmProbationAfter: autoConfirmProbationAfter,
          remindAdmin: remindAdmin,
          remindAdminPrior: remindAdminPrior,
          remainderNotificationTemplate: remainderNotificationTemplate,
          sendRemainderNotifications: sendRemainderNotifications,
          remainderNotificationsTo: remainderNotifications,
          sendConfirmationNotifications: sendConfirmationNotifications,
          confirmationNotificationsTo: confirmationNotifications,
          confirmationNotificationTemplate: confirmationNotificationTemplate,
          postDateRemainders: postDateRemainders,
          postDateRemaindersAfterEvery: postDateRemaindersAfterEvery,
          postDateRemaindersTo: postDateToRemainders,
          postDateRemainderNotificationTemplate:
            postDateRemainderNotificationTemplate
        }

        console.log(obj)

        setBlocking(true)

        let query
        let msg = ''
        if (saveButtonLabel.toLocaleLowerCase() == 'update') {
          obj['uuid'] = docUUID
          query = apicaller('patch', `${BASEURL}/probationControlSetup`, obj)
          msg = 'Updated Successfully'
        } else {
          query = apicaller('post', `${BASEURL}/probationControlSetup`, obj)
          msg = 'Added Successfully'
        }

        query
          .then(res => {
            if (res.status === 200) {
              setBlocking()
              console.log('res.data', res.data)
              setState({
                open: true,
                message: msg,
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              history.push('/dashboard')
            }
          })
          .catch(err => {
            setBlocking()
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
            console.log('create id err', err)
          })
      }
    }
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
              <div className='card-header--title'>
                <p>
                  <b>Probation Controls</b>
                </p>
              </div>

              <Card
                style={{
                  padding: '25px',
                  border: '1px solid #c4c4c4'
                }}>
                <CardContent className='p-0'>
                  <Grid item container direction='row'>
                    <Grid
                      item
                      md={12}
                      container
                      className='mx-auto'
                      direction='row'
                      spacing={2}>
                      <Grid item md={1}>
                        <Switch
                          name='customUserId'
                          color='primary'
                          className='switch-small'
                          value={autoConfirmProbation}
                          checked={autoConfirmProbation}
                          onChange={event => {
                            setAutoConfirmProbation(event.target.checked)
                          }}
                        />
                      </Grid>
                      <Grid item md={11}>
                        Auto-Confirm probation after &nbsp;
                        <TextField
                          variant='outlined'
                          size='small'
                          halfWidth
                          name='autoConfirmProbationAfter'
                          value={autoConfirmProbationAfter}
                          inputProps={{ type: 'number' }}
                          onChange={event => {
                            setAutoConfirmProbationAfter(event.target.value)
                          }}
                          error={
                            isSubmitted &&
                            autoConfirmProbation &&
                            autoConfirmProbationAfter == 0
                          }
                          helperText={
                            isSubmitted &&
                            autoConfirmProbation &&
                            autoConfirmProbationAfter == 0
                              ? 'Fied is required'
                              : ''
                          }
                        />{' '}
                        &nbsp; days of Probation period control
                      </Grid>
                      <Grid item md={1}>
                        <Switch
                          name='customUserId'
                          color='primary'
                          className='switch-small'
                          value={remindAdmin}
                          checked={remindAdmin}
                          onChange={event => {
                            setRemindAdmin(event.target.checked)
                          }}
                        />
                      </Grid>{' '}
                      <Grid item md={11}>
                        Remind admin about Probation Comfirmation &nbsp;
                        <TextField
                          variant='outlined'
                          size='small'
                          halfWidth
                          name='remindAdminPrior'
                          value={remindAdminPrior}
                          inputProps={{ type: 'number' }}
                          onChange={event => {
                            setRemindAdminPrior(event.target.value)
                          }}
                          error={
                            isSubmitted && remindAdmin && remindAdminPrior == ''
                          }
                          helperText={
                            isSubmitted && remindAdmin && remindAdminPrior == ''
                              ? 'Fied is required'
                              : ''
                          }
                        />{' '}
                        &nbsp; days prior to Probation period control
                      </Grid>
                      <Grid item md={1}></Grid>
                      <Grid item md={5}>
                        Notification Template to be used{' '}
                      </Grid>
                      <Grid item md={6}>
                        <TextField
                          id='outlined-new'
                          label='Select'
                          variant='outlined'
                          fullWidth
                          select
                          size='small'
                          name='New'
                          value={remainderNotificationTemplate || ''}
                          onChange={event => {
                            setRemainderNotificationTemplate(event.target.value)
                          }}
                          error={
                            isSubmitted &&
                            remindAdmin &&
                            remainderNotificationTemplate == ''
                          }
                          helperText={
                            isSubmitted &&
                            remindAdmin &&
                            remainderNotificationTemplate == ''
                              ? 'Field is Required'
                              : ''
                          }>
                          {notificationTemplates.map(option => (
                            <MenuItem
                              key={option.notificationType}
                              value={option.uuid}>
                              {option.notificationType}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={1}>
                        <Switch
                          name='customUserId'
                          color='primary'
                          className='switch-small'
                          value={sendRemainderNotifications}
                          checked={sendRemainderNotifications}
                          onChange={event => {
                            setSendRemainderNotifications(event.target.checked)
                          }}
                        />
                      </Grid>
                      <Grid item md={5}>
                        Reminder Notifications to be sent To
                      </Grid>
                      <Grid item md={6}>
                        <FormControl variant='outlined' fullWidth size='small'>
                          <Autocomplete
                            id='combo-box-demo'
                            multiple
                            options={sentToArray}
                            value={remainderNotificationsTo}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Sent To'
                                variant='outlined'
                                halfWidth
                                size='small'
                                error={
                                  isSubmitted &&
                                  sendRemainderNotifications &&
                                  remainderNotificationsTo.length == 0
                                }
                                helperText={
                                  isSubmitted &&
                                  sendRemainderNotifications &&
                                  remainderNotificationsTo.length == 0
                                    ? 'Field is required'
                                    : ''
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              setRemainderNotificationsTo(value)
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1}>
                        {' '}
                        <Switch
                          name='customUserId'
                          color='primary'
                          className='switch-small'
                          value={sendConfirmationNotifications}
                          checked={sendConfirmationNotifications}
                          onChange={event => {
                            setSendConfirmationNotifications(
                              event.target.checked
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={5} className='mx-auto'>
                        {' '}
                        Confirmation Notifications to be sent To{' '}
                      </Grid>
                      <Grid item md={6}>
                        <FormControl variant='outlined' fullWidth size='small'>
                          <Autocomplete
                            id='combo-box-demo'
                            multiple
                            options={sentToArray}
                            value={confirmationNotificationsTo}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Sent To'
                                variant='outlined'
                                halfWidth
                                size='small'
                                error={
                                  isSubmitted &&
                                  sendConfirmationNotifications &&
                                  confirmationNotificationsTo.length == 0
                                }
                                helperText={
                                  isSubmitted &&
                                  sendConfirmationNotifications &&
                                  confirmationNotificationsTo.length == 0
                                    ? 'Field is required'
                                    : ''
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              setConfirmationNotificationsTo(value)
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1} className='mx-auto'></Grid>
                      <Grid item md={5} className='mx-auto'>
                        {' '}
                        Notification Template to be used{' '}
                      </Grid>
                      <Grid item md={6} className='mx-auto'>
                        {' '}
                        <TextField
                          id='outlined-new'
                          label='Select'
                          variant='outlined'
                          fullWidth
                          select
                          size='small'
                          name='New'
                          value={confirmationNotificationTemplate || ''}
                          onChange={event => {
                            setConfirmationNotificationTemplate(
                              event.target.value
                            )
                          }}
                          error={
                            isSubmitted &&
                            sendConfirmationNotifications &&
                            confirmationNotificationTemplate == ''
                          }
                          helperText={
                            isSubmitted &&
                            sendConfirmationNotifications &&
                            confirmationNotificationTemplate == ''
                              ? 'Notification Template is Required'
                              : ''
                          }>
                          {notificationTemplates.map(option => (
                            <MenuItem
                              key={option.notificationType}
                              value={option.uuid}>
                              {option.notificationType}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={1}>
                        <Switch
                          name='customUserId'
                          color='primary'
                          className='switch-small'
                          value={postDateRemainders}
                          checked={postDateRemainders}
                          onChange={event => {
                            setPostDateRemainders(event.target.checked)
                          }}
                        />
                      </Grid>
                      <Grid item md={5}>
                        Post date reminder to be sent To after every &nbsp;
                        &nbsp;{' '}
                        <TextField
                          variant='outlined'
                          size='small'
                          halfWidth
                          name='postDateRemaindersAfterEvery'
                          value={postDateRemaindersAfterEvery}
                          inputProps={{ type: 'number' }}
                          onChange={event => {
                            setPostDateRemaindersAfterEvery()
                          }}
                          error={
                            isSubmitted &&
                            postDateRemainders &&
                            postDateRemaindersAfterEvery == ''
                          }
                          helperText={
                            isSubmitted &&
                            postDateRemainders &&
                            postDateRemaindersAfterEvery == ''
                              ? 'Field is required'
                              : ''
                          }
                        />{' '}
                        &nbsp;&nbsp; day(s) of crossing the probation
                        Confirmation date
                      </Grid>
                      <Grid item md={6}>
                        <FormControl variant='outlined' fullWidth size='small'>
                          <Autocomplete
                            id='combo-box-demo'
                            multiple
                            options={sentToArray}
                            value={postDateRemaindersTo}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Sent To'
                                variant='outlined'
                                fullWidth
                                size='small'
                                error={
                                  isSubmitted &&
                                  postDateRemainders &&
                                  postDateRemaindersTo.length == 0
                                }
                                helperText={
                                  isSubmitted &&
                                  postDateRemainders &&
                                  postDateRemaindersTo == 0
                                    ? 'Field is required'
                                    : ''
                                }
                              />
                            )}
                            onChange={(event, value) => {
                              setPostDateRemaindersTo(value)
                            }}
                          />
                        </FormControl>{' '}
                      </Grid>
                      <Grid item md={1} className='mx-auto'></Grid>
                      <Grid item md={5} className='mx-auto'>
                        Notification Template to be used
                      </Grid>
                      <Grid item md={6}>
                        {' '}
                        <TextField
                          id='outlined-new'
                          label='Select'
                          variant='outlined'
                          fullWidth
                          select
                          size='small'
                          name='New'
                          value={postDateRemainderNotificationTemplate || ''}
                          onChange={event => {
                            setPostDateRemainderNotificationTemplate(
                              event.target.value
                            )
                          }}
                          error={
                            isSubmitted &&
                            postDateRemainders &&
                            postDateRemainderNotificationTemplate == ''
                          }
                          helperText={
                            isSubmitted &&
                            postDateRemainders &&
                            postDateRemainderNotificationTemplate == ''
                              ? 'Field is Required'
                              : ''
                          }>
                          {notificationTemplates.map(option => (
                            <MenuItem
                              key={option.notificationType}
                              value={option.uuid}>
                              {option.notificationType}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <br></br>
                    </Grid>
                  </Grid>
                  <br></br>
                  <div className='float-right' style={{ marginRight: '2.5%' }}>
                    <Button
                      className='btn-primary mb-2 m-2'
                      component={NavLink}
                      to='./dashboard'>
                      Cancel
                    </Button>
                    <Button
                      className='btn-primary mb-2 m-2'
                      onClick={e => save(e)}>
                      {saveButtonLabel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>
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
  )
}
const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ProbationControl)
