import React, { useState } from 'react'
import UploadAddress from '../../components/UploadAddress'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function UploadEmployeeNationalID () {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Address'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayHireReasonCodes={false}
          displayDepartmentCodes={false}
            displayLocationCodes={false}
            displayDesignationCodes={false}
            displayEmployeeCodes={true}></BulkUploadDisplayCodes>
        )}
      <UploadAddress hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
