import { apiFetch } from "./api";

export async function sendTextEmail(emailData) {
  return apiFetch("/api/emails/send", {
    method: "POST",
    body: JSON.stringify(emailData),
  });
}
