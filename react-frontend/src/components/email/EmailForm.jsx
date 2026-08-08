import { useRef, useState } from "react";
import {
  sendTextEmail,
  sendHtmlEmail,
  sendHtmlEmailWithAttachment,
} from "../../api/emailApi";
import "./EmailForm.css";

export default function EmailForm({ emailType }) {
  const emailTitle = {
    text: "Odoslať textový email",
    html: "Odoslať HTML email",
    htmlWithAttachment: "Odoslať HTML email s prílohou",
  };

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const MAX_ATTACHMENT_SIZE = 15 * 1024 * 1024;

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

  function handleRemoveAttachment() {
    setAttachment(null);
    setAttachmentPreview(null);
    setAttachmentStatus("");
    setError("");

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  function handleAttachmentChange(event) {
    const selectedFile = event.target.files[0];

    setError("");
    setAttachmentStatus("");

    if (selectedFile && selectedFile.size > MAX_ATTACHMENT_SIZE) {
      setAttachment(null);
      setAttachmentPreview(null);
      event.target.value = "";

      setAttachmentStatus("error");

      return;
    }

    setAttachment(selectedFile || null);

    if (selectedFile) {
      setAttachmentStatus("success");
    }

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setAttachmentPreview(URL.createObjectURL(selectedFile));
    } else {
      setAttachmentPreview(null);
    }
  }
  function resetForm() {
    setEmailData({
      to: "",
      subject: "",
      message: "",
    });
    setAttachment(null);
    setAttachmentPreview(null);
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
        if (!attachment) {
          setError("Vyberte prílohu.");
          return;
        }

        if (attachment.size > MAX_ATTACHMENT_SIZE) {
          setError("Príloha nemôže byť väčšia ako 15 MB.");
          return;
        }

        responseMessage = await sendHtmlEmailWithAttachment(
          emailData,
          attachment
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

  return (
    <div className="email-form">
      <h2 className="email-form__title">{emailTitle[emailType]}</h2>

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
          <div className="email-form__attachment">
            <div className="email-form__attachment-card">
              <div className="email-form__attachment-controls">
                <h3 className="email-form__attachment-title">Príloha</h3>
                <input
                  className="email-form__attachment-input"
                  ref={attachmentInputRef}
                  id="attachment"
                  type="file"
                  name="attachment"
                  onChange={handleAttachmentChange}
                />

                <small className="email-form__attachment-info">
                  Maximálna veľkosť prílohy je 15 MB.
                </small>

                {attachment && (
                  <div className="email-form__attachment-selected">
                    <div className="email-form__attachment-details">
                      <strong className="email-form__attachment-name">
                        {attachment.name}
                      </strong>
                      <span className="email-form__attachment-size">
                        {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>

                    <button
                      className="email-form__attachment-remove"

                      type="button"
                      onClick={handleRemoveAttachment}
                      aria-label="Zrušiť výber prílohy"
                      title="Zrušiť výber prílohy"
                    >
                      ×
                    </button>
                  </div>
                )}

                {attachmentStatus === "success" && (
                  <div className="email-form__attachment-status email-form__attachment-status--success">
                    <span className="email-form__attachment-status-icon">
                      ✓
                    </span>

                    <span>Príloha bola úspešne načítaná.</span>
                  </div>
                )}

                {attachmentStatus === "error" && (
                  <div className="email-form__attachment-status email-form__attachment-status--error">
                    <span className="email-form__attachment-status-icon">
                      !
                    </span>

                    <span>Príloha prekračuje maximálnu veľkosť 15 MB.</span>
                  </div>
                )}
              </div>

              <div className="email-form__attachment-preview">
                <h3 className="email-form__attachment-title">Náhľad prílohy</h3>

                <div className="email-form__attachment-preview-content">
                  {attachmentPreview ? (
                    <img
                      className="email-form__attachment-preview-image"
                      src={attachmentPreview}
                      alt="Náhľad vybranej prílohy"
                    />
                  ) : (
                    <p className="email-form__attachment-preview-placeholder">
                      Náhľad prílohy sa zobrazí po výbere.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          className="email-form__button"
          type="submit"
          disabled={isSending}
        >
          {isSending ? "Odosielanie..." : emailTitle[emailType]}
        </button>

        {info && <p>{info}</p>}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
