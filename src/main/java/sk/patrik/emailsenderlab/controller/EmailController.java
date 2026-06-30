package sk.patrik.emailsenderlab.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sk.patrik.emailsenderlab.dto.EmailRequest;
import sk.patrik.emailsenderlab.service.EmailService;

/**
 * Controller pre odosielanie emailov.
 * Zabezpečuje prijatie požiadavky na odoslanie emailu,
 * validáciu vstupných dát
 * a odovzdanie požiadavky do service vrstvy.
 */
@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Endpoint na odoslanie jednoduchého textového emailu.
    @PostMapping("/send")
    public ResponseEntity<String> sendTextEmail(@Valid @RequestBody EmailRequest emailRequest) {
        emailService.sendTextEmail(emailRequest);
        return ResponseEntity.ok("Email bol úspešne odoslaný.");
    }

    // Endpoint na odoslanie HTML emailu vytvoreného cez Thymeleaf šablónu.
    @PostMapping("/send-html")
    public ResponseEntity<String> sendHtmlEmail(@Valid @RequestBody EmailRequest emailRequest) {
        emailService.sendHtmlEmail(emailRequest);
        return ResponseEntity.ok("HTML email bol úspešne odoslaný.");
    }

    // Endpoint na odoslanie emailu s prílohou.
    @PostMapping("/send-attachment")
    public ResponseEntity<String> sendEmailWithAttachment(@Valid @RequestBody EmailRequest emailRequest) {
        emailService.sendEmailWithAttachment(emailRequest);
        return ResponseEntity.ok("Email s prílohou bol úspešne odoslaný.");
    }
}
