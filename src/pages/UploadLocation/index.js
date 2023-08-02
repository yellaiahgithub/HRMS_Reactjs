import { Card } from '@material-ui/core';
import UploadLocation from 'components/UploadLocation/uploadLocation';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Location'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
            displayDepartmentCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadLocation hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
