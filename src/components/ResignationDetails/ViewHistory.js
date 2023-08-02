import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    Table,

} from '@material-ui/core';
import apicaller from 'helper/Apicaller'
import { BASEURL } from 'config/conf'
import { connect } from 'react-redux'

const CreateViewHistory = (employeeDetails) => {

    useEffect(() => {
        getReasonForResignation();
    }, []);

    const getReasonForResignation = () => {
        apicaller('get', `${BASEURL}/resignation/fetchByEmployeeUUID/${employeeDetails.employeeUUID}`)
            .then(res => {
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    setViewHistory(res.data)
                }
            })
            .catch(err => {
                console.log('Fetch error', err);
            })
    }

    const getParsedDate = date => {
        if (date && date !== null && date !== '') {
            return new Date(date).toLocaleDateString('en-IN', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            })
        } else {
            return 'N/A'
        }
    }
    const paddingTop = {
        paddingTop: '25px'
    }

    const tableData = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '300px'
    }
    const [viewHistory, setViewHistory] = useState();
    return (
        <>
            <Card style={{ marginTop: '15px' }}>
                <CardContent>
                    <div
                        className="table-responsive-md"
                        style={{ width: '100%', overflowX: 'auto' }}>
                        <Table className='table table-alternate-spaced mb-0'>
                            <thead style={{ background: '#eeeeee' }}>
                                <tr>
                                    <th
                                        title='Date of Resignation'
                                        style={{ ...tableData, ...paddingTop }}
                                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                        scope='col'>
                                        Date of Resignation
                                    </th>
                                    <th
                                        title='Submitted By'
                                        style={{ ...tableData, ...paddingTop }}
                                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                        scope='col'>
                                        Submitted By
                                    </th>
                                    <th
                                        title=' Resignation Reason'
                                        style={{ ...tableData, ...paddingTop }}
                                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                        scope='col'>
                                        Resignation Reason
                                    </th>
                                    <th
                                        title='Resignation Details'
                                        style={{ ...tableData, ...paddingTop }}
                                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                        scope='col'>
                                        Resignation Details
                                    </th>
                                    <th
                                        title='Revoked By'
                                        style={{ ...tableData, ...paddingTop }}
                                        className='font-size-sm font-weight-bold pb-4 text-capitalize '
                                        scope='col'>
                                        Revoked By
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewHistory && (
                                    <>
                                        {viewHistory?.map(
                                            (item, idx) => (
                                                <tr>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <div
                                                                title={getParsedDate(item?.dateOfResignation)}
                                                                style={tableData}>
                                                                {getParsedDate(item?.dateOfResignation)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <div
                                                                title={item?.submittedBy}
                                                                style={tableData}>
                                                                {item?.submittedBy}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <div
                                                                title={item?.resignationReason}
                                                                style={tableData}>
                                                                {item?.resignationReason}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <div
                                                                title={item?.resignationDetails}
                                                                style={tableData}>
                                                                {item?.resignationDetails}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <div
                                                                title={item?.revokedBy}
                                                                style={tableData}>
                                                                {item?.revokedBy}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </>
                                )}
                                {viewHistory && viewHistory.length == 0 && (
                                    <tr className='text-center'>
                                        <td colSpan="6">
                                        <span> No Resignation History Available</span>
                                    </td>
                                    </tr>
                                )}
                            </tbody>

                        </Table>
                    </div>
                </CardContent >
            </Card >
        </>
    )
}
const mapStateToProps = state => ({
    user: state.Auth.user,
})
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CreateViewHistory)