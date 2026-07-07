import { useState } from "react";
import EmailTypeSelector from "../components/email/EmailTypeSelector";

export default function EmailPage() {
  const [emailType, setEmailType] = useState("text");

  return (
    <EmailTypeSelector emailType={emailType} setEmailType={setEmailType} />
  );
}

