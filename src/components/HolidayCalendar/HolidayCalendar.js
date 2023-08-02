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
    Card,
    Menu,
    Button,
    List,
    ListItem,
    TextField,
    Snackbar,
    MenuItem,
    FormControl,
    TableContainer
} from '@material-ui/core'
import 'date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
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
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import Autocomplete from '@material-ui/lab/Autocomplete'


const HolidayCalendar = (props) => {

    const { user } = props
    const [paginationHolidays, setPaginationHolidays] = useState([])
    const [holidays, setHolidays] = useState([])
    const [allholidays, setAllHolidays] = useState([])
    const [blocking, setBlocking] = useState(false)
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [searchOpen, setSearchOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(null)
    const [allLocations, setAllLocations] = useState([])
    const [filteredLocations, setfilteredLocations] = useState([])
    const [isSubmitted, setIsSubmitted] = useState();
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => 1900 + i);
    const [selectYear, setSelectYear] = useState('');
    const [formURL, setFormURL] = useState('/holidayCalendarConfiguration');
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
    useEffect(() => {
        getData()
        getLocations()
    }, [])
    const getData = (body={}) => {
        setBlocking(true)
        apicaller('post', `${BASEURL}/holidayCalendarConfiguration/fetchAll`,body)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    setHolidays(res.data)
                    setAllHolidays(res.data)
                    setPaginationHolidays(res.data)
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('getNationalIds err', err)
            })
    }

    const getLocations = () => {
        apicaller('get', `${BASEURL}/location`)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    setAllLocations(res.data)
                }
            })
            .catch(err => {
                console.log('getDesignation err', err)
            })
    }

    const openSearch = () => setSearchOpen(true)
    const closeSearch = () => setSearchOpen(false)
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
    const handleSort = sortOrder => {
        let sortedHolidays = JSON.parse(JSON.stringify(holidays))
        if (sortOrder == 'ASC') {
            sortedHolidays = sortedHolidays.sort((empA, empB) =>
                empA.name > empB.name
                    ? 1
                    : empB.name > empA.name
                        ? -1
                        : 0
            )
            setHolidays(sortedHolidays)
            setPaginationHolidays(sortedHolidays)
        } else {
            sortedHolidays = sortedHolidays.sort((empB, empA) =>
                empA.name > empB.name
                    ? 1
                    : empB.name > empA.name
                        ? -1
                        : 0
            )
            setHolidays(sortedHolidays)
            setPaginationHolidays(sortedHolidays)
        }
    }
    const handleChange = (event, value) => {
        console.log(value)
        setPage(value)
    }
    const handleSearch = (event) => {
        const filterHolidays = allholidays.filter(
            (holiday) =>
                holiday.name
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase()))

        if (filterHolidays.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
            });
        }

        setHolidays(filterHolidays);
        setPaginationHolidays(filterHolidays);
    }

    const handleFilter = () => {
        let location,body={}
        if (filteredLocations?.length > 0) {
            location = filteredLocations.map(a => a.locationId)
            body.locationId=location;
            setAllLocations(filteredLocations)
          }
          if(selectYear?.length>0)body.year=[selectYear]
        getData(body)
    };

const getLocationNames = (locations) => {
    const locationName = [];
    locations.forEach(location => {
        locationName.push(location.locationName)
    });
    return locationName.toString()
}

