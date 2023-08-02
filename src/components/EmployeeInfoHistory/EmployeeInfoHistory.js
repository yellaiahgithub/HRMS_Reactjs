import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, List, ListItem, Snackbar } from '@material-ui/core';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import EmployeeNameHistory from './EmployeeNameHistory';
import HistoryForms from './HistoryForms';

export default function EmployeeInfoHistory() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || null;
  const employeeUUID = queryParams.get('employeeUUID') || null;
  const [employeeInfoHistoryDetails, setEmployeeInfoHistoryDetails] = useState(
    [null]
  );
  const [savedEmployeeInfoHistoryDetails, setSavedEmployeeInfoHistoryDetails] =
    useState([]);
  const [selectedEmployeeInfoHistory, setSelectedEmployeeInfoHistory] =
    useState(null);
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    toastrStyle: 'sucess',
    message: 'This is a toastr/snackbar notification!'
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;
  const handleClose = () => {
    setState({ ...state, open: false });
  };
  let componentForm;
  useEffect(() => {
    getEmployeeInfoHistory();
    componentForm = EmployeeNameHistory;
  }, []);
  const getEmployeeInfoHistory = () => {
    apicaller(
      'get',
      `${BASEURL}/employeeInfoHistory/fetchByType/` + type + `/` + employeeUUID
    )
      .then((res) => {
        if (res.status === 200) {
          setSavedEmployeeInfoHistoryDetails(res.data);
          let history = []
          if(type.toLowerCase() === 'employeejobdetails' && res.data[0].actionCode.toLowerCase() === "sep") {
            history = [...res.data];
            setEmployeeInfoHistoryDetails(history);
            setSelectedEmployeeInfoHistory(history[0])
          } else {
            history = [null, ...res.data];
            setEmployeeInfoHistoryDetails(history);
          }
        }
      })
      .catch((err) => {
        setState({
          open: true,
          message: err.response.data,
          toastrStyle: 'toastr-warning',
          vertical: 'top',
          horizontal: 'right'
        });
        console.log('getEmployeeInfoHistory err', err);
      });
  };
  const getLabel = (item, type) => {
    if (type.toLowerCase() === 'EmployeeName'.toLowerCase()) {
      return item
        ? item?.historyObject?.firstName +
        (item?.historyObject?.middleName
          ? ' ' + item?.historyObject?.middleName
          : '') +
        (item?.historyObject?.lastName
          ? ' ' + item?.historyObject?.lastName
          : '')
        : 'Add New Name';
    }
    if (type.toLowerCase() === 'EmployeeEmergencyContact'.toLowerCase()) {
      return item
        ? item?.historyObject?.contactName 
           
        : 'Add New Emergency Contact';
    }
    if (type.toLowerCase() === 'EmployeeJobDetails'.toLowerCase()) {
      return item
        ? item?.actionName + ' ' + item?.reasonName
        : 'Add New Job Details';
    }
    if (type.toLowerCase() === 'EmployeeAddress'.toLowerCase()) {
      return item
        ? item?.historyObject?.addressType + ' Address'
        : 'Add New Address';
    }
    if (type.toLowerCase() === 'EmployeeGender'.toLowerCase()) {
      return item
        ? item?.historyObject?.gender : 'Add New Gender ';
    }
    if (type.toLowerCase() === 'EmployeeEmail'.toLowerCase()) {
      return item ?
        item?.historyObject?.type + " - " + 
        (item?.historyObject?.email)
        : 'Add New Email'
    }
    if (type.toLowerCase() === 'EmployeePhone'.toLowerCase()){
      return item?
        item?.historyObject?.type + " - " + 
        (item?.historyObject?.phoneNumber)
        :'Add New Number'
    }
  };

  return (
    <Card>
      <br />
      <Grid container spacing={0}>
        <Grid item md={10} lg={7} xl={11} className="mx-3">
          <h4>Employee Change</h4>
          <Grid container>
            {employeeInfoHistoryDetails?.map((item, idx) => (
              <Grid item lg={12}>
                <div className="timeline-list">
                  <div className="timeline-item">
                    <div className="timeline-item--content">
                      <div className="timeline-item--icon" />
                      <Grid container spacing={0}>
                        <Grid item md={1}>
                          <h3
                            style={{
                              color:
                                selectedEmployeeInfoHistory == item
                                  ? 'blue'
                                  : 'grey'
                            }}
                            className="mb-2 ">
                            {employeeInfoHistoryDetails.length - idx < 10
                              ? '0' + (employeeInfoHistoryDetails.length - idx)
                              : employeeInfoHistoryDetails.length - idx}
                          </h3>
                        </Grid>
                        {item ? (
                          <Grid item md={11}>
                            {selectedEmployeeInfoHistory == item ? (
                              <HistoryForms
                                selectedEmployeeInfoHistory={item}
                                create={false}
                                type={type}
                                employeeUUID={employeeUUID}
                                savedEmployeeInfoHistoryDetails={
                                  savedEmployeeInfoHistoryDetails
                                }
                                setSavedEmployeeInfoHistoryDetails={
                                  setSavedEmployeeInfoHistoryDetails
                                }
                                setEmployeeInfoHistoryDetails={
                                  setEmployeeInfoHistoryDetails
                                }
                                setSelectedEmployeeInfoHistory={
                                  setSelectedEmployeeInfoHistory
                                }
                                setState={setState}
                              />
                            ) : (
                              <>
                                <List style={{ padding: '0px' }}>
                                  <ListItem
                                    style={{ padding: '0px' }}
                                    button
                                    onClick={(e) =>
                                      setSelectedEmployeeInfoHistory(item)
                                    }>
                                    <span
                                      style={{
                                        color:
                                          selectedEmployeeInfoHistory == item
                                            ? 'blue'
                                            : 'grey'
                                      }}>
                                      <h5>{getLabel(item, type)}</h5>
                                      <h5>
                                        {new Date(
                                          item.effectiveDate
                                        ).toLocaleDateString('en-US', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </h5>
                                    </span>
                                  </ListItem>
                                </List>
                              </>
                            )}
                          </Grid>
                        ) : (
                          <Grid item md={11}>
                            {selectedEmployeeInfoHistory == null ? (
                              <HistoryForms
                                selectedEmployeeInfoHistory={null}
                                create={true}
                                type={type}
                                employeeUUID={employeeUUID}
                                savedEmployeeInfoHistoryDetails={
                                  savedEmployeeInfoHistoryDetails
                                }
                                setSavedEmployeeInfoHistoryDetails={
                                  setSavedEmployeeInfoHistoryDetails
                                }
                                setEmployeeInfoHistoryDetails={
                                  setEmployeeInfoHistoryDetails
                                }
                                setSelectedEmployeeInfoHistory={
                                  setSelectedEmployeeInfoHistory
                                }
                                setState={setState}
                              />
                            ) : (
                              <List style={{ padding: '0px' }}>
                                <ListItem
                                  style={{ padding: '0px' }}
                                  button
                                  onClick={(e) =>
                                    setSelectedEmployeeInfoHistory(item)
                                  }>
                                  <h5
                                    style={{
                                      color:
                                        selectedEmployeeInfoHistory == item
                                          ? 'blue'
                                          : 'grey'
                                    }}>
                                    {getLabel(item, type)}
                                  </h5>
                                </ListItem>
                              </List>
                            )}
                          </Grid>
                        )}
                      </Grid>
                      <Snackbar
                        anchorOrigin={{ vertical, horizontal }}
                        key={`${vertical},${horizontal}`}
                        open={open}
                        classes={{ root: toastrStyle }}
                        onClose={handleClose}
                        message={message}
                        autoHideDuration={2000}
                      />
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <br />
    </Card>
  );
}
