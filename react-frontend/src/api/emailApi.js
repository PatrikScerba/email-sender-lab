import { apiFetch } from "./api";

export async function sendTextEmail(emailData) {
  return apiFetch("/api/emails/send", {
    method: "POST",
    body: JSON.stringify(emailData),
  });
}

export async function sendHtmlEmail(emailData) {
  return apiFetch("/api/emails/send-html", {
    method: "POST",
    body: JSON.stringify(emailData),
  });
}

export async function sendHtmlEmailWithAttachment(emailData, attachment) {
  const formData = new FormData();

  formData.append(
    "emailData",
    new Blob([JSON.stringify(emailData)], {
      type: "application/json",
    })
  );

  if (attachment) {
    formData.append("attachment", attachment);
  }

  return apiFetch("/api/emails/send-attachment", {
    method: "POST",
    body: formData,
  });
}
