import React from "react";
import { Grid, Card, List, ListItem } from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import { connect } from "react-redux";


const PriorWorkExperience = (props) => {
    const [blocking, setBlocking] = useState(false);
    const [priorWorkExperienceArray, setPriorWorkExperienceArray] = useState([])
    const { employeeUUID } = props
    useEffect(() => {
        if (employeeUUID) {
            setBlocking(true)
            apicaller('get', `${BASEURL}/work-experience/byEmployeeUUID?employeeUUID=${employeeUUID}`)
                .then(res => {
                    setBlocking(false)
                    if (res.status === 200) {
                        console.log(res.data)
                        setPriorWorkExperienceArray(res.data)
                    }

                })
                .catch(err => {
                    setBlocking(false)
                    console.log('err', err)
                    setPriorWorkExperienceArray([])

                })
        }

    }, [])
    const overflowWrap = {
        'overflowWrap': 'break-word',
    }
    return (
        <>
            <Card>
                <Grid container spacing={0}>
                    <Grid item md={12} lg={12} xl={12} className="mx-auto">
                        {priorWorkExperienceArray.length !== 0 ? (
                            <div>
                                {priorWorkExperienceArray?.map(
                                    (item, idx) => (
                                        <Card
                                            className='myProfileCard'>
                                            <Grid container>
                                                <Grid item md={12} style={{ display: 'contents' }}>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Previous Designation</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.title}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>company Name </div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.companyName}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Employement Type</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.employmentType}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Work Location</div>
                                                        <span className='text-grey font-weight-bold' style={overflowWrap}>
                                                            {item.city},{' '}{item.state},{' '}{item.country}
                                                        </span>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} style={{ display: 'contents' }}>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Reporting Manager's Name</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.reportingManagerName}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Reporting Manager's Designation</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.designation}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Reporting Manager's Email</div>
                                                        <span className='text-grey font-weight-bold' style={overflowWrap}>
                                                            {item.reportingManagerEmail}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Reporting Manager's Number</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.phoneNo}
                                                        </span>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} style={{ display: 'contents' }}>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Worked From</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.startDateMonth}/{item.startDateYear}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Worked To</div>
                                                        <span className='text-grey font-weight-bold'>
                                                            {item.endDateMonth}/{item.endDateYear}
                                                        </span>
                                                    </Grid>
                                                    <Grid item md={3} className='p-4'>
                                                        <div>Reasons for Leaving</div>
                                                        <span className='text-grey font-weight-bold' style={overflowWrap} >
                                                            {item.reasonForLeaving}
                                                        </span>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    ))
                                }
                            </div>
                        ) :
                            <Grid>
                                <div className='text-grey text-center pt-4'> No Prior Work Experience Added</div>
                            </Grid>
                        }

                    </Grid>
                </Grid>
            </Card>
        </>
    )
}

export default PriorWorkExperience;