import { useState } from "react";
import {
  sendTextEmail,
  sendHtmlEmail,
  sendHtmlEmailWithAttachment,
} from "../../api/emailApi";

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

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setEmailData({
      ...emailData,
      [name]: value,
    });
  }

  function handleAttachmentChange(event) {
    const selectedFile = event.target.files[0];

    setAttachment(selectedFile || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setInfo("");
    setError("");

    try {
      if (emailType === "text") {
        const responseMessage = await sendTextEmail(emailData);
        setInfo(responseMessage);
      } else if (emailType === "html") {
        const responseMessage = await sendHtmlEmail(emailData);
        setInfo(responseMessage);
      } else if (emailType === "htmlWithAttachment") {
        const responseMessage = await sendHtmlEmailWithAttachment(
          emailData,
          attachment
        );
        setInfo(responseMessage);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>{emailTitle[emailType]}</h2>

      <form onSubmit={handleSubmit}>
        <input
          style={{ marginRight: "20px" }}
          type="email"
          name="to"
          placeholder="Príjemca"
          value={emailData.to}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder="Predmet"
          value={emailData.subject}
          onChange={handleChange}
          style={{ marginRight: "20px" }}
        />

        <textarea
          name="message"
          placeholder="Správa"
          value={emailData.message}
          onChange={handleChange}
          style={{ marginRight: "20px" }}
        />

        {emailType === "htmlWithAttachment" && (
          <input
            type="file"
            name="attachment"
            onChange={handleAttachmentChange}
            style={{ marginRight: "20px" }}
          />
        )}

        <button style={{ marginRight: "15px" }} type="submit">
          {emailTitle[emailType]}
        </button>

        {info && <p>{info}</p>}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
