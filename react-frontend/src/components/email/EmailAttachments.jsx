import { useEffect, useMemo } from "react";
import "./EmailAttachments.css";

export default function EmailAttachments({
  attachments,
  attachmentStatus,
  attachmentInputRef,
  remainingAttachmentsSize,
  onAttachmentChange,
  onRemoveAttachment,
}) {

  const imagePreviews = useMemo(() => {
    return attachments
      .filter((attachment) => attachment.type.startsWith("image/"))
      .map((attachment) => ({
        attachment,
        url: URL.createObjectURL(attachment),
      }));
  }, [attachments]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ url }) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  return (
    <div className="email-form__attachment">
      <div className="email-form__attachment-card">
        <div className="email-form__attachment-controls">
          <h3 className="email-form__attachment-title">Príloha</h3>

          <div className="email-form__attachment-upload">
            <input
              className="email-form__attachment-input"
              ref={attachmentInputRef}
              id="attachments"
              type="file"
              name="attachments"
              multiple
              onChange={onAttachmentChange}
            />

            <label
              className="email-form__attachment-button"
              htmlFor="attachments"
            >
              Vybrať súbory
            </label>

            <span className="email-form__attachment-file-info">
              {attachments.length === 0
                ? "Nie je vybraný žiadny súbor"
                : `Vybrané súbory: ${attachments.length}`}
            </span>
          </div>

          <small className="email-form__attachment-info">
            Maximálna celková veľkosť príloh je 25 MB. Zostáva{" "}
            {(remainingAttachmentsSize / (1024 * 1024)).toFixed(2)} MB.
          </small>

          {attachments.length > 0 && (
            <div className="email-form__attachment-list">
              {attachments.map((attachment, index) => (
                <div
                  className="email-form__attachment-selected"
                  key={`${attachment.name}-${index}`}
                >
                  <div className="email-form__attachment-details">
                    <strong
                      className="email-form__attachment-name"
                      title={attachment.name}
                    >
                      {attachment.name}
                    </strong>

                    <span className="email-form__attachment-size">
                      {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <button
                    className="email-form__attachment-remove"
                    type="button"
                    onClick={() => onRemoveAttachment(index)}
                    aria-label="Zrušiť výber prílohy"
                    title="Zrušiť výber prílohy"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {attachmentStatus === "success" && (
            <div className="email-form__attachment-status email-form__attachment-status--success">
              <span className="email-form__attachment-status-icon">✓</span>
              <span>Príloha bola úspešne načítaná.</span>
            </div>
          )}

          {attachmentStatus === "error" && (
            <div className="email-form__attachment-status email-form__attachment-status--error">
              <span className="email-form__attachment-status-icon">!</span>

              <span>
                Celková veľkosť príloh prekračuje maximálny limit 25 MB.
              </span>
            </div>
          )}
        </div>

        <div className="email-form__attachment-preview">
          <h3 className="email-form__attachment-title">Náhľad obrázkov</h3>

          <div className="email-form__attachment-preview-content">
            {imagePreviews.length > 0 ? (
              <div className="email-form__attachment-preview-list">
                {imagePreviews.map(({ attachment, url }, index) => (
                  <img
                    key={`${attachment.name}-${index}`}
                    className="email-form__attachment-preview-image"
                    src={url}
                    alt={`Náhľad prílohy ${attachment.name}`}
                  />
                ))}
              </div>
            ) : (
              <p className="email-form__attachment-preview-placeholder">
                Medzi vybranými prílohami nie je žiadny obrázok na zobrazenie.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
