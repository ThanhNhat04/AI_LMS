'use client';
import React, { useState } from 'react';

// Dữ liệu mẫu lấy từ mock_data.txt
const quizData = [
  {
    question: "Theo Định Luật Thứ Nhất của Newton, điều gì xảy ra với một vật đang chuyển động khi không có lực bên ngoài tác dụng?",
    options: [
      "A) Nó sẽ dần dần chậm lại và dừng",
      "B) Nó sẽ tiếp tục chuyển động với vận tốc không đổi",
      "C) Nó sẽ tăng tốc",
      "D) Nó sẽ thay đổi hướng"
    ],
    answer: "B",
    explanation: "Định Luật Thứ Nhất của Newton nói rằng một vật đang chuyển động sẽ tiếp tục chuyển động với cùng tốc độ và hướng trừ khi có lực không cân bằng tác dụng."
  },
  {
    question: "Nếu một vật 10 kg chịu tác dụng của lực tổng hợp 50 N, gia tốc của nó là bao nhiêu?",
    options: [
      "A) 5 m/s²",
      "B) 0,2 m/s²",
      "C) 500 m/s²",
      "D) 60 m/s²"
    ],
    answer: "A",
    explanation: "Sử dụng công thức F = ma, ta có a = F/m = 50N / 10kg = 5 m/s²"
  },
  {
    question: "Định Luật Thứ Ba của Newton phát biểu rằng:",
    options: [
      "A) Lực bằng khối lượng nhân với gia tốc",
      "B) Vật đứng yên sẽ tiếp tục đứng yên",
      "C) Với mỗi tác dụng, có một phản tác dụng bằng và ngược chiều",
      "D) Gia tốc tỉ lệ thuận với lực"
    ],
    answer: "C",
    explanation: "Định Luật Thứ Ba của Newton cụ thể nói rằng với mỗi tác dụng, có một phản tác dụng bằng và ngược chiều."
  },
  // ...Thêm các câu hỏi khác tương tự...
];

export default function QuizPage() {
  const [selected, setSelected] = useState(Array(quizData.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qIdx, oIdx) => {
    const newSelected = [...selected];
    newSelected[qIdx] = oIdx;
    setSelected(newSelected);
  };

  const handleSubmit = () => setShowResult(true);

  const score = selected.reduce(
    (acc, val, idx) =>
      acc + (quizData[idx].options[val]?.startsWith(quizData[idx].answer) ? 1 : 0),
    0
  );

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Quizz: Các Định Luật Newton về Chuyển Động</h2>
      {quizData.map((q, idx) => (
        <div key={idx} className="quiz-question">
          <div className="question">{idx + 1}. {q.question}</div>
          <div className="options">
            {q.options.map((opt, oIdx) => (
              <label key={oIdx} className={`option ${selected[idx] === oIdx ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  checked={selected[idx] === oIdx}
                  onChange={() => handleSelect(idx, oIdx)}
                  disabled={showResult}
                />
                {opt}
              </label>
            ))}
          </div>
          {showResult && (
            <div className={`explanation ${quizData[idx].options[selected[idx]]?.startsWith(q.answer) ? 'correct' : 'incorrect'}`}>
              <b>Kết quả: {quizData[idx].options[selected[idx]]?.startsWith(q.answer) ? 'Đúng' : 'Sai'}</b>
              <br />
              <span>Giải thích: {q.explanation}</span>
            </div>
          )}
        </div>
      ))}
      {!showResult && (
        <button className="quiz-btn" onClick={handleSubmit}>Kiểm tra kết quả</button>
      )}
      {showResult && (
        <div className="quiz-result">
          Bạn đúng {score}/{quizData.length} câu!
        </div>
      )}
      <style>{`
        .quiz-container {
          max-width: 800px;
          margin: 48px auto;
          background: linear-gradient(135deg, #e3f0ff 0%, #f8fafc 100%);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(25, 118, 210, 0.10);
          padding: 40px 32px;
        }
        .quiz-title {
          text-align: center;
          color: #1976d2;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 32px;
        }
        .quiz-question {
          margin-bottom: 28px;
          padding: 18px 0;
          border-bottom: 1px solid #e3e7ed;
        }
        .question {
          font-size: 20px;
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 12px;
        }
        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option {
          padding: 10px 18px;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #e3e7ed;
          cursor: pointer;
          font-size: 17px;
          transition: background 0.2s, border 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .option.selected {
          background: #e3f0ff;
          border: 2px solid #1976d2;
        }
        .quiz-btn {
          margin: 32px auto 0 auto;
          display: block;
          padding: 12px 32px;
          background: #1976d2;
          color: #fff;
          font-size: 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .quiz-btn:hover {
          background: #1565c0;
        }
        .quiz-result {
          margin-top: 28px;
          font-size: 22px;
          color: #388e3c;
          font-weight: bold;
          text-align: center;
        }
        .explanation {
          margin-top: 10px;
          font-size: 16px;
          padding: 10px 18px;
          border-radius: 8px;
        }
        .explanation.correct {
          background: #e8f5e9;
          color: #388e3c;
          border: 1px solid #388e3c;
        }
        .explanation.incorrect {
          background: #ffebee;
          color: #d32f2f;
          border: 1px solid #d32f2f;
        }
      `}</style>
    </div>
  );
}