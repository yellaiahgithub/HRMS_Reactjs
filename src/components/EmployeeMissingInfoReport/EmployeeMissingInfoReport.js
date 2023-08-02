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
    FormControl,
    TableContainer,
    Snackbar,
    MenuItem
} from '@material-ui/core';
import 'date-fns';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import axios from 'axios';
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
import noResults from '../../assets/images/composed-bg/no_result.jpg';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useLocation } from 'react-router-dom';

const EmployeeMissingInfoReport = (props) => {
    const { user } = props;

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;

    const handleClose3 = () => {
        setState({ ...state, open: false });
    };

    const [allemployeeMissingInfo, setAllEmployeeMissingInfo] = useState([]);
    const [paginationEmployeeMissingInfo, setPaginationEmployeeMissingInfo] =
        useState([]);
    const [employeeMissingInfo, setEmployeeMissingInfo] = useState([]);
    const [blocking, setBlocking] = useState(false);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [filteredDataType, setFilteredDataType] = useState([])
    const [filteredGenerateReportBy, setFilteredGenerateReportBy] = useState([])
    const [allLocations, setAllLocations] = useState([]);
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

    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const [searchOpen, setSearchOpen] = useState(false);

    const openSearch = () => setSearchOpen(true);
    const closeSearch = () => setSearchOpen(false);

    const [navigateToDownloadResultPage, setNavigateToDownloadResultPage] =
        useState(false);
    const [downloadResultsUrl, setDownloadResultsUrl] =
        useState('/downloadResults');
    useEffect(() => {
        getDepartments();
        getLocations();
        getEmployees();
    }, []);

    const getEmployees = () => {
        setBlocking(true)

        let obj = {
            reportType: 'MissingInfo',
            reportBy: 'Employee'
        }
        axios
            .post(`${BASEURL}/employee/filter`, obj)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    if (res.data.length > 0) {
                        setEmployeeMissingInfo(res.data)
                        setAllEmployeeMissingInfo(res.data)
                        setPaginationEmployeeMissingInfo(res.data)
                    }
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('getEmployees err', err)
            })
    }

    const getDepartments = () => {
        apicaller('get', `${BASEURL}/department/fetchAll`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('res.data', res.data);
                    setAllDepartments(res.data);
                }
            })
            .catch((err) => {
                console.log('getDepartments err', err);
            });
    };

    const getLocations = () => {
        apicaller('get', `${BASEURL}/location`)
            .then((res) => {
                if (res.status === 200) {
                    console.log('res.data', res.data);
                    setAllLocations(res.data);
                }
            })
            .catch((err) => {
                console.log('getLocations err', err);
            });
    };

    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100px'
    };

    const paddingTop = {
        paddingTop: '25px'
    };

    const tableDataWidth = {
        width: '100px'
    }
    const handleFilter = infoType => {
        let obj = {}

        if (filteredDepartments?.length > 0) {
            const departments = filteredDepartments.map((a) => a.id);
            if (departments) obj['department'] = departments;
        }
        if (filteredLocations?.length > 0) {
            const location = filteredLocations.map((a) => a.locationId);
            if (location) obj['location'] = location;
        }
        if (filteredDataType?.length > 0) {
            const dataTypes = filteredDataType.map(a => a.value)
            if (dataTypes) obj['dataTypes'] = dataTypes;
        }

        if (infoType == 'excel') {
            obj['exportData'] = true;
            obj['downloadedBy'] = user.uuid;
        }

        obj['reportType'] = 'MissingInfo';
        obj['reportBy'] = filteredGenerateReportBy === "By Employee" ? "Employee" : "DataType"

        setBlocking(true);
        axios
            .post(`${BASEURL}/employee/filter`, obj)
            .then((res) => {
                setBlocking(false);
                if (res.status === 200) {
                    console.log('res.data', res.data);
                    if (infoType == 'excel') {
                        setNavigateToDownloadResultPage(true);
                        setState({
                            open: true,
                            message:
                                "Download is in Queue Kindly download the file from 'DOWNLOAD RESULTS' page",
                            toastrStyle: 'toastr-success',
                            vertical: 'top',
                            horizontal: 'right'
                        });
                    } else {
                        setEmployeeMissingInfo(res.data)
                        setAllEmployeeMissingInfo(res.data)
                        setPaginationEmployeeMissingInfo(res.data)
                        handleClose();
                    }
                }
            })
            .catch((err) => {
                setBlocking(false);
                console.log('getEmployees err', err);
            });
    };
    const handleSort = (sortOrder) => {
        let sortedEmployeeMissingInfo = JSON.parse(JSON.stringify(employeeMissingInfo));
        if (sortOrder == 'ASC') {
            sortedEmployeeMissingInfo = sortedEmployeeMissingInfo.sort((empA, empB) =>
                empA.employeeName > empB.employeeName
                    ? 1
                    : empB.employeeName > empA.employeeName
                        ? -1
                        : 0
            );
            setEmployeeMissingInfo(sortedEmployeeMissingInfo);
            setPaginationEmployeeMissingInfo(sortedEmployeeMissingInfo);
        } else {
            sortedEmployeeMissingInfo = sortedEmployeeMissingInfo.sort((empB, empA) =>
                empA.employeeName > empB.employeeName
                    ? 1
                    : empB.employeeName > empA.employeeName
                        ? -1
                        : 0
            );
            setEmployeeMissingInfo(sortedEmployeeMissingInfo);
            setPaginationEmployeeMissingInfo(sortedEmployeeMissingInfo);
        }
    };

    const handleChange = (event, value) => {
        console.log(value);
        setPage(value);
    };

    const handleSearch = event => {
        const filteredMissingInfo = allemployeeMissingInfo.filter((obj) =>
            JSON.stringify(obj)
                .toLowerCase()
                .includes(event.target.value.toLowerCase())
        );

        if (filteredMissingInfo.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
            });
        }

        setEmployeeMissingInfo(filteredMissingInfo);
        setPaginationEmployeeMissingInfo(filteredMissingInfo);
    };
    const dataTypeList = [
        {
            value: 'Education',
            label: 'Education',
            key: 'education'
        },
        {
            value: 'Phone',
            label: 'Phone Number',
            key: 'employeeOfficialPhone'
        },
        {
            value: 'Email',
            label: 'Email Address',
            key: 'employeeOfficialEmail'
        },
        {
            value: 'BloodGroup',
            label: 'BloodGroup',
            key: 'bloodGroup'
        },
        {
            value: 'Image',
            label: 'Employee Image',
            key: 'file'
        },
        {
            value: 'Address',
            label: 'Address',
            key: 'address'
        },
        {
            value: 'EmergencyContact',
            label: 'EmergencyContact',
            key: 'emergencyContact'
        },
        {
            value: 'NationId',
            label: 'National Id',
            key: 'nationId'
        },
        {
            value: 'Dependant',
            label: 'Dependant',
            key: 'dependant'
        },
        {
            value: 'WorkExperience',
            label: 'Prior WorkExperience',
            key: 'workExperience'
        }, {
            value: 'CertificateOrLicense',
            label: 'CertificateOrLicense',
            key: 'certificateOrLicense'
        },

    ]
    const generateReportByList = [
        {
            value: 'By Employee',
            label: 'By Employee'
        },
        {
            value: 'By Data Type',
            label: 'By Data Type'
        },
    ]

    return (
        <>
            <BlockUi
                tag="div"
                blocking={blocking}
                loader={
                    <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
                }>
                <Card className="card-box shadow-none">
                    <div className="d-flex flex-column flex-md-row justify-content-between px-4 py-3">
                        <div
                            className={clsx(
                                'search-wrapper search-wrapper--alternate search-wrapper--grow',
                                { 'is-active': searchOpen }
                            )}>
                            <TextField
                                variant="outlined"
                                size="small"
                                id="input-with-icon-textfield22-2"
                                placeholder="Search Employee, National ID Type, Identification Number..."
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
                        {navigateToDownloadResultPage ? (
                            <div className="d-flex align-items-center justify-content-center">
                                <a
                                    href={downloadResultsUrl}
                                    className="text-black"
                                    title="Navigate To Download Results Page"
                                    style={{ color: 'blue' }}>
                                    Navigate To Downlaod Results Page
                                </a>
                            </div>
                        ) : (
                            ''
                        )}
                        <div className="d-flex align-items-center">

                            <FontAwesomeIcon
                                onClick={() => handleFilter('excel')}
                                icon={['far', 'file-excel']}
                                style={{ color: 'green', cursor: 'pointer' }}
                                className="btn-outline-primary d-flex align-items-center justify-content-center d-40 mr-2 p-0 rounded-pill"
                            />
                            <div>
                                <Button
                                    onClick={(e) => handleClick(e)}
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
                                            <Grid container spacing={2}>
                                                <Grid item md={12}>
                                                    <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                                                        Departments
                                                    </small>
                                                    <FormControl
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small">
                                                        <Autocomplete
                                                            id="combo-box-demo"
                                                            multiple
                                                            options={allDepartments}
                                                            value={filteredDepartments}
                                                            getOptionLabel={(option) => option.name}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Select Employee Department"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setFilteredDepartments(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={12}>
                                                    <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                                                        Locations
                                                    </small>
                                                    <FormControl
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small">
                                                        <Autocomplete
                                                            id="combo-box-demo"
                                                            multiple
                                                            options={allLocations}
                                                            value={filteredLocations}
                                                            getOptionLabel={(option) => option.locationName}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Select Employee Locations"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            )}
                                                            onChange={(event, value) => {
                                                                setFilteredLocations(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={12}>
                                                    <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                                                        Generate Report By
                                                    </small>
                                                    <FormControl
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small">
                                                        <TextField
                                                            id='outlined-filteredGenerateReportBy'
                                                            label='Select'
                                                            variant='outlined'
                                                            fullWidth
                                                            select
                                                            size='small'
                                                            name='filteredGenerateReportBy'
                                                            value={filteredGenerateReportBy}
                                                            onChange={event => {
                                                                setFilteredGenerateReportBy(event.target.value)
                                                                if (event.target.value == 'By Employee') {
                                                                    handleClose();
                                                                }
                                                            }}
                                                        >
                                                            {generateReportByList.map(option => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.value}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                                {filteredGenerateReportBy == 'By Data Type' && (
                                                    <Grid item md={12}>
                                                        <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                                                            Data Type
                                                        </small>
                                                        <FormControl
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small">
                                                            <Autocomplete
                                                                id="combo-box-demo"
                                                                multiple
                                                                options={dataTypeList}
                                                                value={filteredDataType}
                                                                getOptionLabel={(option) => option.label}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Select Data Type"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                    />
                                                                )}
                                                                onChange={(event, value) => {
                                                                    setFilteredDataType(value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                )}

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
                                                    setFilteredDepartments([]);
                                                    setFilteredLocations([]);
                                                    setFilteredGenerateReportBy([]);
                                                    setFilteredDataType([]);
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
                                                            onClick={(e) => {
                                                                getEmployees();
                                                                setFilteredDepartments([]);
                                                                setFilteredLocations([]);
                                                                setFilteredGenerateReportBy([]);
                                                                setFilteredDataType([]);
                                                                handleClose();
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
                                                    setPage(1)
                                                    setPaginationEmployeeMissingInfo(employeeMissingInfo);
                                                    handleClose2();

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
                                                    setPage(1)
                                                    setPaginationEmployeeMissingInfo(employeeMissingInfo);
                                                    handleClose2();
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
                                                    setPage(1)
                                                    setPaginationEmployeeMissingInfo(employeeMissingInfo);
                                                    handleClose2();
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
                                        <div className="font-weight-bold px-4 pt-4">Order(By Employee Name)</div>
                                        <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                                            <ListItem
                                                button
                                                href="#/"
                                                onClick={(e) => {
                                                    handleSort('ASC');
                                                    handleClose2();
                                                }}>
                                                <div className="mr-2">
                                                    <ArrowUpwardTwoToneIcon />
                                                </div>
                                                <span className="font-size-md">Ascending</span>
                                            </ListItem>
                                            <ListItem
                                                button
                                                href="#/"
                                                onClick={(e) => { handleSort('DES'); handleClose2(); }}>
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
                    <div className="p-4">
                        <div className="text-center my-4">
                            <span className="display-4 mb-1 font-size-md font-weight-bold pb-4 text-capitalize">
                                Missing Info Report
                            </span>
                        </div>
                        <div className="table-responsive-md">
                            <TableContainer>
                                <Table className="table table-alternate-spaced mb-0">
                                    <thead style={{ background: '#eeeeee' }}>
                                        <tr>
                                            <th
                                                title="SI.No."
                                                style={Object.assign(
                                                    { minWidth: '75px', maxWidth: '135px' },
                                                    paddingTop
                                                )}
                                                className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                SI.No.
                                            </th>
                                            <th
                                                title="Employee Id"
                                                style={Object.assign(
                                                    { minWidth: '105px', maxWidth: '185px' },
                                                    paddingTop
                                                )}
                                                className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Employee Id
                                            </th>
                                            <th
                                                title="Employee Name"
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Employee Name
                                            </th>
                                            <th
                                                title="Location"
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Location
                                            </th>
                                            <th
                                                title="Department"
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Department
                                            </th>
                                            <th
                                                title="Designation"
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Designation
                                            </th>
                                            {filteredGenerateReportBy == 'By Data Type' && filteredDataType &&

                                                filteredDataType.map((item, idx) => (
                                                    <>
                                                        <th
                                                            title={item.label}
                                                            style={{ ...tableData, ...paddingTop }}
                                                            className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                            scope="col">
                                                            {item.label}
                                                        </th>
                                                    </>
                                                ))
                                            }
                                            {filteredGenerateReportBy == 'By Employee' && (
                                                <>
                                                    <th
                                                        title=" National ID"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        National ID
                                                    </th>
                                                    <th
                                                        title="Employee Image"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Employee Image"
                                                    </th>
                                                    <th
                                                        title="Blood Group"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Blood Group
                                                    </th>
                                                    <th
                                                        title="Address"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Address
                                                    </th>
                                                    <th
                                                        title="Emergency Contact"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Emergency Contact
                                                    </th>
                                                    <th
                                                        title="Dependants"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Dependants
                                                    </th>
                                                    <th
                                                        title="Prior Work Experience"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Prior Work Experience
                                                    </th>
                                                    <th
                                                        title="Phone Number"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Phone Number
                                                    </th>
                                                    <th
                                                        title="Email Address"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Email Address
                                                    </th>
                                                    <th
                                                        title="Certificate/License Details"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Certificate/License Details
                                                    </th>
                                                    <th
                                                        title="Education Details"
                                                        style={{ ...tableData, ...paddingTop }}
                                                        className="font-size-sm font-weight-bold pb-4 text-capitalize "
                                                        scope="col">
                                                        Education Details
                                                    </th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    {paginationEmployeeMissingInfo.length > 0 ? (
                                        <>
                                            <tbody>
                                                {paginationEmployeeMissingInfo
                                                    .slice(
                                                        page * recordsPerPage > employeeMissingInfo.length
                                                            ? page === 0
                                                                ? 0
                                                                : page * recordsPerPage - recordsPerPage
                                                            : page * recordsPerPage - recordsPerPage,
                                                        page * recordsPerPage <= employeeMissingInfo.length
                                                            ? page * recordsPerPage
                                                            : employeeMissingInfo.length
                                                    )
                                                    .map((item, idx) => (
                                                        <>
                                                            <tr>
                                                                <td>
                                                                    <div style={tableData} title={item.SNo}>
                                                                        {item.SNo}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {item?.employeeId ? (
                                                                            <div
                                                                                style={tableData}
                                                                                title={item?.employeeId}>
                                                                                {item.employeeId}
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                style={tableData}
                                                                                title={item?.employeeID}>
                                                                                {item.employeeID}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div
                                                                            style={tableData}
                                                                            title={item.employeeName}>
                                                                            {item.employeeName}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div style={tableData}
                                                                            title={item.location}>
                                                                            {item.location}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div style={tableData}
                                                                            title={item.department}>
                                                                            {item.department}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div style={tableData}
                                                                            title={item.designation}>
                                                                            {item.designation}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                {filteredGenerateReportBy == 'By Data Type' && filteredDataType &&

                                                                    filteredDataType.map((item2) => (
                                                                        <>
                                                                            <td>
                                                                                <div className="d-flex align-items-center">
                                                                                    <div style={tableData}
                                                                                        title={item[item2.key]}>
                                                                                        {item[item2.key]}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </>
                                                                    ))
                                                                }

                                                                {filteredGenerateReportBy == 'By Employee' && (
                                                                    <>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.nationId}>
                                                                                    {item.nationId}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.file}>
                                                                                    {item.file}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.bloodGroup}>
                                                                                    {item.bloodGroup}
                                                                                </div>
                                                                            </div>
                                                                        </td><td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.address}>
                                                                                    {item.address}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.emergencyContact}>
                                                                                    {item.emergencyContact}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.dependant}>
                                                                                    {item.dependant}
                                                                                </div>
                                                                            </div>
                                                                        </td><td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.workExperience}>
                                                                                    {item.workExperience}
                                                                                </div>
                                                                            </div>
                                                                        </td><td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.employeeOfficialPhone}>
                                                                                    {item.employeeOfficialPhone}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.employeeOfficialEmail}>
                                                                                    {item.employeeOfficialEmail}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.certificateOrLicense}>
                                                                                    {item.certificateOrLicense}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div style={tableData}
                                                                                    title={item.education}>
                                                                                    {item.education}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </>
                                                                )}
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
                    </div>
                    <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                        <Pagination
                            className="pagination-primary"
                            count={Math.ceil(employeeMissingInfo.length / recordsPerPage)}
                            variant="outlined"
                            shape="rounded"
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
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.Auth.user
    };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeMissingInfoReport);
