import { useRef, useState } from "react";
import {
  sendTextEmail,
  sendHtmlEmail,
  sendHtmlEmailWithAttachment,
} from "../../api/emailApi";
import "./EmailForm.css";
import EmailAttachments from "./EmailAttachments";

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
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [attachments, setAttachments] = useState([]);

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const [isSending, setIsSending] = useState(false);
  const attachmentInputRef = useRef(null);
  const [attachmentStatus, setAttachmentStatus] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setEmailData({
      ...emailData,
      [name]: value,
    });
  }

  function handleRemoveAttachment(indexToRemove) {
    setAttachments((currentAttachments) =>
      currentAttachments.filter((_, index) => index !== indexToRemove)
    );

    setAttachmentStatus("");
    setError("");

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  function handleAttachmentChange(event) {
    const selectedFiles = Array.from(event.target.files);

    setError("");
    setAttachmentStatus("");

    const currentSize = attachments.reduce((sum, file) => sum + file.size, 0);

    const selectedSize = selectedFiles.reduce(
      (sum, file) => sum + file.size,
      0
    );

    const totalSize = currentSize + selectedSize;

    if (totalSize > MAX_ATTACHMENTS_SIZE) {
      event.target.value = "";
      setAttachmentStatus("error");

      return;
    }

    setAttachments((currentAttachments) => [
      ...currentAttachments,
      ...selectedFiles,
    ]);

    if (selectedFiles.length > 0) {
      setAttachmentStatus("success");
    }

    event.target.value = "";
  }
  function resetForm() {
    setEmailData({
      to: "",
      subject: "",
      message: "",
    });
    setAttachments([]);
    setAttachmentStatus("");

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setInfo("");
    setError("");

    if (
      !emailData.to.trim() ||
      !emailData.subject.trim() ||
      !emailData.message.trim()
    ) {
      setError("Vyplňte príjemcu, predmet a správu.");
      return;
    }
    setIsSending(true);

    try {
      let responseMessage;

      if (emailType === "text") {
        responseMessage = await sendTextEmail(emailData);
      } else if (emailType === "html") {
        responseMessage = await sendHtmlEmail(emailData);
      } else if (emailType === "htmlWithAttachment") {
        if (attachments.length === 0) {
          setError("Vyberte aspoň jednu prílohu.");
          return;
        }

        const totalSize = attachments.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > MAX_ATTACHMENTS_SIZE) {
          setError("Celková veľkosť príloh nemôže byť väčšia ako 25 MB.");
          return;
        }

        responseMessage = await sendHtmlEmailWithAttachment(
          emailData,
          attachments
        );
      }
      setInfo(responseMessage);
      resetForm();

      setTimeout(() => {
        setInfo("");
      }, 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  }

  const totalAttachmentsSize = attachments.reduce(
    (sum, file) => sum + file.size,
    0
  );

  const remainingAttachmentsSize = MAX_ATTACHMENTS_SIZE - totalAttachmentsSize;

  const imageAttachments = attachments.filter((attachment) =>
    attachment.type.startsWith("image/")
  );

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
            imageAttachments={imageAttachments}
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
        {info && <p>{info}</p>}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
