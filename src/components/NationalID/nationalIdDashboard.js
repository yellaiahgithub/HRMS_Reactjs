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
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
} from '@material-ui/core'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
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
import noResults from '../../assets/images/composed-bg/no_result.jpg'

const NationalIdDashboard = props => {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const handleClose3 = () => {
    setState({ ...state, open: false })
  }

  const [formURL, setFormURL] = useState('/createNationalIds')
  const [anchorEl, setAnchorEl] = useState(null)
  // const [formURL, setFormURL] = useState('/createCustomer');
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [anchorEl2, setAnchorEl2] = useState(null)

  const handleClick2 = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)

  const [status, setStatus] = useState('0')

  const handleStatus = event => {
    setStatus(event.target.value)
  }
  const handleFilter = status => {
    if (status > 0) {
      let statusLabel = true
      if (status == 2) {
        statusLabel = false
      }
      const filteredNationalIds = allNationalIds.filter(
        employee => employee.isActive == statusLabel
      )
      setNationalIds(filteredNationalIds)
      setPaginationNationalIds(filteredNationalIds)
    } else {
      setNationalIds(allNationalIds)
      setPaginationNationalIds(allNationalIds)
    }
  }
  const handleSort = sortOrder => {
    let sortedNationalIds = JSON.parse(JSON.stringify(nationalIds))
    if (sortOrder == 'ASC') {
      sortedNationalIds = sortedNationalIds.sort((empA, empB) =>
        empA.name > empB.name
          ? 1
          : empB.name > empA.name
            ? -1
            : 0
      )
      setNationalIds(sortedNationalIds)
      setPaginationNationalIds(sortedNationalIds)
    } else {
      sortedNationalIds = sortedNationalIds.sort((empB, empA) =>
        empA.name > empB.name
          ? 1
          : empB.name > empA.name
            ? -1
            : 0
      )
      setNationalIds(sortedNationalIds)
      setPaginationNationalIds(sortedNationalIds)
    }
  }

  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  const handleSearch = event => {
    const filteredNationalIds = allNationalIds.filter(
      employee =>
        employee.employeeId.includes(event.target.value?.toUpperCase()) ||
        employee.name
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        employee.Identification
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        employee.identificationType
          .toUpperCase()
          .includes(event.target.value?.toUpperCase())
    )

    if (filteredNationalIds.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }

    setNationalIds(filteredNationalIds)
    setPaginationNationalIds(filteredNationalIds)
  }

  const [allNationalIds, setAllNationalIds] = useState([])
  const [paginationNationalIds, setPaginationNationalIds] = useState([])
  const [nationalIds, setNationalIds] = useState([])
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [open4, setOpen4] = useState(false)

  const [isUpdatedSubmitted, setIsUpdateSubmitted] = useState()
  const [isExpiryUpdate, setIsUpdateExpiry] = useState(true)
  const [employeeUUID, setEmployeeUUID] = useState()
  const [updateIdentificationName, setUpdateIdentificationName] = useState()
  const [updateIdentificationNumber, setUpdateIdentificationNumber] = useState()
  const [isPrimaryIDUpdate, setIsPrimaryIDUpdate] = useState(false)
  const [expiryDateUpdate, setUpdateExpiryDate] = useState(null)
  const [_id, setUpdate_id] = useState()
  const [IDType, setIdentificationType] = useState()
  const [employeeId, setUpdatedEmployeeId] = useState()

  const [IdToBeUpdated, setUpdatedID] = useState()
  const [IndexToBeUpdated, setUpdatedIDIndex] = useState()

  const handleClickOpen2 = (i, updateData) => {
    setOpen4(true)
    setEmployeeUUID(updateData.employeeUUID)
    setUpdateIdentificationName(updateData.name)
    setUpdateIdentificationNumber(updateData.Identification)

    setIsPrimaryIDUpdate(updateData.isPrimary)
    setIdentificationType(updateData.identificationType)
    setUpdate_id(updateData._id)
    setUpdatedEmployeeId(updateData.employeeId)

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
  const handleClickClose2 = () => {
    setOpen4(false)
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

    if (updateIdentificationName && updateIdentificationNumber) {
      let obj = {
        Identification: updateIdentificationNumber,
        employeeUUID: employeeUUID,
        expiry: !isExpiryUpdate ? expiryDateUpdate : null,
        identificationType: IDType,
        isPrimary: isPrimaryIDUpdate,
        name: updateIdentificationName,
        _id: _id
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

            const newArray = [...paginationNationalIds]
            obj['employeeId'] = employeeId
            newArray[IndexToBeUpdated] = obj
            setPaginationNationalIds(newArray)

            setOpen4(false)
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('create id err', err)
          setState({
            open: true,
            message: 'Not Updated',
            toastrStyle: 'toastr-warning',
            vertical: 'top',
            horizontal: 'right'
          })
        })
    }
  }


  const handleClose4 = () => {
    setOpen4(false)
  }

  useEffect(() => {
    getNationalIds()
  }, [])

  const getNationalIds = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/nationalId`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setNationalIds(res.data)
          setAllNationalIds(res.data)
          setPaginationNationalIds(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getNationalIds err', err)
      })
  }

  const loading = false
  return (
    <>
      <BlockUi
        tag='div'
        blocking={blocking}
        loader={
          <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
        }>
        <Card className='card-box shadow-none'>
          <div className='d-flex flex-column flex-md-row justify-content-between px-4 py-3'>
            <div
              className={clsx(
                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                { 'is-active': searchOpen }
              )}>
              <TextField
                variant='outlined'
                size='small'
                id='input-with-icon-textfield22-2'
                placeholder='Search Employee, National ID Type, Identification Number...'
                onFocus={openSearch}
                onBlur={closeSearch}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div className='d-flex align-items-center'>
              <div>
                <Button
                  className='btn-primary mr-2'
                  component={NavLink}
                  to='./createNationalID'>
                  Create National ID
                </Button>
              </div>
              <div>
                <Button
                  onClick={handleClick2}
                  className='btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill'>
                  <SettingsTwoToneIcon className='w-50' />
                </Button>
                <Menu
                  anchorEl={anchorEl2}
                  keepMounted
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorEl2)}
                  classes={{ list: 'p-0' }}
                  onClose={handleClose2}>
                  <div className='dropdown-menu-lg overflow-hidden p-0'>
                    <div className='font-weight-bold px-4 pt-3'>Results</div>
                    <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                      <ListItem
                        button
                        href='#/'
                        value={recordsPerPage}
                        onClick={e => {
                          setRecordsPerPage(10)
                          setPage(1)
                          setPaginationNationalIds(nationalIds)
                        }}>
                        <div className='nav-link-icon mr-2'>
                          <RadioButtonUncheckedTwoToneIcon />
                        </div>
                        <span className='font-size-md'>
                          <b>10</b> results per page
                        </span>
                      </ListItem>
                      <ListItem
                        button
                        href='#/'
                        value={recordsPerPage}
                        onClick={e => {
                          setRecordsPerPage(20)
                          setPage(1)
                          setPaginationNationalIds(nationalIds)
                        }}>
                        <div className='nav-link-icon mr-2'>
                          <RadioButtonUncheckedTwoToneIcon />
                        </div>
                        <span className='font-size-md'>
                          <b>20</b> results per page
                        </span>
                      </ListItem>
                      <ListItem
                        button
                        href='#/'
                        value={recordsPerPage}
                        onClick={e => {
                          setRecordsPerPage(30)
                          setPage(1)
                          setPaginationNationalIds(nationalIds)
                        }}>
                        <div className='nav-link-icon mr-2'>
                          <RadioButtonUncheckedTwoToneIcon />
                        </div>
                        <span className='font-size-md'>
                          <b>30</b> results per page
                        </span>
                      </ListItem>
                    </List>
                    <div className='divider' />
                    <div className='font-weight-bold px-4 pt-4'>Order</div>
                    <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                      <ListItem
                        button
                        href='#/'
                        onClick={e => {
                          handleSort('ASC')
                        }}>
                        <div className='mr-2'>
                          <ArrowUpwardTwoToneIcon />
                        </div>
                        <span className='font-size-md'>Ascending</span>
                      </ListItem>
                      <ListItem
                        button
                        href='#/'
                        onClick={e => handleSort('DES')}>
                        <div className='mr-2'>
                          <ArrowDownwardTwoToneIcon />
                        </div>
                        <span className='font-size-md'>Descending</span>
                      </ListItem>
                    </List>
                  </div>
                </Menu>
              </div>
            </div>
          </div>
          <div className='divider' />
          <div className='p-4'>
            <div className='table-responsive-md'>
              <Table className='table table-alternate-spaced mb-0'>
                <thead>
                  <tr>
                    <th
                      style={{ width: '300px' }}
                      className='font-size-lg font-weight-bold pb-4 text-capitalize  text-center'
                      scope='col'>
                      Employee ID
                    </th>
                    <th
                      style={{ width: '300px' }}
                      className='font-size-lg font-weight-bold pb-4 text-capitalize  text-center'
                      scope='col'>
                      Employee Name
                    </th>
                    <th
                      style={{ width: '400px' }}
                      className='font-size-lg font-weight-bold pb-4 text-capitalize text-center'
                      scope='col'>
                      primary National ID Type
                    </th>
                    <th
                      style={{ width: '400px' }}
                      className='font-size-lg font-weight-bold pb-4 text-capitalize text-center'
                      scope='col'>
                      Identification Number
                    </th>
                  </tr>
                </thead>
                {paginationNationalIds.length > 0 ? (<>
                  <tbody>
               
                    {paginationNationalIds
                      .slice(
                        page * recordsPerPage > nationalIds.length
                          ? page === 0
                            ? 0
                            : page * recordsPerPage - recordsPerPage
                          : page * recordsPerPage - recordsPerPage,
                        page * recordsPerPage <= nationalIds.length
                          ? page * recordsPerPage
                          : nationalIds.length
                      )
                      .map((item, idx) => (
                        <>
                          <tr>
                            {/* <td>
                            <div className='text-center'>
                              <span className='font-weight-bold'>
                                {item.employee[0]
                                  ? item.employee[0].customerId
                                  : ''}
                              </span>
                            </div>
                          </td> */}
                            <td>
                              <div className='text-center'>
                                <span className='font-weight-normal'>
                                  {item.employeeId}
                                </span>
                              </div>
                            </td>
                            <td className='text-center'>
                              <span className='font-weight-normal'>
                                {item.name}
                              </span>
                            </td>
                            <td className='text-center'>
                              <span className='font-weight-normal'>
                                {item.identificationType}
                              </span>
                            </td>
                            <td className='text-center'>
                              <span className='font-weight-normal'>
                                {item.Identification}
                              </span>
                            </td>
                            <td className='text-right'>
                              <Button
                                onClick={() =>
                                  handleClickOpen2(idx, item)
                                }
                                className='btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center'>
                                <FontAwesomeIcon
                                  icon={['far', 'edit']}
                                  className='font-size-sm'
                                />
                              </Button>
                            </td>
                          </tr>
                          <tr className='divider'></tr>
                        </>
                      ))}
                  </tbody></>) : (
                  <tbody className='img-text'>
                    <div>
                      <img alt="..." src={noResults} style={{ maxWidth: '600px' }} /></div></tbody>
                )}
              </Table>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
            <Pagination
              className='pagination-primary'
              count={Math.ceil(nationalIds.length / recordsPerPage)}
              variant='outlined'
              shape='rounded'
              selected={true}
              page={page}
              onChange={handleChange}
              showFirstButton
              showLastButton
            />
          </div>
        </Card>
        <Dialog
          classes={{
            paper: 'modal-content rounded border-0 bg-white p-3 p-xl-0'
          }}
          fullWidth
          maxWidth='lg'
          open={open4}
          onClose={handleClose4}
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
                          <label className=' mb-2'>
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
                                    disableToolbar
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
                    onClick={() =>
                      handleClickClose2()
                    }
                  >
                    Cancel
                  </Button>
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
    user: state.Auth.user
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(NationalIdDashboard)
