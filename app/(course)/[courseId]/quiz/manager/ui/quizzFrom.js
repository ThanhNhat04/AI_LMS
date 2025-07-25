import React from "react";

export default function QuizForm({
  form,
  handleChange,
  handleSubmit,
  editingIndex,
  handleClear,
  quizTitle,
  setQuizTitle,
  quizDescription,
  setQuizDescription,
}) {
  return (
    <div className="quiz-form">
      <h1 className="quiz-title">Thêm câu hỏi trắc nghiệm</h1>

      <div className="form-group">
        <label>Tên bài trắc nghiệm:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Nhập tên bài trắc nghiệm..."
        />
      </div>

      <div className="form-group">
        <label>Mô tả bài trắc nghiệm:</label>
        <textarea
          rows="2"
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          placeholder=""
        />
      </div>

      <hr />

      <div className="form-group">
        <label>Nhập nội dung câu hỏi:</label>
        <textarea
          rows="2"
          value={form.question}
          onChange={(e) => handleChange("question", e.target.value)}
          placeholder="Nhập câu hỏi tại đây..."
        />
      </div>

      <div className="flex-row answers">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="answer-input">
            <span className="option-label">{String.fromCharCode(65 + i)})</span>
            <input
              type="text"
              value={form.options[i]}
              onChange={(e) => handleChange(`option_${i}`, e.target.value)}
              placeholder={`Nhập đáp án ${String.fromCharCode(65 + i)}...`}
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Chọn đáp án đúng:</label>
        <select
          value={form.answer}
          onChange={(e) => handleChange("answer", e.target.value)}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div className="form-group">
        <label>Giải thích đáp án:</label>
        <textarea
          rows="2"
          value={form.explanation}
          onChange={(e) => handleChange("explanation", e.target.value)}
          placeholder="Nhập giải thích nếu có..."
        />
      </div>

      <div className="form-actions">
        <button className="btn primary" onClick={handleSubmit}>
          {editingIndex !== null ? "Lưu chỉnh sửa" : "Thêm câu hỏi"}
        </button>
        <button className="btn danger" onClick={handleClear}>
          Xoá toàn bộ
        </button>
      </div>

      <style>{`
        .quiz-form {
          max-width: 800px;
          margin: 0 auto;
          font-family: sans-serif;
          color: #000;
        }

        .quiz-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 24px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          font-weight: bold;
          margin-bottom: 6px;
          display: block;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 10px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #1976d2;
          outline: none;
        }

        .answers {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .answer-input {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1 1 45%;
        }

        .option-label {
          font-weight: bold;
          font-size: 16px;
        }

        .form-actions {
          margin-top: 20px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          margin-right: 12px;
        }

        .btn.primary {
          background: #1976d2;
          color: white;
        }

        .btn.danger {
          background: #d32f2f;
          color: white;
        }

        hr {
          margin: 24px 0;
          border-top: 1px solid #ccc;
        }

        @media (max-width: 768px) {
          .answers {
            flex-direction: column;
          }

          .answer-input {
            flex: 1 1 100%;
          }

          .btn {
            width: 100%;
            margin-bottom: 12px;
          }

          .form-actions {
            display: flex;
            flex-direction: column;
          }
        }
          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            box-sizing: border-box;
          }
      `}</style>
    </div>
  );
}
