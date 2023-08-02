import { Card } from '@material-ui/core';
import UploadDepartment from 'components/uploadDepartment/uploadDepartment';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Departments'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
            displayLocationCodes={true}
            displayDesignationCodes={true}
            displayEmployeeCodes={true}></BulkUploadDisplayCodes>
        )}
        <UploadDepartment hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
