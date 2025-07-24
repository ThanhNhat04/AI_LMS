import React from "react";

export default function QuizMeta({
  quizTitle,
  quizDescription,
  setQuizTitle,
  setQuizDescription,
  handleStart,
}) {
  return (
    <div className="quiz-meta">
      <h2>Bắt đầu tạo Quiz</h2>
      <div className="form-group">
        <label>Tên Quiz:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Nhập tên quiz"
        />
      </div>
      <div className="form-group">
        <label>Mô tả:</label>
        <textarea
          rows={2}
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          placeholder="Nhập mô tả quiz"
        />
      </div>
      <button className="btn" onClick={handleStart}>
        Bắt đầu tạo câu hỏi
      </button>

      <style>{`
 .quiz-meta {
  max-width: 600px;
  margin: 0 auto;
  background: #e3f2fd;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.quiz-meta h2 {
  text-align: center;
  color: #1976d2;
  margin-bottom: 24px;
}

.quiz-meta .form-group {
  margin-bottom: 16px;
}

.quiz-meta input,
.quiz-meta textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
}

.quiz-meta label {
  font-weight: bold;
  margin-bottom: 6px;
  display: block;
}

.quiz-meta .btn {
  width: 100%;
  background: #1976d2;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.quiz-meta .btn:hover {
  background: #115293;
}

`}</style>
    </div>
  );
}
