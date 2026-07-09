import { useState } from "react";
import EmailTypeSelector from "../components/email/EmailTypeSelector";
import EmailForm from "../components/email/EmailForm";

export default function EmailPage() {
  const [emailType, setEmailType] = useState("text");

  return (
    <>
      <EmailTypeSelector emailType={emailType} setEmailType={setEmailType} />
      <EmailForm emailType={emailType} />
    </>
  );
}
