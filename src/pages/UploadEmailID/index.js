import { Card } from '@material-ui/core';
import UploadEmailID from 'components/UploadEmailID/uploadEmailID';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Email ID'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
            displayEmployeeCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadEmailID hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
