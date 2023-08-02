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

const ProbationConfirmation = props => {
    const { setEmployee, user } = props
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState(null)
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
    const [employees, setEmployees] = useState([])
    const [allEmployees, setAllEmployees] = useState([])
    const [paginationEmployees, setPaginationEmployees] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [sort, setSort] = useState('ASC')
    const [page, setPage] = useState(1)
    const [allDepartments, setAllDepartments] = useState([])
    const [allLocations, setAllLocations] = useState([])
    const [allDesignations, setAllDesignations] = useState([])
    const [filteredDepartments, setfilteredDepartments] = useState([])
    const [filteredLocations, setfilteredLocations] = useState([])
    const [filteredDesignations, setfilteredDesignations] = useState([])
    const [selectedJoiningDate, setJoiningDate] = useState(null)
    const [blocking, setBlocking] = useState(false)
    const [checkAllEmployee, setCheckAllEmployee] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState()
    const [hireDate, setHireDate] = useState(null)
    const [confirmationDate, setConfirmationDate] = useState(null)


    useEffect(() => {
        getEmployees()
        getLocations()
        getDepartments()
        getDesignations()

    }, [])
    const handleFilter = type => {
        let departments
        let designation
        let location
        if (filteredDepartments?.length > 0) {
            departments = filteredDepartments.map(a => a.id)
        }
        if (filteredDesignations?.length > 0) {
            designation = filteredDesignations.map(a => a.id)
        }
        if (filteredLocations?.length > 0) {
            location = filteredLocations.map(a => a.locationId)
        }
        let obj = {
            department: departments,
            designation: designation,
            location: location,
            reportType: 'ProbationConfirmation',
            jobStatus: ['Probation']

        }
        const joiningDate = selectedJoiningDate ? selectedJoiningDate : null

        if (joiningDate) {
            obj['joiningDate'] = joiningDate
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
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    })
    const { vertical, horizontal, open, toastrStyle, message } = state
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
    const getDesignations = () => {
        apicaller('get', `${BASEURL}/designation/fetchAll`)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
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
            reportType: 'ProbationConfirmation',
            jobStatus: ['Probation']
        }
        axios
            .post(`${BASEURL}/employee/filter`, obj)
            .then(res => {
                setBlocking(false)
                if (res.status === 200 && res.data.length > 0) {
                    const newArray = res.data.map((item) => {
                        item.empSelected = false
                        return { ...item };
                    });
                    setEmployees(newArray)
                    setAllEmployees(newArray)
                    setPaginationEmployees(newArray)
                } else {
                    setEmployees([])
                    setAllEmployees([])
                    setPaginationEmployees([])
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('getEmployees err', err)
                setEmployees([])
                setAllEmployees([])
                setPaginationEmployees([])
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

    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100px'
    }
    const paddingTop = {
        paddingTop: '25px'
    }
    const handleCancel = () => {
        // Reset form fields
        setConfirmationDate(null);
        setCheckAllEmployee(false);
    };

    const handleSelectEmployee = index => e => {
        if (e.target.name == 'empSelected') {
            const result = allEmployees.map((item, i) => {
                if (index == i) {
                    return { ...item, [e.target.name]: e.target.checked }
                } else {
                    return item
                }
            })
            const newArray = result.map((item, i) => {
                return item
            })
            setAllEmployees(newArray)
            setPaginationEmployees(newArray)
        }
    }
    const handleSelectAllEmployees = (e) => {
        const newArray = allEmployees.map((item) => {
            item.empSelected = e.target.checked
            return { ...item };
        });
        setAllEmployees(newArray);
        setCheckAllEmployee(e.target.checked)
        setPaginationEmployees(newArray)
    }
    const save = (e) => {
        setIsSubmitted(true)
        e.preventDefault();
        if (confirmationDate == null) {
            setState({
                open1: true,
                message: 'Mandatory fields are Required',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            })
            return
        }

        let employeeUUIDs = [];
        allEmployees.map((item) => {
            if (item.empSelected) {
                employeeUUIDs.push(item.uuid)
            }
        })
        console.log('employeeUUIDs', employeeUUIDs)
        console.log(confirmationDate)
        if (employeeUUIDs.length > 0) {
            let input = {
                employeeUUIDs: employeeUUIDs,
                confirmationDate: confirmationDate
            }
            apicaller('post', `${BASEURL}/employee/probationConfirmation`, input)
                .then(res => {
                    if (res.status === 200) {
                        setIsSubmitted(false)

                        setState({
                            open: true,
                            message: 'User confirmed successfully!',
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        })
                        getEmployees()
                        setConfirmationDate(null)
                        setCheckAllEmployee(false);
                    }
                })
                .catch(err => {
                    console.log('confirmation err', err)

                })
        } else {
            setState({
                open: true,
                message: 'Select atleast one Employee',
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            })
        }
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
                                                        Designations
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <Autocomplete
                                                            id='combo-box-demo'
                                                            multiple
                                                            options={allDesignations}
                                                            value={filteredDesignations}
                                                            getOptionLabel={option => option.name}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='Select Employee Designations'
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    size='small'
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setfilteredDesignations(value)
                                                            }}
                                                        />{' '}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        Joining Date
                                                    </small>
                                                    <MuiPickersUtilsProvider
                                                        utils={DateFnsUtils}
                                                        style={{ margin: '0%' }}>
                                                        <KeyboardDatePicker
                                                            style={{ margin: '0%' }}
                                                            inputVariant='outlined'
                                                            format='dd/mm/yyyy'
                                                            placeholder='dd/mm/yyyy'
                                                            margin='normal'
                                                            id='outlined-joiningDate'
                                                            fullWidth
                                                            size='small'
                                                            value={selectedJoiningDate}
                                                            onChange={event => {
                                                                setJoiningDate(event)
                                                            }}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date'
                                                            }}
                                                        />
                                                    </MuiPickersUtilsProvider>
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
                                                    setfilteredDesignations([])
                                                    setfilteredLocations([])
                                                    setJoiningDate(null)
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
                                                                setfilteredDesignations([])
                                                                setfilteredLocations([])
                                                                setJoiningDate(null)
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
                        <div className="text-center my-4">
                            <span className="display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize">
                                Probation Confirmation
                            </span>
                        </div>
                        <div className='table-responsive-md'>
                            <TableContainer>
                                <Table className='table table-alternate-spaced mb-0'>
                                    <thead style={{ background: '#eeeeee' }}>
                                        <tr>
                                            <th className="text-center">
                                                <Checkbox
                                                    color="primary"
                                                    className="align-self-start"
                                                    name='checkBoxAll'
                                                    // checked={checkAllEmployee}
                                                    value={checkAllEmployee}
                                                    onChange={(event) => {
                                                        handleSelectAllEmployees(event)
                                                    }
                                                    }
                                                />
                                            </th>
                                            <th
                                                title='SI.No'
                                                style={Object.assign(
                                                    { minWidth: '75px', maxWidth: '135px' },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                SI.No.
                                            </th>
                                            <th
                                                title='Employee ID'
                                                style={Object.assign(
                                                    { minWidth: '135px', maxWidth: '185px' },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Employee ID
                                            </th>
                                            <th
                                                title='Employee'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Employee Name
                                            </th>
                                            <th
                                                title='Department'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Department
                                            </th>
                                            <th
                                                title='Location'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Location
                                            </th>
                                            <th
                                                title='Designation'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Designation
                                            </th>
                                            <th
                                                title='Hire Date'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Hire Date
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
                                                    .map((item, index) => (
                                                        <>
                                                            <tr>
                                                                <td className="text-center">
                                                                    <Checkbox
                                                                        color='primary'
                                                                        className='align-self-start'
                                                                        name={'empSelected'}
                                                                        checked={item['empSelected']}
                                                                        value={item.empSelected}
                                                                        onChange={handleSelectEmployee(index)}
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div style={tableData} title={index + 1}>
                                                                            {index + 1}
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
                                                                            title={item?.department}
                                                                            style={tableData}>
                                                                            {item?.department}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.location}
                                                                            style={tableData}>
                                                                            {item?.location}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.designation}
                                                                            style={tableData}>
                                                                            {item?.designation}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={getParsedDate(item?.hireDate)}
                                                                            style={tableData}>
                                                                            {getParsedDate(item?.hireDate)}{' '}
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
                    </div>
                    <Grid container md={12} >
                        <Grid md={12} className='d-flex p-4 align-items-center'>
                            <label >Probation Confirmation Date *</label>
                            <Grid md={3} className='pl-4'>
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                    style={{ margin: '0%' }}>
                                    <KeyboardDatePicker
                                        style={{ margin: '0%' }}
                                        inputVariant='outlined'
                                        format='dd/mm/yyyy'
                                        placeholder='dd/mm/yyyy'
                                        margin='normal'
                                        id='date-picker-inline'
                                        fullWidth
                                        size='small'
                                        value={confirmationDate}
                                        onChange={event => {
                                            setConfirmationDate(event)
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }}
                                        helperText={
                                            (isSubmitted && !confirmationDate) ||
                                                (isSubmitted && confirmationDate === null)
                                                ? 'Confimation Date is required'
                                                : ''
                                        }
                                        error={
                                            (isSubmitted && !confirmationDate) ||
                                                (isSubmitted && confirmationDate === null)
                                                ? true
                                                : false
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <br></br>
                        <br></br>
                        <Grid xs={12} md={12} className='p-5'>
                            <div className="divider" />
                            <br></br>
                            <div
                                className="float-left"
                                style={{ marginRight: '2.5%' }}>
                                <Button
                                    onClick={(e) => save(e)}
                                    className="btn-primary font-weight-normal mb-2 mr-3">
                                    Confirm
                                </Button>
                                <Button
                                    className="btn-primary font-weight-normal mb-2"
                                    component={NavLink}
                                    to="./probationConfirmation"
                                    onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                    <Snackbar
                        anchorOrigin={{ vertical, horizontal }}
                        key={`${vertical},${horizontal}`}
                        open={open}
                        classes={{ root: toastrStyle }}
                        onClose={handleClose}
                        message={message}
                        autoHideDuration={3000}
                    />
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProbationConfirmation)

