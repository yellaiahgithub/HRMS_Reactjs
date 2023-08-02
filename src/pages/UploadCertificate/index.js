import { Card } from '@material-ui/core';
import UploadCertificate from 'components/UploadCertificateOrLicense/uploadCertificateOrLicense';
import BulkUploadDisplayCodes from 'components/BulkUploadDisplayCodes/bulkUploadDisplayCodes';

import React, { useState } from 'react';

export default function Create() {
  const [hideCodes, setHideCodes] = useState(false);
  return (
    <>
      <Card>
        <br />
        <h4 className="m-2 text-center">{'Upload Certificate'}</h4>
        {!hideCodes && (
          <BulkUploadDisplayCodes
            displayEmployeeCodes={true}
            displayCertificateCodes={true}
            ></BulkUploadDisplayCodes>
        )}
        <UploadCertificate hideCodes={hideCodes} setHideCodes={setHideCodes} type="Certificate" />
      </Card>
    </>
  );
}
