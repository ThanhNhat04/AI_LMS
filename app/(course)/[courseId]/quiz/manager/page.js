"use client";
import React, { useState, useEffect } from "react";

export default function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  const [quizList, setQuizList] = useState([]);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "A",
    explanation: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("custom_quiz");
    if (stored) setQuizList(JSON.parse(stored));

    const storedTitle = localStorage.getItem("quiz_title");
    const storedDesc = localStorage.getItem("quiz_description");
    if (storedTitle) setQuizTitle(storedTitle);
    if (storedDesc) setQuizDescription(storedDesc);

    if (storedTitle) setIsStarted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("custom_quiz", JSON.stringify(quizList));
  }, [quizList]);

  const handleChange = (field, value) => {
    if (field.startsWith("option")) {
      const index = parseInt(field.split("_")[1]);
      const updatedOptions = [...form.options];
      updatedOptions[index] = value;
      setForm({ ...form, options: updatedOptions });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleSubmit = () => {
    if (!form.question || form.options.some((opt) => opt === "") || !form.explanation) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const newQuiz = {
      question: form.question,
      options: form.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`),
      answer: form.answer,
      explanation: form.explanation,
    };
    setQuizList([...quizList, newQuiz]);
    setForm({
      question: "",
      options: ["", "", "", ""],
      answer: "A",
      explanation: "",
    });
  };

  const handleClear = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ câu hỏi đã tạo?")) {
      localStorage.removeItem("custom_quiz");
      setQuizList([]);
    }
  };

  const handleStart = () => {
    if (!quizTitle.trim()) {
      alert("Vui lòng nhập tên quiz!");
      return;
    }
    localStorage.setItem("quiz_title", quizTitle);
    localStorage.setItem("quiz_description", quizDescription);
    setIsStarted(true);
  };

  return (
    <div className="quiz-container">
      {!isStarted ? (
        <div className="quiz-meta">
          <h2>🎯 Bắt đầu tạo Quiz</h2>
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
            🚀 Bắt đầu tạo câu hỏi
          </button>
        </div>
      ) : (
        <>
          <h2>🛠️ Tạo Quizz: {quizTitle}</h2>
          <div className="quiz-layout">
            {/* Bên trái: form + thông tin quiz */}
            <div className="quiz-form">
              <div className="quiz-info-box">
                <h3>📘 Tên Quiz: {quizTitle}</h3>
                <p><i>{quizDescription}</i></p>
              </div>

              <div className="form-group">
                <label>Câu hỏi:</label>
                <textarea
                  rows="2"
                  value={form.question}
                  onChange={(e) => handleChange("question", e.target.value)}
                />
              </div>

              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="form-group">
                  <label>Đáp án {String.fromCharCode(65 + i)}:</label>
                  <input
                    type="text"
                    value={form.options[i]}
                    onChange={(e) => handleChange(`option_${i}`, e.target.value)}
                  />
                </div>
              ))}

              <div className="form-group">
                <label>Đáp án đúng (A/B/C/D):</label>
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
                  rows="2"
                  value={form.explanation}
                  onChange={(e) => handleChange("explanation", e.target.value)}
                />
              </div>

              <button className="btn" onClick={handleSubmit}>
                ➕ Thêm câu hỏi
              </button>
              <button className="btn clear" onClick={handleClear}>
                🗑️ Xóa toàn bộ
              </button>
            </div>

            {/* Bên phải: danh sách quiz */}
            <div className="quiz-preview">
              <h3>📚 Câu hỏi đã tạo:</h3>
              {quizList.length === 0 && <p>Chưa có câu hỏi nào.</p>}
              {quizList.map((q, idx) => (
                <div key={idx} className="quiz-item">
                  <b>{idx + 1}. {q.question}</b>
                  <ul>
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        style={{ color: opt.startsWith(q.answer) ? "green" : "black" }}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <i>Giải thích: {q.explanation}</i>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        .quiz-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 24px;
          background: #f0f8ff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          font-family: sans-serif;
        }
        h2 {
          text-align: center;
          color: #1976d2;
        }
        .quiz-layout {
          display: flex;
          flex-direction: row;
          gap: 32px;
          margin-top: 24px;
        }
        .quiz-form {
          flex: 1;
        }
        .quiz-preview {
          flex: 1;
          max-height: 700px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        label {
          font-weight: bold;
          display: block;
          margin-bottom: 6px;
        }
        input, textarea, select {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .btn {
          margin: 10px 10px 0 0;
          padding: 10px 20px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn.clear {
          background: #d32f2f;
        }
        .quiz-item {
          background: #fff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          border-left: 4px solid #1976d2;
        }
        ul {
          padding-left: 20px;
        }
        .quiz-meta {
          max-width: 600px;
          margin: 0 auto;
        }
        .quiz-info-box {
          background: #e3f2fd;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .quiz-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
