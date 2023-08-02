import {
    Box,
    Button,
    Card,
    Checkbox,
    Grid,
    Collapse
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASEURL } from 'config/conf';
import React, { useState, useEffect } from 'react';
import apicaller from 'helper/Apicaller';
import { connect } from 'react-redux';
import EmployeeDetailsCard from 'components/MyProfile/EmployeeDetailsCard';
import network from '../../../src/assets/images/network.png';
import location from '../../../src/assets/images/location.png';
import designation from '../../../src/assets/images/designation.jpg';
import address from '../../../src/assets/images/address.png';
import EmergencyContact from '../../../src/assets/images/EmergencyContact.png';
import certificate from '../../../src/assets/images/certificate.png';
import license from '../../../src/assets/images/license.png';
import Promotion from '../../../src/assets/images/Promotion.png';
import beneficiary from '../../../src/assets/images/beneficiary.png';
import dependant from '../../../src/assets/images/dependant.png';
import hire from '../../../src/assets/images/hire.png';
import party from '../../../src/assets/images/party.png';
import telephone from '../../../src/assets/images/telephone.png';
import email from '../../../src/assets/images/email.png';

const EmployeeTimeline = (props) => {
    const { user } = props
    const [employeeTimeline, setEmployeeTimeline] = useState()
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        apicaller(
            'get',
            `${BASEURL}/employeeInfoHistory/timeline?uuid=${user.uuid}`
        )
            .then(res => {
                if (res.status === 200 && res.data.length > 0) {
                    res.data.sort((a, b) => b._id.year - a._id.year);
                    setEmployeeTimeline(res.data)
                    Accordion(0)
                }
            })
            .catch(err => {
                if (err.response?.data) {
                }
                console.log('get employee err', err)
            })
    }, [])

    const [state1, setState1] = useState({
        accordion: [false, false, false]
    });
    const openAccordion = (selectedIndex) => {
        const prevState = state1.accordion;
        const state = prevState.map((x, idx) => (idx == selectedIndex ? true : false));
        setState1({
            accordion: state
        });
    };
    const Accordion = (idx) => {
        openAccordion(idx)
        setSelectedIndex(idx)
    }
    return (
        <>
            <EmployeeDetailsCard employeeDetails={user} />
            <Card>
                <Grid container spacing={0}>
                    {employeeTimeline?.map(
                        (item, idx) => (
                            < Grid item md={10} lg={7} xl={11} className="my-2 mx-5">
                                <Button
                                    onClick={() => { Accordion(idx) }}
                                    aria-expanded={idx === selectedIndex}
                                    style={{
                                        opacity: idx === selectedIndex
                                            ? 1
                                            : 0.5
                                    }}
                                    className='btn btn-dark mb-2 m-2'
                                    type='button' >
                                    {item._id.year}
                                </Button>
                                <div className="timeline-list  mx-4">
                                    <Collapse in={state1.accordion[idx]}>
                                        {item.list?.map(
                                            (item1, idx1) => (
                                                <div className="timeline-item timeline-item-icon">
                                                    <div className="timeline-item--content">
                                                        {item1.incident === "New Department" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse  ">
                                                                {/* <FontAwesomeIcon icon={['far', 'building']} /> */}
                                                                <img src={network} alt="action" width="30" height="30" />
                                                            </div>
                                                            )
                                                            : ("")}
                                                        {item1.incident === "New Emergency Contact" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                {/* <FontAwesomeIcon icon={['far', 'building']} /> */}
                                                                <img src={EmergencyContact} alt="action" width="30" height="30" />

                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New Address" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                {/* <FontAwesomeIcon icon={['far', 'building']} /> */}
                                                                <img src={address} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New Beneficiary" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={beneficiary} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New Dependant" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={dependant} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New Certificate" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={certificate} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New License" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={license} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "Promotion" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={Promotion} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New Location" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse  ">
                                                                <img src={location} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "New Designation" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={designation} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "Service Anniversary" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={party} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        {item1.incident === "HIRE" ?
                                                            (<div className="timeline-item--icon-wrapper square text-white btn-primary btn-gradient shadow-none btn-gradient-inverse ">
                                                                <img src={hire} alt="action" width="30" height="30" />
                                                            </div>)
                                                            : ("")}
                                                        <h4 className="timeline-item--label mb-2 font-weight-bold text-dark">
                                                            {item1.incident}
                                                        </h4>
                                                        <p>
                                                            {new Date(
                                                                item1.createdAt
                                                            ).toLocaleDateString('en-US', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </Collapse>
                                </div>

                            </Grid>
                        ))
                    }
                </Grid>
            </Card >
        </>
    )
}
const mapStateToProps = (state) => ({
    user: state.Auth.user,

});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeTimeline);