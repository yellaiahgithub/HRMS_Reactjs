import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux'
import apicaller from 'helper/Apicaller'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Table,
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Card,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  TextField,
  FormControl,
  Select,
  Snackbar
} from '@material-ui/core'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { ClimbingBoxLoader } from 'react-spinners'

import Pagination from '@material-ui/lab/Pagination'
import BlockUi from 'react-block-ui'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import Autocomplete from '@material-ui/lab/Autocomplete'
import avatar5 from '../../assets/images/avatars/avatar8.png'
import styles from '../ViewEmployeeDetails/employee.module.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useHistory, useLocation } from 'react-router-dom'
import EmployeeDetailsCard from '../MyProfile/EmployeeDetailsCard'

const SearchOrg = props => {
  const { selectedCompany } = props
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  useEffect(() => {
    getEmployees()
    if (employeeSelected) {
      fetchEmployeesHirarchy(props.user)
      setEmployeeDetail(props.user)
    }
  }, [])

  const [allEmployees, setEmployees] = useState([])
  const [blocking, setBlocking] = useState(false)


  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const userUUID = queryParams.get('userUUID') || null
  const employeeSelected = userUUID ? true : false

  const getEmployees = () => {
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          for (const iterator of res.data) {
            iterator['nameWithId'] =
              iterator.employeeName + '-' + iterator.employeeID
          }
          setEmployees(res.data)
        } else {
          setEmployees([])
        }
      })
      .catch(err => {
        console.log('getEmployees err', err)
        setEmployees([])
      })
  }

  const [open3, setOpen3] = useState(false)

  const handleClose3 = () => {
    setOpen3(false)
  }

  const [employeeDetail, setEmployeeDetail] = useState()

  const getEmployeeID = selectedEmployee => {
    if (selectedEmployee && selectedEmployee !== null) {
      setEmployeeDetail(selectedEmployee)
      fetchEmployeesHirarchy(selectedEmployee)
    } else {
      setEmployeeDetail()
    }
  }

  const [orgData, setOrgData] = useState()

  const fetchEmployeesHirarchy = employee => {
    setBlocking(true)
    apicaller(
      'post',
      `${BASEURL}/employee/fetchEmployeesHirarchy?uuid=${employee.uuid}&companyUUID=${selectedCompany.uuid}`
    )
      .then(async res => {
        if (res.status === 200) {

          if (res.data[0]) {
            let empArray = []

            if (res.data[0]?.file) {
              res.data[0]['imgSrc'] = await getImage(res.data[0]?.file)
            }

            if (res.data[0].managerData.length > 0) {
              for (let i = 0; i < res.data[0].managerData.length; i++) {
                if (res.data[0].managerData[i].file) {
                  res.data[0].managerData[i]['imgSrc'] = await getImage(
                    res.data[0].managerData[i].file
                  )
                } else {
                }
              }
            }

            if (res.data[0].reportees.length > 0) {
              for (let i = 0; i < res.data[0].reportees.length; i++) {
                if (res.data[0].reportees[i].file) {
                  res.data[0].reportees[i]['imgSrc'] = await getImage(
                    res.data[0].reportees[i].file
                  )
                } else {
                }
              }
            }
            setBlocking(false)
            setOrgData(res.data[0])
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        if (err.response?.data) {
        }
        console.log('get employee err', err)
      })
  }

  const getImage = file => {
    return new Promise(resolve => {
      if (file) {
        let path = file?.filePath + '/' + file?.fileName
        apicaller('get', `${BASEURL}/storage?path=` + path)
          .then(res => {
            if (res.status === 200) {
              if (res.data) {
                let baseStr64 = res.data
                let imgSrc64 = 'data:image/jpg;base64,' + baseStr64
                // Set the source of the Image to the base64 string
                resolve(imgSrc64)
              }
            }
          })
          .catch(err => {
            console.log('updateSession err', err)
          })
      }
    })
  }

  const getParsedDate = date => {
    if (date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }

  const getInitials = name => {
    if (name) {
      let first_name = name.charAt(0)
      let last_name = name.split(' ').pop().charAt(0)
      return first_name + last_name
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
        <Card>
          <Grid container spacing={0}>
            <Grid item xs={11} md={11} lg={11} xl={11} className='mx-auto'>
              <div className='bg-white p-4 rounded'>

                {employeeSelected ? <EmployeeDetailsCard employeeDetails={props.user} /> : ''}

                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <div>
                      <label className=' mb-2'>
                        Search Employee *
                      </label>
                      <Autocomplete
                        id='combo-box-demo'
                        options={allEmployees}
                        getOptionLabel={option => option.nameWithId}
                        value={employeeDetail || undefined}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Select'
                            variant='outlined'
                            fullWidth
                            size='small'
                            name='selectedEmployee'
                          />
                        )}
                        onChange={(event, value) => {
                          getEmployeeID(value)
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
                {employeeDetail ? (
                  <>
                    <br></br>
                    <Card className='card-box'>
                      <div className='card-header bg-secondary'>
                        <div className='card-header--title'>
                          <b>Org Chart</b>
                        </div>
                      </div>
                      <Grid container spacing={0}>
                        <Grid item md={12} className="mx-auto">

                          <div className='scroll-area-xxl'>
                            <PerfectScrollbar options={{ wheelPropagation: true }}>
                              <div>
                                {orgData ? (
                                  <div className={styles.orgTree}>
                                    <ul style={{ paddingLeft: '0px' }}>
                                      <li style={{ float: 'inherit' }}>
                                        {orgData?.managerData.length > 0 ? (
                                          <>
                                            {orgData?.managerData.map(
                                              (managerData, idx) => (
                                                <>
                                                  <div
                                                    className={styles.card1}
                                                    onClick={e =>
                                                      fetchEmployeesHirarchy(
                                                        managerData
                                                      )
                                                    }>
                                                    <div
                                                      className={styles.card1Body}>
                                                      <Grid
                                                        item
                                                        md={12}
                                                        container
                                                        className='mx-auto mb-2'
                                                        direction='row'>
                                                        <Grid item md={3}>
                                                          {managerData?.file ? (
                                                            <div className='avatar-icon-wrapper avatar-icon-lg'>
                                                              <div className='avatar-icon'>
                                                                <img
                                                                  src={
                                                                    managerData?.imgSrc
                                                                  }
                                                                  alt={getInitials(
                                                                    managerData?.employeeName
                                                                  )}
                                                                />
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className='avatar-icon-wrapper avatar-initials avatar-icon-lg'>
                                                              <div className='avatar-icon text-white bg-success'>
                                                                {getInitials(
                                                                  managerData?.employeeName
                                                                )}
                                                              </div>
                                                            </div>
                                                          )}
                                                        </Grid>{' '}
                                                        <Grid
                                                          item
                                                          md={9}
                                                          style={{
                                                            padding: '10px'
                                                          }}>
                                                          <span
                                                            style={{
                                                              textAlign: 'left'
                                                            }}>
                                                            <h6>
                                                              {' '}
                                                              {
                                                                managerData?.employeeName
                                                              }{' '}
                                                              (
                                                              {
                                                                managerData?.employeeID
                                                              }
                                                              )
                                                            </h6>
                                                            <p>
                                                              {' '}
                                                              {
                                                                managerData?.department
                                                              }
                                                            </p>
                                                            <p>
                                                              {' '}
                                                              {
                                                                managerData?.location
                                                              }
                                                            </p>

                                                            {managerData?.employeePhone ==
                                                              'NA' ? (
                                                              ''
                                                            ) : (
                                                              <p>
                                                                {
                                                                  managerData?.employeePhone
                                                                }
                                                              </p>
                                                            )}
                                                            { }

                                                            {managerData?.employeeEmail ==
                                                              'NA' ? (
                                                              ''
                                                            ) : (
                                                              <p>
                                                                {' '}
                                                                {
                                                                  managerData?.employeeEmail
                                                                }
                                                              </p>
                                                            )}
                                                          </span>
                                                        </Grid>{' '}
                                                      </Grid>
                                                    </div>
                                                    <div
                                                      className={styles.cardFooter}>
                                                      <p>
                                                        {managerData?.designation}
                                                      </p>
                                                    </div>
                                                    <div></div>
                                                  </div>{' '}
                                                </>
                                              )
                                            )}
                                          </>
                                        ) : (
                                          ''
                                        )}

                                        {orgData?.managerData.length > 0 ? (
                                          <ul></ul>
                                        ) : (
                                          ''
                                        )}
                                        <div
                                          className={styles.card1}
                                          onClick={e =>
                                            fetchEmployeesHirarchy(orgData)
                                          }>
                                          <div className={styles.card1Body}>
                                            <Grid
                                              item
                                              md={12}
                                              container
                                              className='mx-auto mb-2'
                                              direction='row'>
                                              <Grid item md={3}>
                                                {/* <div className={styles.image}> */}
                                                {orgData?.file ? (
                                                  <div className='avatar-icon-wrapper avatar-icon-lg'>
                                                    <div className='avatar-icon'>
                                                      <img
                                                        src={orgData.imgSrc}
                                                        alt={getInitials(
                                                          orgData?.employeeName
                                                        )}
                                                      />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className='avatar-icon-wrapper avatar-initials avatar-icon-lg'>
                                                    <div className='avatar-icon text-white bg-success'>
                                                      {getInitials(
                                                        orgData?.employeeName
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                                {/* </div> */}
                                              </Grid>{' '}
                                              <Grid
                                                item
                                                md={9}
                                                style={{ padding: '10px' }}>
                                                <span style={{ textAlign: 'left' }}>
                                                  <h6>
                                                    {' '}
                                                    {orgData?.employeeName} (
                                                    {orgData?.employeeID})
                                                  </h6>
                                                  <p> {orgData?.department}</p>
                                                  <p> {orgData?.location}</p>
                                                  {orgData?.employeePhone ==
                                                    'NA' ? (
                                                    ''
                                                  ) : (
                                                    <p>
                                                      {' '}
                                                      {orgData?.employeePhone}{' '}
                                                    </p>
                                                  )}
                                                  {orgData?.employeeEmail ==
                                                    'NA' ? (
                                                    ''
                                                  ) : (
                                                    <p>
                                                      {' '}
                                                      {orgData?.employeeEmail}{' '}
                                                    </p>
                                                  )}
                                                </span>
                                              </Grid>{' '}
                                            </Grid>
                                          </div>
                                          <div className={styles.cardFooter}>
                                            <p>{orgData?.designation}</p>
                                          </div>
                                          <div></div>
                                        </div>
                                        {orgData?.reportees.length > 0 ? <ul></ul> : ''}
                                      </li>
                                    </ul>
                                    <div className={styles.orgTree}>
                                      <ul style={{ padding: '0px' }}>
                                        <div
                                          style={{
                                            display: 'flex',
                                            overflowX: 'scroll',
                                            marginLeft: '16px',
                                            marginTop: '-17px'
                                          }}>
                                          {orgData?.reportees.length > 0 ? (
                                            <>
                                              {orgData?.reportees.map(
                                                (item, idx) => (
                                                  <>
                                                    <li className='mb-4'>
                                                      {' '}
                                                      <div
                                                        className={styles.card1}
                                                        onClick={e =>
                                                          fetchEmployeesHirarchy(
                                                            item
                                                          )
                                                        }>
                                                        <div
                                                          className={
                                                            styles.card1Body
                                                          }>
                                                          <Grid
                                                            item
                                                            md={12}
                                                            container
                                                            className='mx-auto mb-2'
                                                            direction='row'>
                                                            <Grid item md={3}>
                                                              {/* <div className={styles.image}> */}
                                                              {item?.file && item.imgSrc ? (
                                                                <div className='avatar-icon-wrapper avatar-icon-lg'>
                                                                  <div className='avatar-icon'>
                                                                    <img
                                                                      src={
                                                                        item.imgSrc
                                                                      }
                                                                      alt={getInitials(
                                                                        item?.employeeName
                                                                      )}
                                                                    />
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <div className='avatar-icon-wrapper avatar-initials avatar-icon-lg'>
                                                                  <div className='avatar-icon text-white bg-success'>
                                                                    {getInitials(
                                                                      item?.employeeName
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              )}
                                                              {/* </div> */}
                                                            </Grid>{' '}
                                                            <Grid
                                                              item
                                                              md={7}
                                                              style={{
                                                                padding: '10px'
                                                              }}>
                                                              <span
                                                                style={{
                                                                  textAlign: 'left'
                                                                }}>
                                                                <h6>
                                                                  {' '}
                                                                  {
                                                                    item?.employeeName
                                                                  }{' '}
                                                                  (
                                                                  {item?.employeeID}
                                                                  )
                                                                </h6>
                                                                <p>
                                                                  {' '}
                                                                  {item?.department}
                                                                </p>
                                                                <p>
                                                                  {' '}
                                                                  {item?.location}
                                                                </p>
                                                                {item?.employeePhone ==
                                                                  'NA' ? (
                                                                  ''
                                                                ) : (
                                                                  <p>
                                                                    {' '}
                                                                    {
                                                                      item?.employeePhone
                                                                    }{' '}
                                                                  </p>
                                                                )}
                                                                {item?.employeeEmail ==
                                                                  'NA' ? (
                                                                  ''
                                                                ) : (
                                                                  <p>
                                                                    {' '}
                                                                    {
                                                                      item?.employeeEmail
                                                                    }{' '}
                                                                  </p>
                                                                )}
                                                              </span>
                                                            </Grid>{' '}
                                                          </Grid>
                                                        </div>
                                                        <div
                                                          className={
                                                            styles.cardFooter
                                                          }>
                                                          <p>{item?.designation}</p>
                                                        </div>
                                                        <div></div>
                                                      </div>
                                                    </li>
                                                  </>
                                                )
                                              )}
                                            </>
                                          ) : (
                                            ''
                                          )}
                                        </div>
                                      </ul>
                                    </div>
                                    <div></div>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            </PerfectScrollbar>
                          </div>
                        </Grid>
                      </Grid>
                    </Card>{' '}
                  </>
                ) : (
                  ''
                )}
              </div>
            </Grid>
          </Grid>
        </Card>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          classes={{ root: toastrStyle }}
          onClose={handleClose3}
          message={message}
          autoHideDuration={2000}
        />
      </BlockUi>
    </>
  )
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    selectedCompany: state.Auth.selectedCompany
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SearchOrg)
