import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { connect } from 'react-redux'
import noResults from '../../assets/images/composed-bg/no_result.jpg'
import 'date-fns'
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
    FormControl,
    TableContainer,
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

const EmployeeBloodGroup = props => {
    const { setEmployee, user } = props
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
    const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] = useState(false)
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
    const [filterBloodGroups, setfilterBloodGroups] = useState([])
    const [filterGenders, setfilterGenders] = useState([])
    const [filtertoAge, setfiltertoAge] = useState()
    const [filterfromAge, setfilterfromAge] = useState()

    const bloodGroupList = [
        {
            value: 'A+ve',
            label: 'A+ve'
        },
        {
            value: 'A-ve',
            label: 'A-ve'
        },
        {
            value: 'B+ve',
            label: 'B+ve'
        },
        {
            value: 'B-ve',
            label: 'B-ve'
        },
        {
            value: 'AB+ve',
            label: 'AB+ve,'
        },
        {
            value: 'AB-ve',
            label: 'AB-ve'
        },
        {
            value: 'O+ve',
            label: 'O+ve'
        },
        {
            value: 'O-ve',
            label: 'O-ve'
        },
    ]
    const genders = [
        {
            value: 'Male',
            label: 'Male'
        },
        {
            value: 'Female',
            label: 'Female'
        },
        {
            value: 'Transgender',
            label: 'Transgender'
        },
        {
            value: 'Unknown',
            label: 'Unknown'
        }
    ]

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

    useEffect(() => {
        getEmployees()
        getLocations()
        getDepartments()
    }, [])

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
            reportType: 'BloodGroup'
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

    const handleFilter = type => {
        let departments, location, bloodGroups, genders
        if (filteredDepartments?.length > 0) {
            departments = filteredDepartments.map(a => a.id)
        }
        if (filteredLocations?.length > 0) {
            location = filteredLocations.map(a => a.locationId)
        }
        if (filterBloodGroups?.length > 0) {
            bloodGroups = filterBloodGroups.map(a => a.value)
        }
        if (filterGenders?.length > 0) {
            genders = filterGenders.map(a => a.value)
        }

        const fromAge = filterfromAge ? filterfromAge : null
        const toAge = filtertoAge ? filtertoAge : null

        let obj = {
            department: departments,
            bloodGroup: bloodGroups,
            gender: genders,
            location: location,
            reportType: 'BloodGroup',
        }

        if (fromAge) {
            obj['fromAge'] = Number(fromAge)
        }
        if (toAge) {
            obj['toAge'] = Number(toAge)
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
                            setAllEmployees(res.data)
                            setPaginationEmployees(res.data)
                        } else {
                            setEmployees([])
                            setPaginationEmployees([])
                            setAllEmployees([])
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
                                                        From Age
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <TextField
                                                            id="outlined-fromAge"
                                                            placeholder="Enter From Age"
                                                            type="number"
                                                            variant="outlined"
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            name='from Age'
                                                            value={filterfromAge}
                                                            onChange={(event, value) => {
                                                                setfilterfromAge(event.target.value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        To Age
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <TextField
                                                            id="outlined-toAge"
                                                            placeholder="Enter To Age"
                                                            type="number"
                                                            variant="outlined"
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            name='to Age'
                                                            value={filtertoAge}
                                                            onChange={(event, value) => {
                                                                setfiltertoAge(event.target.value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        Gender
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <Autocomplete
                                                            id='combo-box-demo'
                                                            multiple
                                                            options={genders}
                                                            value={filterGenders}
                                                            getOptionLabel={option => option.value}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='select Genders'
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    size='small'
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setfilterGenders(value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        Blood Broup
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <Autocomplete
                                                            id='combo-box-demo'
                                                            multiple
                                                            options={bloodGroupList}
                                                            value={filterBloodGroups}
                                                            getOptionLabel={option => option.value}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='select Blood Groups'
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    size='small'
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setfilterBloodGroups(value)
                                                            }}
                                                        />
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
                                                    setfilterfromAge([])
                                                    setfiltertoAge([])
                                                    setfilterGenders([])
                                                    setfilterBloodGroups([])
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
                                                                setfilterfromAge([])
                                                                setfiltertoAge([])
                                                                setfilterGenders([])
                                                                setfilterBloodGroups([])
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
                                Employee Blood Group Report
                            </span>
                        </div>
                        <div className='table-responsive-md'>
                            <TableContainer>
                                <Table className='table table-alternate-spaced mb-0'>
                                    <thead style={{ background: '#eeeeee' }}>
                                        <tr>
                                            <th
                                                title='SI.NO'
                                                style={Object.assign(
                                                    { minWidth: '75px', maxWidth: '135px ' },
                                                    paddingTop
                                                )}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                SI.NO
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
                                                title='Employee Name'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Employee Name
                                            </th>
                                            <th
                                                title='Location'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Location
                                            </th>
                                            <th
                                                title='Department'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                scope='col'>
                                                Department
                                            </th>
                                            <th
                                                title='Age'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Age
                                            </th>
                                            <th
                                                title='Gender'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Gender
                                            </th>
                                            <th
                                                title='Blood Group'
                                                style={{ ...tableData, ...paddingTop }}
                                                className='font-size-sm font-weight-bold pb-4 text-capitalize k'
                                                scope='col'>
                                                Blood Group
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
                                                                            title={item?.location}
                                                                            style={tableData}>
                                                                            {item?.location}
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
                                                                            title={item?.age}
                                                                            style={tableData}>
                                                                            {item?.age}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.gender}
                                                                            style={tableData}>
                                                                            {item?.gender}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div
                                                                            title={item?.bloodGroup}
                                                                            style={tableData}>
                                                                            {item?.bloodGroup}
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeBloodGroup)