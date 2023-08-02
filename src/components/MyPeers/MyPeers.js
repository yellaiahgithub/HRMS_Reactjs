import {
    Card,
    Grid,
} from '@material-ui/core';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import BlockUi from 'react-block-ui';
import { ClimbingBoxLoader } from 'react-spinners';
import { connect } from 'react-redux'
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import EmployeeDetailsCard from 'components/MyProfile/EmployeeDetailsCard';

const MyPeers = (props) => {
    const { user } = props
    const [blocking, setBlocking] = useState(false);
    const [activeTab, setActiveTab] = useState('0');
    const [employeeDetails, setEmployeeDetails] = useState([])
    useEffect(() => {
        console.log(user)
        if (user) {
            setBlocking(true)
            apicaller(
                'post',
                `${BASEURL}/employee/filter/`, {
                "reportType": "Peers",
                "managerUUID": [user.managerUUID]
            }
            )
                .then(res => {
                    if (res.status === 200 && res.data.length > 0) {
                        setBlocking(false)
                        const data = res.data.filter(
                            employee => employee.uuid != user.uuid
                        )
                        setEmployeeDetails(data)
                    }
                })
                .catch(err => {
                    setBlocking(false)
                    if (err.response?.data) {
                    }
                    console.log('get employee err', err)
                    setEmployeeDetails([])
                })
        }
    }, [])

    const overflowWrap = {
        'overflowWrap': 'break-word', width: '180px' 
    }
    return (
        <div>
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
                                <EmployeeDetailsCard employeeDetails={user} />
                            </div>
                        </Grid>
                    </Grid>
                </Card>
                <Grid container className='d-flex' spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {employeeDetails?.map((employeeDetails, index) =>
                    (
                        <Grid xs={12} sm={12} md={12} xl={4} lg={2} className="d-flex align-items-stretch px-2 " style={{minWidth:'360px'}}>
                            <Card variant="outlined"
                                style={{ border: '1px solid #c4c4c4', margin: '25px 0' }}  >
                                <div className=" bg-white p-4 rounded">
                                    <Grid container item spacing={0}>
                                        <Grid item md={12} flex-basis className='d-flex'>
                                            <Grid item md={4}>
                                                <div  style={{ width: '100px', height: '100px' }} className='rounded avatar-image overflow-hidden dy-140  text-center text-success d-flex justify-content-center align-items-center'>
                                                    {employeeDetails?.profilePic ? (
                                                        <img
                                                            className="img-fluid img-fit-container rounded-sm"
                                                            src={employeeDetails?.profilePic}                                                           
                                                            alt="..."
                                                        />
                                                    ) : (
                                                        <img
                                                            className="img-fluid img-fit-container rounded-sm"
                                                            src={empty_profile_picture}
                                                            style={{ width: '100px', height: '100px' }}
                                                            alt="..."
                                                        />
                                                    )}
                                                </div>
                                            </Grid>
                                            <Grid md={8} item  className='px-4'>
                                                <h6 className='font-weight-bold text-dark'style={overflowWrap}>{employeeDetails?.employeeName}</h6>
                                                <div className='text-dark font-size-sm' style={overflowWrap}>{employeeDetails?.employeeID}</div>
                                                <div className='text-dark font-size-sm' style={overflowWrap}> {employeeDetails?.designation}</div>
                                            </Grid>
                                        </Grid>
                                        <Grid md={12} className="d-flex mt-3"  >
                                            <Grid item md={12} flex-basis>
                                                <div className='d-flex'>
                                                    <div className="font-size-sm mb-3 justify-content-between" style={{ width: '120px' }}>
                                                        Department
                                                    </div>
                                                    <span className='mx-2'>:</span>
                                                    <div className='opacity-8 font-size-sm mb-3' style={overflowWrap}>
                                                        {employeeDetails?.department}
                                                    </div>
                                                </div>
                                                <div className='d-flex' >
                                                    <div className="font-size-sm mb-3" style={{ width: '120px' }}>
                                                        Location
                                                    </div>
                                                    <span className='mx-2'>:</span>
                                                    <div className='opacity-8 font-size-sm mb-3' style={overflowWrap} >
                                                        {employeeDetails?.location}
                                                    </div>
                                                </div>
                                                <div className='d-flex' >
                                                    <div className="font-size-sm mb-3" style={{ width: '120px' }}>
                                                        Phone
                                                    </div>
                                                    <span className='mx-2'>:</span>
                                                    <div className='opacity-8 font-size-sm mb-3' style={overflowWrap}>
                                                        {employeeDetails?.employeeOfficialPhone}
                                                    </div>
                                                </div>
                                                <div className='d-flex' >
                                                    <div className='font-size-sm mb-3' style={{ width: '120px' }}>
                                                        Email
                                                    </div>
                                                    <span className='mx-2'>:</span>
                                                    <div className='opacity-8 font-size-sm mb-3' style={overflowWrap}>
                                                        {employeeDetails?.employeeOfficialEmail}
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Card>
                        </Grid>
                    )
                    )}
                </Grid>
            </BlockUi>
        </div>
    )
}
const mapStateToProps = (state) => ({
    user: state.Auth.user,

});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(MyPeers);

