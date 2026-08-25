package sk.patrik.emailsenderlab.service;

import org.springframework.web.multipart.MultipartFile;
import sk.patrik.emailsenderlab.dto.EmailRequest;

import java.util.List;

/**
 * Definuje základné operácie pre odosielanie emailov.
 */
public interface EmailService {

    // Odošle jednoduchý textový email.
    void sendTextEmail(EmailRequest emailRequest);

    // Odošle HTML email.
    void sendHtmlEmail(EmailRequest emailRequest);

    // Odošle email s prílohami.
    void sendEmailWithAttachments(EmailRequest emailRequest, List<MultipartFile> attachments);
}
