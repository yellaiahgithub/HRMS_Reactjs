import React,{useState} from 'react';

import UploadJobBandData from '../../components/UploadJobBand/uploadJobBands';

export default function UploadJobBand() {
  const [hideCodes, setHideCodes] = useState(false);

  return (
    <>
    <card>
      <UploadJobBandData hideCodes={hideCodes} setHideCodes={setHideCodes}/>
      </card>
    </>
  );
}
