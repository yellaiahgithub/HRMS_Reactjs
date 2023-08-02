import React, { useState, useEffect } from "react";
import {
    Card,
    Divider,
    TextField,
    Grid,
} from '@material-ui/core';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import empty_profile_picture from '../assets/images/avatars/empty_profile_picture.jpg';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from 'react-redux'

const SelectEmployee = ({ getAllData, employeeUUID }) => {
    const [allEmployees, setEmployees] = useState([])
    const [blocking, setBlocking] = useState(false);
    const [employeeDetail, setEmployeeDetail] = useState()
    const [employeeIndex, setEmployeeIndex] = useState();

    useEffect(() => {
        getEmployees();

    }, [])
    const getEmployees = () => {
        setBlocking(true)
        apicaller('get', `${BASEURL}/employee/get-all-employees`)
            .then(res => {
                if (res.status === 200) {
                    setBlocking(false)
                    console.log('res.data', res.data)
                    const data = res.data;
                    for (let index = 0; index < data.length; index++) {
                        const iterator = data[index];
                        iterator['nameWithId'] =
                            iterator.employeeName + '-' + iterator.employeeID
                        if (employeeUUID && iterator.uuid === employeeUUID) {
                            setEmployeeIndex(index)
                            setEmployeeDetail(iterator)
                            getAllData(iterator)
                        }
                    }
                    setEmployees(res.data)
                } else {
                    setBlocking(false)
                }
            })
            .catch(err => {
                setBlocking(false)
                console.log('getEmployees err', err)
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
            <Grid container spacing={12}>
                <Grid item md={12}>
                    <div>
                        <label className=' mb-2'>
                            Select Employee *
                        </label>
                        <Autocomplete
                            id='combo-box-demo'
                            options={allEmployees}
                            getOptionLabel={option => option.nameWithId}
                            value={
                                employeeIndex != null ? allEmployees[employeeIndex] || '' : null
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Select'
                                    variant='outlined'
                                    fullWidth
                                    size='small'
                                    value={
                                        employeeIndex != null ? allEmployees[employeeIndex] || '' : null
                                    }
                                    name='selectedEmployee'
                                />
                            )}
                            onChange={(event, value) => {
                                const index = allEmployees.findIndex(
                                    (employee) => employee.uuid === value?.uuid
                                );
                                setEmployeeIndex(index)
                                setEmployeeDetail(value)
                                getAllData(value)
                            }}
                        />
                    </div>
                </Grid>
            </Grid>
            {employeeDetail && (
                <Card
                    style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}>
                    <div className="p-4">
                        <Grid container spacing={0}>
                            <Grid item md={12} xl={2} >
                                <div className='rounded avatar-image overflow-hidden d-140  text-center text-success d-flex justify-content-center align-items-center'>
                                    {employeeDetail?.profilePic ? (
                                        <img
                                            className="img-fluid img-fit-container rounded-sm"
                                            src={employeeDetail?.profilePic}
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
                            <Grid item xs={12} md={6} lg={6} xl={5} className="mx-auto" >
                                <Grid item className="d-flex" spacing={2}>
                                    <Grid item md={5}>
                                        <div className="font-size-sm font-weight-bold mb-3">
                                            Employee Name
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <div className="opacity-8 font-size-sm mb-3">
                                            {employeeDetail.employeeName}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item className="d-flex" spacing={2}>
                                    <Grid item md={5}>
                                        <div className="font-size-sm font-weight-bold mb-3">
                                            DOB
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <div className="opacity-8 font-size-sm mb-3">
                                            {getParsedDate(employeeDetail?.dob)}{''}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item className="d-flex" spacing={2}>
                                    <Grid item md={5}>
                                        <div className="font-size-sm font-weight-bold mb-3">
                                            Department
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <div className="opacity-8 font-size-sm mb-3">
                                            {employeeDetail?.department}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6} xl={5} className="mx-auto" >
                                <Grid item className="d-flex" spacing={2}>
                                    <Grid item md={5}>
                                        <div className="font-size-sm font-weight-bold mb-3">
                                            Employee ID
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <div className="opacity-8 font-size-sm mb-3">
                                            {employeeDetail?.employeeID}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item className="d-flex" spacing={2}>
                                    <Grid item md={5}>
                                        <div className="font-size-sm font-weight-bold mb-3">
                                            Designation
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <div className="opacity-8 font-size-sm mb-3">
                                            {employeeDetail?.designation}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item className="d-flex" spacing={2}>
                                    <Grid item md={5}>
                                        <div className="font-size-sm font-weight-bold mb-3">
                                            Location
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <div className="opacity-8 font-size-sm mb-3">
                                            {employeeDetail?.location}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Card >
            )}
        </BlockUi >
    )
}
const mapStateToProps = (state) => ({
    user: state.Auth.user
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(SelectEmployee);
