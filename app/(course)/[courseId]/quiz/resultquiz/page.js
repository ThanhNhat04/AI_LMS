"use client";
import React, { useState } from "react";

const data = {
  overview:
    "Tuyệt vời con yêu! Hôm nay con đã học rất chăm chỉ và vui vẻ. Cô rất tự hào về con!",
  lesson: {
    lesson_title: "Khám phá Thế giới Số và Phép Tính Cơ Bản",
    learning_objectives: [
      "Con sẽ biết cách đếm các đồ vật xung quanh mình.",
      "Con sẽ nhận biết được các con số đáng yêu từ 1 đến 10.",
      "Con sẽ hiểu 'Phép Cộng' là gì và biết cách gộp các nhóm lại với nhau.",
    ],
    greeting:
      "Chào con yêu quý của cô! Hôm nay, chúng mình sẽ bắt đầu một hành trình kỳ diệu để khám phá những con số và cách chúng hoạt động nhé!",
    sections: [
      {
        title: "Bé ơi, cùng đếm đồ chơi!",
        content:
          "Con có biết không, mỗi khi con đếm đồ chơi, con đang học toán đó! Cùng nhìn xung quanh và đếm xem con có bao nhiêu chiếc xe, bao nhiêu con gấu bông nhé!",
        examples: [
          "Cô có 1 cái kẹo mút.",
          "Con có 2 quả bóng bay màu sắc.",
          "Chúng mình có tất cả mấy món đồ chơi?",
        ],
        key_points: [
          "Đếm là cách mình tìm 'số lượng' của vật gì đó.",
          "Mỗi vật là một 'số'.",
          "Chúng ta đếm từ 1 đến 10.",
        ],
      },
      {
        title: "Phép cộng là gì nhỉ?",
        content:
          "Khi con gộp 1 quả táo và 1 quả chuối lại, con có bao nhiêu trái cây? Đó chính là phép cộng đó con!",
        examples: [
          "1 quả táo + 1 quả chuối = 2 loại trái cây!",
          "2 bạn nhỏ + 1 bạn nữa = 3 bạn cùng chơi!",
        ],
        key_points: [
          "Phép cộng là 'gộp lại' hai nhóm.",
          "Dùng dấu '+' để biểu thị phép cộng.",
          "Kết quả gọi là 'tổng'.",
        ],
      },
    ],
  },
  practice: {
    intro: "Giờ thì con hãy thử làm các bài tập sau nhé!",
    exercise_groups: [
      {
        group_title: "🧸 Nhóm bài tập Đếm số",
        exercises: [
          {
            type: "multiple_choice",
            question: "Con thấy bao nhiêu chú gấu bông?",
            options: ["2", "3", "4"],
            answer: "3",
          },
          {
            type: "fill_in_blank",
            question: "Cô có ___ chiếc kẹo.",
            answer: "2",
          },
        ],
      },
      {
        group_title: "➕ Nhóm bài tập Phép cộng cơ bản",
        exercises: [
          {
            type: "multiple_choice",
            question: "1 + 2 bằng mấy?",
            options: ["2", "3", "4"],
            answer: "3",
          },
          {
            type: "fill_in_blank",
            question: "2 + 1 = ___",
            answer: "3",
          },
        ],
      },
    ],
  },
  review_exercises: [
    { question: "Con nhớ không? 1 + 1 bằng mấy?", answer: "2" },
    { question: "Chúng mình đếm từ 1 đến ___?", answer: "10" },
  ],
  mistake_reference_table: [
    {
      mistake: "Đếm sai số lượng",
      explanation:
        "Có thể con đếm nhanh quá. Mình hãy đếm chậm rãi từng món đồ nhé!",
    },
    {
      mistake: "Cộng nhầm kết quả",
      explanation: "Mình thử dùng ngón tay để đếm và cộng lại lần nữa nha con!",
    },
  ],
  encouragement:
    "Con đã hoàn thành rất tốt phần bài giảng và bài tập hôm nay! Hãy tiếp tục phát huy tinh thần học tập vui vẻ này nhé! Cô tin rằng con sẽ trở thành một ngôi sao toán học!",
};

