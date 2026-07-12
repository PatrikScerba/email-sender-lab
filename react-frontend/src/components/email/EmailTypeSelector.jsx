export default function EmailTypeSelector({ emailType, setEmailType }) {
  return (
    <div>
      <button onClick={() => setEmailType("text")}>Textový email</button>
       <button onClick={() => setEmailType("html")}>HTML email</button>
      </div>
  );
}

