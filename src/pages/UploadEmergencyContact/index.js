import { Card } from '@material-ui/core';
import UploadEmergencyContact from 'components/UploadEmergencyContact/uploadEmergencyContact';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Emergency Contact'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayEmployeeCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadEmergencyContact hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
