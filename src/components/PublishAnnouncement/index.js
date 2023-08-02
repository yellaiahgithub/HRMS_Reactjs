import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Container,
  MenuItem,
  Table,
  CardContent,
  MenuList,
  TextField,
  Snackbar,
  ListItem,
  List,
  Menu,
  InputAdornment,
  Switch
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation, useHistory } from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { STATUS } from 'react-joyride'
import { setDate } from 'date-fns'
import apicaller from 'helper/Apicaller'
import clsx from 'clsx'

import Pagination from '@material-ui/lab/Pagination'

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'

const PublishAnnouncement = props => {
  const { user } = props
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })

  const { vertical, horizontal, open, toastrStyle, message } = state

  const [blocking, setBlocking] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState()
  const [checkAllData, setCheckAllIds] = useState(false)

  const [addedIds, setAddedIds] = useState([])

  const [DepartmentsArray, setDepartments] = useState([])
  const [paginatedDepartments, setPaginatedDepartments] = useState([])
  const [allDepartments, setAllDepartments] = useState([])

  const [LocationsArray, setLocations] = useState([])
  const [paginatedLocations, setPaginatedLocations] = useState([])
  const [allLocations, setAllLocations] = useState([])

  const [DesignationsArray, setDesignations] = useState([])
  const [paginatedDesignations, setPaginatedDesignations] = useState([])
  const [allDesignations, setAllDesignations] = useState([])

  const [anchorEl3, setAnchorEl3] = useState(null)

  const [anchorEl2, setAnchorEl2] = useState(null)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [sort, setSort] = useState('ASC')
  const [page, setPage] = useState(1)
  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [title, setTitle] = useState()
  const [news, setNews] = useState()
  const [publishTo, setPublishTo] = useState()
  const [ifNotify, setIfNotify] = useState(false)

  const [dataArray, setDataArray] = useState([])
  const [paginatedArrray, setPaginatedArray] = useState([])
  const [allData, setAllData] = useState([])

  const publishType = [
    { value: 'All Employees' },
    { value: 'Department' },
    { value: 'Location' },
    { value: 'Designation' }
  ]

  const handleClick2 = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  const [searchOpen, setSearchOpen] = useState(false)
  const history = useHistory()

  const handleSearch = event => {
    const results = allData.filter(obj =>
      JSON.stringify(obj).toLowerCase().includes(event.target.value)
    )
    if (results.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }
    setDataArray(results)
    setPaginatedArray(results)
  }

  const handleSort = sortOrder => {
    if (publishTo == 'Location') {
      let sortedData = JSON.parse(JSON.stringify(dataArray))
      if (sortOrder == 'ASC') {
        sortedData = sortedData.sort((data1, data2) =>
          data1.locationName > data2.locationName
            ? 1
            : data2.locationName > data1.locationName
            ? -1
            : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      } else {
        sortedData = sortedData.sort((data2, data1) =>
          data1.locationName > data2.locationName
            ? 1
            : data2.locationName > data1.locationName
            ? -1
            : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      }
    } else {
      let sortedData = JSON.parse(JSON.stringify(dataArray))
      if (sortOrder == 'ASC') {
        sortedData = sortedData.sort((data1, data2) =>
          data1.name > data2.name ? 1 : data2.name > data1.name ? -1 : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      } else {
        sortedData = sortedData.sort((data2, data1) =>
          data1.name > data2.name ? 1 : data2.name > data1.name ? -1 : 0
        )
        setDataArray(sortedData)
        setPaginatedArray(sortedData)
      }
    }
  }

  const handleChange = (event, value) => {
    // console.log(value);
    setPage(value)
  }

  useEffect(() => {
    getAllDepartments()
    getDesignations()
    getLocations()
  }, [])

  const getAllDepartments = () => {
    apicaller('get', `${BASEURL}/department/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setDepartments(res.data)
          setPaginatedDepartments(res.data)
          setAllDepartments(res.data)
        }
      })
      .catch(err => {
        console.log('getDepartments err', err)
      })
  }

  const getDesignations = () => {
    apicaller('get', `${BASEURL}/designation/fetchAll`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setDesignations(res.data)
          setPaginatedDesignations(res.data)
          setAllDesignations(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const getLocations = () => {
    apicaller('get', `${BASEURL}/location`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          setLocations(res.data)
          setPaginatedLocations(res.data)
          setAllLocations(res.data)
        }
      })
      .catch(err => {
        console.log('getDesignation err', err)
      })
  }

  const setDataToShow = event => {
    setAddedIds([])
    setPublishTo(event.target.value)
    if (event.target.value == 'Department') {
      setDataArray(DepartmentsArray)
      setPaginatedArray(paginatedDepartments)
      setAllData(allDepartments)
    } else if (event.target.value == 'Designation') {
      setDataArray(DesignationsArray)
      setPaginatedArray(paginatedDesignations)
      setAllData(allDesignations)
    } else if (event.target.value == 'Location') {
      setDataArray(LocationsArray)
      setPaginatedArray(paginatedLocations)
      setAllData(allLocations)
    }
  }

  const borderStyle = {
    border: '1px solid rgb(196 196 196)',
    borderRadius: '4px'
  }

  const save = e => {
    e.preventDefault()
    console.log(publishTo)
    //to do service call
    setIsSubmitted(true)
    if (fromDate && toDate && title && publishTo && news) {
      if (addedIds.length == 0 && publishTo && publishTo !== 'All Employees') {
        let msg = 'Please select atleast one ' + publishTo
        setState({
          open: true,
          message: msg,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      } else {
        let inputObj = {
          startDate: fromDate,
          endDate: toDate,
          title: title,
          news: news,
          publishTo: publishTo,
          publishToIDs: addedIds,
          notify: ifNotify
        }
        apicaller('post', `${BASEURL}/announcement`, inputObj)
          .then(res => {
            if (res.status === 200) {
              setState({
                open: true,
                message: 'Announcement Published Successfully',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
              })
              setIsSubmitted(false)
              setFromDate(null)
              setToDate(null)
              setTitle('')
              setNews('')
              setPublishTo('')
              setIfNotify(false)
              setDataArray([])
              setPaginatedArray([])
              setAllData([])
            }
          })
          .catch(err => {
            setState({
              open: true,
              message: err.response.data,
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
            console.log('Publish Announcement err', err)
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
    }
  }

  const addRemoveIds = (event, item) => {
    let newArray = []
    let index = -1
    if (publishTo !== 'Location') {
      for (let i = 0; i < addedIds.length; i++) {
        if (addedIds[i] === item.id) {
          index = i
          break
        }
      }
      if (index === -1) {
        let id = item.id
        addedIds.push(id)
        setAddedIds(addedIds)

        const result = allData.map((item, i) => {
          return { ...item, item }
        })
        setDataArray(result)
      } else {
        addedIds.splice(index, 1)
        setAddedIds(addedIds)

        const result = allData.map((item, i) => {
          return { ...item, item }
        })

        setDataArray(result)
      }
    } else {
      for (let i = 0; i < addedIds.length; i++) {
        if (addedIds[i] === item.locationId) {
          index = i
          break
        }
      }
      if (index === -1) {
        let id = item.locationId
        addedIds.push(id)
        setAddedIds(addedIds)

        const result = allData.map((item, i) => {
          return { ...item, item }
        })
        setDataArray(result)
      } else {
        addedIds.splice(index, 1)
        setAddedIds(addedIds)

        const result = allData.map((item, i) => {
          return { ...item, item }
        })

        setDataArray(result)
      }
    }
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const getObjByValue = (arr, value) => {
    return value ? arr.find(x => x.value == value) : {}
  }
  const handleClear = () => {
    // Reset form fields
    setFromDate(null);
    setToDate(null);
    setTitle('');
    setNews('');
    setPublishTo('')
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
            <Grid item md={10} lg={11} xl={11} className='mx-auto'>
              <div className='bg-white p-4 rounded'>
                <br />
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className='font-weight-normal mb-2'>
                        Publish News From Date *
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
                          fullWidth
                          size='small'
                          value={fromDate}
                          onChange={event => {
                            setFromDate(event)
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                          helperText={
                            isSubmitted && fromDate == null
                              ? 'Publish From Date is required'
                              : ''
                          }
                          error={isSubmitted && fromDate == null ? true : false}
                        />{' '}
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div>
                      <label className='font-weight-normal mb-2'>
                        News To Date *
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
                          fullWidth
                          size='small'
                          value={toDate}
                          onChange={event => {
                            setToDate(event)
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                          helperText={
                            isSubmitted && toDate == null
                              ? 'Publish To Date is required'
                              : ''
                          }
                          error={isSubmitted && toDate == null ? true : false}
                        />{' '}
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={8}>
                    <div>
                      <label className='font-weight-noraml mb-2'>Title *</label>
                      <TextField
                        id='outlined-Title'
                        placeholder='Title'
                        variant='outlined'
                        fullWidth
                        size='small'
                        name='Title'
                        value={title}
                        onChange={event => {
                          setTitle(event.target.value)
                        }}
                        error={isSubmitted && (title ? false : true)}
                        helperText={
                          isSubmitted && (title ? '' : 'Title is Required')
                        }
                      />
                    </div>
                  </Grid>{' '}
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={8}>
                    <label className='font-size-lg font-weight-normal mt-1'>
                      News
                    </label>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label=''
                      multiline
                      rowsMax='8'
                      value={news}
                      onChange={event => {
                        setNews(event.target.value)
                      }}
                      variant='outlined'
                      error={isSubmitted && (news ? false : true)}
                      helperText={
                        isSubmitted && (news ? '' : 'News is Required')
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div>
                      <label className=' mb-2'>Publish To *</label>
                      <TextField
                        variant='outlined'
                        fullWidth
                        id='outlined-type'
                        select
                        label='Select'
                        size='small'
                        name='publishTo'
                        value={publishTo || ''}
                        onChange={event => {
                          setDataToShow(event)
                        }}
                        error={isSubmitted && (publishTo ? false : true)}
                        helperText={
                          isSubmitted &&
                          (publishTo ? '' : 'Publish To is Required')
                        }>
                        {publishType.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </Grid>
                </Grid>
                <br></br> <br></br>
                {publishTo && publishTo !== 'All Employees' ? (
                  <>
                    <Card
                      style={{
                        padding: '25px',
                        border: '1px solid #c4c4c4'
                      }}>
                      <div className='card-header'>
                        <div className='card-header--title'>
                          <p>
                            <b>Select {publishTo}s</b>
                          </p>
                        </div>
                      </div>
                      <div className='d-flex justify-content-between p-4 py-3'>
                        <div
                          className={clsx(
                            'search-wrapper search-wrapper--alternate search-wrapper--grow',
                            { 'is-active': searchOpen }
                          )}>
                          <TextField
                            variant='outlined'
                            size='small'
                            id='input-with-icon-textfield22-2'
                            placeholder='Search Name, Id'
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
                                <div className='font-weight-bold px-4 pt-3'>
                                  Results
                                </div>
                                <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                                  <ListItem
                                    button
                                    href='#/'
                                    value={recordsPerPage}
                                    onClick={e => {
                                      setRecordsPerPage(10)
                                      setPage(1)

                                      {
                                        publishTo == 'Department'
                                          ? setPaginatedDepartments(
                                              allDepartments
                                            )
                                          : setPaginatedDepartments([])
                                      }
                                      {
                                        publishTo == 'Designation'
                                          ? setPaginatedDesignations(
                                              allDesignations
                                            )
                                          : setPaginatedDesignations([])
                                      }
                                      {
                                        publishTo == 'Location'
                                          ? setPaginatedLocations(allLocations)
                                          : setPaginatedLocations([])
                                      }
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
                                      {
                                        publishTo == 'Department'
                                          ? setPaginatedDepartments(
                                              allDepartments
                                            )
                                          : setPaginatedDepartments([])
                                      }
                                      {
                                        publishTo == 'Designation'
                                          ? setPaginatedDesignations(
                                              allDesignations
                                            )
                                          : setPaginatedDesignations([])
                                      }
                                      {
                                        publishTo == 'Location'
                                          ? setPaginatedLocations(allLocations)
                                          : setPaginatedLocations([])
                                      }
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
                                      {
                                        publishTo == 'Department'
                                          ? setPaginatedDepartments(
                                              allDepartments
                                            )
                                          : setPaginatedDepartments([])
                                      }
                                      {
                                        publishTo == 'Designation'
                                          ? setPaginatedDesignations(
                                              allDesignations
                                            )
                                          : setPaginatedDesignations([])
                                      }
                                      {
                                        publishTo == 'Location'
                                          ? setPaginatedLocations(allLocations)
                                          : setPaginatedLocations([])
                                      }
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
                                <div className='font-weight-bold px-4 pt-4'>
                                  Order
                                </div>
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
                                    <span className='font-size-md'>
                                      Ascending
                                    </span>
                                  </ListItem>
                                  <ListItem
                                    button
                                    href='#/'
                                    onClick={e => handleSort('DES')}>
                                    <div className='mr-2'>
                                      <ArrowDownwardTwoToneIcon />
                                    </div>
                                    <span className='font-size-md'>
                                      Descending
                                    </span>
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
                            <thead className='thead-light'>
                              <tr>
                                <th
                                  style={{ width: '20%' }}
                                  className='text-center'>
                                  {publishTo == 'Department'
                                    ? 'Department ID'
                                    : ''}
                                  {publishTo == 'Designation'
                                    ? 'Designation ID'
                                    : ''}
                                  {publishTo == 'Location' ? 'Location ID' : ''}
                                </th>
                                <th
                                  style={{ width: '30%' }}
                                  className='text-center'>
                                  {publishTo == 'Department'
                                    ? 'Department Name'
                                    : ''}
                                  {publishTo == 'Designation'
                                    ? 'Designation Name'
                                    : ''}
                                  {publishTo == 'Location'
                                    ? 'Location Name'
                                    : ''}
                                </th>
                                <th
                                  style={{ width: '20%' }}
                                  className='text-center'>
                                  <Checkbox
                                    color='primary'
                                    className='align-self-start'
                                    name='checkBoxAll'
                                    value={checkAllData}
                                    onChange={event => {
                                      setCheckAllIds(event.target.checked)
                                      if (event.target.checked) {
                                        let ids = []
                                        if (publishTo !== 'Location') {
                                          ids = allData.map(a => a.id)
                                        } else {
                                          ids = allData.map(a => a.locationId)
                                        }
                                        setAddedIds(ids)
                                      } else {
                                        setAddedIds([])
                                      }
                                    }}
                                  />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedArrray
                                .slice(
                                  page * recordsPerPage > dataArray.length
                                    ? page === 0
                                      ? 0
                                      : page * recordsPerPage - recordsPerPage
                                    : page * recordsPerPage - recordsPerPage,
                                  page * recordsPerPage <= dataArray.length
                                    ? page * recordsPerPage
                                    : dataArray.length
                                )
                                .map((item, idx) => (
                                  <tr>
                                    <td className='text-center'>
                                      {publishTo == 'Location' ? (
                                        <div>{item.locationId}</div>
                                      ) : (
                                        <div>{item.id}</div>
                                      )}
                                    </td>
                                    <td className='text-center'>
                                      {publishTo == 'Location' ? (
                                        <div>{item.locationName}</div>
                                      ) : (
                                        <div>{item.name}</div>
                                      )}
                                    </td>

                                    <td className='text-center'>
                                      <div>
                                        {' '}
                                        {publishTo !== 'Location' ? (
                                          <Checkbox
                                            color='primary'
                                            className='align-self-start'
                                            name='preferred'
                                            value={addedIds.includes(item?.id)}
                                            checked={addedIds.includes(
                                              item?.id
                                            )}
                                            onChange={event => {
                                              addRemoveIds(event, item)
                                            }}
                                          />
                                        ) : (
                                          <Checkbox
                                            color='primary'
                                            className='align-self-start'
                                            name='preferred'
                                            value={addedIds.includes(
                                              item?.locationId
                                            )}
                                            checked={addedIds.includes(
                                              item?.locationId
                                            )}
                                            onChange={event => {
                                              addRemoveIds(event, item)
                                            }}
                                          />
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>

                        <div className='d-flex  justify-content-center pt-3 mb-5'>
                          <Pagination
                            className='pagination-primary'
                            count={Math.ceil(dataArray.length / recordsPerPage)}
                            variant='outlined'
                            shape='rounded'
                            selected={true}
                            page={page}
                            onChange={handleChange}
                            showFirstButton
                            showLastButton
                          />
                        </div>
                      </div>
                    </Card>{' '}
                  </>
                ) : (
                  ''
                )}
                <br></br>
                <br></br>
                <Grid container spacing={6}>
                  <Grid item md={8}>
                    <Switch
                      onChange={event => {
                        console.log(event)
                        setIfNotify(event.target.checked)
                      }}
                      checked={ifNotify}
                      name='IfNotifyDate'
                      color='primary'
                      className='switch-small'
                    />{' '}
                    &nbsp;{' '}
                    <label className=' mb-2'>
                      Notify Employees About Announcement
                    </label>
                  </Grid>
                </Grid>
                <br></br>
                <div className='divider' />
                <div className='divider' />
                <div className='float-right' style={{ marginRight: '2.5%' }}>
                  <Button
                    className='btn-primary mb-2 m-2'
                      onClick={handleClear}>
                    Clear
                  </Button>
                  <Button
                    className='btn-primary mb-2 m-2'
                    type='submit'
                    onClick={e => save(e)}>
                    Save
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </Card>{' '}
      </BlockUi>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        classes={{ root: toastrStyle }}
        onClose={handleClose}
        message={message}
        autoHideDuration={2000}
      />
    </>
  )
}

const mapStateToProps = state => ({
  selectedCompany: state.Auth.selectedCompany,
  user: state.Auth.user
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PublishAnnouncement)
