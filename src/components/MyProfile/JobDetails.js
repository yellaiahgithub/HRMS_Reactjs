import React, { useState, useEffect } from 'react'
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

const JobDetails = ({ employeeDetails }) => {
    const officialEmail = employeeDetails?.emails.find(email => email.type === "Official")
    const officialPhoneNumber = employeeDetails?.phones.find(phoneNumber => phoneNumber.type === "Official")
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
    const overflowWrap = {
        'overflowWrap': 'break-word',
    }
    return (
        <>
            <Card
                className='myProfileCard'>
                <Grid container>
                    <Grid item md={12} style={{ display: 'contents' }} className='d-flex flex-column flex-md-row'>
                        <Grid item md={3} className='p-4'>
                            <div>Employee ID</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.id}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Department </div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.departmentName}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Report To</div>
                            <span className='text-grey font-weight-bold' style={overflowWrap}>
                                {employeeDetails?.managerName}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Date Of Hire </div>
                            <span className='text-grey font-weight-bold'>
                                {getParsedDate(employeeDetails?.hireDate)}{' '}
                            </span>
                        </Grid>
                    </Grid>
                    <Grid item md={12} style={{ display: 'contents' }} className='d-flex flex-column flex-md-row'>
                        <Grid item md={3} className='p-4'>
                            <div>Office Email ID</div>
                            <span className='text-grey font-weight-bold' style={{
                                overflowWrap: 'break-word'
                            }}>
                                {officialEmail?.email}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Job Title</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.designationName}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Location</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.locationName}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Job Type</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.jobType}{' '}
                            </span>
                        </Grid>
                    </Grid>
                    <Grid item md={12} style={{ display: 'contents' }} className='d-flex flex-column flex-md-row'>
                        <Grid item md={3} className='p-4'>
                            <div>Confirmation Date</div>
                            <span className='text-grey font-weight-bold'>
                                {' '}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Job Status</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.jobStatus}{' '}
                            </span>
                        </Grid>
                        <Grid item md={6} className='p-4'>
                            <div>Office Phone Number</div>
                            <span className='text-grey font-weight-bold'>
                                {officialPhoneNumber?.phoneNumber}
                            </span>
                        </Grid>
                    </Grid>
                </Grid>
            </Card >
        </>
    )
}
const mapStateToProps = state => ({
    user: state.Auth.user,
})
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(JobDetails)