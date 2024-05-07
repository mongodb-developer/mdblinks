import { useState } from "react";
import { H3 } from "@leafygreen-ui/typography";
import Modal from "@leafygreen-ui/modal";
import Button from "@leafygreen-ui/button";
import { css } from "@leafygreen-ui/emotion";
import { QRCode } from 'react-qrcode-logo';

const QRCODE_SIZE = 450;

const qrCodeWrapperStyle = css`
  overflow: scroll;
  max-height: 560px;
  max-width: 560px;
`

export default function QrCodeModal(props) {
  const { open, setOpen, qrCodeDestination, className } = props;

  let [qrCodeShowHighRes, setQrCodeShowHighRes] = useState(false);

  return (
    <Modal open={open} setOpen={setOpen} className={className}>
      <H3>QR Code for {qrCodeDestination}</H3>
      <br/>
      <Button
        size="xsmall"
        variant="primaryOutline"
        onClick={() => setQrCodeShowHighRes(!qrCodeShowHighRes)}
      >
        Show {qrCodeShowHighRes ? "Low" : "High"} Res
      </Button>
      <br/>
      <div className={qrCodeWrapperStyle}>
        <QRCode
          value={qrCodeDestination}
          size={qrCodeShowHighRes ? QRCODE_SIZE * 10 : QRCODE_SIZE}
          ecLevel={"Q"}
          quietZone={20}
          bgColor={"#FFFFFF"}
          fgColor={"#023430"}
          logoImage="/logo-square-dark-green.png"
          logoWidth={(qrCodeShowHighRes ? QRCODE_SIZE * 10 : QRCODE_SIZE) * 0.2}
          logoOpacity={0.8}
          logoPadding={1}
          logoPaddingStyle={"square"}
          removeQrCodeBehindLogo={true}
          qrStyle={"fluid"}
          eyeRadius={undefined}
          eyeColor={"#023430"}
        />
      </div>
    </Modal>
  )
}