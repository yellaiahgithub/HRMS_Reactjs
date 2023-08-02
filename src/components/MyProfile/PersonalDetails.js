import React, { useState, useEffect } from 'react'
import {
    Card,
    Grid,
} from '@material-ui/core';
import { connect } from 'react-redux'

const PersonalDetails = ({ employeeDetails }) => {
    const personalEmail = employeeDetails?.emails.find(email => email.type === "Personal")
    const personalPhoneNumber = employeeDetails?.phones.find(phoneNumber => phoneNumber.type === "Mobile")

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
                className='myProfileCard p-4'>
                <Grid container>
                    <Grid item md={12} style={{ display: 'contents' }}>
                        <Grid item md={3} className='p-4'>
                            <div>Blood Group</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.bloodGroup}
                            </span>
                        </Grid>
                        <Grid item md={3} className=' p-4'>
                            <div>Marital Status</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.maritalStatus}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Date Of Birth</div>
                            <span className='text-grey font-weight-bold'>
                                {getParsedDate(employeeDetails?.dob)}{' '}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Celebrates Birthday On</div>
                            <span className='text-grey font-weight-bold'>
                                {getParsedDate(employeeDetails?.celebratesOn)}{' '}
                            </span>
                        </Grid>
                    </Grid>
                    <Grid item md={12} style={{ display: 'contents' }}>
                        <Grid item md={3} className='p-4'>
                            <div>Birth country</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.birthCountry}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Birth State</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.birthState}
                            </span>
                        </Grid>
                        <Grid item md={3} className='p-4'>
                            <div>Birth Place</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.birthPlace}
                            </span>
                        </Grid>
                        <Grid item md={3} className=' p-4'>
                            <div>Gender</div>
                            <span className='text-grey font-weight-bold'>
                                {employeeDetails?.gender}
                            </span>
                        </Grid>
                    </Grid>
                    <Grid item md={12} style={{ display: 'contents' }} >
                        <Grid item md={3} className=' p-4'>
                            <div>Personal Email ID</div>
                            <span className='text-grey font-weight-bold ' style={overflowWrap} >
                                {personalEmail?.email}
                            </span>
                        </Grid>
                        <Grid item md={3} className=' p-4'>
                            <div>Personal Phone Number</div>
                            <span className='text-grey font-weight-bold'>
                                {personalPhoneNumber?.phoneNumber}
                            </span>
                        </Grid>
                        <Grid item md={6} className=' p-4'>
                            <div>Preferred Address</div>
                            <span className='text-grey font-weight-bold' style={overflowWrap}>
                                {employeeDetails?.primaryAddress?.address1},{' '}
                                {employeeDetails?.primaryAddress?.address2},{' '}
                                {employeeDetails?.primaryAddress?.address3},{' '}
                                {employeeDetails?.primaryAddress?.city},{' '}
                                {employeeDetails?.primaryAddress?.state},{' '}
                                {employeeDetails?.primaryAddress?.country},{' '}
                                {employeeDetails?.primaryAddress?.PIN}
                            </span>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
const mapStateToProps = state => ({
    user: state.Auth.user,
})
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails)