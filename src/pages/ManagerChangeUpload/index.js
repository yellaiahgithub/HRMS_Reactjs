import React, { useState } from 'react'
import ManagerChangeUpload from '../../components/ManagerChangeUpload'
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';
import { Card } from '@material-ui/core';

export default function UploadManagerChange() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
    <Card>
        <br />
        <h4 className="m-2 text-center">{'Manager Change Upload'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
            displayEmployeeCodes={true}
            displayAllActions={true}
            >
            </BulkUploadDisplayCodes>
        )}
      <ManagerChangeUpload hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </Card>
    </>
  )
}
