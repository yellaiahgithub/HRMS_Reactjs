import React, { useState } from 'react'
import UploadJobGrade from '../../components/UploadJobGrade'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function UploadGrade () {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload JobGrade'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayHireReasonCodes={false}
          displayDepartmentCodes={false}
          displayLocationCodes={false}
          displayDesignationCodes={false}
          displayEmployeeCodes={false}
          displayJobGrades={true}
          ></BulkUploadDisplayCodes>
        )}
      <UploadJobGrade hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
