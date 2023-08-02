import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import apicaller from 'helper/Apicaller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    TableContainer,
    Popover,
    FormControl,
} from '@material-ui/core';
import 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import Autocomplete from '@material-ui/lab/Autocomplete'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import { BASEURL } from 'config/conf';
import { ClimbingBoxLoader } from 'react-spinners';
import Pagination from '@material-ui/lab/Pagination';
import BlockUi from 'react-block-ui';
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import viewDetails from '../../../src/assets/images/ViewDetails.jpg';
import noResults from '../../assets/images/composed-bg/no_result.jpg';
import { useLocation } from 'react-router-dom';

const TransactionSummary = (props) => {
    const { user } = props;
    const queryParams = new URLSearchParams(useLocation().search);
    const type = queryParams.get('type') || null;
    const [paginationTransaction, setpaginationTransaction] = useState([]);
    const [transaction, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [blocking, setBlocking] = useState(false);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [searchOpen, setSearchOpen] = useState(false);
    const [resignationDetails, setResignationDetails] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('')
    const [filteredTransactions, setfilteredTransactions] = useState([])
    const [filterApprovalStatus, setfilterApprovalStatus] = useState([])
    const [selectedFromDate, setFromDate] = useState(null)
    const [selectedToDate, setToDate] = useState(null)
    const [url, setUrl] = useState('')
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const colors = [
        { backgroundColor: 'DarkBlue' },
        { backgroundColor: 'DarkMagenta' },
        { backgroundColor: 'DarkOrchid' },
        { backgroundColor: 'DarkSlateBlue' },
        { backgroundColor: 'DarkViolet' },
        { backgroundColor: 'Fuchsia' },
        { backgroundColor: 'Indigo' },
        { backgroundColor: 'MidnightBlue' },
        { backgroundColor: 'Navy' },
        { backgroundColor: 'RoyalBlue' },
        { backgroundColor: 'SlateBlue' }
    ];

    const approvalStatus = [
        {
            value: 'Approved',
            label: 'Approved'
        },
        {
            value: 'Pending',
            label: 'Pending'
        },
        {
            value: 'Rejected',
            label: 'Rejected'
        }
    ];
    const transactionTypeList = [
        {
            value: 'Resignation',
            label: 'Resignation'
        }
    ]

    useEffect(() => {
        let url;
        if (type === 'admin') {
            url = `${BASEURL}/transactionSummary/fetchByApproverType/${type}`;
        } else {
            url = `${BASEURL}/transactionSummary/fetchByApproverType/${type}?userUUID=${user.uuid}`;
        }
        setUrl(url)
        getTransactionSummary(url, {})
    }, []);

    const getParsedDate = (date) => {
        if (date !== null && date !== '') {
            return new Date(date).toLocaleDateString('en-IN', {
                month: 'short',
                day: '2-digit'
            });
        } else {
            return 'N/A';
        }
    };
    const getTransactionSummary = (url, inputObj) => {
        apicaller('post', url, inputObj)
            .then((res) => {
                if (res.status === 200) {
                    setpaginationTransaction(res.data);
                    setAllTransactions(res.data);
                }
                console.log(res.data);
            })
            .catch((err) => {
                setBlocking(false);
                if (err.response?.data) {
                }
                console.log('get employee err', err);
            });
    };

    const openSearch = () => setSearchOpen(true);
    const closeSearch = () => setSearchOpen(false);
    const handleClose3 = () => {
        setState({ ...state, open: false });
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [anchorEl2, setAnchorEl2] = useState(null);
    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const [anchorEl3, setAnchorEl3] = useState(null);
    const handleViewDetails = (event, resignationUUID) => {
        setAnchorEl3(event.currentTarget);
        getViewDetails(resignationUUID);
    };
    const getViewDetails = (resignationUUID) => {
        apicaller(
            'get',
            `${BASEURL}/resignation/fetchForTransactionSummary/${resignationUUID}`
        )
            .then((res) => {
                if (res.status === 200) {
                    setResignationDetails(res.data);
                }
            })
            .catch((err) => {
                console.log('getDepartments err', err);
            });
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };
    const handleClose4 = () => {
        setAnchorEl3(null);
    };


    const handleSort = (sortOrder) => {
        let sortedTransactions = JSON.parse(JSON.stringify(transaction));
        if (sortOrder == 'ASC') {
            sortedTransactions = sortedTransactions.sort((empA, empB) =>
                empA.name > empB.name ? 1 : empB.name > empA.name ? -1 : 0
            );
            setTransactions(sortedTransactions);
            setpaginationTransaction(sortedTransactions);
        } else {
            sortedTransactions = sortedTransactions.sort((empB, empA) =>
                empA.name > empB.name ? 1 : empB.name > empA.name ? -1 : 0
            );
            setTransactions(sortedTransactions);
            setpaginationTransaction(sortedTransactions);
        }
    };
    const handleChange = (event, value) => {
        console.log(value);
        setPage(value);
    };

    const handleFilter = () => {
        let Transactions
        let ApprovalStatus

        if (filteredTransactions?.length > 0) {
            Transactions = filteredTransactions.map(a => a.value)
        }
        if (filterApprovalStatus?.length > 0) {
            ApprovalStatus = filterApprovalStatus.map(a => a.value)
        }

        let inputObj = {
            transactionType: Transactions,
            transactionStatus: ApprovalStatus,
            employeeId: selectedEmployeeId,
            employeeName: selectedEmployeeName
        }

        const fromDate = selectedFromDate ? selectedFromDate : null
        const toDate = selectedToDate ? selectedToDate : null

        if (fromDate) {
            inputObj['startDate'] = fromDate
        }
        if (toDate) {
            inputObj['endDate'] = toDate
        }

        getTransactionSummary(url, inputObj)
    }
    const handleSearch = (event) => {
        const filterTransactions = allTransactions.filter((transaction) =>
            transaction.employeeName?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
            transaction.employeeId?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
            transaction.requestType?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
            getParsedDate(transaction.requestedDate)?.toUpperCase().includes(event.target.value?.toUpperCase()) ||
            transaction.status?.toUpperCase().includes(event.target.value?.toUpperCase())
        );

        if (filterTransactions.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
            });
        }

        setTransactions(filterTransactions);
        setpaginationTransaction(filterTransactions);
    };
    const [anchorEl4, setAnchorEl4] = useState(null);
    const handleCancelResignation = (event, resignationUUID) => {
        setAnchorEl4(event.currentTarget);
        cancelResignation(resignationUUID);
    };
    const cancelResignation = (resignationUUID) => {
        apicaller(
            'put',
            `${BASEURL}/resignation/cancel/${resignationUUID}`
        )
            .then((res) => {
                if (res.status === 200) {
                    setState({
                        open: true,
                        message: "Resignation Request is Cancelled",
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                }
            })
            .catch((err) => {
                console.log('getDepartments err', err);
                setState({
                    open: true,
                    message: err.response.data,
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                })
            });
    };

    const paddingTop = {
        paddingTop: '25px'
    };
    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100px'
    };


    return (
        <>
            <BlockUi
                tag="div"
                blocking={blocking}
                loader={
                    <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
                }>
                <Card className="card-box shadow-none">
                    <div className="d-flex flex-column flex-md-row justify-content-between px-4  py-3">
                        <div
                            className={clsx(
                                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                                { 'is-active': searchOpen }
                            )}>
                            <TextField
                                variant="outlined"
                                size="small"
                                id="input-with-icon-textfield22-2"
                                placeholder="Search"
                                onFocus={openSearch}
                                onBlur={closeSearch}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchTwoToneIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        <div className="d-flex align-items-center">
                            <div>
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
                                                {type !== 'employee' && (
                                                    <Grid item container spacing={2} direction="row">
                                                        <Grid item md={12}>
                                                            <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                                Employee Name
                                                            </small>
                                                            <TextField
                                                                id='outlined-EmployeeName'
                                                                placeholder='Enter Employee Name'
                                                                variant='outlined'
                                                                fullWidth
                                                                size='small'
                                                                name='employeeName'
                                                                value={selectedEmployeeName}
                                                                onChange={(event) => {
                                                                    setSelectedEmployeeName(event.target.value);
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item md={12}>
                                                            <label className="font-weight-bold pb-2 text-uppercase text-primary mb-2">
                                                                Employee ID
                                                            </label>
                                                            <TextField
                                                                id="outlined-employeeId"
                                                                placeholder="Enter Employee ID"
                                                                variant="outlined"
                                                                fullWidth
                                                                size="small"
                                                                value={selectedEmployeeId}
                                                                onChange={(event) => {
                                                                    setSelectedEmployeeId(event.target.value);
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )}
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        Transaction Type
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <Autocomplete
                                                            id='combo-box-demo'
                                                            multiple
                                                            options={transactionTypeList}
                                                            value={filteredTransactions}
                                                            getOptionLabel={option => option.label}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='Select Transaction Type'
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    size='small'
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setfilteredTransactions(value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        Transaction Status
                                                    </small>
                                                    <FormControl
                                                        variant='outlined'
                                                        fullWidth
                                                        size='small'>
                                                        <Autocomplete
                                                            id='combo-box-demo1'
                                                            multiple
                                                            options={approvalStatus}
                                                            value={filterApprovalStatus}
                                                            getOptionLabel={option => option.label}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='select Approval Status'
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    size='small'
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setfilterApprovalStatus(value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        FROM DATE
                                                    </small>
                                                    <MuiPickersUtilsProvider
                                                        utils={DateFnsUtils}
                                                        style={{ margin: '0%' }}>
                                                        <KeyboardDatePicker
                                                            style={{ margin: '0%' }}
                                                            inputVariant='outlined'
                                                            format='dd/MM/yyyy'
                                                            margin='normal'
                                                            id='outlined-fromDate'
                                                            fullWidth
                                                            size='small'
                                                            value={selectedFromDate}
                                                            onChange={event => {
                                                                setFromDate(event)
                                                            }}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date'
                                                            }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className='font-weight-bold pb-2 text-uppercase text-primary d-block'>
                                                        TO DATE
                                                    </small>
                                                    <MuiPickersUtilsProvider
                                                        utils={DateFnsUtils}
                                                        style={{ margin: '0%' }}>
                                                        <KeyboardDatePicker
                                                            style={{ margin: '0%' }}
                                                            inputVariant='outlined'
                                                            format='dd/MM/yyyy'
                                                            margin='normal'
                                                            id='outlined-toDate'
                                                            fullWidth
                                                            size='small'
                                                            value={selectedToDate}
                                                            onChange={event => {
                                                                setToDate(event)
                                                            }}
                                                            KeyboardButtonProps={{
                                                                'aria-label': 'change date'
                                                            }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className="divider" />
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
                                                    setSelectedEmployeeId('')
                                                    setSelectedEmployeeName('')
                                                    setfilteredTransactions([])
                                                    setfilterApprovalStatus([])
                                                    setFromDate(null)
                                                    setToDate(null)
                                                }}
                                                size="small">
                                                Clear Filters
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
                                                            onClick={e => {
                                                                setSelectedEmployeeId('')
                                                                setSelectedEmployeeName('')
                                                                setfilteredTransactions([])
                                                                setfilterApprovalStatus([])
                                                                setFromDate(null)
                                                                setToDate(null)
                                                                handleClose(0)
                                                                getTransactionSummary(url, {})
                                                            }}
                                                        >
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
                            </div>
                            <div>
                                <Button
                                    onClick={handleClick2}
                                    className="btn-outline-primary d-flex align-items-center justify-content-center d-40 p-0 rounded-pill">
                                    <SettingsTwoToneIcon className="w-50" />
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
                                    <div className="dropdown-menu-lg overflow-hidden p-0">
                                        <div className="font-weight-bold px-4 pt-3">Results</div>
                                        <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                                            <ListItem
                                                button
                                                href="#/"
                                                value={recordsPerPage}
                                                onClick={(e) => {
                                                    setRecordsPerPage(10);
                                                    setpaginationTransaction(allTransactions);
                                                    setPage(1);
                                                }}>
                                                <div className="nav-link-icon mr-2">
                                                    <RadioButtonUncheckedTwoToneIcon />
                                                </div>
                                                <span className="font-size-md">
                                                    <b>10</b> results per page
                                                </span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href="#/"
                                                value={recordsPerPage}
                                                onClick={(e) => {
                                                    setRecordsPerPage(20);
                                                    setpaginationTransaction(allTransactions);
                                                    setPage(1);
                                                }}>
                                                <div className="nav-link-icon mr-2">
                                                    <RadioButtonUncheckedTwoToneIcon />
                                                </div>
                                                <span className="font-size-md">
                                                    <b>20</b> results per page
                                                </span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href="#/"
                                                value={recordsPerPage}
                                                onClick={(e) => {
                                                    setRecordsPerPage(30);
                                                    setpaginationTransaction(allTransactions);
                                                    setPage(1);
                                                }}>
                                                <div className="nav-link-icon mr-2">
                                                    <RadioButtonUncheckedTwoToneIcon />
                                                </div>
                                                <span className="font-size-md">
                                                    <b>30</b> results per page
                                                </span>
                                            </ListItem>
                                        </List>
                                        <div className="divider" />
                                        <div className="font-weight-bold px-4 pt-4">Order</div>
                                        <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                                            <ListItem
                                                button
                                                href="#/"
                                                onClick={(e) => {
                                                    handleSort('ASC');
                                                }}>
                                                <div className="mr-2">
                                                    <ArrowUpwardTwoToneIcon />
                                                </div>
                                                <span className="font-size-md">Ascending</span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href="#/"
                                                onClick={(e) => handleSort('DES')}>
                                                <div className="mr-2">
                                                    <ArrowDownwardTwoToneIcon />
                                                </div>
                                                <span className="font-size-md">Descending</span>
                                            </ListItem>
                                        </List>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className="divider" />
                    <div className="table-responsive py-4 px-4">
                        <TableContainer>
                            <Table className="table table-alternate-spaced mb-0">
                                <thead className="thead-light">
                                    <tr> 
                                        {type !== 'employee' ? (
                                            <>
                                                <th
                                                    style={Object.assign(
                                                        { minWidth: '135px', maxWidth: '185px' },
                                                        paddingTop
                                                    )}
                                                    className="font-size-lg font-weight-bold pb-4 text-capitalize  text-left text-dark"
                                                    scope="col">
                                                    Employee ID
                                                </th>
                                                <th
                                                    style={Object.assign(
                                                        { minWidth: '185px', maxWidth: '185px' },
                                                        paddingTop
                                                    )}
                                                    className="font-size-lg font-weight-bold pb-4 text-capitalize  text-left text-dark"
                                                    scope="col">
                                                    Employee Name
                                                </th>
                                            </>
                                        ) : (
                                            <></>
                                        )}

                                        <th
                                            style={Object.assign(
                                                { minWidth: '100px', maxWidth: '135px' },
                                                paddingTop
                                            )}
                                            className="font-size-lg font-weight-bold pb-4 text-capitalize text-left text-dark"
                                            scope="col">
                                            Request Type
                                        </th>
                                        <th
                                            style={Object.assign(
                                                { minWidth: '100px', maxWidth: '135px' },
                                                paddingTop
                                            )}
                                            className="font-size-lg font-weight-bold pb-4 text-capitalize text-left text-dark"
                                            scope="col">
                                            Requested Date
                                        </th>
                                        <th
                                            style={Object.assign(
                                                { minWidth: '100px', maxWidth: '135px' },
                                                paddingTop
                                            )}
                                            className="font-size-lg font-weight-bold pb-4 text-capitalize text-left text-dark"
                                            scope="col">
                                            Current Status
                                        </th>
                                        <th
                                            style={Object.assign(
                                                { minWidth: '100px', maxWidth: '75px' },
                                                paddingTop
                                            )}
                                            className="font-size-lg font-weight-bold pb-4 text-capitalize text-left text-dark"
                                            scope="col">
                                            View Details
                                        </th>
                                    </tr>
                                </thead>
                                {paginationTransaction.length > 0 ? (
                                    <>
                                        <tbody>
                                            {paginationTransaction
                                                .slice(
                                                    page * recordsPerPage > allTransactions.length
                                                        ? page === 0
                                                            ? 0
                                                            : page * recordsPerPage - recordsPerPage
                                                        : page * recordsPerPage - recordsPerPage,
                                                    page * recordsPerPage <= allTransactions.length
                                                        ? page * recordsPerPage
                                                        : allTransactions.length
                                                )
                                                .map((item, idx) => (
                                                    <>
                                                        <tr>
                                                            {type !== 'employee' ? (
                                                                <>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div style={tableData}>
                                                                                {item?.employeeId}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div style={tableData}>
                                                                                {item?.employeeName}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div style={tableData}>
                                                                        {item?.requestType}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div style={tableData}>
                                                                        {getParsedDate(item?.requestedDate)}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div style={tableData}>{item?.status}</div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div
                                                                        // title={getParsedDate(item?.hireDate)}
                                                                        style={tableData}>
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                handleViewDetails(
                                                                                    e,
                                                                                    item.resignationUUID
                                                                                );
                                                                            }}
                                                                            className="d-40  p-0 ">
                                                                            <img
                                                                                src={viewDetails}
                                                                                alt="action"
                                                                                width="40"
                                                                                height="40"
                                                                                className="font-size-lg"
                                                                            />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr className="divider"></tr>
                                                    </>
                                                ))}
                                        </tbody>
                                    </>
                                ) : (
                                    <tbody className="text-center">
                                        <div>
                                            <img
                                                alt="..."
                                                src={noResults}
                                                style={{ maxWidth: '600px' }}
                                            />
                                        </div>
                                    </tbody>
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                        <Pagination
                            className="pagination-primary"
                            count={Math.ceil(allTransactions.length / recordsPerPage)}
                            variant="outlined"
                            shape="rounded"
                            selected={true}
                            page={page}
                            onChange={handleChange}
                            showFirstButton
                            showLastButton
                        />
                    </div>
                    <Popover
                        open={Boolean(anchorEl3)}
                        onClose={handleClose3}
                        style={{
                            top: '0',
                            left: '320px',
                            right: '10px',
                            maxHeight: '800px',
                            maxWidth: '1300px',
                            margin: '0 auto'
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center'
                        }}>
                        <Button
                            style={{ marginLeft: '95%', marginTop: '1%' }}
                            onClick={handleClose4}
                            className="btn-neutral-danger d-30  p-0 ">
                            <FontAwesomeIcon
                                icon={['fas', 'times']}
                                className="font-size-lg crossIcon"
                            />
                        </Button>
                        <Card
                            variant="outlined"
                            className="m-2 p-4"
                            style={{ minWidth: '1200px' }}>
                            <h6 className="font-weight-bold text-dark pt-3">
                                Resignation Request
                            </h6>
                            <div className="d-flex pt-2 pl-4">
                                <div
                                    className="font-size-sm mb-3 text-dark"
                                    style={{ width: '80px' }}>
                                    intiated by
                                </div>
                                <div
                                    className="opacity-8 font-size-sm mb-3 text-dark"
                                    style={{ overflowWrap: 'break-word', width: '180px' }}>
                                    {resignationDetails?.createdByName}
                                </div>
                                <div
                                    className="font-size-sm mb-3 text-dark"
                                    style={{ width: '80px' }}>
                                    intiated on
                                </div>
                                <div
                                    className="opacity-8 font-size-sm mb-3 text-dark"
                                    style={{ overflowWrap: 'break-word', width: '180px' }}>
                                    {getParsedDate(resignationDetails?.createdAt)}
                                </div>
                            </div>
                            <h6>
                                WorkFlow & Status
                            </h6>
                            <Card
                                variant="outlined"
                                style={{
                                    border: '1px solid #c4c4c4',
                                    margin: '10px 0',
                                    width: '96%'
                                }}>
                                <Grid
                                    container
                                    className="d-flex"
                                    style={{ overflowX: 'scroll' }}>
                                    <Grid className="d-flex align-items-stretch px-2 ">
                                        <Card
                                            variant="outlined"
                                            style={{
                                                border: `3px solid LimeGreen`,
                                                margin: '25px 12px',
                                                width: '250px',
                                                minHeight: '200px',
                                                color: 'white',
                                                backgroundColor: colors[0].backgroundColor
                                            }}>
                                            <div className="p-2 rounded">
                                                <Grid container item spacing={0}>
                                                    <Grid md={8} item className="px-1">
                                                        <h3 className="font-weight-bold">1</h3>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} className="d-flex mt-3">
                                                    <Grid item md={12} flex-basis>
                                                        <div className="d-flex">
                                                            <div
                                                                className="font-size-sm mb-3"
                                                                style={{ width: '120px' }}>
                                                                Applied by
                                                            </div>
                                                            <div
                                                                className="opacity-8 font-size-sm mb-3"
                                                                style={{
                                                                    overflowWrap: 'break-word',
                                                                    width: '180px'
                                                                }}>
                                                                {resignationDetails?.createdByName}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex">
                                                            <div
                                                                className="font-size-sm mb-3"
                                                                style={{ width: '120px' }}>
                                                                Applied on
                                                            </div>
                                                            <div
                                                                className="opacity-8 font-size-sm mb-3"
                                                                style={{
                                                                    overflowWrap: 'break-word',
                                                                    width: '180px'
                                                                }}>
                                                                {getParsedDate(resignationDetails?.createdAt)}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex">
                                                            <div
                                                                className="font-size-sm mb-3"
                                                                style={{ width: '120px' }}>
                                                                Status -
                                                            </div>
                                                            <div
                                                                className="opacity-8 font-size-sm mb-3"
                                                                style={{
                                                                    overflowWrap: 'break-word',
                                                                    width: '180px'
                                                                }}>
                                                                Completed
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Card>
                                        {resignationDetails?.resignationHistoryDetails?.map(
                                            (item, index) => (
                                                <>
                                                    <Card
                                                        variant="outlined"
                                                        style={{
                                                            border: `3px solid ${item.approvalStatus === 'Pending' ? 'DarkOrange' : 'LimeGreen'} `,
                                                            margin: '25px 12px',
                                                            width: '250px',
                                                            minHeight: '200px',
                                                            color: 'white',
                                                            backgroundColor: colors[index + 1].backgroundColor
                                                        }}>
                                                        <div className="p-2 rounded">
                                                            <Grid container item spacing={0}>
                                                                <Grid md={8} item className="px-1">
                                                                    <h3 className="font-weight-bold">
                                                                        {index + 2}
                                                                    </h3>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid md={12} className="d-flex mt-3">
                                                                <Grid item md={12} flex-basis>
                                                                    <div className="d-flex">
                                                                        <div
                                                                            className="font-size-sm mb-3"
                                                                            style={{ width: '120px' }}>
                                                                            Level {item.levelOfApprover}
                                                                        </div>
                                                                        <div
                                                                            className="opacity-8 font-size-sm mb-3"
                                                                            style={{
                                                                                overflowWrap: 'break-word',
                                                                                width: '180px'
                                                                            }}>
                                                                            {item.approver}
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex">
                                                                        <div
                                                                            className="font-size-sm mb-3"
                                                                            style={{ width: '120px' }}>
                                                                            Name
                                                                        </div>
                                                                        <div
                                                                            className="opacity-8 font-size-sm mb-3"
                                                                            style={{
                                                                                overflowWrap: 'break-word',
                                                                                width: '180px'
                                                                            }}>
                                                                            {item.approverName}
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex">
                                                                        <div
                                                                            className="font-size-sm mb-3"
                                                                            style={{ width: '120px' }}>
                                                                            Status -
                                                                        </div>
                                                                        <div
                                                                            className="opacity-8 font-size-sm mb-3"
                                                                            style={{
                                                                                overflowWrap: 'break-word',
                                                                                width: '180px'
                                                                            }}>
                                                                            {item.approvalStatus}
                                                                        </div>
                                                                    </div>
                                                                    {item.approveOrRejectedBy && (
                                                                        <div className="d-flex">
                                                                            <div className="font-size-sm mb-6">
                                                                                {item.approvalStatus} By{' '}
                                                                                {item.approveOrRejectedBy}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    </Card>

                                                </>
                                            )
                                        )}
                                    </Grid>
                                </Grid>
                            </Card>
                            {type == 'employee' ? <>
                                <Button
                                    onClick={(e) => {
                                        handleCancelResignation(
                                            e,
                                            resignationDetails?.resignationUUID
                                        );
                                    }}
                                    className="btn-primary mx-2">
                                    <span className="btn-wrapper--label">Cancel Resignation Request</span>
                                </Button>
                                <Button
                                    className="btn-primary mx-2">
                                    <span className="btn-wrapper--label">Edit Resignation Request</span>

                                </Button>
                            </>
                                : ''}

                        </Card>
                    </Popover>
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
    );
};
const mapStateToProps = (state) => ({
    user: state.Auth.user
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(TransactionSummary);