import {
    Button,
    Card,
    Checkbox,
    Grid,
    Menu,
    ListItem,
    List,
    Snackbar,
    Table,
    TableContainer
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone'
import BlockUi from 'react-block-ui';
import RadioButtonUncheckedTwoToneIcon from '@material-ui/icons/RadioButtonUncheckedTwoTone'
import ArrowDownwardTwoToneIcon from '@material-ui/icons/ArrowDownwardTwoTone'
import ArrowUpwardTwoToneIcon from '@material-ui/icons/ArrowUpwardTwoTone'
import avatar5 from '../../assets/images/avatars/avatar4.jpg';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter as Router, Link,
    useLocation
} from "react-router-dom";
import { ClimbingBoxLoader } from 'react-spinners';
import { connect } from 'react-redux';
import { Pagination } from '@material-ui/lab';
import noResults from '../../assets/images/composed-bg/no_result.jpg'

const UserCredentials = (props) => {
    const { selectedEmployee } = props;
    const history = useHistory()
    const [isSubmitted, setIsSubmitted] = useState();
    const [blocking, setBlocking] = useState(false);
    const queryParams = new URLSearchParams(useLocation().search);
    const id = queryParams.get('id') || null;
    const edit = id ? true : false;
    const saveButtonLabel = edit ? 'Update Credentials' : 'Save';
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const [addedEmployees, setAddedEmployees] = useState([])
    const [employee, setEmployee] = useState()
    const [employeesCurrentContactDetailsArray, setEmployeesCurrentContactDetailsArray] = useState();
    const location = useLocation();
    const [page, setPage] = useState(1)
    const searchParams = new URLSearchParams(location.search);
    const employeeUUIDs = searchParams.get('employeeUUIDs')?.split(',');
    const [employeeData, setEmployeeData] = useState();
    //boolean variable to show and hide
    const [showEmployees, setShowEmployees] = useState(false);

    const [employees, setEmployees] = useState(false);
    const [allEmployees, setAllEmployees] = useState();
    const [anchorEl3, setAnchorEl3] = useState(null)
    const [checkAllEmployees, setCheckAllEmployees] = useState(false)
    const [paginationEmployees, setPaginationEmployees] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10)
    const [selectedEmployeeUuids, setSelectedEmployeeUuids] = useState([])
    const handleClose = () => {
        setState({ ...state, open: false });
    };

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

    const [anchorEl2, setAnchorEl2] = useState(null)

    const paddingTop = {
        paddingTop: '25px'
    }

    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100px'
    }

    const handleClose2 = () => {
        setAnchorEl2(null)
    }

    const handleClick2 = event => {
        setAnchorEl2(event.currentTarget)
    }

    const handleChange = (event, value) => {
        console.log(value)
        setPage(value)
    }

    const CreateUserCredentials = () => {
        if (showEmployees && selectedEmployeeUuids.length == 0) {
            setState({
                open: true,
                message: "No Employee Selected, Invalid Credential Status",
                toastrStyle: 'toastr-warning',
                vertical: 'top',
                horizontal: 'right'
            })
            return
        }
        const employeeIds = showEmployees ? selectedEmployeeUuids : [selectedEmployee.uuid]
        const inputObj = {
            employeeIds: employeeIds
        }
        apicaller('post', `${BASEURL}/employee/generateUserIds`, inputObj)
            .then(res => {
                if (res.status === 200) {
                    // console.log('res.data', res.data)
                    setState({
                        open: true,
                        message: 'User Credentials Created Successfully',
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                    setTimeout(() => {
                        history.push('/employees')
                    }, 2000);
                }
            })
            .catch(err => {
                console.log('err', err)
                setState({
                    open: true,
                    message: err.response.data,
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                })
            })
    }

    useEffect(() => {
        console.log(id)
        if (id) {
            getEmployeesCurrentDetails(id)
        }

        console.log(employeeUUIDs)
        if (employeeUUIDs && employeeUUIDs.length > 1) {
            setShowEmployees(true)
            const inputObj = {
                employeeIds: employeeUUIDs
            }
            apicaller('post', `${BASEURL}/employee/fetchEmployeesCredentialStatus`, inputObj)
                .then(res => {
                    if (res.status === 200) {
                        const selectedEmployeeUuids = []
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].credentialStatus === "To Be Created") {
                                selectedEmployeeUuids.push(res.data[i].uuid)
                            }
                        }
                        setSelectedEmployeeUuids(selectedEmployeeUuids)
                        setEmployeeData(res.data)
                    }
                })
                .catch(err => {
                    console.log('User Id is already created', err)
                    setState({
                        open: true,
                        message: err.message || err?.response?.data,
                        toastrStyle: 'toastr-warning',
                        vertical: 'top',
                        horizontal: 'right'
                    })
                })
        }
    }, [])

    const getEmployeesCurrentDetails = employeeID => {
        setBlocking(true)
        apicaller('get', `${BASEURL}/employee/get-employee-by-id/${employeeID}`)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    setBlocking(false)
                    console.log(res.data)
                    // setEmployeesCurrentContactDetailsArray(res.data)
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('get employee err', err)
            })
    }

    const getParsedDate = date => {
        if (date !== null && date !== '') {
            return new Date(date).toLocaleDateString('af-ZA', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            })
        } else {
            return 'N/A'
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <BlockUi
            tag="div"
            blocking={blocking}
            loader={
                <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
            }>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={0}>
                        <Grid item md={12} lg={12} xl={12} className="mx-auto">
                            <div className="bg-white p-4 rounded">
                                <br />
                                <label
                                    style={{ marginTop: '15px' }}
                                    className="font-weight-normal  m-4 ">
                                    Create User Credentials
                                </label>
                                {selectedEmployee && !showEmployees && (
                                    <Card
                                        style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
                                        <div className="p-4">
                                            <Grid container spacing={0}>
                                                <Grid item md={2}>
                                                    <img
                                                        alt="..."
                                                        className="img-fluid"
                                                        style={{ minHeight: '100px', maxHeight: '150px' }}
                                                        src={avatar5}
                                                    />
                                                </Grid>
                                                <Grid item md={10}>
                                                    <Grid item md={12} className="d-flex" spacing={2}>
                                                        <Grid item md={3}>
                                                            <div>
                                                                <div className="font-size-sm font-weight-bold mb-3">
                                                                    Employee Name
                                                                </div>
                                                                <div className="font-size-sm font-weight-bold mb-3">
                                                                    DOJ
                                                                </div>
                                                                <div className="font-size-sm font-weight-bold mb-3">
                                                                    Department
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <p className="opacity-8 font-size-sm mb-3">
                                                                {selectedEmployee.employeeName}
                                                            </p>
                                                            <p className="opacity-8 font-size-sm mb-3">
                                                                {getParsedDate(selectedEmployee?.hireDate)}{''}
                                                            </p>
                                                            <p className="opacity-8 font-size-sm mb-3">
                                                                {selectedEmployee?.departmentName != null ? selectedEmployee?.departmentName : selectedEmployee?.department}
                                                            </p>
                                                        </Grid>
                                                        <Grid item md={3}>
                                                            <div>
                                                                <div className="font-size-sm font-weight-bold mb-3">
                                                                    Employee ID
                                                                </div>
                                                                <div className="font-size-sm font-weight-bold mb-3">
                                                                    Designation
                                                                </div>
                                                                <div className="font-size-sm font-weight-bold mb-3">
                                                                    Location
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                        <Grid item md={3}>
                                                            <p className="opacity-8 font-size-sm mb-3">
                                                                {selectedEmployee?.employeeID || selectedEmployee?.id}
                                                            </p>
                                                            <p className="opacity-8 font-size-sm mb-3">
                                                                {selectedEmployee?.designationName != null ? selectedEmployee?.designationName : selectedEmployee?.designation}
                                                            </p>
                                                            <p className="opacity-8 font-size-sm mb-3">
                                                                {selectedEmployee?.locationName != null ? selectedEmployee?.locationName : selectedEmployee?.location}
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Card>
                                )}
                                {showEmployees && employeeData && employeeData.length > 0 && (
                                    <>
                                        <div className='divider' />
                                        <div className='p-4'>
                                            <div className='table-responsive-md'>
                                                <TableContainer>
                                                    <Table className='table table-alternate-spaced mb-0'>
                                                        <thead style={{ background: '#eeeeee' }}>
                                                            <tr>
                                                                <th style={Object.assign({ width: '5px' }, paddingTop)}>

                                                                </th>
                                                                <th
                                                                    title='Employee ID'
                                                                    style={Object.assign({ width: '115px' }, paddingTop)}
                                                                    className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                                    scope='col'>
                                                                    Employee ID
                                                                </th>
                                                                <th
                                                                    title='Employee'
                                                                    style={{ ...tableData, ...paddingTop }}
                                                                    className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                                    scope='col'>
                                                                    Employee
                                                                </th>
                                                                <th
                                                                    title='Date of Joining'
                                                                    style={Object.assign({ width: '5px' }, paddingTop)}
                                                                    className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                                    scope='col'>
                                                                    DOJ
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
                                                                    className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                                    scope='col'>
                                                                    Designation
                                                                </th>

                                                                <th
                                                                    title='Employee Status'
                                                                    style={Object.assign({ width: '155px' }, paddingTop)}
                                                                    className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                                    scope='col'>
                                                                    Employee Status
                                                                </th>
                                                                <th
                                                                    title='Credential Status'
                                                                    style={Object.assign({ width: '155px' }, paddingTop)}
                                                                    className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                                                    scope='col'>
                                                                    Credential Status
                                                                </th>
                                                                <th style={{ width: '5px' }}> </th>
                                                            </tr>
                                                        </thead>
                                                        {employeeData.length > 0 ? (
                                                            <>
                                                                <tbody>
                                                                    {employeeData
                                                                        .map((item, idx) => (
                                                                            <>
                                                                                <tr>
                                                                                    <td>
                                                                                        <Checkbox
                                                                                            id='outlined-AllEmployees'
                                                                                            placeholder='AllEmployees'
                                                                                            variant='outlined'
                                                                                            size='small'

                                                                                            value={addedEmployees.includes(item?.uuid)}
                                                                                            checked={item.credentialStatus == "To Be Created"}

                                                                                        ></Checkbox>
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
                                                                                                title={getParsedDate(item?.hireDate)}
                                                                                                style={tableData}>
                                                                                                {getParsedDate(item?.hireDate)}{' '}
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
                                                                                                title={item?.jobStatus}
                                                                                                style={tableData}>
                                                                                                {item?.jobStatus}
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className='d-flex align-items-center'>
                                                                                            <div
                                                                                                title={item?.credentialStatus}
                                                                                                style={tableData}>
                                                                                                <label
                                                                                                    style={
                                                                                                        item?.credentialStatus?.toLowerCase() == 'to be created'
                                                                                                            ? { color: 'green' }
                                                                                                            : { color: 'red' }
                                                                                                    }>
                                                                                                    {item?.credentialStatus}
                                                                                                </label>
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
                                        </div>
                                    </>
                                )}
                            </div>
                            <Snackbar
                                anchorOrigin={{ vertical, horizontal }}
                                key={`${vertical},${horizontal}`}
                                open={open}
                                classes={{ root: toastrStyle }}
                                onClose={handleClose}
                                message={message}
                                autoHideDuration={2000}
                            />
                        </Grid>
                    </Grid>
                </form>
                <div
                    className="float-right"
                    style={{ marginRight: '2.5%', marginBottom: '3%' }}>
                    <Button
                        className="btn-primary mb-2 m-2"
                        onClick={() => {
                            CreateUserCredentials()
                        }}>
                        Create User Credentials
                    </Button>
                    <Button
                        className="btn-primary mb-2 m-2"
                        component={NavLink}
                        to="./employees"
                    >
                        Cancel
                    </Button>
                </div>
            </Card>

        </BlockUi >
    );
};

const mapStateToProps = state => ({ selectedEmployee: state.Auth.selectedEmployee })
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(UserCredentials)
