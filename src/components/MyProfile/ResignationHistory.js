import React from 'react';
import { Grid, Card, List, ListItem } from '@material-ui/core';
import { BASEURL } from 'config/conf';
import { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import { connect } from 'react-redux';

const ResignationHistory = (props) => {
  const { employeeUUID } = props;

  const [blocking, setBlocking] = useState(false);
  const [resignationHistoryArray, setResignationHistoryArray] = useState([]);

  const getParsedDate = (date) => {
    if (date && date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } else {
      return 'N/A';
    }
  };
  useEffect(() => {
    if (employeeUUID) {
      setBlocking(true);
      apicaller(
        'get',
        `${BASEURL}/resignation/fetchEmployeeHistory/${employeeUUID}`
      )
        .then((res) => {
          setBlocking(false);
          if (res.status === 200) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isEarlyExit) {
                const daysForNoticePeriodAsPerEmployee = getDateDifference(
                  res.data[i].requestSubmissionDate,
                  res.data[i].lastWorkingDateAsPerEmployee
                );
                res.data[i]['noticePeriodAsPerEmployee'] =
                  daysForNoticePeriodAsPerEmployee + ' Days';
              }
            }
            setResignationHistoryArray(res.data);
          }
        })
        .catch((err) => {
          setBlocking(false);
          console.log('err', err);
          setResignationHistoryArray([]);
        });
    }
  }, []);
  const getDateDifference = (startDate, endDate) => {
    // Convert the dates to milliseconds
    var startMillis = new Date(startDate);
    var endMillis = new Date(endDate);
    startMillis.setUTCHours(0, 0, 0, 0);
    endMillis.setUTCHours(0, 0, 0, 0);
    // Calculate the difference in milliseconds
    var differenceMillis =
      startMillis.getTime() > endMillis.getTime()
        ? startMillis.getTime() - endMillis.getTime()
        : endMillis.getTime() - startMillis.getTime();
    // Convert milliseconds to days
    var days = Math.floor(differenceMillis / (1000 * 60 * 60 * 24));
    return isNaN(days) ? 'N/A' : days;
  };
  return (
    <>
      <Card>
        <Grid container spacing={0}>
          <Grid item md={12} lg={12} xl={12} className="mx-auto">
            <div className="bg-white p-4 rounded">
              {resignationHistoryArray?.map((item, idx) => (
                <>
                  <div className="ml-4 mb-0">Resignation Details</div>
                  <Card
                    style={{
                      padding: '25px',
                      border: '1px solid #c4c4c4',
                      margin: '10px',
                      marginBottom: '30px'
                    }}>
                    <Grid container spacing={0}>
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ width: '200px' }}>
                              Request Submission Date
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {getParsedDate(item?.requestSubmissionDate)}{' '}
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ width: '200px' }}>
                              Reason For Resignation
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {item.resignationReason}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ minWidth: '200px' }}>
                              Resignation Details
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {item.resignationDetails}
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ width: '200px' }}>
                              Is Early Exit Request
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {item.isEarlyExit ? 'Yes' : 'No'}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ width: '200px' }}>
                              Last Date As Per Employee
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {getParsedDate(
                                item?.lastWorkingDateAsPerEmployee
                              )}{' '}
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ width: '200px' }}>
                              Notice Period As Per Employee
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {item.noticePeriodAsPerEmployee}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <div className="d-flex align-items-center">
                            <div
                              className="font-size-sm my-3 justify-content-between"
                              style={{ width: '200px' }}>
                              Action Taken
                            </div>
                            <div
                              className=" text-grey font-weight-bold my-3"
                              style={{
                                overflowWrap: 'break-word'
                              }}>
                              {item.actionTake}
                            </div>
                          </div>
                        </Grid>
                        <Grid item md={6}>
                          {item.rejectedBy && (
                            <div className="d-flex align-items-center ">
                              <div
                                className="font-size-sm my-3 justify-content-between"
                                style={{ width: '200px' }}>
                                Request Rejected By
                              </div>
                              <div
                                className=" text-grey font-weight-bold my-3"
                                style={{
                                  overflowWrap: 'break-word'
                                }}>
                                {item.rejectedBy}
                              </div>
                            </div>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        {item.resignationHistory.map((historyitem, idx) => (
                          <Grid item md={6}>
                            <div className="d-flex align-items-center ">
                              <div
                                className="font-size-sm my-3 justify-content-between"
                                style={{ width: '200px' }}>
                                {historyitem.approver} Comments
                              </div>
                              <div
                                className=" text-grey font-weight-bold my-3"
                                style={{
                                  overflowWrap: 'break-word'
                                }}>
                                {historyitem.comments}
                              </div>
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Card>
                </>
              ))}
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.Auth.user
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ResignationHistory);
