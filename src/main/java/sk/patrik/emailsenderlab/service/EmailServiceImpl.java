package sk.patrik.emailsenderlab.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import sk.patrik.emailsenderlab.dto.EmailRequest;

/**
 * Servisná implementácia zodpovedná za odosielanie emailov.
 * Táto trieda používa Spring komponent JavaMailSender, ktorý zabezpečuje
 * samotné odoslanie emailovej správy cez nakonfigurovaný SMTP server.
 */
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    // Emailová adresa odosielateľa načítaná z konfigurácie aplikácie.
    @Value("${spring.mail.username}")
    private String fromEmail;

    // Konštruktor vloží JavaMailSender pripravený podľa SMTP konfigurácie.
    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
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
}
