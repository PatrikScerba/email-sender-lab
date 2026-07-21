package sk.patrik.emailsenderlab.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.spring6.SpringTemplateEngine;
import sk.patrik.emailsenderlab.dto.EmailRequest;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;

/**
 * Servisná implementácia zodpovedná za odosielanie emailov.
 * Táto trieda používa Spring komponent JavaMailSender, ktorý zabezpečuje
 * samotné odoslanie emailovej správy cez nakonfigurovaný SMTP server.
 * Pri HTML emailoch vytvára MIME správu, ktorá podporuje HTML obsah,
 * vložené obrázky a prílohy.
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final String SENDER_NAME = "Gym Management System";
    private final JavaMailSender javaMailSender;

    // SpringTemplateEngine sa používa na generovanie HTML obsahu emailu z Thymeleaf šablóny.
    private final SpringTemplateEngine templateEngine;

    // Emailová adresa odosielateľa načítaná z konfigurácie aplikácie.
    @Value("${spring.mail.username}")
    private String fromEmail;

    // Konštruktor vloží komponenty potrebné pre odosielanie emailov a HTML šablón.
    public EmailServiceImpl(JavaMailSender javaMailSender,
                            SpringTemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    // Metóda vytvorí jednoduchú textovú emailovú správu a odošle ju cez JavaMailSender.
    @Override
    public void sendTextEmail(EmailRequest emailRequest) {

        // Vytvorenie emailovej správy.
        SimpleMailMessage emailMessage = new SimpleMailMessage();

        // Nastavenie základných údajov emailu.
        emailMessage.setFrom(fromEmail);
        emailMessage.setTo(emailRequest.getTo());
        emailMessage.setSubject(emailRequest.getSubject());
        emailMessage.setText(emailRequest.getMessage());

        // Odoslanie emailu cez nakonfigurovaný SMTP server.
        javaMailSender.send(emailMessage);
    }

    // Metóda vytvorí HTML emailovú správu z Thymeleaf šablóny a odošle ju cez JavaMailSender.
    @Override
    public void sendHtmlEmail(EmailRequest emailRequest) {
        sendHtmlEmailInternal(
                emailRequest,
                "email/notification-email",
                null,
                null,
                "Nepodarilo sa odoslať HTML email."
        );
    }

    // Metóda pripraví voliteľnú prílohu a odošle HTML email.
    @Override
    public void sendEmailWithAttachment(
            EmailRequest emailRequest,
            MultipartFile attachment
    ) {
        String attachmentName = null;
        InputStreamSource attachmentSource = null;

        if (attachment != null && !attachment.isEmpty()) {
            attachmentName = attachment.getOriginalFilename();
            attachmentSource = attachment;
        }

        sendHtmlEmailInternal(
                emailRequest,
                "email/attachment-email",
                attachmentName,
                attachmentSource,
                "Nepodarilo sa odoslať email s prílohou."
        );
    }

    // Interná metóda spracováva spoločnú logiku odosielania HTML emailov s voliteľnou prílohou.
    private void sendHtmlEmailInternal(
            EmailRequest emailRequest,
            String templateName,
            String attachmentName,
            InputStreamSource attachment,
            String errorMessage
    ) {

        boolean hasAttachment =
                attachment != null && attachmentName != null;
        try {
            Context context = new Context();
            context.setVariable("message", emailRequest.getMessage());
            context.setVariable("hasAttachment", hasAttachment);

            String htmlContent = templateEngine.process(templateName, context);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true, "UTF-8");

            ClassPathResource logo =
                    new ClassPathResource("static/images/email-logo.png");

            helper.setFrom(fromEmail, SENDER_NAME);
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());
            helper.setText(htmlContent, true);
            helper.addInline("logo", logo);

            if (hasAttachment) {
                helper.addAttachment(attachmentName, attachment);
            }

            javaMailSender.send(mimeMessage);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(errorMessage, e);
        }
    }
}

