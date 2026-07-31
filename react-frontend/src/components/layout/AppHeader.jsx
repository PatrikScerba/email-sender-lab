import "./AppHeader.css";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <div className="app-header__icon">
          ✉
        </div>

        <div className="app-header__text">
          <h1>
            Email Sender <span>Lab</span>
          </h1>

          <p>Mini projekt na odosielanie emailov</p>
        </div>
      </div>

      <div className="app-header__project">
        <h2>Gym Management System</h2>
        <span>Email Module</span>
      </div>
    </header>
  );
}