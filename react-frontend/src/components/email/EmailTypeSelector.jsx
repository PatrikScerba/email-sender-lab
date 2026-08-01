import "./EmailTypeSelector.css";

export default function EmailTypeSelector({ emailType, setEmailType }) {
  return (
    <div className="email-type-selector">
      <button
        type="button"
        className={
          emailType === "text"
            ? "email-type-selector__button email-type-selector__button--active"
            : "email-type-selector__button"
        }
        onClick={() => setEmailType("text")}
      >
        Textový email
      </button>

      <button
        type="button"
        className={
          emailType === "html"
            ? "email-type-selector__button email-type-selector__button--active"
            : "email-type-selector__button"
        }
        onClick={() => setEmailType("html")}
      >
        HTML email
      </button>

      <button
        type="button"
        className={
          emailType === "htmlWithAttachment"
            ? "email-type-selector__button email-type-selector__button--active"
            : "email-type-selector__button"
        }
        onClick={() => setEmailType("htmlWithAttachment")}
      >
        HTML email s prílohou
      </button>
    </div>
  );
}
