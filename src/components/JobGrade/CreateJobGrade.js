import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Snackbar,
  Switch,
  Radio
} from '@material-ui/core'
import { BASEURL } from 'config/conf'
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation, useHistory } from 'react-router-dom'
import apicaller from 'helper/Apicaller'
import BlockUi from 'react-block-ui'
import { ClimbingBoxLoader } from 'react-spinners'
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

const CreateJobGrade = props => {
  const { selectedCompany } = props
  const [isSubmitted, setIsSubmitted] = useState()
  const [blocking, setBlocking] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id') || null
  const readOnly = queryParams.get('readOnly')?.toLowerCase() == 'true' || false
  const edit = id ? true : false

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state
  const [gradeUuid, setGradeUuid] = useState()
  const [gradeId, setGradeID] = useState()
  const [gradeName, setGradeName] = useState()
  const [effectiveDate, setEffectiveDate] = useState(null)
  const [status, setStatus] = useState(true)
  const [currentEffectiveStatus, setCurrentEffectiveStatus] = useState(
    edit
      ? [
        { label: 'Active', value: true },
        { label: 'InActive', value: false }
      ]
      : [{ label: 'Active', value: true }]
  )
  const [description, setDescription] = useState()

  const [minimum, setMinimum] = useState()
  const [midPoint, setMidPoint] = useState()
  const [maximum, setMaximum] = useState()
  const [progressionRules, setProgressionRules] = useState(false)
  const [maximumService, setMaxService] = useState()
  const [minService, setMinService] = useState()
  const [reviewsRatings, setReviewsRatings] = useState(false)
  const [reviewsNumber, setReviewNumbers] = useState()
  const [isRating, setIsRating] = useState('')
  const [minRatingValue, setMinRatingValue] = useState()
  const [averageRatingValue, setAverageRatingValue] = useState()
  const [maxRatingValue, setMaxRatingValue] = useState()
  const [byAge, setByAge] = useState(false)
  const [minAge, setMinAge] = useState()
  const [nextGrade, setNextGrade] = useState(null)
  const [allGrades, setAllGrades] = useState()

  const saveButtonLabel = edit ? 'Update' : 'Save'

  const handleClose = () => {
    setState({ ...state, open: false })
  }
  useEffect(() => {
    if (id) {
      getJobGrade()
    } else {
      getJobGrades('')
    }
  }, [])

  const getJobGrades = (nextGrade) => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/jobGrade/fetchAll`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data?.data)
          setAllGrades(res.data?.data)
          if (nextGrade && nextGrade !== '') {
            setNextGrade(res.data?.data.find(x => x.gradeName === nextGrade))
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getJObGrade err', err)
      })
  }

  const getJobGrade = () => {
    apicaller('get', `${BASEURL}/jobGrade/fetchBy/?gradeId=` + id)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res?.data?.data[0])
          setGradeName(res?.data?.data[0].gradeName)
          setStatus(res?.data?.data[0].status)
          setEffectiveDate(
            new Date(res?.data?.data[0].effectiveDate)?.toLocaleDateString()
          )
          setGradeID(res?.data?.data[0].gradeId)
          setDescription(res?.data?.data[0].description)
          setGradeUuid(res?.data?.data[0].uuid)
          setMinimum(res?.data?.data[0].gradeSalaryRangeMinimum)
          setMidPoint(res?.data?.data[0].gradeSalaryRangeMidPoint)
          setMaximum(res?.data?.data[0].gradeSalaryRangeMaximum)
          setProgressionRules(res?.data?.data[0].progressionByService)
          setMaxService(res?.data?.data[0].maximumService)
          setMinService(res?.data?.data[0].minimumService)
          setReviewsRatings(res?.data?.data[0].progressionByReviewsRatings)
          setReviewNumbers(res?.data?.data[0].minimumNumberOfReviews)
          setMinRatingValue(res?.data?.data[0].minimumRating)
          setAverageRatingValue(res?.data?.data[0].averageRating)
          setMaxRatingValue(res?.data?.data[0].finalRating)
          setByAge(res?.data?.data[0].progressionByAge)
          setMinAge(res?.data?.data[0].minimumAge)
          getJobGrades(res?.data?.data[0].nextGrade)
          if (res?.data?.data[0].averageRating) {
            setIsRating('averageRating')
          } else if (res?.data?.data[0].minimumRating) {
            setIsRating('minRating')
          } else if (res?.data?.data[0].finalRating) {
            setIsRating('maxRating')
          }
        }
      })
      .catch(err => {
        console.log('getJobGrade err', err)
        getJobGrades('')
      })
  }

  const showErrorMsg = () => {
    setState({
      open: true,
      message: 'Missing fields are required',
      toastrStyle: 'toastr-warning',
      vertical: 'top',
      horizontal: 'right'
    })
  }

  const save = e => {
    e.preventDefault()
    setIsSubmitted(true)
    // to do service call

    if (byAge && !minAge) {
      showErrorMsg()
      return
    }
    if (
      (progressionRules && !minService) ||
      minService == '' ||
      (progressionRules && !maximumService) ||
      maximumService == ''
    ) {
      showErrorMsg()
      return
    }
    if (reviewsRatings) {
      if (isRating == '') {
        showErrorMsg()
        return
      }
    }
    if (reviewsRatings && isRating) {
      if (!minRatingValue && !averageRatingValue && !maxRatingValue) {
        showErrorMsg()
        return
      }
    }

    if (gradeId && gradeName && effectiveDate && validDate) {
      let data = {
        gradeId: gradeId,
        gradeName: gradeName,
        effectiveDate: effectiveDate,
        status: status,
        description: description,
        gradeSalaryRangeMinimum: minimum,
        gradeSalaryRangeMidPoint: midPoint,
        gradeSalaryRangeMaximum: maximum,
        progressionByService: progressionRules,
        minimumService: minService,
        maximumService: maximumService,
        minimumNumberOfReviews: reviewsNumber,
        progressionByReviewsRatings: reviewsRatings,
        minimumRating: minRatingValue,
        averageRating: averageRatingValue,
        finalRating: maxRatingValue,
        progressionByAge: byAge,
        minimumAge: minAge,
        nextGrade: nextGrade ? nextGrade.uuid : null
      }

      if (edit) {
        data.uuid = gradeUuid
        apicaller('put', `${BASEURL}/jobGrade/update`, data)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              setGradeID('')
              setGradeName('')
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
              history.push('/jobGrade')
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
              if (err?.response?.data.indexOf('to be unique') !== -1) {
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
        apicaller('post', `${BASEURL}/jobGrade/save`, data)
          .then(res => {
            if (res.status === 200) {
              console.log('res.data', res.data)
              setIsSubmitted(false)
              setBlocking(false)
              if (res?.data[0]) {
                setState({
                  open: true,
                  message: 'Updated Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
                history.push('/jobGrade')
              }
              else if (res?.data?.errors.length > 0) {
                setState({
                  open: true,
                  message: res?.data?.errors[0],
                  toastrStyle: 'toastr-warning',
                  vertical: 'top',
                  horizontal: 'right'
                })
              } else {
                setState({
                  open: true,
                  message: 'Added Successfully',
                  toastrStyle: 'toastr-success',
                  vertical: 'top',
                  horizontal: 'right'
                })
                history.push('/jobGrade')
              }
            }
          })
          .catch(err => {
            setBlocking(false)
            if (err?.response?.data) {
              if (err?.response?.data.indexOf('to be unique') !== -1) {
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
      showErrorMsg()
      return
    }
    setIsSubmitted(true)
  }

  const handleSubmit = event => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  const [validDate, setValidDate] = useState(edit ? true : false)
  const companyCreatedDate = new Date(
    selectedCompany?.registrationDate
  )

  const validateDate = date => {
    if (date && !isNaN(Date.parse(date))) {
      if (new Date(date) < companyCreatedDate) {
        setValidDate(false)
      } else {
        setValidDate(true)
      }
    } else {
      if (date) setValidDate(false)
      else setValidDate(true)
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={10} md={10} lg={10} xl={10} className='mx-auto'>
              <div className='bg-white p-4 rounded'>
                <div className='text-center my-4'>
                  <h1 className='display-4 mb-1 font-weight-normal'>
                    Create Job Grade
                  </h1>
                </div>
              </div>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Grade ID *
                  </label>
                  <TextField
                    id='outlined-gradeId'
                    placeholder='Grade ID'
                    variant='outlined'
                    fullWidth
                    size='small'
                    disabled={edit}
                    name='gradeId'
                    value={gradeId}
                    error={isSubmitted && (gradeId ? false : true)}
                    helperText={
                      isSubmitted && (gradeId ? '' : 'Field is Mandatory')
                    }
                    onChange={event => {
                      if (event.target) {
                        setGradeID(event.target.value)
                      }
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Grade Name *
                  </label>
                  <TextField
                    id='outlined-gradeName'
                    placeholder='Grade Name'
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='gradeName'
                    value={gradeName}
                    error={isSubmitted && (gradeName ? false : true)}
                    helperText={
                      isSubmitted && (gradeName ? '' : 'Field is Mandatory')
                    }
                    onChange={event => {
                      if (event.target) {
                        setGradeName(event.target.value)
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className='font-weight-normal mb-2'>
                      Effective Date *
                    </label>
                    <MuiPickersUtilsProvider
                      utils={DateFnsUtils}
                      style={{ margin: '0%' }}>
                      <KeyboardDatePicker
                        style={{ margin: '0%' }}
                        inputVariant='outlined'
                        format='dd/MM/yyyy'
                        margin='normal'
                        id='date-picker-inline'
                        minDate={companyCreatedDate}
                        fullWidth
                        size='small'
                        value={effectiveDate}
                        onChange={event => {
                          validateDate(event)
                          setEffectiveDate(event)
                        }}
                        error={
                          isSubmitted
                            ? effectiveDate
                              ? effectiveDate !== null &&
                                effectiveDate instanceof Date &&
                                new Date(effectiveDate) < companyCreatedDate
                                ? "Effective Date Should be greater than company's created Date"
                                : null
                              : 'Effective Date Required'
                            : effectiveDate !== null &&
                              effectiveDate instanceof Date &&
                              new Date(effectiveDate) < companyCreatedDate
                              ? "Effective Date Should be greater than company's created Date"
                              : null
                                ? !isSubmitted
                                : effectiveDate !== null &&
                                  effectiveDate instanceof Date &&
                                  new Date(effectiveDate) < companyCreatedDate
                                  ? "Effective Date Should be greater than company's created Date"
                                  : null
                        }
                        helperText={
                          isSubmitted
                            ? effectiveDate
                              ? effectiveDate !== null &&
                                effectiveDate instanceof Date &&
                                new Date(effectiveDate) < companyCreatedDate
                                ? "Effective Date Should be greater than company's created Date"
                                : null
                              : 'Effective Date Required'
                            : effectiveDate !== null &&
                              effectiveDate instanceof Date &&
                              new Date(effectiveDate) < companyCreatedDate
                              ? "Effective Date Should be greater than company's created Date"
                              : null
                                ? !isSubmitted
                                : effectiveDate !== null &&
                                  effectiveDate instanceof Date &&
                                  new Date(effectiveDate) < companyCreatedDate
                                  ? "Effective Date Should be greater than company's created Date"
                                  : null
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
                    <label className='font-weight-normal mb-2'>Status</label>
                    <TextField
                      variant='outlined'
                      fullWidth
                      id='outlined-phoneStatus'
                      select
                      label='Select'
                      size='small'
                      name='status'
                      error={isSubmitted && (status ? false : true)}
                      helperText={
                        isSubmitted && (status ? '' : 'Status is Required')
                      }
                      value={status}
                      onChange={event => {
                        setStatus(event.target.value)
                      }}>
                      {currentEffectiveStatus.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={12}>
                  <label
                    style={{ marginTop: '15px' }}
                    className='font-weight-normal mb-2'>
                    Description
                  </label>
                  <TextField
                    fullWidth
                    id='outlined-multiline-flexible'
                    variant='outlined'
                    label=''
                    multiline
                    rowsMax='5'
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
              </Grid>
              <br></br> <br></br>
              <b>Grade Salary Range</b>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <div>
                    <label className='font-weight-normal mb-2'>Minimum</label>
                    <TextField
                      id='outlined-minimum'
                      placeholder='Minimum'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='minimum'
                      value={minimum}
                      onChange={event => {
                        setMinimum(event.target.value)
                      }}
                    />
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div>
                    <label className='font-weight-normal mb-2'>Mid Point</label>
                    <TextField
                      id='outlined-midPoint'
                      placeholder='Mid Point'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='midPoint'
                      value={midPoint}
                      onChange={event => {
                        setMidPoint(event.target.value)
                      }}
                    />
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div>
                    <label className='font-weight-normal mb-2'>Maximum</label>
                    <TextField
                      id='outlined-maximum'
                      placeholder='Maximum'
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='maximum'
                      value={maximum}
                      onChange={event => {
                        setMaximum(event.target.value)
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
              <br></br> <br></br>
              <b>Progression Rules</b>
              <Grid container spacing={6}>
                <Grid item md={8}>
                  <div className='mt-4'>
                    <label className='font-weight-normal mb-2'></label>
                    <Switch
                      onChange={event => {
                        console.log(event)
                        setProgressionRules(event.target.checked)
                        if (event.target.value == false) {
                          setMinService()
                          setMaxService()
                        }
                      }}
                      checked={progressionRules}
                      name='progressionRules'
                      color='primary'
                      className='switch-small'
                    />{' '}
                    &nbsp; By Number of years of services
                  </div>
                </Grid>
              </Grid>
              {progressionRules ? (
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className='font-weight-normal mb-2'>
                        Minimum Service
                      </label>{' '}
                      <br></br>
                      <TextField
                        id='outlined-minService'
                        placeholder='Minimum Service'
                        variant='outlined'
                        halfWidth
                        size='small'
                        name='minService'
                        value={minService}
                        onChange={event => {
                          setMinService(event.target.value)
                        }}
                        helperText={
                          isSubmitted &&
                            progressionRules &&
                            (!minService || minService === '')
                            ? 'Minimum Service is required'
                            : ''
                        }
                        error={
                          isSubmitted &&
                            progressionRules &&
                            (!minService || minService === '')
                            ? true
                            : false
                        }
                      />
                      &nbsp; <span className='mb-2'>Yrs</span>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className='font-weight-normal mb-2'>
                        Maximum Service
                      </label>{' '}
                      <br></br>
                      <TextField
                        id='outlined-maximumService'
                        placeholder='Maximum Service'
                        variant='outlined'
                        halfWidth
                        size='small'
                        name='maximumService'
                        value={maximumService}
                        onChange={event => {
                          setMaxService(event.target.value)
                        }}
                        helperText={
                          isSubmitted &&
                            progressionRules &&
                            (!maximumService || maximumService === '')
                            ? 'Maximum Service is required'
                            : ''
                        }
                        error={
                          isSubmitted &&
                            progressionRules &&
                            (!maximumService || maximumService === '')
                            ? true
                            : false
                        }
                      />
                      &nbsp; <span className='mb-2'>Yrs</span>
                    </div>
                  </Grid>
                </Grid>
              ) : (
                ''
              )}
              <Grid container spacing={6}>
                <Grid item md={8}>
                  <div className='mt-4'>
                    <Switch
                      onChange={event => {
                        console.log(event)
                        setReviewsRatings(event.target.checked)
                        if (event.target.value == false) {
                          setIsRating('')
                          setMinRatingValue()
                          setAverageRatingValue()
                          setMaxRatingValue()
                          setReviewNumbers()
                        }
                      }}
                      checked={reviewsRatings}
                      name='reviewsRatings'
                      color='primary'
                      className='switch-small'
                    />
                    &nbsp; By Number of Reviews And Ratings
                  </div>
                </Grid>
              </Grid>
              {reviewsRatings ? (
                <>
                  <Grid container spacing={6}>
                    <Grid item md={6}>
                      <div className='mt-4'>
                        <label className='font-weight-normal mb-2'>
                          Minimum Number of Reviews &nbsp;
                        </label>
                        <TextField
                          id='outlined-reviewsNumber'
                          placeholder='Number of Reviews'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='reviewsNumber'
                          value={reviewsNumber}
                          onChange={event => {
                            setReviewNumbers(event.target.value)
                          }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <div className='d-flex'>
                        <Grid item md={4}>
                          <Radio
                            checked={isRating === 'minRating'}
                            onChange={event => {
                              setIsRating(event.target.value)
                            }}
                            value='minRating'
                            name='radio-minRating'
                            inputProps={{ 'aria-label': 'minRating' }}
                            label='minRating'
                          />
                          Minimum Rating{' '}
                        </Grid>
                        <Grid item md={4}>
                          <TextField
                            id='outlined-minRating'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='minRating'
                            placeholder='Minimum Rating Value'
                            value={minRatingValue}
                            onChange={event => {
                              setMinRatingValue(event.target.value)
                            }}
                            helperText={
                              isSubmitted && isRating === ''
                                ? 'Minimum or Average or Final Rating is required. Select any one'
                                : '' ||
                                  (isSubmitted &&
                                    isRating === 'minRating' &&
                                    (!minRatingValue || minRatingValue === ''))
                                  ? 'Minimum Rating Value is required'
                                  : ''
                            }
                            error={
                              isSubmitted && isRating === ''
                                ? true
                                : false ||
                                  (isSubmitted &&
                                    isRating === 'minRating' &&
                                    (!minRatingValue || minRatingValue === ''))
                                  ? true
                                  : false
                            }
                          />
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <div className='d-flex'>
                        <Grid item md={4}>
                          <Radio
                            checked={isRating === 'averageRating'}
                            onChange={event => {
                              setIsRating(event.target.value)
                            }}
                            value='averageRating'
                            name='radio-averageRating'
                            inputProps={{ 'aria-label': 'averageRating' }}
                            label='averageRating'
                          />
                          Average Rating{' '}
                        </Grid>
                        <Grid item md={4}>
                          <TextField
                            placeholder='Average Rating Value'
                            id='outlined-reviewsNumber'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='averageRating'
                            value={averageRatingValue}
                            onChange={event => {
                              setAverageRatingValue(event.target.value)
                            }}
                            helperText={
                              isSubmitted && isRating === ''
                                ? 'Minimum or Average or Final Rating is required. Select any one'
                                : '' ||
                                  (isSubmitted &&
                                    isRating === 'averageRating' &&
                                    (!averageRatingValue ||
                                      averageRatingValue === ''))
                                  ? 'Average Rating Value is required'
                                  : ''
                            }
                            error={
                              isSubmitted && isRating === ''
                                ? true
                                : false ||
                                  (isSubmitted &&
                                    isRating === 'averageRating' &&
                                    (!averageRatingValue ||
                                      averageRatingValue === ''))
                                  ? true
                                  : false
                            }
                          />
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <div className='d-flex'>
                        <Grid item md={4}>
                          <Radio
                            checked={isRating === 'maxRating'}
                            onChange={event => {
                              setIsRating(event.target.value)
                            }}
                            value='maxRating'
                            name='radio-maxRating'
                            inputProps={{ 'aria-label': 'maxRating' }}
                            label='maxRating'
                          />
                          Final Rating{' '}
                        </Grid>
                        <Grid item md={4}>
                          <TextField
                            placeholder='Final Rating Value'
                            id='outlined-maxRatingValue'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='MaxRatingValue'
                            value={maxRatingValue}
                            onChange={event => {
                              setMaxRatingValue(event.target.value)
                            }}
                            helperText={
                              isSubmitted && isRating === ''
                                ? 'Minimum or Average or Final Rating is required. Select any one'
                                : '' ||
                                  (isSubmitted &&
                                    isRating === 'maxRating' &&
                                    (!maxRatingValue || maxRatingValue === ''))
                                  ? 'Final Rating Value is required'
                                  : ''
                            }
                            error={
                              isSubmitted && isRating === ''
                                ? true
                                : false ||
                                  (isSubmitted &&
                                    isRating === 'maxRating' &&
                                    (!maxRatingValue || maxRatingValue === ''))
                                  ? true
                                  : false
                            }
                          />
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </>
              ) : (
                ''
              )}
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div className='mt-4'>
                    <label className='font-weight-normal mb-2'></label>
                    <Switch
                      onChange={event => {
                        console.log(event)
                        setByAge(event.target.checked)
                        if (event.target.checked == false) {
                          setMinAge()
                        }
                      }}
                      checked={byAge}
                      name='progressionRules'
                      color='primary'
                      className='switch-small'
                    />{' '}
                    &nbsp; By Age
                  </div>
                </Grid>
                {byAge ? (
                  <Grid item md={6}>
                    <div>
                      <label className='font-weight-normal mb-2'>
                        Age should be Minimum &nbsp;
                      </label>{' '}
                      <br></br>
                      <TextField
                        id='outlined-minAge'
                        placeholder='Minimum Age'
                        variant='outlined'
                        halfWidth
                        size='small'
                        name='minAge'
                        value={minAge}
                        onChange={event => {
                          setMinAge(event.target.value)
                        }}
                        helperText={
                          isSubmitted && byAge && (!minAge || minAge === '')
                            ? 'Minimum Age is required'
                            : ''
                        }
                        error={
                          isSubmitted && byAge && (!minAge || minAge === '')
                            ? true
                            : false
                        }
                      />
                      &nbsp; <span className='mb-2'>Yrs</span>
                    </div>
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <div>
                    <label className='font-weight-normal mb-2'>Next Grade </label>
                    <Autocomplete
                      id='combo-box-demo'
                      options={allGrades}
                      getOptionLabel={option => option.gradeName}
                      value={nextGrade}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select'
                          variant='outlined'
                          fullWidth
                          size='small'
                          name='selectedEmployee'
                          value={nextGrade}
                        />
                      )}
                      onChange={(event, value) => {
                        setNextGrade(value)
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <br></br> <br></br>
            <div className='divider' />
            <div className='divider' />
            <div className='w-100'>
              <div className='float-right' style={{ marginRight: '2.5%' }}>
                <Button
                  className='btn-primary mb-2 m-2'
                  component={NavLink}
                  to='./jobGrade'>
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
        </form>
      </Card>
    </BlockUi>
  )
}

const mapStateToProps = state => ({
  user: state.Auth.user,
  selectedCompany: state.Auth.selectedCompany
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CreateJobGrade)
