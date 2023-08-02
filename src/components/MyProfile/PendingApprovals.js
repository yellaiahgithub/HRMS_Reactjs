import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Grid,
    Card,
    List,
    ListItem,
    TableContainer,
    Table,
    Popover,
    Button,
} from '@material-ui/core';
import { useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import { makeStyles } from '@material-ui/core/styles';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import AcceptRejectResignation from './AcceptRejectResignation';
import resignation from '../../../src/assets/images/resignation.png'
import { connect } from 'react-redux';

const PendingApprovals = (props) => {
    const { user, isAdmin = false } = props;
    const [activeTab, setActiveTab] = useState('1');
    const [popUpActiveTab, setPopUpActiveTab] = useState('1');
    const [currentResignation, setCurrentResignation] = useState(null);
    const [pendingResignationApprovals, setPendingResignationApprovals] = useState([])
    const [indirectPendingResignationApprovals, setIndirectPendingResignationApprovals] = useState([])
    const [resignationRequests, setResignationRequests] = useState([])
    const [activeResignationTypeTab, setActiveResignationTypeTab] = useState('1');
    const [blocking, setBlocking] = useState(false);
    const tableStyle={padding: '0px',display: 'flex',alignItems: 'center'}
    useEffect(() => {
        if (isAdmin) {
            const fetchBy = "Admin"
            const url = `${BASEURL}/resignation/fetchByApproverUUID/${user.uuid}?isDirectEmployee=false&fetchBy=${fetchBy}`
            getResignationRequests(url, setResignationRequests)
        }
        else {
            const directReporteeURL = `${BASEURL}/resignation/fetchByApproverUUID/${user.uuid}?isDirectEmployee=true`
            getResignationRequests(directReporteeURL, setPendingResignationApprovals)
            const inDirectReporteeURL = `${BASEURL}/resignation/fetchByApproverUUID/${user.uuid}?isDirectEmployee=false&isL2L3Approver=true`
            getResignationRequests(inDirectReporteeURL, setIndirectPendingResignationApprovals)
        }
    }, []);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    const toogleActiveResignationTypeTab = (tab) => {
        if (activeResignationTypeTab !== tab) setActiveResignationTypeTab(tab);
    }
    const popUpToggle = (tab) => {
        if (popUpActiveTab !== tab) setPopUpActiveTab(tab);
    };
    const getParsedDate = (date) => {
        if (date !== null && date !== '') {
            return new Date(date).toLocaleDateString('en-IN', {
                month: 'short',
                day: '2-digit'
            });
        } else {
            return 'N/A';
        }
    };
    const getResignationRequests = (url,settingObj,resignationReq) => {
        apicaller(
            'get', url
        )
            .then((res) => {
                if (res.status === 200) {
                    settingObj(res.data)
                    if(resignationReq){
                        resignationReq(res.data)
                    }
                }
            })
            .catch((err) => {
                setBlocking(false);
                if (err.response?.data) {
                }
                console.log('get employee err', err);
            });
    }
    const getResignationRequestsList = () => {
        return isAdmin ? [] : (activeResignationTypeTab == '1' ? pendingResignationApprovals : indirectPendingResignationApprovals)
    }
    const getResignationRequestsListSetter = () => {
        return (activeResignationTypeTab == '1' ? setPendingResignationApprovals : setIndirectPendingResignationApprovals)
    }
    return (
        <>
            <Grid item lg={6}>
                <Card style={{ width: "auto", height: isAdmin?"18rem":"25rem" }}>
                {!isAdmin &&<List
                        component="div"
                        className="nav-line d-flex nav-line-alt nav-tabs-info pt-3">
                        <ListItem
                            button
                            disableRipple
                            selected={activeResignationTypeTab === '1'}
                            onClick={() => {
                                toogleActiveResignationTypeTab('1');
                                setResignationRequests(pendingResignationApprovals);
                            }}>
                            <span className="text-center mx-4 text-bold">My Direct Reportees </span>
                            <div className="divider" />
                        </ListItem>
                        <ListItem
                            button
                            disableRipple
                            selected={activeResignationTypeTab === '2'}
                            onClick={() => {
                                toogleActiveResignationTypeTab('2');
                                setResignationRequests(indirectPendingResignationApprovals);
                            }}>
                            <span className="text-center mx-4 text-bold">My Indirect Reportees </span>
                            <div className="divider" />
                        </ListItem>
                    </List>}
                    <div>
                        <List
                            component="div"
                            className="nav-line d-flex nav-line-alt nav-tabs-info">
                            <ListItem>
                                <div className="text-center my-1">
                                    <img src={resignation} alt="action" width="40" height="40" />
                                </div>
                            </ListItem>
                            <ListItem
                                button
                            >
                                <span className="text-center mx-4">Resignation Requests</span>
                                <div className="divider" />
                                {resignationRequests?.length}
                            </ListItem>
                        </List>

                        <div className="table-responsive" style={{ overflow: 'auto', height: '13.6rem' }} >
                            <TableContainer>
                                <Table className="table table-alternate-spaced mb-0">
                                    <div className='pl-4 pr-3' style={{ height: '3.6rem' }}>
                                        <tr className='d-flex ' style={{height:'100%',borderTop: '1px solid grey'}} >
                                            <th width={'15%'} className='font-size-sm' style={{...tableStyle}}>
                                                {' '}
                                            </th>
                                            <th width={'25%'} className='font-size-sm ' style={{...tableStyle}}>
                                                <div className="rounded-top p-1 text-capitalize">
                                                    Employee Name
                                                </div>
                                            </th>
                                            <th width={'20%'} className='font-size-sm' style={{...tableStyle}}>
                                                <div className="rounded-top p-1 text-capitalize">
                                                    Designation
                                                </div>
                                            </th>
                                            <th width={'20%'} className='font-size-sm' style={{...tableStyle}}>
                                                <div className="rounded-top p-1 text-capitalize">
                                                    Submitting On
                                                </div>
                                            </th>
                                            <th width={'20%'} className='font-size-sm' style={{...tableStyle}}>
                                                <div className="rounded-top p-1 text-capitalize">
                                                    Last Working
                                                </div>
                                            </th>
                                        </tr>
                                    </div>
                                    <div className='pl-4' style={{ height: '150px', overflow: 'auto' }}>
                                        {resignationRequests?.map((item, idx) => (
                                            <tr onClick={(e) =>
                                                setCurrentResignation(item)
                                            } className='d-flex pb-2 pt-2' style={{borderTop: '1px solid grey',cursor: 'pointer'}} >
                                                <td width={'15%'} style={{...tableStyle,borderTop: '0px'}}>
                                                    {item.profilePic ? (
                                                        <img
                                                            className="img-fluid img-fit-container rounded-sm"
                                                            src={item.profilePic}
                                                            style={{ width: '60px', height: '60px' }}
                                                            alt="..."
                                                        />
                                                    ) : (
                                                        <img
                                                            className="img-fluid img-fit-container rounded-sm"
                                                            src={empty_profile_picture}
                                                            style={{ width: '60px', height: '60px' }}
                                                            alt="..."
                                                        />
                                                    )}
                                                </td>
                                                <td width={'25%'} style={{...tableStyle,borderTop: '0px'}}>
                                                    <div className="rounded-top p-1 text-capitalize">
                                                        {item.employeeName}
                                                    </div>
                                                </td>
                                                <td width={'20%'} style={{...tableStyle,borderTop: '0px'}}>
                                                    <div className="rounded-top p-1 text-capitalize">
                                                        {item.designation}
                                                    </div>
                                                </td>
                                                <td width={'20%'} style={{...tableStyle,borderTop: '0px'}}>
                                                    <div className="rounded-top p-1">
                                                        {getParsedDate(item.submittedOn)}

                                                    </div>
                                                </td>
                                                <td width={'20%'} style={{...tableStyle,borderTop: '0px'}}>
                                                    <div className="rounded-top p-1">
                                                        {getParsedDate(
                                                            item.lastWorkingDate
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </div>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </Card>
            </Grid>
            <Popover
                open={currentResignation != null}
                onClose={(e) => setCurrentResignation(null)}
                style={{
                    top: '0',
                    left: '320px',
                    right: '10px',
                    maxHeight: '800px',
                    maxWidth: '1300px',
                    margin: '0 auto'
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center'
                }}>
                <Button
                    style={{ marginLeft: '95%', marginTop: '1%' }}
                    onClick={(e) => setCurrentResignation(null)}
                    className="btn-neutral-danger d-30  p-0 ">
                    <FontAwesomeIcon
                        icon={['fas', 'times']}
                        className="font-size-lg crossIcon"
                    />
                </Button>
                <AcceptRejectResignation currentResignation={currentResignation} setCurrentResignation={setCurrentResignation} pendingResignationApprovals={getResignationRequestsList()} setPendingResignationApprovals={getResignationRequestsListSetter()} resignationRequests={resignationRequests} setResignationRequests={setResignationRequests} />
            </Popover>
        </>
    );
};
const mapStateToProps = (state) => ({
    user: state.Auth.user
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PendingApprovals);