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
// import AcceptRejectResignation from './AcceptRejectResignation';
import resignation from '../../../src/assets/images/resignation.png'
import { connect } from 'react-redux';

const CreatePendingProbationConfirmation = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [popUpActiveTab, setPopUpActiveTab] = useState('1');
    const [pendingProbationConfirmationCount, setPendingProbationConfirmationCount] = useState(0);
    const [currentResignation, setCurrentResignation] = useState(null);
    const [pendingProbationConfirmation, setPendingProbationConfirmation] = useState([])
    const [blocking, setBlocking] = useState(false);

    useEffect(() => {
        getPendingProbationConfirmation()

    }, []);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
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

    const getPendingProbationConfirmation = () => {
        apicaller(
            'get', `${BASEURL}/employee/fetchProbationEmployee`
        )
            .then((res) => {
                if (res.status === 200) {
                    setPendingProbationConfirmation(res.data);
                    setPendingProbationConfirmationCount(res.data.length);

                }
            })
            .catch((err) => {
                setBlocking(false);
                if (err.response?.data) {
                }
                console.log('get employee err', err);
            });
    }

    return (
        <>
            <Grid item lg={6}>
                <Card style={{ width: "auto", height: "18rem" }}>
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
                            disableRipple
                            selected={activeTab === '1'}
                            onClick={() => {
                                toggle('1');
                                setPendingProbationConfirmation(pendingProbationConfirmation);
                            }}>
                            <span className="text-center mx-4">Pending Probation Confirmation </span>
                            <div className="divider" />
                            {pendingProbationConfirmation?.length}
                        </ListItem>
                    </List>
                    <div className="table-responsive" style={{ overflow: 'auto' }}>
                        <TableContainer>
                            <Table
                                className="table table-alternate-spaced mb-0"
                            >
                                <div style={{ overflow: 'auto' }}>
                                    <tr className='d-flex pl-4'>
                                        <th className='font-size-sm'>
                                            <div className="rounded-top p-1 text-capitalize"
                                                style={{ width: '60px', height: '60px' }}
                                            >
                                                {' '}
                                            </div>
                                        </th>
                                        <th className='font-size-sm'>
                                            <div className="rounded-top p-1 text-capitalize">
                                                Employee Name
                                            </div>
                                        </th>
                                        <th className='font-size-sm'>
                                            <div className="rounded-top p-1 text-capitalize">
                                                Designation
                                            </div>
                                        </th>
                                        <th className='font-size-sm'>
                                            <div className="rounded-top p-1 text-capitalize">
                                                DOJ
                                            </div>
                                        </th>
                                        <th className='font-size-sm'>
                                            <div className="rounded-top p-1 text-capitalize">
                                                Confirmation Date
                                            </div>
                                        </th>
                                    </tr>
                                </div>
                                <div style={{ height: '150px', overflow: 'auto' }}>

                                    {pendingProbationConfirmation?.map((item, idx) => (
                                        <tr onClick={(e) =>
                                            setCurrentResignation(item)
                                        } className='d-flex pl-4'>
                                            <td width={'15%'}>
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
                                            <td width={'20%'}                                               
                                                style={{ width: '100px' }}>
                                                <div className="rounded-top p-1">
                                                    {item.firstName}{item.lastName}
                                                </div>
                                            </td>
                                            <td width={'20%'}>
                                                <div className="rounded-top p-1">
                                                    {item.designation}
                                                </div>
                                            </td>
                                            <td width={'20%'}>
                                                <div className="rounded-top p-1">
                                                    {getParsedDate(item.dob)}

                                                </div>
                                            </td>
                                            <td width={'20%'}>
                                                <div className="rounded-top p-1">
                                                    {getParsedDate(
                                                        item.probationDate
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </div>
                            </Table>
                        </TableContainer>
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
                {/* <AcceptRejectResignation currentResignation={currentResignation} setCurrentResignation={setCurrentResignation} pendingProbationConfirmation={pendingProbationConfirmation} setPendingProbationConfirmation={setPendingProbationConfirmation} /> */}
            </Popover>
        </>
    );
};
const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreatePendingProbationConfirmation);