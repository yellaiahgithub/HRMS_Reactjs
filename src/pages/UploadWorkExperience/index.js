import { Card } from '@material-ui/core';
import UploadWorkExperience from 'components/UploadWorkExperience/uploadWorkExperience';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Work Experience'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
          displayEmployeeCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadWorkExperience hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
