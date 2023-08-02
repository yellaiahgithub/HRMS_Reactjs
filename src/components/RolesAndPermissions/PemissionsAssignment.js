import React, { useState, Component, useEffect } from 'react'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Card,
  MenuItem,
  TextField,
  FormControl,
  FormHelperText,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  InputAdornment,
  Switch,
  ListItem,
  List,
  Menu,
  TableContainer,
  Popover,
  Snackbar
} from '@material-ui/core'
import clsx from 'clsx'
import Pagination from '@material-ui/lab/Pagination'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Description } from '@material-ui/icons'
import apicaller from 'helper/Apicaller'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { BASEURL } from 'config/conf'
import { TRUE } from 'sass'
import Autocomplete from '@material-ui/lab/Autocomplete'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';




const PersmissionAssignment = () => {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open, toastrStyle, message } = state

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id') || null
  const adminAccess = id ? true : false

  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [sort, setSort] = useState('ASC')
  const [page, setPage] = useState(1)

  const [roleName, setRoleName] = useState()
  const [roleDescription, setRoleDescription] = useState()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRolesubmitted, setIsRolesubmitted] = useState(false)
  const [anchorEl3, setAnchorEl3] = useState(null)

  const [anchorEl2, setAnchorEl2] = useState(null)

  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)

  const handleClick2 = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const [employeeDetail, setEmployeeDetail] = useState()
  const [assignment, setSelectedAssignment] = useState()
  const [blocking, setBlocking] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const [RolesArray, setRoles] = useState([])

  const [paginatedRoles, setPaginatedRoles] = useState([])

  const [allRoles, setallRoles] = useState([])

  const [addedRoles, setAddedRoles] = useState([])
  const [addedUsers, setAddedUsers] = useState([])

  const [employeeId, setEmployeeID] = useState()
  const [objectId, setSelectedObjectId] = useState()
  const [employeeUUID, setSelectedEmployeeUUID] = useState()
  const [allEmployees, setAllEmployees] = useState([])
  const [userIdArray, setUserIdArray] = useState()
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedRole, setRole] = useState()
  const [paginatedUsers, setPaginatedUsers] = useState([])
  const [userArray, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [checkAllUsers, setCheckAllUsers] = useState(false)
  const [checkAllRoles, setCheckAllRoles] = useState(false)
  const history = useHistory()


  const option = [{ value: 'Role' }, { value: 'User ID' }]

  const setPagination = event => {
    if (selectedOption == 'Role') {
      setPaginatedUsers(userArray)
    } else {
      setPaginatedRoles(RolesArray)
    }
  }

  const handleSearch = event => {
    if (selectedOption == 'Role') {
      const filteredUsers = allUsers.filter(
        user =>
          (user.id &&
            user.id
              .toUpperCase()
              .includes(event.target.value?.toUpperCase())) ||
          (user.firstName &&
            user.firstName
              .toUpperCase()
              .includes(event.target.value?.toUpperCase())) ||
          (user.lastName &&
            user.lastName
              .toUpperCase()
              .includes(event.target.value?.toUpperCase())) ||
          (user.userId &&
            user.userId
              .toUpperCase()
              .includes(event.target.value?.toUpperCase()))
      )

      if (filteredUsers.length == 0) {
        setState({
          open: true,
          message: 'No Matching Results Found',
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        })
      }

      setUsers(filteredUsers)
      setPaginatedUsers(filteredUsers)
    } else {
      const filteredRoles = allRoles.filter(
        role =>
          role.name.toUpperCase().includes(event.target.value?.toUpperCase()) ||
          role.description
            .toUpperCase()
            .includes(event.target.value?.toUpperCase())
      )

      if (filteredRoles.length == 0) {
        setState({
          open: true,
          message: 'No Matching Results Found',
          toastrStyle: 'toastr-success',
          vertical: 'top',
          horizontal: 'right'
        })
      }

      setRoles(filteredRoles)
      setPaginatedRoles(filteredRoles)
    }
  }

  const handleSort = sortOrder => {
    if (selectedOption == 'User ID') {
      let sortedRoles = JSON.parse(JSON.stringify(RolesArray))
      if (sortOrder == 'ASC') {
        sortedRoles = sortedRoles.sort((role1, role2) =>
          role1.name > role2.name ? 1 : role2.name > role1.name ? -1 : 0
        )
        setRoles(sortedRoles)
        setPaginatedRoles(sortedRoles)
      } else {
        sortedRoles = sortedRoles.sort((role2, role1) =>
          role1.name > role2.name ? 1 : role2.name > role1.name ? -1 : 0
        )
        setRoles(sortedRoles)
        setPaginatedRoles(sortedRoles)
      }
    } else {
      let sortedUser = JSON.parse(JSON.stringify(userArray))
      if (sortOrder == 'ASC') {
        sortedUser = sortedUser.sort((user1, user2) =>
          user1.firstName > user2.firstName
            ? 1
            : user2.firstName > user1.firstName
              ? -1
              : 0
        )
        setUsers(sortedUser)
        setPaginatedUsers(sortedUser)
      } else {
        sortedUser = sortedUser.sort((user2, user1) =>
          user1.firstName > user2.firstName
            ? 1
            : user2.firstName > user1.firstName
              ? -1
              : 0
        )
        setUsers(sortedUser)
        setPaginatedUsers(sortedUser)
      }
    }
  }

  const handleChange = (event, value) => {
    // console.log(value);
    setPage(value)
  }

  const handleClickPopover3 = event => {
    setAnchorEl3(event.currentTarget)
  }

  const handleClosePopover3 = () => {
    setAnchorEl3(null)
    setRoleDescription()
    setRoleName()
  }

  const open3 = Boolean(anchorEl3)

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  useEffect(() => {
    
    if (adminAccess) {
      setBlocking(true)
      setSelectedOption('User ID')
      setEmployeeID(id)
      let addedRoles = []
      apicaller('get', `${BASEURL}/employee/get-employee-by-id/${id}`)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data[0])
            setEmployeeDetail(res.data[0])
            setSelectedObjectId(res.data[0]?._id)
            setSelectedEmployeeUUID(res.data[0]?.uuid)
            addedRoles = res?.data[0]?.roleUUIDs

            // Get roles after getting employee details
            apicaller('get', `${BASEURL}/role`)
              .then(res => {
                if (res.status === 200) {
                  setBlocking(false)
                  setAddedRoles(addedRoles)
                  setTimeout(
                    setRoles(res.data),
                    setallRoles(res.data),
                    setPaginatedRoles(res.data)
                    , 1000);
                  if (addedRoles.length == res.data.length) {
                    setCheckAllRoles(true)
                  }
                }
              })
              .catch(err => {
                setBlocking(false)
                console.log('get department err', err)
              })
          }
        })
        .catch(err => {
          setBlocking(false)
          console.log('getEmployees err', err)
        })
    } else {
      getEmployees()
      getRoles()
    }
  }, [])

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
  const paddingTop = {
    paddingTop: '25px'
  }
  const getEmployees = () => {
    apicaller('get', `${BASEURL}/employee/get-all-employees`)
      .then(res => {
        if (res.status === 200) {
          console.log('res.data', res.data)
          let userIDArray = []
          for (const iterator of res.data) {
            iterator['nameWithId'] =
              iterator.employeeName + '-' + iterator.employeeID

            if (iterator.userId) {
              userIDArray.push(iterator)
            }
          }
          setAllEmployees(res.data)
          setAddedRoles(res.data?.roleUUIDs)
        }
      })
      .catch(err => {
        console.log('getEmployees err', err)
      })
  }

  const saveRolesToEmployees = () => {
    let query = ''
    let inputObj = {
      employeeUUIDs: addedUsers,
      roleUUID: selectedRole.uuid
    }
    let msg = ''
    if (assignment == 'assigned') {
      query = apicaller('patch', `${BASEURL}/employee/assignRole`, inputObj)
      msg = 'Users Assigned Successfully'
    } else if (assignment == 'unAssigned') {
      query = apicaller('patch', `${BASEURL}/employee/unAssignRole`, inputObj)
      msg = 'Users UnAssigned Successfully'
    }

    setBlocking(true)

    query
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)

          setIsSubmitted(false)
          setPaginatedUsers([])
          setAddedUsers([])

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
        if (err.response.data) {
          setBlocking(false)
          console.log('Users Assigned err', err)
        }
      })
  }

  const save = e => {
    e.preventDefault()
    //to do service call
    setIsSubmitted(true)
    if (selectedOption == 'Role' && selectedRole?.uuid) {
      saveRolesToEmployees()
    } else if (selectedOption == 'User ID' && objectId) {
      let Obj = {
        roleUUIDs: addedRoles,
        uuid: employeeUUID
      }

      apicaller('put', `${BASEURL}/employee/update`, Obj)
        .then(res => {
          if (res.status === 200) {
            console.log('res.data', res.data)
            setState({
              open: true,
              message: 'Roles Assigned Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })

            history.push('/dashboard')

          }
        })
        .catch(err => {
          if (err?.response.data) {
            setState({
              open: true,
              message: 'Error Occured while creating Role',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          }
          console.log('create Role err', err)
        })
    }
  }

  const getRoles = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/role`)
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          setRoles(res.data)
          setPaginatedRoles(res.data)
          setallRoles(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get department err', err)
      })
  }

  const getAssignedUsers = () => {
    setAddedUsers([])
    setCheckAllUsers(false)
    setSelectedAssignment('assigned')
    if (!selectedRole) {
      setIsSubmitted(true)
      return
    }

    setBlocking(true)
    apicaller(
      'get',
      `${BASEURL}/role/assignedUser?roleUUID=${selectedRole.uuid} `
    )
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          setUsers(res.data)
          setAllUsers(res.data)
          setPaginatedUsers(res.data)

          if (res.data?.length == 0) {
            setState({
              open: true,
              message: 'No user found for Assign',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get department err', err)
      })
  }

  const getUnAssignedUsers = () => {
    setAddedUsers([])
    setCheckAllUsers(false)
    setSelectedAssignment('unAssigned')

    if (!selectedRole) {
      setIsSubmitted(true)
      return
    }

    setBlocking(true)
    apicaller(
      'get',
      `${BASEURL}/role/unAssignedUser?roleUUID=${selectedRole.uuid} `
    )
      .then(res => {
        if (res.status === 200) {
          setBlocking(false)
          setUsers(res.data)
          setAllUsers(res.data)
          setPaginatedUsers(res.data)

          if (res.data?.length == 0) {
            setState({
              open: true,
              message: 'No user found for Unassign',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
          }
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get department err', err)
      })
  }

  const saveRole = e => {
    setIsRolesubmitted(true)
    if (roleName && roleDescription) {
      setBlocking(true)
      let obj = {
        name: roleName,
        description: roleDescription
      }

      apicaller('post', `${BASEURL}/role`, obj)
        .then(res => {
          setBlocking(false)
          if (res.status === 200) {
            console.log('res.data', res.data)

            setRoles(RolesArray => [...RolesArray, res.data[0]])

            setallRoles(allRoles => [...allRoles, res.data[0]])
            setPaginatedRoles(paginatedRoles => [
              ...paginatedRoles,
              res.data[0]
            ])
            handleClosePopover3()
            setIsRolesubmitted(false)

            setState({
              open: true,
              message: 'Role Created Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
          }
        })
        .catch(err => {
          setBlocking(false)
          if (err?.response?.data) {
            setState({
              open: true,
              message: 'Error Occured while creating role Details',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          }
          console.log('create role err', err)
        })
    }
  }

  const addRemoveUsers = (e, item, idx) => {
    let newArray = []
    let index = -1
    for (let i = 0; i < addedUsers.length; i++) {
      if (addedUsers[i] === item.employeeUUID) {
        index = i
        break
      }
    }
    if (index === -1) {
      let uuid = item.employeeUUID
      addedUsers.push(uuid)
      setAddedUsers(addedUsers)

      const result = paginatedUsers.map((item, i) => {
        return { ...item, item }
      })
      setPaginatedUsers(result)
      setUsers(result)
    } else {
      addedUsers.splice(index, 1)
      setAddedUsers(addedUsers)

      const result = paginatedUsers.map((item, i) => {
        return { ...item, item }
      })

      setPaginatedUsers(result)
      setUsers(result)
    }

    if (addedUsers.length == paginatedUsers.length) {
      setCheckAllUsers(true)
    } else {
      setCheckAllUsers(false)
    }

  }

  const addRemoveRoles = (e, item, idx) => {
    let newArray = []
    let index = -1
    for (let i = 0; i < addedRoles?.length; i++) {
      if (addedRoles[i] === item.uuid) {
        index = i
        break
      }
    }
    if (index === -1) {
      let uuid = item.uuid
      addedRoles.push(uuid)
      setAddedRoles(addedRoles)

      const result = paginatedRoles.map((item, i) => {
        return { ...item, item }
      })
      setPaginatedRoles(result)
      setRoles(result)
    } else {
      addedRoles.splice(index, 1)
      setAddedRoles(addedRoles)

      const result = paginatedRoles.map((item, i) => {
        return { ...item, item }
      })

      setPaginatedRoles(result)
      setRoles(result)
    }

    if (addedRoles.length == paginatedRoles.length) {
      setCheckAllRoles(true)
    } else {
      setCheckAllRoles(false)
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
        <Card
          style={{
            padding: '25px',
            border: '1px solid #c4c4c4',
            margin: '25px'
          }}>
          <Grid container spacing={0}>
            <Grid item md={10} lg={10} xl={10} className='mx-auto'>
              {adminAccess ? (
                <></>
              ) : (
                <>
                  <Grid
                    item
                    md={12}
                    container
                    className='mx-auto mb-4'
                    direction='row'>
                    <Grid item md={3} className='mx-auto'>
                      <label className='font-weight-normal mt-1'>
                        Assign/Unassign By *
                      </label>
                    </Grid>
                    <Grid item md={6} className='mx-auto'>
                      <TextField
                        variant='outlined'
                        fullWidth
                        id='outlined-marital'
                        select
                        label='Select'
                        size='small'
                        name='marital'
                        value={selectedOption}
                        helperText={
                          isSubmitted &&
                            (!selectedOption || selectedOption === '')
                            ? 'Assign/Unassign By is required'
                            : ''
                        }
                        error={
                          isSubmitted &&
                            (!selectedOption || selectedOption === '')
                            ? true
                            : false
                        }
                        onChange={event => {
                          setSelectedOption(event.target.value)
                        }}>
                        {option.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  {selectedOption == 'User ID' ? (
                    <Grid
                      item
                      md={12}
                      container
                      className='mx-auto mb-4'
                      direction='row'>
                      <Grid item md={3} className='mx-auto'>
                        <label className='font-weight-normal mt-2'>
                          Select Employee ID *
                        </label>
                      </Grid>
                      <Grid item md={6} className='mx-auto'>
                        <Autocomplete
                          id='combo-box-demo'
                          options={allEmployees}
                          getOptionLabel={option => option.nameWithId}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Select'
                              variant='outlined'
                              fullWidth
                              size='small'
                              name='employeeId'
                              value={employeeId || ''}
                              helperText={
                                isSubmitted &&
                                  (!employeeId || employeeId === '')
                                  ? 'Employee ID is required'
                                  : ''
                              }
                              error={
                                isSubmitted &&
                                  (!employeeId || employeeId === '')
                                  ? true
                                  : false
                              }
                            />
                          )}
                          onChange={(event, value) => {
                            console.log(value)
                            setEmployeeID(value?.employeeID)
                            setSelectedObjectId(value?._id)
                            setSelectedEmployeeUUID(value?.uuid)
                            let uuids = value.roles?.map(a => a.uuid)
                            setAddedRoles(uuids)
                            setCheckAllRoles(false)

                            const result = paginatedRoles.map((item, i) => {
                              return { ...item, item }
                            })

                            setPaginatedRoles(result)

                            if (uuids.length == result.length) {
                              setCheckAllRoles(true)
                            }

                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      {selectedOption == 'Role' ? (
                        <>
                          <Grid
                            item
                            md={12}
                            container
                            className='mx-auto mb-4'
                            direction='row'>
                            <Grid item md={3} className='mx-auto'>
                              <label className='font-weight-normal mt-2'>
                                Select Role *
                              </label>
                            </Grid>
                            <Grid item md={6} className='mx-auto'>
                              <Autocomplete
                                id='combo-box-demo'
                                options={RolesArray}
                                getOptionLabel={option => option.name}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Select'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    name='selectedRole'
                                    value={selectedRole || ''}
                                    helperText={
                                      isSubmitted &&
                                        (!selectedRole || selectedRole === '')
                                        ? 'Role is required'
                                        : ''
                                    }
                                    error={
                                      isSubmitted &&
                                        (!selectedRole || selectedRole === '')
                                        ? true
                                        : false
                                    }
                                  />
                                )}
                                onChange={(event, value) => {
                                  setRole(value)
                                  setPaginatedUsers([])
                                  setAllUsers([])
                                  setUsers([])
                                }}
                              />
                            </Grid>
                          </Grid>
                          <div className='text-center'>
                            <Button
                              className='btn-primary mb-2 m-2 text-center'
                              onClick={e => getAssignedUsers(e)}>
                              Assign
                            </Button>
                            <Button
                              className='btn-primary mb-2 m-2 text-center'
                              type='submit'
                              onClick={e => getUnAssignedUsers(e)}>
                              UnAssign
                            </Button>
                          </div>
                        </>
                      ) : (
                        ''
                      )}
                    </>
                  )}{' '}
                </>
              )}

              {employeeDetail ? (
                <>
                  <h4>Assign/Modify Admin Access</h4>
                  <br></br>
                  <Card
                    style={{
                      border: '1px solid #c4c4c4',
                      margin: '25px 0'
                    }}>
                    <div className='p-4'>
                      <Grid container spacing={0}>
                        <Grid item md={12} xl={2}>
                          <div className='rounded avatar-image overflow-hidden d-140  text-center text-success d-flex justify-content-center align-items-center'>
                            {employeeDetail?.profilePic ? (
                              <img
                                className="img-fluid img-fit-container rounded-sm"
                                src={employeeDetail?.profilePic}
                                style={{ width: '150px', height: '150px' }}
                                alt="..."
                              />
                            ) : (
                              <img
                                className="img-fluid img-fit-container rounded-sm"
                                src={empty_profile_picture}
                                style={{ width: '150px', height: '150px' }}
                                alt="..."
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item md={10} xs={12} lg={6} xl={5}>
                          <Grid item xs={10} md={12} className="d-flex" spacing={2} >
                            <Grid item md={6}>
                              <div className="font-size-sm font-weight-bold mb-4">
                                Employee Name
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <div className="opacity-8 font-size-sm mb-3">
                                {employeeDetail?.employeeName}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid item xs={10} md={12} className="d-flex" spacing={2} >
                            <Grid item md={6}>
                              <div className='font-size-sm font-weight-bold mb-4'>
                                DOB
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <div className="opacity-8 font-size-sm mb-3">
                                {getParsedDate(employeeDetail?.dob)}{' '}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid item xs={10} md={12} className="d-flex" spacing={2} >
                            <Grid item md={6}>
                              <div className="font-size-sm font-weight-bold mb-4">
                                Department
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <div className="opacity-8 font-size-sm mb-3">
                                {employeeDetail?.department}{' '}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={10} xs={12} lg={6} xl={5} >
                          <Grid item xs={10} md={12} className="d-flex" spacing={2} >
                            <Grid item md={6}>
                              <div className='font-size-sm font-weight-bold mb-4'>
                                Employee ID
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <div className="opacity-8 font-size-sm mb-3">
                                {employeeDetail?.id}{' '}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid item xs={10} md={12} className="d-flex" spacing={2} >
                            <Grid item md={6}>
                              <div className='font-size-sm font-weight-bold mb-4'>
                                Designation
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <div className="opacity-8 font-size-sm mb-3">
                                {employeeDetail?.designation}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid item xs={10} md={12} className="d-flex" spacing={2} >
                            <Grid item md={6}>
                              <div className='font-size-sm font-weight-bold mb-4'>
                                Location
                              </div>
                            </Grid>
                            <Grid item md={6}>
                              <div className="opacity-8 font-size-sm mb-3">
                                {employeeDetail?.location}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  </Card>
                </>
              ) : (
                ''
              )}

              {(selectedOption == 'User ID' && employeeId) ||
                (selectedOption == 'Role' && allUsers.length > 0) ? (
                <>
                  <Grid
                    item
                    md={12}
                    style={{
                      border: '1px solid #ebe5e5',
                      borderRadius: '0.75rem'
                    }}>
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
                          placeholder='Search Roles...'
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
                                    setPagination()
                                    handleClose2();
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
                                    setPagination()
                                    handleClose2();
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
                                    setPagination()
                                    handleClose2();
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
                                {selectedOption == 'Role' ? "Order(By Employee Name)" : "Order(By Role Name)"}
                              </div>
                              <List className='nav-neutral-first nav-pills-rounded flex-column p-2'>
                                <ListItem
                                  button
                                  href='#/'
                                  onClick={e => {
                                    handleSort('ASC');
                                    handleClose2();
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
                                  onClick={e => { handleSort('DES'); handleClose2(); }}>
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

                    {selectedOption == 'User ID' ? (
                      <>
                        <div className='p-4'>
                          <div className='table-responsive-md'>
                            <TableContainer>
                              <Table className='table table-alternate-spaced mb-0'>
                                <thead>
                                  <tr>
                                    <th
                                      style={{ width: '40%' }}
                                      className='font-size-lg font-weight-bold pb-4 text-capitalize '
                                      scope='col'>
                                      Role Name
                                    </th>
                                    <th
                                      style={{ width: '70%' }}
                                      className='font-size-lg font-weight-bold pb-4 text-capitalize '
                                      scope='col'>
                                      Description
                                    </th>
                                    <th
                                      style={{ width: '10%' }}
                                      className='font-size-lg font-weight-bold pb-4 text-capitalize'
                                      scope='col'>
                                      <Checkbox
                                        id='outlined-isOne-to-OneJob'
                                        placeholder='Is One-to-One Job'
                                        variant='outlined'
                                        size='small'
                                        checked={checkAllRoles}
                                        onChange={event => {
                                          setCheckAllRoles(event.target.checked)
                                          if (event.target.checked) {
                                            let uuids = paginatedRoles.map(
                                              a => a.uuid
                                            )
                                            setAddedRoles(uuids)
                                          } else {
                                            setAddedRoles([])
                                          }
                                        }}></Checkbox>
                                    </th>
                                  </tr>
                                </thead>
                                {paginatedRoles.length > 0 ? (
                                  <tbody>
                                    {paginatedRoles
                                      .slice(
                                        page * recordsPerPage > RolesArray.length
                                          ? page === 0
                                            ? 0
                                            : page * recordsPerPage -
                                            recordsPerPage
                                          : page * recordsPerPage -
                                          recordsPerPage,
                                        page * recordsPerPage <= RolesArray.length
                                          ? page * recordsPerPage
                                          : RolesArray.length
                                      )
                                      .map((item, idx) => (
                                        <>
                                          <tr>
                                            <td>
                                              <div className='d-flex '>
                                                <div>{item.name}</div>
                                              </div>
                                            </td>
                                            <td>
                                              <div className='d-flex '>
                                                <div>{item.description}</div>
                                              </div>
                                            </td>
                                            <td>
                                              <div className='d-flex '>
                                                <Checkbox
                                                  id='outlined-isOne-to-OneJob'
                                                  placeholder='Is One-to-One Job'
                                                  variant='outlined'
                                                  size='small'
                                                  value={addedRoles?.includes(
                                                    item?.uuid
                                                  )}
                                                  checked={addedRoles?.includes(
                                                    item?.uuid
                                                  )}
                                                  onChange={event => {
                                                    addRemoveRoles(
                                                      event,
                                                      item,
                                                      idx
                                                    )
                                                  }}></Checkbox>
                                              </div>
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                  </tbody>
                                ) : (
                                  <tbody className='text-center'>
                                    <div>
                                      <img
                                        alt='...'
                                        src={noResults}
                                        style={{ maxWidth: '600px' }}
                                      />
                                    </div>
                                  </tbody>
                                )}
                              </Table>
                            </TableContainer>
                          </div>
                        </div>
                        <div className='d-flex  justify-content-center pt-3 mb-5'>
                          <Pagination
                            className='pagination-primary'
                            count={Math.ceil(
                              RolesArray.length / recordsPerPage
                            )}
                            variant='outlined'
                            shape='rounded'
                            selected={true}
                            page={page}
                            onChange={handleChange}
                            showFirstButton
                            showLastButton
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {selectedOption == 'Role' ? (
                          <>
                            <div className='p-4'>
                              <div className='table-responsive-md'>
                                <TableContainer>
                                  <Table className='table table-alternate-spaced mb-0'>
                                    <thead style={{ background: '#eeeeee' }}>
                                      <tr>
                                        <th
                                          style={{ width: '30%', ...paddingTop }}
                                          className='font-size-lg font-weight-bold pb-4 text-capitalize align-items-center'
                                          scope='col'>
                                          Employee ID
                                        </th>
                                        <th
                                          style={{ width: '40%', ...paddingTop }}
                                          className='font-size-lg font-weight-bold pb-4 text-capitalize align-items-center'
                                          scope='col'>
                                          Employee Name
                                        </th>
                                        <th
                                          style={{ width: '40%', ...paddingTop }}
                                          className='font-size-lg font-weight-bold pb-4 text-capitalize align-items-center'
                                          scope='col'>
                                          User ID
                                        </th>
                                        <th
                                          style={{ width: '10%', ...paddingTop }}
                                          className='font-size-lg font-weight-bold pb-4 text-capitalize align-items-center'
                                          scope='col'>
                                          <Checkbox
                                            id='outlined-isOne-to-OneJob'
                                            placeholder='Is One-to-One Job'
                                            variant='outlined'
                                            size='small'
                                            checked={checkAllUsers}
                                            onChange={event => {
                                              setCheckAllUsers(
                                                event.target.checked
                                              )
                                              if (event.target.checked) {
                                                let uuids = paginatedUsers.map(
                                                  a => a.employeeUUID
                                                )
                                                setAddedUsers(uuids)
                                              } else {
                                                setAddedUsers([])
                                              }
                                            }}></Checkbox>
                                        </th>
                                      </tr>
                                    </thead>
                                    {paginatedUsers.length > 0 ? (
                                      <tbody>
                                        {paginatedUsers
                                          .slice(
                                            page * recordsPerPage >
                                              userArray.length
                                              ? page === 0
                                                ? 0
                                                : page * recordsPerPage -
                                                recordsPerPage
                                              : page * recordsPerPage -
                                              recordsPerPage,
                                            page * recordsPerPage <=
                                              userArray.length
                                              ? page * recordsPerPage
                                              : userArray.length
                                          )
                                          .map((item, idx) => (
                                            <>
                                              <tr>
                                                <td>
                                                  <div className='d-flex align-items-center'>
                                                    <div>{item.id}</div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className='d-flex align-items-center'>
                                                    <div>
                                                      {item.firstName} -{' '}
                                                      {item.lastName}
                                                    </div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className='d-flex align-items-center'>
                                                    <div>{item.userId}</div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className='d-flex '>
                                                    <Checkbox
                                                      id='outlined-isOne-to-OneJob'
                                                      placeholder='Is One-to-One Job'
                                                      variant='outlined'
                                                      size='small'
                                                      value={addedUsers.includes(
                                                        item?.employeeUUID
                                                      )}
                                                      checked={addedUsers.includes(
                                                        item?.employeeUUID
                                                      )}
                                                      onChange={event => {
                                                        addRemoveUsers(
                                                          event,
                                                          item,
                                                          idx
                                                        )
                                                      }}></Checkbox>
                                                  </div>
                                                </td>
                                              </tr>
                                            </>
                                          ))}
                                      </tbody>
                                    ) : (
                                      <tbody className='text-center'>
                                        <div>
                                          <img
                                            alt='...'
                                            src={noResults}
                                            style={{ maxWidth: '600px' }}
                                          />
                                        </div>
                                      </tbody>
                                    )}
                                  </Table>
                                </TableContainer>
                              </div>
                            </div>
                            <div className='d-flex  justify-content-center pt-3 mb-5'>
                              <Pagination
                                className='pagination-primary'
                                count={Math.ceil(
                                  userArray.length / recordsPerPage
                                )}
                                variant='outlined'
                                shape='rounded'
                                selected={true}
                                page={page}
                                onChange={handleChange}
                                showFirstButton
                                showLastButton
                              />
                            </div>{' '}
                          </>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </Grid>
                  <div className='float-left pt-3' style={{ marginLeft: '2.5%' }}>
                    <Button
                      className='btn-primary mb-2 m-2'
                      component={NavLink}
                      to='./dashboard'>
                      Cancel
                    </Button>
                    <Button
                      className='btn-primary mb-2 m-2'
                      type='submit'
                      onClick={e => save(e)}>
                      Save
                    </Button>
                  </div>{' '}
                </>
              ) : (
                ''
              )}
            </Grid >
            <Popover
              open={open3}
              anchorEl={anchorEl3}
              classes={{ paper: 'rounded font-size-xl' }}
              onClose={handleClosePopover3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}>
              <div className='rounded-top p-3 font-weight-bold'>
                <Grid item md={12} container direction='row'>
                  <Grid item md={3} className='mx-auto'>
                    <label className='font-weight-normal mt-2'>Role Name</label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <TextField
                      id='outlined-roleName'
                      placeholder=''
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='roleName'
                      value={roleName}
                      onChange={event => {
                        setRoleName(event.target.value)
                      }}
                      helperText={
                        isRolesubmitted && (!roleName || roleName === '')
                          ? 'role Name  is required'
                          : ''
                      }
                      error={
                        isRolesubmitted && (!roleName || roleName === '')
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
                  <Grid item md={3} className='mx-auto'>
                    <label className='font-weight-normal mt-2'>
                      Role Description
                    </label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label=''
                      multiline
                      rowsMax='5'
                      value={roleDescription}
                      onChange={event => {
                        setRoleDescription(event.target.value)
                      }}
                      variant='outlined'
                      error={
                        isRolesubmitted && (roleDescription ? false : true)
                      }
                      helperText={
                        isRolesubmitted &&
                          (!roleDescription || roleDescription === '')
                          ? 'Description is required'
                          : ''
                      }
                    />
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className='float-left' style={{ marginLeft: '2.5%' }}>
                <Button
                  className='btn-primary mb-2 m-2'
                  onClose={handleClosePopover3}>
                  Cancel
                </Button>
                <Button
                  className='btn-primary mb-2 m-2'
                  type='submit'
                  onClick={e => saveRole(e)}>
                  Save
                </Button>
              </div>
            </Popover>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              key={`${vertical},${horizontal}`}
              open={open}
              classes={{ root: toastrStyle }}
              onClose={handleClose}
              message={message}
              autoHideDuration={2000}
            />
          </Grid >
        </Card >
      </BlockUi >
    </>
  )
}

export default PersmissionAssignment