return (
    <>
        <BlockUi            
            tag='div'
            blocking={blocking}
            loader={
                <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
            }>
            <Card className='card-box shadow-none'>
                <div className='d-flex flex-column flex-md-row justify-content-between px-4 py-3'               >
                    <div
                        className={clsx(
                            'search-wrapper search-wrapper--alternate search-wrapper--grow',
                            { 'is-active': searchOpen }
                        )}>
                        <TextField
                            variant='outlined'
                            size='small'
                            id='input-with-icon-textfield22-2'
                            placeholder='Search'
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
                        <div className='d-flex justify-content-end px-4 p-2'>
                            <Button
                                className='btn-primary mr-2'
                                component={NavLink}
                                to='/holidayCalendarConfiguration'>
                                Create Holiday Calendar
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
                                                <small className='font-weight-bold pb-2 text-uppercase text-primary d-block mt-4'>
                                                    Year
                                                </small>
                                                <MuiPickersUtilsProvider
                                                    utils={DateFnsUtils}
                                                    style={{ margin: '0%' }}>                              
                                                    <TextField
                                                        id="outlined-year"                                                       
                                                        style={{ margin: '0%' }}
                                                        label="Year"                                                     
                                                        variant="outlined"
                                                        fullWidth
                                                        select
                                                        size="small"
                                                        value={selectYear}
                                                        onChange={(event) => {
                                                            setSelectYear(event.target.value);
                                                        }}>
                                                        {yearsArray.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid item md={12}>
                                                <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                    Locations
                                                </small>
                                                <FormControl
                                                    variant='outlined'
                                                    fullWidth
                                                    size='small'>
                                                    <Autocomplete
                                                        id='combo-box-demo'
                                                        multiple
                                                        options={allLocations}
                                                        value={filteredLocations}
                                                        getOptionLabel={option => option.locationName}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label='Select Employee Locations'
                                                                variant='outlined'
                                                                fullWidth
                                                                size='small'
                                                            />
                                                        )}
                                                        onChange={(event, value) => {
                                                            setfilteredLocations(value)
                                                        }}
                                                    />{' '}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className='divider' />
                                    <div className='p-3 text-center bg-secondary'>
                                        <Button
                                            className='btn-primary'
                                            onClick={() => {
                                                handleFilter();
                                                handleClose()
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
                                                            getData()
                                                            setSelectYear('')
                                                            setfilteredLocations([])
                                                            handleClose()
                                                        }}
                                                    >
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
                                                setPaginationHolidays(allholidays)
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
                                                setPaginationHolidays(allholidays)
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
                                                setPaginationHolidays(allholidays)
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
                                            onClick={e => {handleSort('DES');handleClose2()}}>
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
                
                <div>
                    <div className='table-responsive-md m-4 px-5'>
                        <TableContainer>
                        <Table className='table table-alternate-spaced p-4'>
                            <thead className="thead-light">
                                <tr className='m-4 '>
                                    <th
                                        style={{ width: '450px' }}
                                        className='font-size-lg font-weight-bold pb-4 text-capitalize  text-left text-dark'
                                        scope='col'>
                                        Name of the Holiday Calendar
                                    </th>
                                    <th
                                        style={{ width: '180px' }}
                                        className='font-size-lg font-weight-bold pb-4 text-capitalize  text-left text-dark'
                                        scope='col'>
                                        Year
                                    </th>
                                    <th
                                        style={{ width: '300px' }}
                                        className='font-size-lg font-weight-bold pb-4 text-capitalize text-left text-dark'
                                        scope='col'>
                                        Location
                                    </th>

                                </tr>
                            </thead>
                            {paginationHolidays.length > 0 ? (<>
                                <tbody>

                                    {paginationHolidays
                                        .slice(
                                            page * recordsPerPage > allholidays.length
                                                ? page === 0
                                                    ? 0
                                                    : page * recordsPerPage - recordsPerPage
                                                : page * recordsPerPage - recordsPerPage,
                                            page * recordsPerPage <= allholidays.length
                                                ? page * recordsPerPage
                                                : allholidays.length
                                        )
                                        .map((item, idx) => (
                                            <>
                                                <tr className='mx-5 text-dark'>
                                                    <td className="text-left">
                                                        <div className='text-lef'>
                                                            <span className='font-weight-normal'>
                                                                {item?.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className='text-left'>
                                                        <span className='font-weight-normal'>
                                                            {item?.year}
                                                        </span>
                                                    </td>
                                                    <td className='text-left'>
                                                        <span className='font-weight-normal'>
                                                            {getLocationNames(item?.locations)}
                                                        </span>
                                                    </td>
                                                    <td className='text-right'>
                                                        <Button
                                                            component={NavLink}
                                                            to={formURL + '?uuid=' + item.uuid}
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
                                <tbody className='text-center'>
                                    <div>
                                        <img alt="..." src={noResults} style={{ maxWidth: '600px' }} /></div></tbody>
                            )}
                        </Table>
                        </TableContainer>
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                    <Pagination
                        className='pagination-primary'
                        count={Math.ceil(allholidays.length / recordsPerPage)}
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

export default connect(mapStateToProps, mapDispatchToProps)(HolidayCalendar)
