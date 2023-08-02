import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Card, List, ListItem, Table, TableContainer, Button, MenuItem } from '@material-ui/core';
import Policy from '../../../src/assets/images/policy.jpg';
import apicaller from "helper/Apicaller";
import { BASEURL } from 'config/conf';
import no_policy from '../../assets/images/no_policy.png'
    ;

const CompanyPolicy = () => {
    const [companyPolicyData, setCompanyPolicyData] = useState([]);
    const [documentSrc, setDocumentSrc] = useState('')
    useEffect(() => {
        getCompanyPolicy();
    }, [])

    const getCompanyPolicy = () => {
        apicaller('get', `${BASEURL}/companyPolicy`)
            .then(res => {
                if (res.status === 200) {
                    setCompanyPolicyData(res.data)
                    console.log(res.data[0])
                }

            })
            .catch(err => {
                console.log('get Company Policy err', err)
            })
    }
    const getParsedDate = date => {
        if (date !== null && date !== '') {
            return new Date(date).toLocaleDateString('en-IN', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            })
        } else {
            return 'N/A'
        }
    }

    const checkIfDocumentUploadedOrNot = obj => {
        const base64WithoutPrefix = obj.pdfFile.substr('data:application/pdf;base64,'.length);
        const bytes = atob(base64WithoutPrefix);
        let length = base64WithoutPrefix.length;
        let unitArray = new Uint8Array(length);
        while (length--) {
            unitArray[length] = bytes.charCodeAt(length);
        }
        const file = new Blob([unitArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
    }

    const attributes = {
        className: 'nav-item'
    };
    return (
        <>
            <Grid item lg={6}>
                <Card style={{ width: "auto", height: "18rem" }}>
                    <List component="div" className="nav-line d-flex nav-line-alt nav-tabs-info">
                        <ListItem>
                            <div className="text-center my-1">
                                <img src={Policy} alt="action" width="40" height="40" />
                            </div>
                            <span className="text-center mx-4">
                                View Company Policy
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
                                {companyPolicyData.length > 0 ? (
                                    <>
                                        {companyPolicyData.map((item, idx) => (
                                            <>
                                                <tr>
                                                    <td className="px-2"> &nbsp;
                                                        {item.type}
                                                    </td>
                                                    <td className="px-2"> &nbsp;
                                                        | Version {item.version}
                                                    </td>
                                                    <td className="px-2"> &nbsp;
                                                        | As of {getParsedDate(item.effectiveDate)}
                                                    </td>
                                                    <td className="px-2">
                                                        <MenuItem attributes={attributes} data={{ item: 'item 1' }}>
                                                            <ListItem
                                                                // component="a"
                                                                button
                                                                onClick={() => checkIfDocumentUploadedOrNot(item)}
                                                            >
                                                                <div className="nav-link-icon">
                                                                    <FontAwesomeIcon icon={['far', 'file-pdf']} style={{ color: "red" }} />
                                                                </div>
                                                            </ListItem>
                                                        </MenuItem>
                                                        {/* {item.fileName}{item.filePath} */}
                                                    </td>
                                                </tr>

                                            </>
                                        ))
                                        }
                                    </>
                                ) : (
                                    <div className='text-center mt-3'>
                                        <div className='my-3'>
                                            <img src={no_policy} alt='...'
                                                style={{ width: '120px', height: '130px' }} className="img-fluid  rounded-sm " />
                                        </div>
                                        <h6> There Are No Policies To Show</h6>
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
export default CompanyPolicy