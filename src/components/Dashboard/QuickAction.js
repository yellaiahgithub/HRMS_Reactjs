import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Card,
  TableContainer,
  Table,
  List,
  ListItem,
  Button,
  Popover
} from '@material-ui/core';
import action from '../../../src/assets/images/action.png';
import { connect } from 'react-redux';
import { BASEURL } from 'config/conf';
import apicaller from 'helper/Apicaller';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import AcceptRejectResignation from 'components/MyProfile/AcceptRejectResignation';
import noQuickActions from '../../assets/images/noQuickActions.png'

const QuickAction = (props) => {
  const { user } = props;
  const [resignationRequests, setResignationRequests] = useState([]);
  const [blocking, setBlocking] = useState(false);
  const [currentResignation, setCurrentResignation] = useState(null);

  useEffect(() => {
    getResignationRequests();
  }, []);

  const getResignationRequests = () => {
    apicaller(
      'get',
      `${BASEURL}/resignation/fetchByApproverUUID/${user.uuid}?isDirectEmployee=false&fetchBy=Role`
    )
      .then((res) => {
        if (res.status === 200) {
          setResignationRequests(res.data);
        }
      })
      .catch((err) => {
        setBlocking(false);
        if (err.response?.data) {
        }
        console.log('get ResignationRequests err', err);
      });
  };

  return (
    <>
      <Grid item lg={6}>
        <Card style={{ width: 'auto', height: '18rem' }}>
          <div>
            <List
              component="div"
              className="nav-line d-flex nav-line-alt nav-tabs-info">
              <ListItem>
                <div className="text-center my-1">
                  <img src={action} alt="action" width="40" height="40" />
                </div>
                <span className="text-center mx-4">Quick Action</span>
                <div className="divider" />
              </ListItem>
            </List>
            <div
              className="table-responsive"
              style={{ overflow: 'auto', height: '13.6rem' }}>
              <TableContainer>
                <Table className="table table-alternate-spaced mb-0">
                  {resignationRequests.length > 0 ? (
                    <div style={{ height: '150px', overflow: 'auto' }}>
                      {resignationRequests?.map((item, idx) => (
                        <tr
                          onClick={(e) =>
                            setCurrentResignation(item)
                          }
                          className="d-flex pl-3">
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
                          <td width={'25%'}>
                            <div className="rounded-top p-1 text-capitalize">
                              {item.employeeName}
                            </div>
                          </td>
                          <td width={'25%'}>
                            <div className="rounded-top p-1 text-capitalize">
                              {item.designation}
                            </div>
                          </td>
                          <td width={'40%'}>
                            <div
                              className="rounded-top p-1 text-capitalize"
                              style={{ color: 'red' }}>
                              Resignation Requested
                            </div>
                          </td>
                        </tr>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center'>
                      <div className='my-1'>
                        <img src={noQuickActions} alt='...'
                          style={{
                            width: '150px',
                            height: '150px'
                          }} className="img-fluid  rounded-sm " />
                      </div>
                      <h6>There Are No Quick Actions Pending</h6>

                    </div>


                  )}
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
        <AcceptRejectResignation
          currentResignation={currentResignation}
          setCurrentResignation={setCurrentResignation}
          pendingResignationApprovals={resignationRequests}
          setPendingResignationApprovals={setResignationRequests}
        />
      </Popover>
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.Auth.user
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(QuickAction);
