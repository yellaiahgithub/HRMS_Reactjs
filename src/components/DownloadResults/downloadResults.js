import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Table,
    Grid,
    InputAdornment,
    FormControlLabel,
    Checkbox,
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
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import FileSaver from 'file-saver';
import moment from 'moment';
import noResults from '../../assets/images/composed-bg/no_result.jpg'


var Excel = require('exceljs');

const DownoadResults = (props) => {
    const { user } = props;
    const history = useHistory();

    const { selectedCompany } = props;
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

    const [searchOpen, setSearchOpen] = useState(false);

    const openSearch = () => setSearchOpen(true);
    const closeSearch = () => setSearchOpen(false);

    const [downloadResults, setDownloadResults] = useState([]);
    const [allDownloadResults, setAllDownloadResults] = useState([]);
    const [paginationDownloadResult, setPaginationDownloadResult] = useState([]);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const reportNames = [
        { type: "nationId", name: "Employee National ID Details" },
        { type: "Employee", name: "Employee Details Report" },
        { type: "EmergencyContact", name: "Employee Emergency Contact Report" },
        { type: "MissingInfo", name: "Employee Missing Info Report" },
        { type: "Dependant", name: "Employee Dependant Details Report" },
        { type: "Department", name: "Department Wise Employee Headcount Report" },
        { type: "Hire_Seperation", name: "Employee Hire/Seperation Summary Report" },
        { type: "ProbationConfirmation", name: "Employee Probation Confirmation Report" },
        { type: "BloodGroup", name: "Employee Blood Group Report" },
        { type: "Beneficiary", name: "Employee Beneficiary Details Report" },
        { type: "Certificate", name: "Employee Certificate Details Report" },
        { type: "License", name: "Employee License Details Report" },
        { type: "Role", name: "Employee Roles Report" },
        { type: "WorkExperience", name: "Employee Prior Work Experience Report" },
    ]
    useEffect(() => {
        getDownloadResult();
    }, []);

    const getDownloadResult = () => {
        // Get all DownloadResults API call
        apicaller('get', `${BASEURL}/downloadResults/fetchAll`)
            .then((res) => {
                if (res.status === 200) {
                    setDownloadResults(res.data);
                    setAllDownloadResults(res.data);
                    setPaginationDownloadResult(res.data);
                }
            })
            .catch((err) => {
                console.log('getDownloadResults err', err);
            });
    };

    const downloadResultStatusFilter = [
        // { value: 'All Statuses' },
        // { value: 'Sucess' },
        { value: 'InProgress' },
        { value: 'Completed' }
    ];
    const [status, setStatus] = useState('All Statuses');
    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '180px'
    }
    const paddingTop = {
        paddingTop: '25px'
    }

    const handleStatus = (event) => {
        setStatus(event.target.value);
    };
    const handleFilter = () => {
        if (status.toLocaleLowerCase() != 'All Statuses'.toLowerCase()) {
            const filteredDownloadResults = allDownloadResults.filter(
                (customer) => customer.status.toLowerCase() == status.toLowerCase()
            );
            setDownloadResults(filteredDownloadResults);
            setPaginationDownloadResult(filteredDownloadResults);
        } else {
            setDownloadResults(allDownloadResults);
            setPaginationDownloadResult(allDownloadResults);

        }
        handleClose()
    };
    const handleSort = (sortOrder) => {
        let sortedDownloadResults = JSON.parse(JSON.stringify(downloadResults));
        if (sortOrder == 'ASC') {
            sortedDownloadResults = sortedDownloadResults.sort((desA, desB) =>
                desA.createdAt > desB.createdAt
                    ? 1
                    : desB.createdAt > desA.createdAt
                        ? -1
                        : 0
            );
            setDownloadResults(sortedDownloadResults);
            setPaginationDownloadResult(sortedDownloadResults);
        } else {
            sortedDownloadResults = sortedDownloadResults.sort((desB, desA) =>
                desA.createdAt > desB.createdAt
                    ? 1
                    : desB.createdAt > desA.createdAt
                        ? -1
                        : 0
            );
            setDownloadResults(sortedDownloadResults);
            setPaginationDownloadResult(sortedDownloadResults);
        }
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (event) => {
        const filteredDownloadResults = allDownloadResults.filter(
            (downloadResult) =>
                downloadResult.type
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase()) ||
                downloadResult.downloadedByName
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase()) ||
                downloadResult.status
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase()) ||
                downloadResult.fileName
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase()) ||
                new Date(downloadResult.createdAt)
                    .toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase()) ||
                new Date(downloadResult.createdAt)
                    .toLocaleTimeString()
                    .toUpperCase()
                    .includes(event.target.value?.toUpperCase())
        );

        if (filteredDownloadResults.length == 0) {
            setState({
                open: true,
                message: 'No Matching Results Found',
                toastrStyle: 'toastr-success',
                vertical: 'top',
                horizontal: 'right'
            });
        }

        setDownloadResults(filteredDownloadResults);
        setPaginationDownloadResult(filteredDownloadResults);
    };

    const getReportName = (type) => {
        const report = reportNames.find(role => role.type.toLowerCase() === type.toLowerCase())
        return report ? report.name : type;
    }
    const generateReport = (item) => {
        console.log("report generatring")
        const endColumnAlphabet = String.fromCharCode(65 + item.reportHeader.length - 1)
        const workbook = new Excel.Workbook();
        workbook.creator = item.downloadedByName;
        workbook.lastModifiedBy = item.downloadedByName;
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        const sheet = workbook.addWorksheet(item.type);

        //sheet header cells

        //companyName
        const companyNameRow = sheet.addRow([selectedCompany.companyName]);
        companyNameRow.alignment = { vertical: 'middle', horizontal: 'center' };
        companyNameRow.font = { bold: true }
        sheet.mergeCells('A' + companyNameRow.number + ':' + endColumnAlphabet + companyNameRow.number);

        //report Type
        const reportTypeRow = sheet.addRow([getReportName(item.type)])
        reportTypeRow.alignment = { vertical: 'middle', horizontal: 'center' };
        reportTypeRow.font = { bold: true }
        sheet.mergeCells('A' + reportTypeRow.number + ':' + endColumnAlphabet + reportTypeRow.number);

        sheet.addRow();
        if (item.type.toLowerCase() === "Department".toLowerCase()) {
            const departmentDataMap = new Map();
            const departmentsList = [];
            for (let index = 0; index < item.downloadedData.length; index++) {
                const data = item.downloadedData[index];
                if (departmentDataMap.get(data.department)) {
                    departmentDataMap.set(data.department,
                        [...departmentDataMap.get(data.department),
                        { ...data }
                        ]);
                }
                else {
                    departmentsList.push(data.department)
                    departmentDataMap.set(data.department, [{ ...data }]);
                }
            }
            departmentsList.forEach(dept => {
                const deptNameRow = sheet.addRow(["Department Name: " + dept])
                deptNameRow.alignment = { vertical: 'middle' };
                deptNameRow.font = { bold: true }
                sheet.mergeCells('A' + deptNameRow.number + ':' + endColumnAlphabet + deptNameRow.number);
                //header cells
                addHeaderInReport(sheet, item.reportHeader);
                //data cells
                addRowsInReport(sheet, item.reportHeader, departmentDataMap.get(dept))
                //summary cells
                const summaryRow = sheet.addRow(["Total Number of Employess in " + dept + " department are " + departmentDataMap.get(dept).length])
                summaryRow.alignment = { vertical: 'middle' };
                summaryRow.font = { bold: true }
                sheet.mergeCells('A' + summaryRow.number + ':' + endColumnAlphabet + summaryRow.number);

                sheet.addRow()
            })
        }
        else if (item.type.toLowerCase() === "Hire_Separation".toLowerCase()) {
            //table header cells
            addHeaderInReport(sheet, item.reportHeader);
            //table data cells
            addRowsInReport(sheet, item.reportHeader, item.downloadedData)
            sheet.addRow();

            let summaryHeader = [{ label: "Location", key: "location" }, { label: "Department", key: "department" }, { label: "HireCount", key: "hireCount" }, { label: "SeparationCount", key: "separationCount" }];
            let summaryData = [];

            const locationDataMap = new Map();
            const locationList = [];

            for (let index = 0; index < item.downloadedData.length; index++) {
                const data = item.downloadedData[index];
                if (locationDataMap.get(data.location)) {
                    locationDataMap.set(data.location,
                        [...locationDataMap.get(data.location),
                        { ...data }
                        ]);
                }
                else {
                    locationList.push(data.location)
                    locationDataMap.set(data.location, [{ ...data }]);
                }
            }
            locationList.forEach(loc => {
                const locWiseList = locationDataMap.get(loc)
                const departmentDataMap = new Map();
                const departmentsList = [];
                for (let index = 0; index < locWiseList.length; index++) {
                    const data = locWiseList[index];
                    if (departmentDataMap.get(data.department)) {
                        departmentDataMap.set(data.department,
                            [...departmentDataMap.get(data.department),
                            { ...data }
                            ]);
                    }
                    else {
                        departmentsList.push(data.department)
                        departmentDataMap.set(data.department, [{ ...data }]);
                    }
                }
                departmentsList.forEach(dept => {
                    const deptWiseList = departmentDataMap.get(dept);
                    const separationCount = deptWiseList.filter(data => data.exitDate != "N/A").length
                    const hireCount = deptWiseList.length - separationCount
                    const summary = {
                        location: loc,
                        department: dept,
                        hireCount: hireCount,
                        separationCount: separationCount
                    }
                    summaryData.push(summary)
                })
            })
            addHeaderInReport(sheet, summaryHeader);
            addRowsInReport(sheet, summaryHeader, summaryData)
        }
        else {
            //table header cells
            addHeaderInReport(sheet, item.reportHeader);
            //table data cells
            addRowsInReport(sheet, item.reportHeader, item.downloadedData)
        }
        //footer cells
        sheet.addRow();
        const runDate = ["Run Date: " + (new Date(item.createdAt)).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })]
        const runTime = ["Run Time: " + new Date(item.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            sec: '2-digit'
        })]
        const runBy = ["Run By: " + item.downloadedByName]
        const runDateRow = sheet.addRow(runDate);
        const runTimeRow = sheet.addRow(runTime);
        const runByRow = sheet.addRow(runBy);
        sheet.mergeCells('A' + runDateRow.number + ':' + endColumnAlphabet + runDateRow.number);
        sheet.mergeCells('A' + runTimeRow.number + ':' + endColumnAlphabet + runTimeRow.number);
        sheet.mergeCells('A' + runByRow.number + ':' + endColumnAlphabet + runByRow.number);
        runDateRow.font = { bold: true }
        runTimeRow.font = { bold: true }
        runByRow.font = { bold: true }


        //flusing into excel
        workbook.xlsx.writeBuffer()
            .then((buffer) => {
                const blob = new Blob([buffer],
                    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                FileSaver.saveAs(blob, item.fileName)
                setState({
                    open: true,
                    message: 'Downloaded Sucessfully',
                    toastrStyle: 'toastr-success',
                    vertical: 'top',
                    horizontal: 'right'
                });
                deleteResult(item.uuid)
            })
    }
    const addHeaderInReport = (sheet, reportHeader) => {
        let headers = [];
        reportHeader.forEach(headerData => headers.push(headerData.label))
        const headerRow = sheet.addRow(headers);
        headerRow.font = { bold: true }
        headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        for (let column = 0; column < headers.length; column++) {
            sheet.getCell(String.fromCharCode(65 + column) + headerRow.number).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            sheet.getColumn(String.fromCharCode(65 + column)).width = headers[column].length + 5;
        }
    }
    const addRowsInReport = (sheet, reportHeader, tableData) => {
        let rows = [];
        tableData.forEach((data, index) => {
            let row = [];
            reportHeader.forEach(headerData => {
                let cellData;
                if (headerData.key.toLowerCase() === "SNo".toLowerCase()) {
                    cellData = index + 1;
                } else {
                    const dateParsing = moment(data[headerData.key], "YYYY-MM-DD");
                    if (isNaN(data[headerData.key]) && !isNaN(Date.parse(data[headerData.key])) && dateParsing.isValid() && dateParsing.parsingFlags().unusedTokens.length == 0) {
                        cellData = new Date(data[headerData.key]).toLocaleDateString()
                    } else if (Array.isArray(data[headerData.key])) {
                        cellData = data[headerData.key].length > 0 ? data[headerData.key].toString() : "N/A"
                    }
                    else {
                        cellData = data[headerData.key]
                    }
                }
                row.push(cellData)
            })
            rows.push(row)
        })
        console.log(rows);
        const dataRows = sheet.addRows(rows);
        dataRows.forEach(tempRow => {
            tempRow.alignment = { vertical: 'middle', wrapText: true }
            for (let column = 0; column < reportHeader.length; column++) {
                sheet.getCell(String.fromCharCode(65 + column) + tempRow.number).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        })
    }
    const deleteResult = (uuid) => {
        apicaller('delete', `${BASEURL}/downloadResults/delete?uuid=` + uuid)
            .then((res) => {
                if (res.status === 200) {
                    setDownloadResults(downloadResults.filter(result => result.uuid != uuid));
                    setAllDownloadResults(allDownloadResults.filter(result => result.uuid != uuid));
                    setPaginationDownloadResult(paginationDownloadResult.filter(result => result.uuid != uuid));
                }
            })
            .catch((err) => {
                console.log('delete Download Results err', err);
            });

    }


    return (
        <>
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
                            placeholder="Search Download Results..."
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
                    <div className="d-flex align-items-center justify-content-center" >
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
                                        <Grid container spacing={6} >
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
                                                        {downloadResultStatusFilter.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.value}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className="divider" />
                                    <div className="p-3 text-center bg-secondary">
                                        <Button
                                            className="btn-primary"
                                            size="small"
                                            onClick={() => {
                                                handleFilter();
                                            }}
                                        >
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
                                                        onClick={e => {
                                                            getDownloadResult();
                                                            setStatus()
                                                            handleClose()
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
                        <div >
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
                                            onClick={(e) => {
                                                setRecordsPerPage(10);
                                                setPage(1)
                                                setPaginationDownloadResult(downloadResults);
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
                                            onClick={(e) => {
                                                setRecordsPerPage(20);
                                                setPage(1)
                                                setPaginationDownloadResult(downloadResults);
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
                                            onClick={(e) => {
                                                setRecordsPerPage(30);
                                                setPage(1)
                                                setPaginationDownloadResult(downloadResults);
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
                                    <div className="font-weight-bold px-4 pt-4">Order</div>
                                    <List className="nav-neutral-first nav-pills-rounded flex-column p-2">
                                        <ListItem
                                            button
                                            href="#/"
                                            onClick={(e) => { handleSort('ASC'); handleClose2(); }}>
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
                {paginationDownloadResult.length > 0 && (
                    <>
                        <div className="p-4">
                            <div style={{ overflow: 'auto' }} className='table-responsive-md'>
                                <Table className="table table-alternate-spaced mb-0">
                                    <thead>
                                        <tr className="align-items-center justify-content-center">
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Download Type
                                            </th>
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Download Date
                                            </th>
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Downloaded Time
                                            </th>
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize  "
                                                scope="col">
                                                Downloaded By
                                            </th>
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                File Name
                                            </th>
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Download Status
                                            </th>
                                            <th
                                                style={{ ...tableData, ...paddingTop }}
                                                className="font-size-lg align-items-center justify-content-center font-weight-bold pb-4 text-capitalize "
                                                scope="col">
                                                Download File
                                            </th>{' '}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginationDownloadResult
                                            .slice(
                                                page * recordsPerPage > downloadResults.length
                                                    ? page === 0
                                                        ? 0
                                                        : page * recordsPerPage - recordsPerPage
                                                    : page * recordsPerPage - recordsPerPage,
                                                page * recordsPerPage <= downloadResults.length
                                                    ? page * recordsPerPage
                                                    : downloadResults.length
                                            )
                                            .map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center ">
                                                                <div style={tableData}>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-normal text-black"
                                                                        title={item.type}>
                                                                        {item.type}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center ">
                                                                <div style={tableData}>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-normal text-black"
                                                                        title={item.createdAt}>
                                                                        {new Date(
                                                                            item.createdAt
                                                                        ).toLocaleDateString(undefined, {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center ">
                                                                <div style={tableData}>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-normal text-black"
                                                                        title={item.createdAt}>
                                                                        {new Date(
                                                                            item.createdAt
                                                                        ).toLocaleTimeString()}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div style={tableData}>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-normal text-black"
                                                                        title={item.downloadedByName}>
                                                                        {item.downloadedByName}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div style={tableData}>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-normal text-black"
                                                                        title={item.fileName}>
                                                                        {item.fileName}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={
                                                                    (item.status.toLowerCase() == 'Completed'.toLowerCase()
                                                                    )
                                                                        ? {
                                                                            background: '#cde1cd',
                                                                            color: 'green',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '25px',
                                                                            '& :hover': {
                                                                                textDecoration: 'underline'
                                                                            }
                                                                        }
                                                                        : item.status.toLowerCase() ==
                                                                            'In Progress'.toLowerCase()
                                                                            ? {
                                                                                background: 'rgb(232 235 57 / 29%)',
                                                                                color: 'rgb(255 139 0)',
                                                                                cursor: 'pointer',
                                                                                borderRadius: '25px',
                                                                                '& :hover': {
                                                                                    textDecoration: 'underline'
                                                                                }
                                                                            }
                                                                            : {
                                                                                background: 'rgb(230 183 183)',
                                                                                color: 'red',
                                                                                cursor: 'pointer',
                                                                                borderRadius: '25px',
                                                                                '& :hover': {
                                                                                    textDecoration: 'underline'
                                                                                }
                                                                            }
                                                                }>
                                                                <div>{item.status}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center ">
                                                                {item?.reportHeader &&
                                                                    (
                                                                        <div>
                                                                            <FileCopyIcon onClick={(e) => generateReport(item)} className="d-40" />
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </td>
                                                        <td className="text-right"></td>
                                                    </tr>
                                                    <tr className="divider"></tr>
                                                </>
                                            ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center pt-3 mb-5">
                            <Pagination
                                className="pagination-primary"
                                count={Math.ceil(downloadResults.length / recordsPerPage)}
                                variant="outlined"
                                shape="rounded"
                                selected={true}
                                page={page}
                                onChange={handleChange}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </>
                )}
                {paginationDownloadResult.length == 0 && (
                    <div className='text-center'>
                        <img
                            alt='...'
                            src={noResults}
                            style={{ maxWidth: '600px' }}
                        />
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
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedCompany: state.Auth.selectedCompany,
        user: state.Auth.user
    };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DownoadResults);
