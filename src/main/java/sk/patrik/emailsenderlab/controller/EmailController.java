package sk.patrik.emailsenderlab.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
