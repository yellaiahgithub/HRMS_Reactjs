import React, { useState } from 'react'
import UploadNationalID from '../../components/UploadNationalID'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function UploadEmployeeNationalID () {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload National ID'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayHireReasonCodes={false}
          displayDepartmentCodes={false}
            displayLocationCodes={false}
            displayDesignationCodes={false}
            displayEmployeeCodes={true}></BulkUploadDisplayCodes>
        )}
      <UploadNationalID hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
