package sk.patrik.emailsenderlab.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import sk.patrik.emailsenderlab.dto.EmailRequest;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;

/**
 * Servisná implementácia zodpovedná za odosielanie emailov.
 * Táto trieda používa Spring komponent JavaMailSender, ktorý zabezpečuje
 * samotné odoslanie emailovej správy cez nakonfigurovaný SMTP server.
 * Pri HTML emailoch vytvára MIME správu, aby bolo možné odoslať email s HTML obsahom.
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
        try {

            // Odovzdanie dynamických údajov do Thymeleaf šablóny.
            Context context = new Context();
            context.setVariable("message", emailRequest.getMessage());

            // Vygenerovanie výsledného HTML obsahu zo šablóny.
            String htmlContent = templateEngine.process("email/notification-email", context);

            // Vytvorenie MIME správy pre HTML email.
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            // Pomocná trieda na jednoduchšie nastavenie MIME emailu, vrátane HTML obsahu a kódovania UTF-8.
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Pridanie loga ako inline obrázku do emailu.
            ClassPathResource logo = new ClassPathResource("static/images/email-logo.png");

            helper.setFrom(fromEmail, SENDER_NAME);
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());
            helper.setText(htmlContent, true);
            helper.addInline("logo", logo);

            // Odoslanie emailu cez nakonfigurovaný SMTP server.
            javaMailSender.send(mimeMessage);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Nepodarilo sa odoslať HTML email.", e);
        }
    }

    // Metóda vytvorí emailovú správu s prílohou a odošle ju cez JavaMailSender.
    @Override
    public void sendEmailWithAttachment(EmailRequest emailRequest) {
        try {
            Context context = new Context();
            context.setVariable("message", emailRequest.getMessage());

            String htmlContent = templateEngine.process("email/attachment-email", context);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true, "UTF-8");


            ClassPathResource logo = new ClassPathResource("static/images/email-logo.png");

            // Statická príloha načítaná z resources/static/images.
            ClassPathResource  attachment = new ClassPathResource("static/images/EFK3.png");

            helper.setFrom(fromEmail, SENDER_NAME);
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());
            helper.setText(htmlContent, true);
            helper.addInline("logo", logo);
            helper.addAttachment("EFK3.png", attachment);

            javaMailSender.send(mimeMessage);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Nepodarilo sa odoslať email s prílohou.", e);
        }
    }
}
