package sk.patrik.emailsenderlab.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO trieda, ktorá predstavuje požiadavku na odoslanie emailu.
 *
 * Obsahuje základné údaje potrebné pre odoslanie emailu:
 * príjemcu, predmet a voliteľnú správu.
 */
public class EmailRequest {

    @NotBlank(message = "Email príjemcu nesmie byť prázdny.")
    @Email(message = "Email príjemcu musí mať platný formát.")
    private String to;

    @NotBlank(message = "Predmet emailu nesmie byť prázdny.")
    private String subject;

    private String message;

    public String getTo() {
        return to;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }
}

