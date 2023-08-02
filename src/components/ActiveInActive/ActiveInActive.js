import {
    Button,
    Card,
    Grid,
    Snackbar
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import BlockUi from 'react-block-ui';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg'

import {
    BrowserRouter as Router, Link,
    useLocation
} from "react-router-dom";
import { ClimbingBoxLoader } from 'react-spinners';
import { connect } from 'react-redux';

const CreateActiveInActive = (props) => {
    const { selectedEmployee } = props;
    const history = useHistory()
    const [blocking, setBlocking] = useState(false);
    const queryParams = new URLSearchParams(useLocation().search);
    const id = queryParams.get('id') || null;
    const edit = id ? true : false;
    const saveButtonLabel = edit ? 'Update Employees Current Contact Details' : 'Save';
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        toastrStyle: 'sucess',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const [locked, setLocked] = useState(selectedEmployee.isLocked)

    const handleClose = () => {
        setState({ ...state, open: false });
    };
    const [employeesCurrentContactDetailsArray, setEmployeesCurrentContactDetailsArray] =
        useState();

    const handleChangeLockedUnLocked = (locked) => {
        const inputObj = {
            isLocked: locked,
            incorrectPasswordAttempts: 0,
            uuid: selectedEmployee.uuid
        }
        apicaller('put', `${BASEURL}/employee/update?id=lockUnlock`, inputObj)
            .then((res) => {
                if (res.status === 200) {
                    setState({
                        openToast: true,
                        message: 'Employee Updated Successfully',
                        toastrStyle: 'toastr-success',
                        vertical: 'top',
                        horizontal: 'right'
                    });
                    history.push('/employees')
                }
            })
            .catch((err) => {
                setState({
                    openToast: true,
                    message: 'Error Occured while creating Employee Details',
                    toastrStyle: 'toastr-warning',
                    vertical: 'top',
                    horizontal: 'right'
                });
                console.log('update employee err', err);
            })
    }

    useEffect(() => {
        console.log(id)
        if (id) {
            getEmployeesCurrentDetails(id)
        }
    }, [])

    const getEmployeesCurrentDetails = employeeID => {
        setBlocking(true)
        apicaller('get', `${BASEURL}/get-employee-by-id/${employeeID}`)
            .then(res => {
                setBlocking(false)
                if (res.status === 200) {
                    setBlocking(false)
                    console.log(res.data)
                    setEmployeesCurrentContactDetailsArray(res.data)
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

    return (
        <BlockUi
            tag="div"
            blocking={blocking}
            loader={
                <ClimbingBoxLoader loading={blocking} color={'var(--primary)'} />
            }>
            <Card>
                <Grid container spacing={0}>
                    <Grid item md={12} lg={12} xl={12} className="mx-auto">
                        <div className="bg-white p-4 rounded">
                            <br />
                            <label
                                style={{ marginTop: '15px' }}
                                className="font-weight-bold mb-2">
                                Make Lock/UnLock Account
                            </label>
                            {selectedEmployee && (
                                <Card
                                    style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
                                    <div className="p-4">
                                        <Grid container spacing={0}>
                                            <Grid item md={12} xl={2}>
                                                <div className='rounded avatar-image overflow-hidden d-140  text-center text-success d-flex justify-content-center align-items-center'>
                                                    {selectedEmployee?.profilePic ? (
                                                        <img
                                                            className="img-fluid img-fit-container rounded-sm"
                                                            src={selectedEmployee?.profilePic}
                                                            style={{ width: '150px', height: '150px' }}
                                                            alt="..."
                                                        />
                                                    ) : (
                                                        <img
                                                            className="img-fluid img-fit-container rounded-sm"
                                                            src={empty_profile_picture}
                                                            style={{ width: '150px', height: '150px' }}
                                                            alt="..."
                                                        />
                                                    )}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={6} xl={5}>
                                                <Grid item md={12} className="d-flex">
                                                    <Grid item md={5}>
                                                        <div className="font-size-sm font-weight-bold mb-3">
                                                            Employee Name
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={7}>
                                                        <div className="opacity-8 font-size-sm mb-3">
                                                            {selectedEmployee.employeeName}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} className="d-flex">
                                                    <Grid item md={5}>
                                                        <div className="font-size-sm font-weight-bold mb-3">
                                                            DOJ
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={7}>
                                                        <div className="opacity-8 font-size-sm mb-3">
                                                            {getParsedDate(selectedEmployee?.hireDate)}{''}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} className="d-flex">
                                                    <Grid item md={5}>
                                                        <div className="font-size-sm font-weight-bold mb-3">
                                                            Department
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={7}>
                                                        <div className="opacity-8 font-size-sm mb-3">
                                                            {selectedEmployee?.department}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={6} xl={5}>
                                                <Grid item md={12} className="d-flex">
                                                    <Grid item md={5}>
                                                        <div className="font-size-sm font-weight-bold mb-3">
                                                            Employee ID
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={7}>
                                                        <div className="opacity-8 font-size-sm mb-3">
                                                            {selectedEmployee?.employeeID}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} className="d-flex">
                                                    <Grid item md={5}>
                                                        <div className="font-size-sm font-weight-bold mb-3">
                                                            Designation
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={7}>
                                                        <div className="opacity-8 font-size-sm mb-3">
                                                            {selectedEmployee?.designation}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} className="d-flex">
                                                    <Grid item md={5}>
                                                        <div className="font-size-sm font-weight-bold mb-3">
                                                            Location
                                                        </div>
                                                    </Grid>
                                                    <Grid item md={7}>
                                                        <div className="opacity-8 font-size-sm mb-3">
                                                            {selectedEmployee?.location}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </Grid>  
                </Grid>
                <div
                    className="float-right"
                    style={{ marginRight: '2.5%' }}>
                    <Button
                        className="btn-primary mb-4 m-2"
                        onClick={() => {
                            setLocked(!locked)
                            handleChangeLockedUnLocked(!locked)
                        }}>
                        {!locked ? 'Lock Account' : 'Un-Lock Account'}
                    </Button>
                    <Button
                        className="btn-primary mb-4 m-2"
                        component={NavLink}
                        to="./employees">                    
                        Cancel
                    </Button>
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
            </Card >
        </BlockUi >
    );
};

const mapStateToProps = state => ({ selectedEmployee: state.Auth.selectedEmployee })
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CreateActiveInActive)
