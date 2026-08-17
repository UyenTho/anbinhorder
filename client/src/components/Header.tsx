import "./Header.css";

export function Header({
  tableId,
  onExit,
}: {
  tableId: number;
  onExit?: () => void;
}) {
  return (
    <header className="ab-header">
      <div className="ab-header__wordmark">
        <span className="ab-header__eyebrow">Vườn Sinh Thái</span>
        <h1>An Bình</h1>
      </div>
      <div className="ab-header__right">
        {onExit && (
          <button className="ab-header__exit" onClick={onExit} aria-label="Thoát">
            Thoát
          </button>
        )}
        <div className="ab-header__table">
          <span className="ab-header__table-label">Bàn</span>
          <span className="ab-header__table-number">{tableId}</span>
        </div>
      </div>
    </header>
  );
}
