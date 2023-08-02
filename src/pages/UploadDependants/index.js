import React, { useState } from 'react'
import UploadDependants from '../../components/UploadDependants'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function Create () {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
      <br />
        <h4 className="m-2 text-center">{'Upload Dependants'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayHireReasonCodes={false}
          displayDepartmentCodes={false}
            displayLocationCodes={false}
            displayDesignationCodes={false}
            displayEmployeeCodes={true}></BulkUploadDisplayCodes>
        )}
      <UploadDependants hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
