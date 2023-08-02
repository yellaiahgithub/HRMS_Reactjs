import React, { useState } from 'react'
import UploadBeneficiary from '../../components/UploadBeneficiary'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function Create () {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Beneficiary'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayHireReasonCodes={false}
          displayDepartmentCodes={false}
            displayLocationCodes={false}
            displayDesignationCodes={false}
            displayEmployeeCodes={true}></BulkUploadDisplayCodes>
        )}
      <UploadBeneficiary hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
