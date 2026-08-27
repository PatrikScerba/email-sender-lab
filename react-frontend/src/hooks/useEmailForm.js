import { useRef, useState } from "react";
import {
  sendTextEmail,
  sendHtmlEmail,
  sendHtmlEmailWithAttachment,
} from "../api/emailApi";

const MAX_ATTACHMENTS_SIZE = 25 * 1024 * 1024;

export default function useEmailForm(emailType) {
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

    setError("");
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

  return {
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
  };
}
