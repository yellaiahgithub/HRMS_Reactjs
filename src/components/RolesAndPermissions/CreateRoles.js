import React, { useState, Component, useEffect } from 'react'
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
import { NavLink } from 'react-router-dom'
import apicaller from 'helper/Apicaller'

import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'

import { BASEURL } from 'config/conf'
import { TRUE } from 'sass'

const CreateRoles = () => {
  const [state, setState] = useState({
    open1: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  })
  const { vertical, horizontal, open1, toastrStyle, message } = state

  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [sort, setSort] = useState('ASC')
  const [page, setPage] = useState(1)

  const [roleName, setRoleName] = useState()
  const [roleDescription, setRoleDescription] = useState()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPermissionSubmitted, setIsPermissionSubmitted] = useState(false)
  const [permissionName, setPermissionName] = useState()
  const [permissionDescription, setPermissionDescription] = useState()
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

  const [blocking, setBlocking] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const [PermissionsArray, setPermissions] = useState([])

  const [paginatedPermissions, setPaginatedPermissions] = useState([])

  const [allPermissions, setAllPermissions] = useState([])

  const [addedPermissions, setAddedPermissions] = useState([])
  const [checkAllPermissions, setCheckAllPermissions] = useState(false)

  const handleSearch = event => {
    const filteredPermissions = allPermissions.filter(
      permission =>
        permission.name
          .toUpperCase()
          .includes(event.target.value?.toUpperCase()) ||
        permission.description
          .toUpperCase()
          .includes(event.target.value?.toUpperCase())
    )

    if (filteredPermissions.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-success',
        vertical: 'top',
        horizontal: 'right'
      })
    }

    setPermissions(filteredPermissions)
    setPaginatedPermissions(filteredPermissions)
  }

  const handleSort = sortOrder => {
    let sortedPermissions = JSON.parse(JSON.stringify(PermissionsArray))
    if (sortOrder == 'ASC') {
      sortedPermissions = sortedPermissions.sort((perm1, perm2) =>
        perm1.name > perm2.name ? 1 : perm2.name > perm1.name ? -1 : 0
      )
      setPermissions(sortedPermissions)
      setPaginatedPermissions(sortedPermissions)
    } else {
      sortedPermissions = sortedPermissions.sort((perm2, perm1) =>
        perm1.name > perm2.name ? 1 : perm2.name > perm1.name ? -1 : 0
      )
      setPermissions(sortedPermissions)
      setPaginatedPermissions(sortedPermissions)
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
    setPermissionDescription()
    setPermissionName()
  }

  const open3 = Boolean(anchorEl3)

  const handleClose = () => {
    setState({ ...state, open1: false })
  }

  useEffect(() => {
    getPermissions()
  }, [])

  const save = e => {
    e.preventDefault()
    //to do service call

    setIsSubmitted(true)
    if (roleName && roleDescription) {
      setBlocking(true)
      let Obj = {
        name: roleName,
        description: roleDescription,
        permissions: addedPermissions
      }

      apicaller('post', `${BASEURL}/role`, Obj)
        .then(res => {
          if (res.status === 200) {
            setBlocking(false)
            console.log('res.data', res.data)
            setIsSubmitted(false)
            setRoleDescription('')
            setRoleName('')
            setAddedPermissions([])
            setState({
              open1: true,
              message: 'Role Created Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
          }
        })
        .catch(err => {
          setBlocking(false)
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

  const getPermissions = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/permission`)
      .then(res => {
        if (res.status === 200) {
          for (const iterator of res.data) {
            iterator['isAdded'] = false
          }

          setBlocking(false)
          setPermissions(res.data)
          setPaginatedPermissions(res.data)
          setAllPermissions(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('get department err', err)
      })
  }

  const savePermission = e => {
    setIsPermissionSubmitted(true)
    if (permissionName && permissionDescription) {
      let obj = {
        name: permissionName,
        description: permissionDescription
      }

      apicaller('post', `${BASEURL}/permission`, obj)
        .then(res => {
          if (res.status === 200) {
            console.log('res.data', res.data)
            setState({
              open1: true,
              message: 'Permisison Created Successfully',
              toastrStyle: 'toastr-success',
              vertical: 'top',
              horizontal: 'right'
            })
            handleClosePopover3()
            setIsPermissionSubmitted(false)
            setPermissions(PermissionsArray => [
              ...PermissionsArray,
              res.data[0]
            ])
            setPermissions(allPermissions => [...allPermissions, res.data[0]])
            setPaginatedPermissions(paginatedPermissions => [
              ...paginatedPermissions,
              res.data[0]
            ])
          }
        })
        .catch(err => {
          if (err?.response?.data) {
            setState({
              open: true,
              message: 'Error Occured while creating Permisison Details',
              toastrStyle: 'toastr-warning',
              vertical: 'top',
              horizontal: 'right'
            })
          }
          console.log('create Permisison err', err)
        })
    }
  }

  const addRemovePermissions = (e, item, idx) => {
    let newArray = []
    let index = -1
    for (let i = 0; i < addedPermissions.length; i++) {
      if (addedPermissions[i] === item.uuid) {
        index = i
        break
      }
    }
    if (index === -1) {
      let uuid = item.uuid
      addedPermissions.push(uuid)
      setAddedPermissions(addedPermissions)

      const result = paginatedPermissions.map((item, i) => {
        return { ...item, item }
      })
      setPaginatedPermissions(result)
      setPermissions(result)
    } else {
      addedPermissions.splice(index, 1)
      setAddedPermissions(addedPermissions)

      const result = paginatedPermissions.map((item, i) => {
        return { ...item, item }
      })

      setPaginatedPermissions(result)
      setPermissions(result)
    }

    if(addedPermissions.length == paginatedPermissions.length) {
      setCheckAllPermissions(true)
    } else {
      setCheckAllPermissions(false)
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
              <Grid
                item
                md={12}
                container
                className='mx-auto mb-4'
                direction='row'>
                <Grid item md={3} className='mx-auto'>
                  <label className='font-weight-normal mt-2'>Role Name *</label>
                </Grid>
                <Grid item md={6} className='mx-auto'>
                  <TextField
                    id='outlined-roleName'
                    placeholder=''
                    variant='outlined'
                    fullWidth
                    size='small'
                    name='roleName'
                    value={roleName || undefined || ''}
                    onChange={event => {
                      setRoleName(event.target.value)
                    }}
                    helperText={
                      isSubmitted && (!roleName || roleName === '')
                        ? 'Role Name is required'
                        : ''
                    }
                    error={
                      isSubmitted && (!roleName || roleName === '')
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
                    Role Description *
                  </label>
                </Grid>
                <Grid item md={6} className='mx-auto'>
                  <TextField
                    fullWidth
                    id='outlined-multiline-flexible'
                    label=''
                    multiline
                    rowsMax='5'
                    value={roleDescription || undefined || ''}
                    onChange={event => {
                      setRoleDescription(event.target.value)
                    }}
                    variant='outlined'
                    error={isSubmitted && (roleDescription ? false : true)}
                    helperText={
                      isSubmitted &&
                        (!roleDescription || roleDescription === '')
                        ? 'Role Description is required'
                        : ''
                    }
                  />
                </Grid>
              </Grid>

              <Grid
                item
                md={12}
                style={{
                  border: '1px solid #ebe5e5',
                  borderRadius: '0.75rem'
                }}>
                <div className='d-flex justify-content-between px-4 py-3'>
                  <div
                    className={clsx(
                      'search-wrapper search-wrapper--alternate search-wrapper--grow',
                      { 'is-active': searchOpen }
                    )}>
                    <TextField
                      variant='outlined'
                      size='small'
                      id='input-with-icon-textfield22-2'
                      placeholder='Search Permissions...'
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
                      {/* <Button
                className="btn-primary mr-2"
                component={NavLink}
                to="./CreateCustomer">
                Create Customer
              </Button> */}
                    </div>
                    {/* <div>
              <Button
                onClick={handleClick}
                className="btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill">
                <FilterListTwoToneIcon className="w-50" />
              </Button>
              <Menu
                anchorEl={anchorEl}
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
                open={Boolean(anchorEl)}
                classes={{ list: 'p-0' }}
                onClose={handleClose}>
                <div className="dropdown-menu-xxl overflow-hidden p-0">
                  <div className="p-3">
                    <Grid container spacing={6}>
                      <Grid item md={12}>
                        <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                          Status
                        </small>
                        <FormControl variant="outlined" fullWidth size="small">
                          <Select
                            fullWidth
                            value={status}
                            onChange={handleStatus}
                            labelWidth={0}>
                            <MenuItem value={0}>All statuses</MenuItem>
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={2}>Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="divider" />
                  <div className="p-3 text-center bg-secondary">
                    <Button
                      className="btn-primary"
                      onClick={() => {
                        handleFilter(parseInt(status));
                      }}
                      size="small">
                      Filter results
                    </Button>
                  </div>
                  <div className="divider" />
                  <div className="p-3">
                    <Grid container spacing={6}>
                      <Grid item md={12}>
                        <List className="nav-neutral-danger flex-column p-0">
                          <ListItem
                            button
                            className="d-flex rounded-sm justify-content-center"
                            href="#/"
                            onClick={(e) => {
                              setStatus(0);
                              handleFilter(0);
                            }}>
                            <div className="mr-2">
                              <DeleteTwoToneIcon />
                            </div>
                            <span>Cancel</span>
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Menu>
            </div> */}
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
                                setPaginatedPermissions(PermissionsArray)
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
                                setPaginatedPermissions(PermissionsArray)
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
                                setPaginatedPermissions(PermissionsArray)
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
                    <TableContainer>
                      <Table className='table table-alternate-spaced mb-0'>
                        <thead>
                          <tr>
                            <th
                              style={{ width: '40%' }}
                              className='font-size-lg font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              Permission Name
                            </th>
                            <th
                              style={{ width: '70%' }}
                              className='font-size-lg font-weight-bold pb-4 text-capitalize'
                              scope='col'>
                              Description
                            </th>
                            <th
                              style={{ width: '10%' }}
                              className='font-size-lg font-weight-bold pb-4 text-capitalize '
                              scope='col'>
                              <Checkbox
                                id='outlined-isOne-to-OneJob'
                                placeholder='Is One-to-One Job'
                                variant='outlined'
                                size='small'
                                checked={checkAllPermissions}
                                onChange={event => {
                                  setCheckAllPermissions(event.target.checked)
                                  if (event.target.checked) {
                                    let uuids = paginatedPermissions.map(
                                      a => a.uuid
                                    )
                                    setAddedPermissions(uuids)
                                  } else {
                                    setAddedPermissions([])
                                  }
                                }}></Checkbox>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPermissions
                            .slice(
                              page * recordsPerPage > PermissionsArray.length
                                ? page === 0
                                  ? 0
                                  : page * recordsPerPage - recordsPerPage
                                : page * recordsPerPage - recordsPerPage,
                              page * recordsPerPage <= PermissionsArray.length
                                ? page * recordsPerPage
                                : PermissionsArray.length
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
                                        value={addedPermissions.includes(
                                          item?.uuid
                                        )}
                                        checked={addedPermissions.includes(
                                          item?.uuid
                                        )}
                                        onChange={event => {
                                          addRemovePermissions(event, item, idx)
                                        }}></Checkbox>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ))}
                        </tbody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>

                <div className='d-flex  justify-content-center pt-3 mb-5'>
                  <Pagination
                    className='pagination-primary'
                    count={Math.ceil(PermissionsArray.length / recordsPerPage)}
                    variant='outlined'
                    shape='rounded'
                    selected={true}
                    page={page}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                  />
                </div>
              </Grid>
              <p className='p-4'>
                Did not find your permission in the list above?{' '}
                <a
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={handleClickPopover3}>
                  Create one now
                </a>
              </p>

              <div className='float-left' style={{ marginLeft: '2.5%' }}>
                <Button
                  className='btn-primary mb-2 m-2'
                  component={NavLink}
                  to='./roles'>
                  Cancel
                </Button>
                <Button
                  className='btn-primary mb-2 m-2'
                  type='submit'
                  onClick={e => save(e)}>
                  Save
                </Button>
              </div>
            </Grid>

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
                    <label className='font-weight-normal mt-2'>
                      Permission Name
                    </label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <TextField
                      id='outlined-permissionName'
                      placeholder=''
                      variant='outlined'
                      fullWidth
                      size='small'
                      name='permissionName'
                      value={permissionName}
                      onChange={event => {
                        setPermissionName(event.target.value)
                      }}
                      helperText={
                        isPermissionSubmitted &&
                          (!permissionName || permissionName === '')
                          ? 'Permission Name  is required'
                          : ''
                      }
                      error={
                        isPermissionSubmitted &&
                          (!permissionName || permissionName === '')
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
                      Permission Description
                    </label>
                  </Grid>
                  <Grid item md={6} className='mx-auto'>
                    <TextField
                      fullWidth
                      id='outlined-multiline-flexible'
                      label=''
                      multiline
                      rowsMax='5'
                      value={permissionDescription}
                      onChange={event => {
                        setPermissionDescription(event.target.value)
                      }}
                      variant='outlined'
                      error={
                        isPermissionSubmitted &&
                        (permissionDescription ? false : true)
                      }
                      helperText={
                        isPermissionSubmitted &&
                          (!permissionDescription || permissionDescription === '')
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
                  onClick={e => savePermission(e)}>
                  Save
                </Button>
              </div>
            </Popover>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              key={`${vertical},${horizontal}`}
              open={open1}
              classes={{ root: toastrStyle }}
              onClose={handleClose}
              message={message}
              autoHideDuration={2000}
            />
          </Grid>
        </Card>
      </BlockUi>
    </>
  )
}

export default CreateRoles
