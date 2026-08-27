import "./EmailForm.css";
import EmailAttachments from "./EmailAttachments";
import useEmailForm from "../../hooks/useEmailForm";

const EMAIL_TITLE = {
  text: "Odoslať textový email",
  html: "Odoslať HTML email",
  htmlWithAttachment: "Odoslať HTML email s prílohou",
};

const EMAIL_TYPE_INFO = {
  text: "Email bude odoslaný ako textový email.",
  html: "Email bude odoslaný vo formáte HTML.",
  htmlWithAttachment: "Email bude odoslaný vo formáte HTML s prílohou.",
};

const MAX_ATTACHMENTS_SIZE = 25 * 1024 * 1024;

export default function EmailForm({ emailType }) {
  const {
    emailData,
    attachments,
    info,
    error,
    isSending,
    attachmentInputRef,
    attachmentStatus,
    remainingAttachmentsSize,
    handleChange,
    handleRemoveAttachment,
    handleAttachmentChange,
    handleSubmit,
  } = useEmailForm(emailType);

  return (
    <div className="email-form">
      <form className="email-form__form" onSubmit={handleSubmit}>
        <div className="email-form__group">
          <label className="email-form__label" htmlFor="to">
            Komu
          </label>
          <input
            className="email-form__input"
            id="to"
            type="email"
            name="to"
            placeholder="Príjemca"
            autoComplete="email"
            value={emailData.to}
            onChange={handleChange}
          />
        </div>

        <div className="email-form__group">
          <label className="email-form__label" htmlFor="subject">
            Predmet
          </label>
          <input
            className="email-form__input"
            id="subject"
            type="text"
            name="subject"
            placeholder="Predmet"
            autoComplete="off"
            value={emailData.subject}
            onChange={handleChange}
          />
        </div>

        <div className="email-form__group">
          <label className="email-form__label" htmlFor="message">
            Správa
          </label>

          <textarea
            className="email-form__textarea"
            id="message"
            name="message"
            placeholder="Správa"
            value={emailData.message}
            onChange={handleChange}
          />
        </div>

        {emailType === "htmlWithAttachment" && (
          <EmailAttachments
            attachments={attachments}
            attachmentStatus={attachmentStatus}
            attachmentInputRef={attachmentInputRef}
            remainingAttachmentsSize={remainingAttachmentsSize}
            onAttachmentChange={handleAttachmentChange}
            onRemoveAttachment={handleRemoveAttachment}
          />
        )}
        <div className="email-form__actions">
          <button
            className="email-form__button"
            type="submit"
            disabled={isSending}
          >
            <span className="email-form__button-icon">➤</span>
            {isSending ? "Odosielanie..." : EMAIL_TITLE[emailType]}
          </button>

          <div className="email-form__email-info">
            <span className="email-form__email-info-icon">i</span>
            {EMAIL_TYPE_INFO[emailType]}
          </div>
        </div>
        {info && (
          <div className="email-form__attachment-status email-form__attachment-status--success">
            <span className="email-form__attachment-status-icon">✓</span>
            <span>{info}</span>
          </div>
        )}
        {error && (
          <div className="email-form__attachment-status email-form__attachment-status--error">
            <span className="email-form__attachment-status-icon">!</span>
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
