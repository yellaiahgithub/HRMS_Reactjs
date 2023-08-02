import { Card, Grid, Snackbar, TextField } from '@material-ui/core'
import { BASEURL } from 'config/conf'
import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import 'date-fns'
import apicaller from 'helper/Apicaller'
import { Autocomplete } from '@material-ui/lab'

const CreateBulkUploadDisplayCodes = props => {
  const {
    selectedCompany,
    displayDepartmentCodes,
    displayEmployeeCodes,
    displayDesignationCodes,
    displayLocationCodes,
    displayHireReasonCodes,
    displayCertificateCodes,
    displayLicenseCodes,
    displayJobGrades,
    displayJobLevel,
    displayAllActions
  } = props

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const [hireReason, setHireReason] = useState()
  const [department, setDepartment] = useState()
  const [location, setLocation] = useState()
  const [designation, setDesignation] = useState()
  const [manager, setManager] = useState()
  const [certificate, setCertificate] = useState()
  const [license, setLicense] = useState()
  const [grade, setGrade] = useState()
  const [jobLevel, setJobLevel] = useState()
  const [action, setAction] = useState()
  const [actionReasons, setActionReasons] = useState()

  const [allEmployees, setAllEmployees] = useState([])
  const [allDesigntaion, setAllDesigntaion] = useState([])
  const [allDepartments, setAllDepartments] = useState([])
  const [allLocations, setAllLocation] = useState([])
  const [allReasons, setAllReasons] = useState([])
  const [allCertificates, setAllCertificates] = useState([])
  const [allLicenses, setAllLicenses] = useState([])
  const [allGrades, setAllGrades] = useState([])
  const [allJobLevel, setAllJobLevel] = useState([])
  const [allActions, setAllActions] = useState([])
  const [allActionReasons, setAllActionReasons] = useState([])

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  useEffect(() => {
    if (displayDepartmentCodes) getAllDepartments()
    if (displayLocationCodes) getAllLocations()
    if (displayDesignationCodes) getAllDesignations()
    if (displayEmployeeCodes) getAllEmployees()
    if (displayHireReasonCodes) getActions()
    if (displayAllActions) getAllActions()
    if (displayCertificateCodes) getCertificates()
    if (displayLicenseCodes) getLicenses()
    if (displayJobGrades) getAllJobGrades()
    if (displayJobLevel) getAllJobLevel()
  }, [])
  const getAllDepartments = () => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDepartments(res.data)
        }
      })
      .catch(err => {
        console.log('getDepartments err', err)
      })
  }

  const getAllEmployees = () => {
    apicaller('get', `${BASEURL}/employee/fetchEmployeeByUserId`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          for (const iterator of res.data) {
            iterator['name'] = iterator.firstName + ' ' + iterator.lastName
          }
          setAllEmployees(res.data)
        }
      })
      .catch(err => {
        console.log('getEmployees err', err)
      })
  }

  const getAllDesignations = () => {
    apicaller(
      'get',
      `${BASEURL}/designation/fetchAll?isOneToOne=true&status=true`
    )
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllDesigntaion(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getCertificates = () => {
    apicaller('get', `${BASEURL}/itemCatalogue/fetchByType/Certificate`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllCertificates(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }
  const getLicenses = () => {
    apicaller('get', `${BASEURL}/itemCatalogue/fetchByType/License`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllLicenses(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }
  const getAllLocations = () => {
    apicaller('get', `${BASEURL}/location`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllLocation(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }
  const getActions = () => {
    apicaller('get', `${BASEURL}/action/find`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          const primaryObject = res.data.find(
            obj => obj.actionName === 'HIRE' || obj.actionName === 'hire'
          )

          if (primaryObject) {
            apicaller(
              'get',
              `${BASEURL}/action/byActionCode/?actionCode=${primaryObject.actionCode}`
            )
              .then(res => {
                if (res.status === 200) {
                  if (res.data[0]?.reasons) {
                    console.log('res.data', res.data[0]?.reasons)
                    setAllReasons(res.data[0]?.reasons)
                  }
                }
              })
              .catch(err => {
                console.log('FEtchall Action Reasons Err', err)
              })
          }
        }
      })
      .catch(err => {
        console.log('FEtchall Action Reasons Err', err)
      })
  }

  const getAllActions = () => {
    apicaller('get', `${BASEURL}/action/byActionCode`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setAllActions(res.data)
        }
      })
      .catch(err => {
        console.log('get actions err', err)
      })
  }

  const getAllJobGrades = () => {
    apicaller('get', `${BASEURL}/jobGrade/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data?.data)
          setAllGrades(res.data?.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getAllJobLevel = () => {
    apicaller('get', `${BASEURL}/jobBand/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('getAllJobLevel res.data', res.data)
          setAllJobLevel(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={10} md={10} lg={10} xl={11} className="mx-auto">
          <Grid item container spacing={2} direction="row">
            <Grid item container spacing={2} direction="row">
              <Grid item md={12}>
                <Card
                  className='codesCard shadow-xxl'
                >
                  <Grid container>
                    <Grid
                      item
                      container
                      spacing={4}
                      className='mx-auto'
                      direction='row'>
                      <Grid item md={12}>
                        <label style={{ marginTop: '8px' }} className=' mb-2 text-capitalize'>
                          Please use codes for Bulk Upload
                        </label>
                      </Grid>
                    </Grid>
                    <br />
                    {displayHireReasonCodes && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Hire Reason
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allReasons}
                              getOptionLabel={option => option.reasonName}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='hireReason'
                                  value={hireReason || ''}
                                />
                              )}
                              onSelect={event => {
                                const reason = allReasons.find(
                                  reason => reason.reasonName === event.target.value
                                )
                                setHireReason(reason?.reasonCode)
                              }}
                            />
                          </Grid>
                          {hireReason && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {hireReason}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayDepartmentCodes && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Department
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allDepartments}
                              getOptionLabel={option => option.name}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='department'
                                  value={department || ''}
                                />
                              )}
                              onSelect={event => {
                                const dept = allDepartments.find(
                                  dept => dept.name === event.target.value
                                )
                                setDepartment(dept?.id)
                              }}
                            />
                          </Grid>
                          {department && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {department}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayLocationCodes && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Location
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allLocations}
                              getOptionLabel={option => option.locationName}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='location'
                                  value={location || ''}
                                />
                              )}
                              onSelect={event => {
                                const location = allLocations.find(
                                  loc => loc.locationName === event.target.value
                                )
                                setLocation(location?.locationId)
                              }}
                            />
                          </Grid>
                          {location && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {location}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayDesignationCodes && (
                      <>
                        {' '}
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Designation
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allDesigntaion}
                              getOptionLabel={option => option.name}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='designation'
                                  value={designation || ''}
                                />
                              )}
                              onSelect={event => {
                                const desc = allDesigntaion.find(
                                  desc => desc.name === event.target.value
                                )
                                setDesignation(desc?.id)
                              }}
                            />
                          </Grid>
                          {designation && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {designation}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayEmployeeCodes && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Employee ID
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allEmployees}
                              getOptionLabel={option => option.name}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='manager'
                                  value={manager || ''}
                                />
                              )}
                              onSelect={event => {
                                const manager = allEmployees.find(
                                  emp => emp.name === event.target.value
                                )
                                setManager(manager?.id)
                              }}
                            />
                          </Grid>
                          {manager && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {manager}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayCertificateCodes && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Certificate Codes
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allCertificates}
                              getOptionLabel={option => option.description}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='certificate'
                                  value={certificate || ''}
                                />
                              )}
                              onSelect={event => {
                                const certificate = allCertificates.find(
                                  cert => cert.description === event.target.value
                                )
                                setCertificate(certificate?.code)
                              }}
                            />
                          </Grid>
                          {certificate && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {certificate}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayLicenseCodes && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              License Codes
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allLicenses}
                              getOptionLabel={option => option.description}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='license'
                                  value={license || ''}
                                />
                              )}
                              onSelect={event => {
                                const license = allLicenses.find(
                                  lic => lic.description === event.target.value
                                )
                                setLicense(license?.code)
                              }}
                            />
                          </Grid>
                          {license && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {license}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayJobGrades && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Job Grade Codes
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allGrades}
                              getOptionLabel={option => option.gradeName}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='grade'
                                  value={grade || ''}
                                />
                              )}
                              onSelect={event => {
                                const grade = allGrades.find(
                                  grade => grade.gradeName === event.target.value
                                )
                                setGrade(grade?.gradeId)
                              }}
                            />
                          </Grid>
                          {grade && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {grade}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}
                    {displayJobLevel && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Job Level Codes
                            </label>
                          </Grid>
                          <Grid item md={4}>
                            <Autocomplete
                              id='combo-box-demo'
                              options={allJobLevel}
                              getOptionLabel={option => option ? option.bandName : ''}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  label='Select'
                                  variant='outlined'
                                  fullWidth
                                  size='small'
                                  name='jobLevel'
                                  value={jobLevel || ''}
                                />
                              )}
                              onSelect={event => {
                                const jobLevel = allJobLevel.find(
                                  jobLevel => jobLevel.bandName === event.target.value
                                )
                                setJobLevel(jobLevel?.bandId)
                              }}
                            />
                          </Grid>
                          {jobLevel && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {jobLevel}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}

                    {displayAllActions && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Action
                            </label>
                          </Grid>
                          {allActions && (
                            <Grid item md={4}>
                              <Autocomplete
                                id='combo-box-demo'
                                options={allActions}
                                getOptionLabel={option => option.actionName}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Select'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    name='action'
                                    value={action || ''}
                                  />
                                )}
                                onSelect={event => {
                                  console.log('event.target.value', event.target.value)
                                  const action = allActions.find(
                                    action => action.actionName === event.target.value
                                  )
                                  if (action) {
                                    setAllActionReasons(action.reasons)
                                    setAction(action.actionCode)
                                  }
                                }}
                              />
                            </Grid>
                          )}
                          {action && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {action}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}

                    {displayAllActions && allActionReasons && (
                      <>
                        <Grid
                          item
                          container
                          spacing={4}
                          className='mx-auto'
                          direction='row'>
                          <Grid item md={3}>
                            <label style={{ marginTop: '8px' }} className=' mb-2'>
                              Action Reasons
                            </label>
                          </Grid>
                          {allActionReasons && (
                            <Grid item md={4}>
                              <Autocomplete
                                id='combo-box-demo'
                                options={allActionReasons}
                                getOptionLabel={option => option.reasonName}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Select'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    name='actionReasons'
                                    value={actionReasons || ''}
                                  />
                                )}
                                onSelect={event => {
                                  const reasonObj = allActionReasons.find(
                                    reason => reason.reasonName === event.target.value
                                  )
                                  if (reasonObj) {
                                    setActionReasons(reasonObj.reasonCode)
                                  }
                                }}
                              />
                            </Grid>
                          )}
                          {actionReasons && (
                            <>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  code:
                                </label>
                              </Grid>
                              <Grid item md={1}>
                                <label style={{ marginTop: '8px' }} className=' mb-2'>
                                  {actionReasons}
                                </label>
                              </Grid>
                            </>
                          )}
                        </Grid>
                        <br />
                      </>
                    )}

                  </Grid>

                </Card>

              </Grid>
            </Grid>
          </Grid>
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
      <br />
      <br />
    </>
  )
}

const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBulkUploadDisplayCodes)
