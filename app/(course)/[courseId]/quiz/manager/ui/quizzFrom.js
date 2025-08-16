"use client";
import React from "react";

export default function QuizForm({
  form,
  handleChange,
  handleSubmit,
  editingIndex,
  handleClear,
  article,
}) {
  return (
    <div className="quiz-form">
      <div className="form-group">
        <label>Tiêu đề bài đọc:</label>
        <input
          type="text"
          value={article.title}
          onChange={(e) => handleChange("article_title", e.target.value)}
          placeholder="Nhập tiêu đề bài đọc..."
        />
      </div>

      <div className="form-group">
        <label>Nội dung bài đọc:</label>
        <textarea
          rows="4"
          value={article.content}
          onChange={(e) => handleChange("article_content", e.target.value)}
          placeholder="Nhập nội dung bài đọc..."
        />
      </div>

      <div className="form-group">
        <label>Chủ đề:</label>
        <input
          type="text"
          value={article.subject}
          onChange={(e) => handleChange("article_subject", e.target.value)}
          placeholder="VD: Toán học, Khoa học..."
        />
      </div>

      <div className="form-group">
        <label>Độ khó:</label>
        <select
          value={article.difficulty}
          onChange={(e) => handleChange("article_difficulty", e.target.value)}
        >
          <option value="">-- Chọn độ khó --</option>
          <option value="dễ">Dễ</option>
          <option value="trung bình">Trung bình</option>
          <option value="khó">Khó</option>
        </select>
      </div>

      <hr />

      <h2 className="quiz-title">
        {editingIndex !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi ôn tập"}
      </h2>

      <div className="form-group">
        <label>Câu hỏi:</label>
        <textarea
          rows="3"
          value={form.question}
          onChange={(e) => handleChange("question", e.target.value)}
          placeholder="Nhập câu hỏi..."
        />
      </div>

      <div className="answers">
        {form.options.map((opt, idx) => (
          <div className="answer-input" key={idx}>
            <span className="option-label">{String.fromCharCode(65 + idx)}:</span>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleChange(`option_${idx}`, e.target.value)}
              placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Đáp án đúng:</label>
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
        <label>Giải thích:</label>
        <textarea
          rows="3"
          value={form.explanation}
          onChange={(e) => handleChange("explanation", e.target.value)}
          placeholder="Nhập giải thích nếu có"
        />
      </div>

      <div className="form-actions">
        <button className="btn primary" onClick={handleSubmit}>
          {editingIndex !== null ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
        </button>
        <button className="btn danger" onClick={handleClear}>
          Xóa tất cả câu hỏi
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
          font-size: 24px;
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
