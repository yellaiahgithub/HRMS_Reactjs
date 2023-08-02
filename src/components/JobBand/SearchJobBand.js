import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux'
import apicaller from 'helper/Apicaller'
import {
  Table,
  Grid,
  InputAdornment,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SearchJobBandDashboard = props => {
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

  const [anchorEl, setAnchorEl] = useState(null)
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
      const filteredBands = allBands.filter(
        band => band.status == statusLabel
      )
      setBands(filteredBands)
      setPaginationBand(filteredBands)
    } else {
      setBands(allBands)
      setPaginationBand(allBands)
    }
  }
  const handleSort = (sortOrder) => {
    let sortedBands = JSON.parse(JSON.stringify(bands))
    if (sortOrder == 'ASC') {
      sortedBands = sortedBands.sort((bandA, bandB) =>
        bandA.bandName > bandB.bandName
          ? 1
          : bandB.bandName > bandA.bandName
            ? -1
            : 0
      )
      setBands(sortedBands)
      setPaginationBand(sortedBands)
    } else {
      sortedBands = sortedBands.sort((bandB, bandA) =>
        bandA.bandName > bandB.bandName
          ? 1
          : bandB.bandName > bandA.bandName
            ? -1
            : 0
      )
      setBands(sortedBands)
      setPaginationBand(sortedBands)
    }
  }

  const handleChange = (event, value) => {
    console.log(value)
    setPage(value)
  }

  const handleSearch = event => {
    const filteredBands = allBands.filter(
      band =>
        band.bandName?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
        band.bandId
          ?.toUpperCase()
          .includes(event.target.value?.toUpperCase())
    )

    if (filteredBands.length == 0) {
      setState({
        open: true,
        message: 'No Matching Results Found',
        toastrStyle: 'toastr-warning',
        vertical: 'top',
        horizontal: 'right'
      })
    }

    setBands(filteredBands)
    setPaginationBand(filteredBands)
  }

  const [allBands, setAllBands] = useState([])
  const [paginationBand, setPaginationBand] = useState([])
  const [bands, setBands] = useState([])
  const [blocking, setBlocking] = useState(false)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [formURL, setFormURL] = useState('/createJobBand');

  useEffect(() => {
    getJobBands()
  }, [])

  const getJobBands = () => {
    setBlocking(true)
    apicaller('get', `${BASEURL}/jobBand/fetchAll`)
      .then(res => {
        setBlocking(false)
        if (res.status === 200) {
          console.log('res.data', res.data)
          setBands(res.data)
          setAllBands(res.data)
          setPaginationBand(res.data)
        }
      })
      .catch(err => {
        setBlocking(false)
        console.log('getJObBand err', err)
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
                placeholder='Search Job Bands...'
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
                  to='./createJobBand'>
                  Create Job Band
                </Button>
              </div>
              <div>
                <Button
                  onClick={handleClick}
                  className='btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill'>
                  <FilterListTwoToneIcon className='w-50' />
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
                  <div className='dropdown-menu-xxl overflow-hidden p-0'>
                    <div className='p-3'>
                      <Grid container spacing={6}>
                        <Grid item md={12}>
                          <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                            Status
                          </small>
                          <FormControl
                            variant='outlined'
                            fullWidth
                            size='small'>
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
                    <div className='divider' />
                    <div className='p-3 text-center bg-secondary'>
                      <Button
                        className='btn-primary'
                        onClick={() => {
                          handleFilter(parseInt(status));handleClose()
                        }}
                        size='small'>
                        Filter results
                      </Button>
                    </div>
                    <div className='divider' />
                    <div className='p-3'>
                      <Grid container spacing={6}>
                        <Grid item md={12}>
                          <List className='nav-neutral-danger flex-column p-0'>
                            <ListItem
                              button
                              className='d-flex rounded-sm justify-content-center'
                              href='#/'
                              onClick={e => {
                                setStatus(0)
                                handleFilter(0)
                                handleClose()
                              }}>
                              <div className='mr-2'>
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
                          handleClose2()
                          setPaginationBand(bands)
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
                          handleClose2()
                          setPaginationBand(bands)
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
                          handleClose2()
                          setPaginationBand(bands)
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
                          handleSort('ASC');handleClose2()
                        }}>
                        <div className='mr-2'>
                          <ArrowUpwardTwoToneIcon />
                        </div>
                        <span className='font-size-md'>Ascending</span>
                      </ListItem>
                      <ListItem
                        button
                        href='#/'
                        onClick={e =>{ handleSort('DES');handleClose2()}}>
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
          {paginationBand.length > 0 && (
            <div className='p-4'>
              <div className='table-responsive-md'>
                <Table className='table table-alternate-spaced mb-0'>
                  <thead>
                    <tr>
                      <th
                        style={{ width: '200px' }}
                        className='font-size-lg font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Band ID
                      </th>
                      <th
                        style={{ width: '200px' }}
                        className='font-size-lg font-weight-bold pb-4 text-capitalize '
                        scope='col'>
                        Band Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginationBand
                      .slice(
                        page * recordsPerPage > bands.length
                          ? page === 0
                            ? 0
                            : page * recordsPerPage - recordsPerPage
                          : page * recordsPerPage - recordsPerPage,
                        page * recordsPerPage <= bands.length
                          ? page * recordsPerPage
                          : bands.length
                      )
                      .map(item => (
                        <>
                          <tr style={{ borderBottom: '6px solid transparent' }}>
                            <td>
                              <span>{item.bandId}</span>
                            </td>
                            <td>
                              <span>{item.bandName}</span>
                            </td>
                            <td className="text-right">
                                <Button
                                  component={NavLink}
                                  to={formURL + '?id=' + item.bandId}
                                  className="btn-primary mx-1 rounded-sm shadow-none hover-scale-sm d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center">
                                  <FontAwesomeIcon
                                    icon={['far', 'edit']}
                                    className="font-size-sm"
                                  />
                                </Button>
                              </td>
                          </tr>
                        </>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                <Pagination
                  className='pagination-primary'
                  count={Math.ceil(bands.length / recordsPerPage)}
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
          )}
          {paginationBand.length == 0 && (
          <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
            <label className="p-4 d-flex align-items-center">
              No Matching Results Found
            </label>
          </div>
        )}
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
    user: state.Auth.user
  }
}

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchJobBandDashboard)
