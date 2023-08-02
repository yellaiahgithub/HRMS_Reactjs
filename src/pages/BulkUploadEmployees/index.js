import React, { useState } from 'react'
import BulkUploadEmployees from '../../components/BulkUploadEmployees'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function UploadBulkEmployees () {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Employees'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayHireReasonCodes={true}
          displayDepartmentCodes={true}
            displayLocationCodes={true}
            displayDesignationCodes={true}
            displayEmployeeCodes={true}></BulkUploadDisplayCodes>
        )}
      <BulkUploadEmployees hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
