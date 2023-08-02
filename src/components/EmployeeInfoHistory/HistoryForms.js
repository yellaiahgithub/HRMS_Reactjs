import { Card } from '@material-ui/core';

import React, { useState } from 'react';
import { connect } from 'react-redux';
import EmployeeNameHistory from './EmployeeNameHistory';
import EmployeeEmergencyContactHistory from './EmployeeEmergencyContactHistory';
import EmployeeJobDetailHistory from './EmployeeJobDetailHistory';
import EmployeeEmailHistory from './EmployeeEmailHistory';
import EmployeePhoneHistory from './EmployeePhoneHistory';
import EmployeeAddressHistory from './EmployeeAddressHistory';
import EmployeeGenderHistory from './EmployeeGenderHistory';
function HistoryForms(props) {
  const {
    selectedEmployeeInfoHistory,
    create,
    type,
    employeeUUID,
    savedEmployeeInfoHistoryDetails,
    setSavedEmployeeInfoHistoryDetails,
    setEmployeeInfoHistoryDetails,
    setSelectedEmployeeInfoHistory,
    setState
  } = props;

  return (
    <>
      {type === 'EmployeeName' && (
        <EmployeeNameHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={setSavedEmployeeInfoHistoryDetails}
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
      {type === 'EmployeeEmergencyContact'  && (
        <EmployeeEmergencyContactHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={
            setSavedEmployeeInfoHistoryDetails
          }
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
      {type === 'EmployeeJobDetails' && (
        <EmployeeJobDetailHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={
            setSavedEmployeeInfoHistoryDetails
          }
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
      {type === 'EmployeeAddress' && (
        <EmployeeAddressHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={
            setSavedEmployeeInfoHistoryDetails
          }
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
      {type === 'EmployeeGender' && (
        <EmployeeGenderHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={setSavedEmployeeInfoHistoryDetails}
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
      {type === 'EmployeeEmail' && (
        <EmployeeEmailHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={setSavedEmployeeInfoHistoryDetails}
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
      {type === 'EmployeePhone' && (
         <EmployeePhoneHistory
          selectedEmployeeInfoHistory={selectedEmployeeInfoHistory}
          create={create}
          employeeUUID={employeeUUID}
          savedEmployeeInfoHistoryDetails={savedEmployeeInfoHistoryDetails}
          setSavedEmployeeInfoHistoryDetails={setSavedEmployeeInfoHistoryDetails}
          setEmployeeInfoHistoryDetails={setEmployeeInfoHistoryDetails}
          setSelectedEmployeeInfoHistory={setSelectedEmployeeInfoHistory}
          setState={setState}
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  selectedCompany: state.Auth.selectedCompany
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryForms);
