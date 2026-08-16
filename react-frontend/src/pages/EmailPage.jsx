import { useState } from "react";
import EmailTypeSelector from "../components/email/EmailTypeSelector";
import EmailForm from "../components/email/EmailForm";
import AppHeader from "../components/layout/AppHeader.jsx";
import "./EmailPage.css";

export default function EmailPage() {
  const [emailType, setEmailType] = useState("text");

  return (
    <main className="email-page">
      <section className="email-page__content">
        <AppHeader />

        <section className="email-card">
             <h2 className="email-card__title">Odoslať email</h2>

          <EmailTypeSelector
            emailType={emailType}
            setEmailType={setEmailType}
          />

          <EmailForm emailType={emailType} />
        </section>
      </section>
    </main>
  );
}
