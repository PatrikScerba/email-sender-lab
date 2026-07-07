export default function EmailTypeSelector({ emailType, setEmailType }) {
  return (
    <div>
      <button onClick={() => setEmailType("text")}>Textový email</button>
      </div>
  );
}

