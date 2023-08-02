import { Card } from '@material-ui/core';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';
import UploadDocument from 'components/uploadDocument/uploadDocument';

export default function Create() {
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Documents'}</h4>
        <UploadDocument/>
      </Card>
    </>
  );
}
