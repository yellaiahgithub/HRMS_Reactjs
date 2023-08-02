import { Card } from '@material-ui/core';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';
import UploadDesignation from 'components/uploadDesignation/uploadDesignation';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Designations'}</h4>
        {!hideCodes && 
        <BulkUploadDisplayCodes
          displayJobGrades={true}
          displayJobLevel={true}>
        </BulkUploadDisplayCodes>}
        <UploadDesignation hideCodes={hideCodes} setHideCodes={setHideCodes} />
      </Card>
    </>
  );
}
