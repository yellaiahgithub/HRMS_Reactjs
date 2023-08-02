import { Card } from '@material-ui/core';
import UploadPhone from 'components/UploadPhone/uploadPhone';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Phone'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayEmployeeCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadPhone hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
