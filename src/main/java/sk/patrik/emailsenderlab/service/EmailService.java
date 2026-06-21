package sk.patrik.emailsenderlab.service;

import sk.patrik.emailsenderlab.dto.EmailRequest;

/**
 * Definuje základné operácie pre odosielanie emailov.
 */
public interface EmailService {

    // Odošle jednoduchý textový email.
    void sendTextEmail(EmailRequest emailRequest);

    // Odošle HTML email.
    void sendHtmlEmail(EmailRequest emailRequest);
}