export default function ResultPage() {
  const [answers, setAnswers] = useState({}); // Lưu lựa chọn của người dùng

  const handleSelect = (groupIndex, exIndex, option) => {
    const key = `${groupIndex}-${exIndex}`;
    setAnswers({ ...answers, [key]: option });


  };
  return (
    <main className="result-page">
      <h1>🎓 Kết quả học tập</h1>
      <section>
        <h2>📝 Tổng quan</h2>
        <p>{data.overview}</p>
      </section>

       <section>
        <h2>🧠 Luyện tập</h2>
        <p>{data.practice.intro}</p>
        {data.practice.exercise_groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3>{group.group_title}</h3>
            {group.exercises.map((ex, exIndex) => {
              const key = `${groupIndex}-${exIndex}`;
              const userAnswer = answers[key];
              const isCorrect = userAnswer === ex.answer;

              return (
                <div key={exIndex} className="box exercise-box">
                  <p>
                    <strong>📝 Câu hỏi:</strong> {ex.question}
                  </p>

                  {ex.type === "multiple_choice" && (
                    <div className="options">
                      {ex.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            handleSelect(groupIndex, exIndex, opt)
                          }
                          className={
                            userAnswer
                              ? opt === ex.answer
                                ? "btn correct"
                                : opt === userAnswer
                                ? "btn wrong"
                                : "btn disabled"
                              : "btn"
                          }
                          disabled={!!userAnswer}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {ex.type === "fill_in_blank" && (
                    <p>
                      <strong>✅ Đáp án:</strong> {ex.answer}
                    </p>
                  )}

                  {userAnswer && ex.type === "multiple_choice" && (
                    <p>
                      <strong>✅ Đáp án đúng:</strong> {ex.answer} –{" "}
                      {isCorrect ? "Chính xác!" : "Sai rồi, con xem lại nhé!"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>


      <section>
        <h2>🧠 Luyện tập</h2>
        <p>{data.practice.intro}</p>
        {data.practice.exercise_groups.map((group, i) => (
          <div key={i}>
            <h3>{group.group_title}</h3>
            {group.exercises.map((ex, j) => (
              <div key={j} className="box exercise-box">
                <p>
                  <strong>📝 Câu hỏi:</strong> {ex.question}
                </p>
                {ex.options && (
                  <ul>
                    {ex.options.map((opt, k) => (
                      <li key={k}>{opt}</li>
                    ))}
                  </ul>
                )}
                <p>
                  <strong>✅ Đáp án:</strong> {ex.answer}
                </p>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section>
        <h2>🔁 Ôn tập</h2>
        {data.review_exercises.map((r, i) => (
          <div key={i} className="box">
            <p>
              <strong>❓ Câu hỏi:</strong> {r.question}
            </p>
            <p>
              <strong>✅ Đáp án:</strong> {r.answer}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2>⚠️ Bảng lỗi sai thường gặp</h2>
        {data.mistake_reference_table.map((m, i) => (
          <div key={i} className="box mistake-box">
            <p>
              <strong>🚫 Lỗi:</strong> {m.mistake}
            </p>
            <p>
              <strong>💡 Gợi ý:</strong> {m.explanation}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2>💖 Lời động viên</h2>
        <p>{data.encouragement}</p>
      </section>
            <style jsx>{`
        .result-page {
          font-family: "Segoe UI", sans-serif;
          padding: 32px;
          max-width: 800px;
          margin: auto;
        }
        h1 {
          font-size: 36px;
          color: #2c3e50;
        }
        h2 {
          font-size: 28px;
          color: #1abc9c;
          margin-top: 30px;
        }
        h3 {
          font-size: 22px;
          color: #2980b9;
          margin-top: 20px;
        }
        h4 {
          font-size: 20px;
          color: #8e44ad;
          margin-top: 15px;
        }
        h5 {
          font-size: 18px;
          margin-top: 10px;
        }
        p,
        li {
          font-size: 16px;
          line-height: 1.6;
        }
        ul {
          padding-left: 20px;
          margin-top: 6px;
        }
        .box {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          padding: 16px;
          border-radius: 6px;
          margin-top: 10px;
        }
        .exercise-box {
          background: #f1f8ff;
        }
        .mistake-box {
          background: #fff4f4;
        }
        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .btn {
          padding: 8px 16px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
          background: #f0f0f0;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn:hover {
          background: #e0e0e0;
        }
        .btn.correct {
          background-color: #d4edda;
          border-color: #28a745;
          color: #155724;
          cursor: default;
        }
        .btn.wrong {
          background-color: #f8d7da;
          border-color: #dc3545;
          color: #721c24;
          cursor: default;
        }
        .btn.disabled {
          background-color: #eee;
          cursor: default;
          opacity: 0.6;
        }
      `}</style>
    </main>
  );
}
