import React from 'react';
import clsx from 'clsx';
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
import PerfectScrollbar from 'react-perfect-scrollbar';
import party from '../../../src/assets/images/party.png';
import { useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import { BASEURL } from 'config/conf';
import { makeStyles } from '@material-ui/core/styles';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import empty_profile_picture from '../../assets/images/avatars/empty_profile_picture.jpg';
import birthday_wishes from '../../assets/images/birthday_wishes.png'
import work_anniversary from '../../assets/images/work_anniversary.png'

const useStyles = makeStyles((theme) => ({
  monthPicker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    padding: theme.spacing(1)
  },

  monthButton: {
    minWidth: 0,
    padding: theme.spacing(1),
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#fff'
    }
  }
}));

const Birthday = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [popUpActiveTab, setPopUpActiveTab] = useState('1');
  const [type, setType] = useState('BirthDate');
  const [popUpType, setPopUpType] = useState('BirthDate');
  const [birthdayAnniversaryData, setBirthdayAnniversaryData] = useState([]);
  const [birthDaysCount, setBirthDaysCount] = useState(0);
  const [anniversaryCount, setAnniversaryCount] = useState(0);
  const [todayBirthDayEmployees, setTodayBirthDayEmployees] = useState([]);
  const [todayAnniversaryEmployees, setTodayAnniversaryEmployees] = useState(
    []
  );
  const [todaysBirthdayAnniversaryData, setTodaysBirthdayAnniversaryData] =
    useState([]);
  const [selectedMonthBirthDayEmployees, setSelectedMonthBirthDayEmployees] =
    useState([]);
  const [
    selectedMonthAnniversaryEmployees,
    setSelectedMonthAnniversaryEmployees
  ] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [anchorEl3, setAnchorEl3] = useState(null);
  const open3 = Boolean(anchorEl3);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const popUpToggle = (tab) => {
    if (popUpActiveTab !== tab) setPopUpActiveTab(tab);
  };
  useEffect(() => {
    getBirthdays('HireDate');
    getBirthdays('BirthDate');
    setType('BirthDate');
  }, []);
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
  const getBirthdays = (fetchBy, month) => {
    const URL =
      month != null
        ? `${BASEURL}/employee/fetchBirthDatesOrAnniversaries?month=${month + 1
        }&fetchBy=${fetchBy}`
        : `${BASEURL}/employee/fetchBirthDatesOrAnniversaries?fetchBy=${fetchBy}`;
    apicaller('get', URL)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (month == null) {
            if (fetchBy.toLowerCase() === 'BirthDate'.toLowerCase()) {
              setTodayBirthDayEmployees(res.data);
              setBirthDaysCount(res.data.length);
              setTodaysBirthdayAnniversaryData(res.data);
            } else if (fetchBy.toLowerCase() === 'HireDate'.toLowerCase()) {
              setTodayAnniversaryEmployees(res.data);
              setAnniversaryCount(res.data.length);
            }
          } else {
            if (fetchBy.toLowerCase() === 'BirthDate'.toLowerCase()) {
              setSelectedMonthBirthDayEmployees(res.data);
              if (popUpType.toLowerCase() === 'BirthDate'.toLowerCase()) {
                setBirthdayAnniversaryData(res.data);
              }
            } else if (fetchBy.toLowerCase() === 'HireDate'.toLowerCase()) {
              setSelectedMonthAnniversaryEmployees(res.data);
              if (popUpType.toLowerCase() === 'HireDate'.toLowerCase()) {
                setBirthdayAnniversaryData(res.data);
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log('get Birthdays and workAnniversaries err', err);
      });
  };

  const monthWiseViewPopover = (event) => {
    setPopUpType('BirthDate');
    getBirthdays('birthDate', new Date().getMonth());
    getBirthdays('HireDate', new Date().getMonth());
    setAnchorEl3(event.currentTarget);
  };

  const handleClosePopover3 = () => {
    setAnchorEl3(null);
  };

  const handlePrevMonth = () => {
    handleDateChange((prevDate) => {
      const prevMonth = prevDate.getMonth() != 0 ? prevDate.getMonth() - 1 : 11;
      getBirthdays('BirthDate', prevMonth);
      getBirthdays('HireDate', prevMonth);
      return new Date(prevDate.getFullYear(), prevMonth, 1);
    });
  };

  const handleNextMonth = () => {
    handleDateChange((prevDate) => {
      const nextMonth = prevDate.getMonth() != 11 ? prevDate.getMonth() + 1 : 0;
      getBirthdays('BirthDate', nextMonth);
      getBirthdays('HireDate', nextMonth);
      return new Date(prevDate.getFullYear(), nextMonth, 1);
    });
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const classes = useStyles();

  return (
    <>
      <Grid item lg={6}>
        <Card style={{ width: "auto", height: "18rem" }}>
          {/* <PerfectScrollbar options={{ wheelPropagation: true }}> */}
          <List
            component="div"
            className="nav-line d-flex nav-line-alt nav-tabs-info">
            <ListItem>
              <div className="text-center my-1">
                <img src={party} alt="action" width="40" height="40" />
              </div>
            </ListItem>
            <ListItem
              button
              disableRipple
              selected={activeTab === '1'}
              onClick={() => {
                toggle('1');
                setType('BirthDate');
                setTodaysBirthdayAnniversaryData(todayBirthDayEmployees);
              }}>
              <span className="text-center mx-4">Birthdays </span>
              <div className="divider" />
              {birthDaysCount}
            </ListItem>
            <ListItem
              button
              disableRipple
              selected={activeTab === '2'}
              onClick={() => {
                toggle('2');
                setType('HireDate');
                setTodaysBirthdayAnniversaryData(todayAnniversaryEmployees);
              }}>
              <span className="text-center mx-4">Work Anniversaries</span>
              <div className="divider" />
              {anniversaryCount}
            </ListItem>
          </List>
          <div className="table-responsive-md" style={{ overflow: 'auto' }}>
            <TableContainer>
              <Table
                className="table table-alternate-spaced mb-0"
              >
                <thead className="thead-light">
                  <Popover
                    open={open3}
                    style={{
                      top: '0',
                      left: '10px',
                      right: '10px',
                      maxWidth: '800px',
                      margin: '0 auto'
                    }}
                    anchorEl={anchorEl3}
                    classes={{ paper: 'rounded font-size-xl' }}
                    onClose={handleClosePopover3}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'center'
                    }}>
                    <div className="rounded-top p-1">
                      <div
                        className="float-right"
                        style={{ marginRight: '10px', marginLeft: '50px' }}>
                        <Button
                          className="btn-neutral-danger mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center"
                          onClick={() => handleClosePopover3()}>
                          <FontAwesomeIcon
                            icon={['fas', 'times']}
                            className="font-size-sm"
                          />
                        </Button>
                      </div>
                      <List
                        component="div"
                        className="nav-line d-flex nav-line-alt nav-tabs-info">
                        <ListItem>
                          <div className="text-center my-1">
                            <img
                              src={party}
                              alt="action"
                              width="40"
                              height="40"
                            />
                          </div>
                        </ListItem>
                        <ListItem
                          button
                          disableRipple
                          selected={popUpActiveTab === '1'}
                          onClick={() => {
                            popUpToggle('1');
                            setPopUpType('BirthDate');
                            setBirthdayAnniversaryData(
                              selectedMonthBirthDayEmployees
                            );
                          }}>
                          <span className="text-center mx-4">
                            Birthdays &nbsp;{' '}
                            {selectedMonthBirthDayEmployees.length}
                          </span>
                          <div className="divider" />
                        </ListItem>
                        <ListItem
                          button
                          disableRipple
                          selected={popUpActiveTab === '2'}
                          onClick={() => {
                            popUpToggle('2');
                            setPopUpType('HireDate');
                            setBirthdayAnniversaryData(
                              selectedMonthAnniversaryEmployees
                            );
                          }}>
                          <span>
                            Work Anniversaries &nbsp;{' '}
                            {selectedMonthAnniversaryEmployees.length}
                          </span>
                          <div className="divider" />
                        </ListItem>
                      </List>
                      <div className={classes.monthPicker}>
                        <Button
                          className={classes.monthButton}
                          onClick={handlePrevMonth}>
                          <FontAwesomeIcon icon={faChevronLeft} />
                        </Button>
                        <div>{getMonthName(selectedDate)}</div>
                        <Button
                          className={classes.monthButton}
                          onClick={handleNextMonth}>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </Button>
                      </div>
                      {birthdayAnniversaryData.length > 0 ? (
                        <div style={{ height: '250px', overflow: 'auto' }}>
                          {birthdayAnniversaryData?.map((item, idx) => (
                            <tr>
                              <td width={'20%'}>
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
                              <td width={'60%'}>
                                <div className="rounded-top p-1 text-capitalize">
                                  {item.employeeName},&nbsp;{item.designation}
                                </div>
                              </td>
                              <td width={'20%'}>
                                <div className="rounded-top p-1">
                                  {getParsedDate(
                                    popUpType === 'BirthDate'
                                      ? item.dob
                                      : item.hireDate
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center'>
                          <img src={popUpActiveTab === '1' ? birthday_wishes : work_anniversary} alt='...'
                            style={{ width: '300px', height: '240px' }} className="img-fluid rounded-sm" />
                        </div>
                      )}
                    </div>
                  </Popover>
                </thead>
                {todaysBirthdayAnniversaryData.length > 0 ? (
                  <div style={{ height: '150px', overflow: 'auto' }}>
                    {todaysBirthdayAnniversaryData?.map((item, idx) => (
                      <tr>
                        <td width={'20%'}>
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
                        <td width={'60%'}>
                          <div className="rounded-top p-1 text-capitalize">
                            {item.employeeName},&nbsp;{item.designation}
                          </div>
                        </td>
                        <td width={'20%'}>
                          <div className="rounded-top p-1">
                            {getParsedDate(
                              type === 'BirthDate' ? item.dob : item.hireDate
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </div>
                ) : (

                  <div className='text-center'>
                    <img src={activeTab === '1' ? birthday_wishes : work_anniversary} alt='...'
                      style={{ width: '300px', height: '170px' }} className="img-fluid rounded-sm" />
                  </div>
                )}
              </Table>
            </TableContainer>
          </div>
          <p className="p-3">
            <a
              style={{
                color: 'blue',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={monthWiseViewPopover}>
              Month Wise View
            </a>
          </p>
          {/* </PerfectScrollbar> */}
        </Card>
      </Grid>
    </>
  );
};
export default Birthday;
