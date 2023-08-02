import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from 'react-redux'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    TableContainer,
    Checkbox,
    Snackbar
} from '@material-ui/core'
import apicaller from 'helper/Apicaller'
import Pagination from '@material-ui/lab/Pagination'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import axios from 'axios'
import { BASEURL } from 'config/conf'
import { ClimbingBoxLoader } from 'react-spinners'
import BlockUi from 'react-block-ui'
import { setSelectedEmployee } from '../../actions/index'

const EmployeePriorWorkExperienceReport = (props) => {
    const { setEmployee, user } = props
    const history = useHistory()

    const [anchorEl, setAnchorEl] = useState(null)
    const [formURL, setFormURL] = useState('/assignedPermissions')
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setState({ ...state, open: false })
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
    const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] =
        useState(false)
    const [downloadResults, setDownloadUrl] = useState('/downloadResults')
    const [status, setStatus] = useState('0')
    const [employees, setEmployees] = useState([])
    const [allEmployees, setAllEmployees] = useState([])
    const [paginationEmployees, setPaginationEmployees] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [sort, setSort] = useState('ASC')
    const [page, setPage] = useState(1)
    const [allDepartments, setAllDepartments] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [filteredDepartments, setfilteredDepartments] = useState([])
    const [filteredLocations, setfilteredLocations] = useState([])
    const [filterTotalExperience, setFilterTotalExperience] = useState([])

    useEffect(() => {
        getEmployees()
        getLocations()
        getDepartments()
    }, [])

    const handleStatus = event => {
        setStatus(event.target.value)
    }
    const handleFilter = type => {
        let departments
        let location

        if (filteredDepartments?.length > 0) {
            departments = filteredDepartments.map(a => a.id)
        }
        if (filteredLocations?.length > 0) {
            location = filteredLocations.map(a => a.locationId)
        }

        let obj = {
            department: departments,
            totalExperience: filterTotalExperience,
            location: location,
            reportType: 'WorkExperience',
        }
        if (type == 'excel') {
            obj['exportData'] = true
            obj['downloadedBy'] = user.uuid
        }
        setBlocking(true)
        axios
            .post(`${BASEURL}/employee/filter`, obj)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    if (type == 'excel') {
                        setNavigateToDownloadResultPage(true)
                        setState({
                            open: true,
                            message:
                                "Download is in Queue Kindly download the file from 'DOWNLOAD RESULTS' page",
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        })
                    } else {
                        if (res.data.length > 0) {
                            setEmployees(res.data)
                            setPaginationEmployees(res.data)
                        } else {
                            setEmployees([])
                            setPaginationEmployees([])
                        }
                        handleClose()
                    }
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('getEmployees err', err)
            })
    }
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
    const jobTypes = [
        {
            value: 'Consultant',
            label: 'Consultant'
        },
        {
            value: 'Contractor',
            label: 'Contractor'
        },
        {
            value: 'Employee',
            label: 'Employee'
        },
        {
            value: 'Intern',
            label: 'Intern'
        },
        {
            value: 'Retainer',
            label: 'Retainer'
        }
    ]
    const totalExperienceArray = Array.from({ length: 25 }, (_, i) => 1 + i);
    const handleSort = sortOrder => {
        let sortedEmployees = JSON.parse(JSON.stringify(employees))
        if (sortOrder == 'ASC') {
            sortedEmployees = sortedEmployees.sort((loct1, loct2) =>
                loct1.employeeName > loct2.employeeName
                    ? 1
                    : loct2.employeeName > loct1.employeeName
                        ? -1
                        : 0
            )
            setEmployees(sortedEmployees)
            setPaginationEmployees(sortedEmployees)
        } else {
            sortedEmployees = sortedEmployees.sort((loct2, loct1) =>
                loct1.employeeName > loct2.employeeName
                    ? 1
                    : loct2.employeeName > loct1.employeeName
                        ? -1
                        : 0
            )
            setEmployees(sortedEmployees)
            setPaginationEmployees(sortedEmployees)
        }
    }
    const getDepartments = () => {
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
    const getEmployees = () => {
        setBlocking(true)
        let obj = {
            reportType: 'WorkExperience'
        }
        axios
            .post(`${BASEURL}/employee/filter`, obj)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    if (res.data.length > 0) {
                        setEmployees(res.data)
                        setAllEmployees(res.data)
                        setPaginationEmployees(res.data)
                    }
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('getEmployees err', err)
            })
    }
    const handleChange = (event, value) => {
        console.log(value)
        setPage(value)
    }
    const handleSearch = (event) => {
        const results = allEmployees.filter((obj) =>
            JSON.stringify(obj)
                .toLowerCase()
                .includes(event.target.value.toLowerCase())
        );
        if (results.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
            });
        }
        setEmployees(results)
        setPaginationEmployees(results)
    };
    const [blocking, setBlocking] = useState(false)
    const [ifMultiselect, setIfMultiselect] = useState(true)

    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100px'
    }
    const paddingTop = {
        paddingTop: '25px'
    }

    return (
        <BlockUi
            tag='div'
            blocking={blocking}
            loader={
                <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
            }>
            <>
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
                                placeholder='Search employees...'
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
                        {navigateToDownloadResultPage ? (
                            <div className='d-flex align-items-center justify-content-center'>
                                <a
                                    href={downloadResults}
                                    className='text-black'
                                    title='Navigate To Download Results Page'
                                    style={{ color: 'blue' }}>
                                    Navigate To Downlaod Results Page
                                </a>
                            </div>
                        ) : (
                            ''
                        )}
                        <div className='d-flex align-items-center'>
                            <FontAwesomeIcon
                                onClick={() => handleFilter('excel')}
                                icon={['far', 'file-excel']}
                                style={{ color: 'green', cursor: 'pointer' }}
                                className='btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill'
                            />
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
                                                        Departments
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <Autocomplete
                                                            id='combo-box-demo'
                                                            multiple
                                                            options={allDepartments}
                                                            value={filteredDepartments}
                                                            getOptionLabel={option => option.name}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='Select Employee Department'
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    size='small'
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setfilteredDepartments(value)
                                                            }}
                                                        />
                                                    </FormControl>
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
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        Total Experience
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <TextField
                                                            id='combo-box-demo'
                                                            label='Select Total Experience'
                                                            variant='outlined'
                                                            fullWidth
                                                            select
                                                            multiple
                                                            size='small'
                                                            value={filterTotalExperience}
                                                            onChange={(event, value) => {
                                                                setFilterTotalExperience(event.target.value)
                                                            }}>
                                                            {totalExperienceArray.map((option) => (
                                                                <MenuItem key={option} value={option}>
                                                                    {option}
                                                                </MenuItem>
                                                            ))}

                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className='divider' />
                                        <div className="p-3 text-center bg-secondary">
                                            <Button
                                                style={{ margin: '0px 15px' }}
                                                className="btn-primary"
                                                onClick={() => {
                                                    handleFilter();
                                                }}
                                                size="small">
                                                Search
                                            </Button>
                                            <Button
                                                style={{ margin: '0px 15px' }}
                                                className="btn-secondary"
                                                onClick={() => {
                                                    setfilteredDepartments([])
                                                    setfilteredLocations([])
                                                    setFilterTotalExperience([])
                                                }}
                                                size="small">
                                                Clear Filters
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
                                                                getEmployees()
                                                                setfilteredDepartments([])
                                                                setfilteredLocations([])
                                                                setFilterTotalExperience([])
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
                                                    setPaginationEmployees(employees);
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
                                                    setPaginationEmployees(employees);
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
                                                    setPaginationEmployees(employees);
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
                                        <div className='font-weight-bold px-4 pt-4'>Order(By Employee Name)</div>
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
                                                <span className='font-size-md'>Ascending</span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href='#/'
                                                onClick={e => { handleSort('DES'); handleClose2(); }}>
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
                        <div className='text-center my-4'>
                            <span className='display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize'>
                                Employee Prior Work Experience Details Report
                            </span>
                        </div>
                        <div className='table-responsive-md'>
                            <TableContainer>
                                <Table className='table table-alternate-spaced mb-0'>
                                    <thead style={{ background: '#eeeeee' }}>
                                        <tr>
                                            <th
                                                title='SI.No'
                                                style={Object.assign(
                                                    { minWidth: '60px', maxWidth: '135px' },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                SI.No.
                                            </th>
                                            <th
                                                title='Employee ID'
                                                style={Object.assign(
                                                    { minWidth: '110px', maxWidth: '185px' },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Employee ID
                                            </th>
                                            <th
                                                title='Employee Name'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Employee Name
                                            </th>
                                            <th
                                                title='Total Experience'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Total Experience
                                            </th>
                                            <th
                                                title='Previous Designation'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Previous Designation
                                            </th>
                                            <th
                                                title='Employment Type'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Employment Type
                                            </th>
                                            <th
                                                title='Company Name'
                                                style={Object.assign(
                                                    {
                                                        minWidth: '135px',
                                                        maxWidth: '285px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Company Name
                                            </th>
                                            <th
                                                title='Worked From'
                                                style={Object.assign(
                                                    {
                                                        minWidth: '1px',
                                                        maxWidth: '280px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Worked From
                                            </th>
                                            <th
                                                title='Worked To'
                                                style={Object.assign(
                                                    {
                                                        minWidth: '80px',
                                                        maxWidth: '280px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Worked To
                                            </th>
                                            <th
                                                title='Reporting Manager’s Name'
                                                style={Object.assign(
                                                    {
                                                        minWidth: '135px',
                                                        maxWidth: '280px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Reporting Manager’s Name
                                            </th>
                                            <th
                                                title='Reporting Manager’s Designation'
                                                style={Object.assign(
                                                    {
                                                        minWidth: '135px',
                                                        maxWidth: '280px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Reporting Manager’s Designation
                                            </th>
                                            <th
                                                title='Reason for Leaving'
                                                style={Object.assign(
                                                    {
                                                        minWidth: '135px',
                                                        maxWidth: '280px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Reason for Leaving
                                            </th>
                                        </tr>
                                    </thead>
                                    {paginationEmployees.length > 0 ? (
                                        <>
                                            <tbody>
                                                {paginationEmployees
                                                    .slice(
                                                        page * recordsPerPage > employees.length
                                                            ? page === 0
                                                                ? 0
                                                                : page * recordsPerPage - recordsPerPage
                                                            : page * recordsPerPage - recordsPerPage,
                                                        page * recordsPerPage <= employees.length
                                                            ? page * recordsPerPage
                                                            : employees.length
                                                    )
                                                    .map((item, idx) => (
                                                        <>
                                                            <tr>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div style={tableData} title={item.SNo}>
                                                                            {item.SNo}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.employeeID}
                                                                            style={tableData}>
                                                                            {item?.employeeID}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.employeeName}
                                                                            style={tableData}>
                                                                            {item?.employeeName}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.totalExperience}
                                                                            style={tableData}>
                                                                            {item?.totalExperience}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.previousDesignation}
                                                                            style={tableData}>
                                                                            {item?.previousDesignation}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.employmentType}
                                                                            style={tableData}>
                                                                            {item?.employmentType}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.previouscompanyName}
                                                                            style={tableData}>
                                                                            {item?.previouscompanyName}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.workedFrom}
                                                                            style={tableData}>
                                                                            {item?.workedFrom}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.workedTo}
                                                                            style={tableData}>
                                                                            {item?.workedTo}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.reportingManagerName}
                                                                            style={tableData}>
                                                                            {item?.reportingManagerName}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.reportingManagerDesignation}
                                                                            style={tableData}>
                                                                            {item?.reportingManagerDesignation}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.reasonForLeaving}
                                                                            style={tableData}>
                                                                            {item?.reasonForLeaving}
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                            <tr className='divider'></tr>
                                                        </>
                                                    ))}
                                            </tbody>
                                        </>
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
                        <div className='d-flex align-items-center justify-content-center pt-3 mb-5'>
                            <Pagination
                                className='pagination-primary'
                                count={Math.ceil(employees.length / recordsPerPage)}
                                variant='outlined'
                                shape='rounded'
                                selected={true}
                                page={page}
                                onChange={handleChange}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                        {/* </>
              );
            } else {
              return (
                <>
                  <h1>NO RESULTS FOUND....</h1>
                </>
              );
            }
          }} */}
                    </div>
                </Card>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    key={`${vertical},${horizontal}`}
                    open={open}
                    classes={{ root: toastrStyle }}
                    onClose={handleClose}
                    message={message}
                    autoHideDuration={3000}
                />
            </>
        </BlockUi>
    )
}

const mapStateToProps = state => {
    return {
        user: state.Auth.user
    }
}

const mapDispatchToProps = dispatch => ({
    setEmployee: data => dispatch(setSelectedEmployee(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeePriorWorkExperienceReport)
