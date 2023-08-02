import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Checkbox,
    Grid,
    MenuItem,
    TextField,
    Table,
    DialogContent,
    CardContent,
    Collapse,
    Dialog,
    Snackbar,
    Divider
} from '@material-ui/core';
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'
import BlockUi from 'react-block-ui'
import { connect } from 'react-redux'

const EmergencyContactDetails = (props) => {
    const { employeeUUID } = props
    const [blocking, setBlocking] = useState(false);
    const [emergencyContactDetails, setEmergencyContactDetails] = useState([])
    useEffect(() => {
        if (employeeUUID) {
            // fetchEmployeesHirarchy(selectedEmployee)
            setBlocking(true)
            apicaller(
                'get',
                `${BASEURL}/emergency-contact/employeeUUID/${employeeUUID}`)
                .then(res => {
                    if (res.status === 200) {
                        setBlocking(false)
                        if (res.data) {
                            setEmergencyContactDetails(res.data)
                        }
                    }
                })
                .catch(err => {
                    setBlocking(false)
                    if (err.response?.data) {
                    }
                    console.log('get employee err', err)
                })
        }
    }, [])
    const overflowWrap = {
        'overflowWrap': 'break-word',
    }

    return (
        <>
            {emergencyContactDetails?.length !== 0 ? (
                <>
                    {emergencyContactDetails.map((item, idx) => (
                        <>
                            <Card className='myProfileCard'>
                                <div>
                                    <span className='text-grey font-weight-bold float-right ' style={{ fontSize: '12px' }}>
                                        Is Primary Contact : {item.isPrimary ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <Grid container>
                                    <Grid item md={12} style={{ display: 'contents' }}>
                                        <Grid item md={3} className='p-4'>
                                            <div>Contact Name</div>
                                            <span className='text-grey font-weight-bold'>
                                                {item.contactName}
                                            </span>
                                        </Grid>
                                        <Grid item md={2} className='p-4'>
                                            <div>Phone Number</div>
                                            <span className='text-grey font-weight-bold'>
                                                {item?.phoneNo}
                                            </span>
                                        </Grid>
                                        <Grid item md={3} className='p-4'>
                                            <div>Relationship With Employee</div>
                                            <span className='text-grey font-weight-bold'>
                                                {item?.relationship}
                                            </span>
                                        </Grid>
                                        <Grid item md={4} className='p-4'>
                                            <div>Emergency Contact Address</div>
                                            <span className='text-grey font-weight-bold' style={overflowWrap}>
                                                {item.addressLine1}{' '},
                                                {item.addressLine2}{' '}
                                                {item.city}{' '}
                                                {item.state}{' '}
                                                {item.country}{' '}
                                                {item.addressSameAsEmployee}{' '}
                                                {item.pinCode}
                                            </span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        </>
                    ))}
                </>
            ) :
                <Grid>
                    <div className='text-grey text-center pt-4'> No Emergency Contact Details Added</div>
                </Grid>
            }
        </>
    )
}

export default EmergencyContactDetails;