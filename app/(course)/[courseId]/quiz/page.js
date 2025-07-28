"use client";
import React, { useState, useEffect } from "react";

export default function QuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("custom_quiz");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setQuizData(parsed);
        setSelected(Array(parsed.length).fill(null));
      } catch (err) {
        console.error("Lỗi khi parse localStorage:", err);
      }
    }
  }, []);

  const handleSelect = (qIdx, oIdx) => {
    const newSelected = [...selected];
    newSelected[qIdx] = oIdx;
    setSelected(newSelected);
  };

  const handleSubmit = () => setShowResult(true);

  const score = selected.reduce((acc, val, idx) => {
    const correctLetter = quizData[idx]?.answer;
    const selectedOption = quizData[idx]?.options[val];
    return acc + (selectedOption?.startsWith(correctLetter) ? 1 : 0);
  }, 0);

  //Gợi ý AI
  // Hàm này sẽ được gọi khi người dùng nhấn nút "Gợi ý
  const handleAIClick = () => {

    const sessionId = "session_001"; // hoặc sinh random nếu muốn

    const article = {
      title: "Các Định Luật Newton về Chuyển Động",
      content: `Các Định Luật Newton về Chuyển Động là ba nguyên lý cơ bản mô tả mối quan hệ giữa các lực tác dụng lên vật thể và chuyển động của nó.

Definh Luật Thứ Nhất (Định Luật Quán Tính): Một vật đang đứng yên sẽ tiếp tục đứng yên, và một vật đang chuyển động sẽ tiếp tục chuyển động với cùng tốc độ và hướng, trừ khi có lực không cân bằng tác dụng lên nó.

Định Luật Thứ Hai: Gia tốc của vật thể tỉ lệ thuận với lực tổng hợp tác dụng lên nó và tỉ lệ nghịch với khối lượng của nó. Điều này được biểu diễn qua công thức F = ma, trong đó F là lực, m là khối lượng, và a là gia tốc.

Định Luật Thứ Ba: Với mỗi tác dụng, có một phản tác dụng bằng và ngược chiều. Khi một vật tác dụng lực lên vật thứ hai, vật thứ hai đồng thời tác dụng lại một lực có độ lớn bằng nhau nhưng ngược hướng lên vật thứ nhất.

Những định luật này tạo thành nền tảng của cơ học cổ điển và giúp chúng ta hiểu cách các vật thể chuyển động trong thế giới hàng ngày.`,
      subject: "vật lý",
      difficulty: "trung bình",
    };

    const correctAnswers = quizData.map((q) => q.answer);

    const userAnswers = selected.map((selIdx, i) => {
      if (selIdx == null) return null;
      return quizData[i].options[selIdx][0]; // Lấy ký tự A/B/C/D từ đầu chuỗi
    });

    const answerDetails = quizData.map((q, i) => {
      const correctLetter = q.answer;
      const userIdx = selected[i];
      const userAnswer = userIdx != null ? q.options[userIdx][0] : null;
      const isCorrect = userAnswer === correctLetter;

      return {
        question_id: q.id ?? i + 1,
        user_answer: userAnswer,
        is_correct: isCorrect,
        // time_taken_seconds: Math.floor(Math.random() * 30) + 5, // hoặc có thể lưu time thực
        confidence: "trung bình", // hoặc có thể cho người dùng chọn
      };
    });

    const output = {
      session_id: sessionId,
      article,
      questions: quizData,
      correct_answers: correctAnswers,
      user_answers: userAnswers,
      answer_details: answerDetails,
    };

    console.log("Cấu trúc gửi lên AI:", output);
  };

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <h2 className="quiz-title">Bài tập</h2>
        {quizData.length === 0 ? (
          <div>Hiện tại chưa có bài tập bài tập nào được tạo</div>
        ) : (
          quizData.map((q, idx) => (
            <div key={idx} className="quiz-question">
              <div className="question">
                {idx + 1}. {q.question}
              </div>
              <div className="options">
                {q.options.map((opt, oIdx) => (
                  <label
                    key={oIdx}
                    className={`option ${
                      selected[idx] === oIdx ? "selected" : ""
                    }`}
                  >
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
                <div
                  className={`explanation ${
                    quizData[idx].options[selected[idx]]?.startsWith(q.answer)
                      ? "correct"
                      : "incorrect"
                  }`}
                >
                  <b>
                    Kết quả:{" "}
                    {quizData[idx].options[selected[idx]]?.startsWith(q.answer)
                      ? "Đúng"
                      : "Sai"}
                  </b>
                  <br />
                  <span>Giải thích: {q.explanation}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="quiz-navigation">
        <div className="nav-grid">
          {quizData.map((_, idx) => {
            let className = "nav-item";
            if (selected[idx] !== null) {
              className += " answered";
              if (showResult) {
                const isCorrect = quizData[idx].options[
                  selected[idx]
                ]?.startsWith(quizData[idx].answer);
                className += isCorrect ? " correct" : " incorrect";
              }
            }
            return (
              <div key={idx} className={className}>
                {idx + 1}
              </div>
            );
          })}
        </div>
        {!showResult && quizData.length > 0 && (
          <button className="quiz-btn" onClick={handleSubmit}>
            Nộp bài
          </button>
        )}
        {showResult && (
          <div>
            <div className="quiz-result">
              Bạn đúng {score}/{quizData.length} câu!
            </div>
            <button className="quiz-btn" onClick={() => setShowResult(false)}>
              Làm lại
            </button>
            <button className="quiz-btn" onClick={handleAIClick}>
              Gợi ý AI
            </button>
          </div>
        )}
      </div>

      <style>{`
        .quiz-wrapper {
          display: flex;
          max-width: 1200px;
          margin: 48px auto;
          gap: 32px;
          align-items: flex-start;
          padding: 0 16px;
        }

        .quiz-container {
          flex: 1;
          background: var(--bg-color, #f9fafb);
          border-radius: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          padding: 40px 32px;
        }

        .quiz-title {
          text-align: center;
          color: black;
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
          color: black;
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
          width: 100%; 
          min-height: 30px;
          margin: 16px 0 0 0; 
          display: block;
          padding: 12px 32px;
          background: #1976d2;
          color: #fff;
          font-size: 22px;
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
          border-radius: 8px;
          padding: 16px;
          background: #e3f2fd; 
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

        .quiz-navigation {
          width: 240px;
          background: var(--bg-color, #f9fafb);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          position: sticky;
          top: 40px;
          height: fit-content;
        }

        .nav-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
          text-align: center;
          color: #1e293b;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .nav-item {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          border: 1px solid #94a3b8;
          background: #fff;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          cursor: default;
          font-size: 20px;
        }

        .nav-item.answered {
          background: #cbd5e1;
          color: #1e293b;
        }

        .nav-item.correct {
          background: #c8facc;
          border-color: #22c55e;
          color: #14532d;
        }

        .nav-item.incorrect {
          background: #fecaca;
          border-color: #ef4444;
          color: #7f1d1d;
        }

        @media (max-width: 768px) {
          .quiz-wrapper {
            flex-direction: column;
          }

          .quiz-navigation {
            width: 100%;
            position: static;
            margin-top: 24px;
          }

          .nav-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
