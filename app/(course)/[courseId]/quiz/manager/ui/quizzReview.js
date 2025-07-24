import React from "react";

export default function QuizPreview({
  quizList,
  handleEdit,
  handleDelete,
  menuIndex,
  setMenuIndex,
}) {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="quiz-preview">
      <h3>Danh sách câu hỏi đã tạo:</h3>
      {quizList.length === 0 && <p>Chưa có câu hỏi nào.</p>}
      {quizList.map((q, idx) => (
        <div key={idx} className="quiz-item">
          <div className="quiz-header">
            <b>
              Câu {idx + 1}: {q.question}
            </b>
            <div className="menu-container">
              <button
                className="menu-button"
                onClick={() => setMenuIndex(menuIndex === idx ? null : idx)}
              >
                &#x22EE;
              </button>
              {menuIndex === idx && (
                <div className="dropdown-menu">
                  <button onClick={() => handleEdit(idx)}>Sửa</button>
                  <button onClick={() => handleDelete(idx)}>Xóa</button>
                </div>
              )}
            </div>
          </div>

          <div className="options-grid">
            {q.options.map((opt, i) => {
              const isCorrect = opt.startsWith(q.answer);
              return (
                <div
                  key={i}
                  className={`option-item ${isCorrect ? "correct" : ""}`}
                >
                  <strong>{optionLabels[i]})</strong> {opt.slice(2)}
                </div>
              );
            })}
          </div>

          <i>Giải thích: {q.explanation}</i>
        </div>
      ))}

      <style>{`
        .quiz-preview {
          flex: 1;
          max-height: 1000px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .quiz-preview h3 {
          margin-bottom: 16px;
          color: black;
        }

        .quiz-item {
          background: #fff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          border-left: 4px solid #1976d2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-container {
          position: relative;
        }

        .menu-button {
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
        }

        .dropdown-menu {
          position: absolute;
          top: 24px;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 10;
          min-width: 100px;
        }

        .dropdown-menu button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 22px;
        }

        .dropdown-menu button:hover {
          background: #f5f5f5;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin: 12px 0;
        }

        .option-item {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #f9f9f9;
        }

        .option-item.correct {
          background-color: #e0f7e9;
          border-color: #4caf50;
          font-weight: bold;
        }

        .quiz-item i {
          display: block;
          margin-top: 8px;
          color: #666;
          font-style: italic;
        }

        @media (max-width: 600px) {
          .options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
