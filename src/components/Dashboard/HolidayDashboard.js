import React from "react";
import { useState } from 'react';
import {
    Grid,
    Card,
    List,
    ListItem,
    TableContainer,
    Table,
} from '@material-ui/core';
import apicaller from "helper/Apicaller";
import { useEffect } from "react";
import { BASEURL } from 'config/conf';
import { connect } from "react-redux";
import HolidayCalendar from '../../../src/assets/images/HolidayCalendar.jpg';
import holiday_calendar from '../../../src/assets/images/holiday_calendar_icon.png';

const HolidayDashboard = (props) => {
    const { user } = props
    const [holidayData, setHolidayData] = useState([]);

    useEffect(() => {
        getHolidayCalendar();
    }, [])
    const getHolidayCalendar = () => {
        apicaller('get', `${BASEURL}/holidayCalendarConfiguration/employee?locationId=${user.location}`)
            .then(res => {
                if (res.status === 200) {
                    setHolidayData(res.data[0].holidays)
                }
            })
            .catch(err => {
                console.log('get Company Policy err', err)
            })
    }
    const getPrasedDate = createdDate => {
        const date = new Date(createdDate)
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
    }
    const getDay = createdDate => {
        const date = new Date(createdDate)
        switch (date.getDay()) {
            case 0: return "Sunday";
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
        }
    }
    const getColor = (type) => {
        switch (type) {
            case 'Restricted': return "rgb(232,25,58)";
            case "Closed": return "rgb(14,64,85)";
            default: return "rgb(127,127,127)"
        }
    }

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
                                <img src={HolidayCalendar} alt="action" width="50" height="50" />
                            </div>
                            <span className="text-center mx-4">
                                Holiday Calendar
                            </span>
                            <div className="divider" />
                        </ListItem>
                    </List>
                    <div>
                    </div>
                    <div className="table-responsive-md"
                        style={{ overflow: 'auto', height: '13.6rem' }}>
                        <TableContainer>
                            <Table className="table table-alternate-spaced mb-0" style={{ height: "auto" }}>
                                {holidayData.length > 0 ? (
                                    <div>
                                        {holidayData.map((item, idx) => (
                                            <>
                                                <tr className="text-dark ">
                                                    <td className="px-2"> &nbsp;
                                                        {item?.nameOfHoliday}
                                                    </td>
                                                    <td className="px-2"> &nbsp;
                                                        {getPrasedDate(item?.date)}
                                                    </td>
                                                    <td className="px-2"> &nbsp;
                                                        {getDay(item?.date)}
                                                    </td>
                                                    <td className="px-2" style={{ color: getColor(item?.type) }}>
                                                        {item?.type} Holiday
                                                    </td>
                                                </tr>
                                            </>
                                        ))
                                        }
                                    </div>
                                ) : (
                                    <div className="text-center my-3">
                                        <div className="mb-3">
                                            <img src={holiday_calendar} alt='...'
                                                style={{ width: '120px', height: '120px' }} className="img-fluid  rounded-sm" />
                                        </div>
                                        <h6> Hoilday Calendar Not Defined</h6>
                                    </div>

                                )}

                            </Table>
                        </TableContainer>
                    </div>
                </Card>
            </Grid>
        </>
    )
}
const mapStateToProps = state => {
    return {
        user: state.Auth.user
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HolidayDashboard)