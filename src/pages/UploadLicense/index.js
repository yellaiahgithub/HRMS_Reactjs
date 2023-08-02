import { Card } from '@material-ui/core';
import UploadCertificateOrLicense from 'components/UploadCertificateOrLicense/uploadCertificateOrLicense';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload License'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
            displayEmployeeCodes={true}
            displayLicenseCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadCertificateOrLicense hideCodes={hideCodes} setHideCodes={setHideCodes} type="License" />
      </Card>
    </>
  );
}
