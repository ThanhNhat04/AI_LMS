"use client";
import React, { useState } from "react";

function parseMarkdown(text = "") {
  return text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

export default function LessonResult({ lessonData }) {
  const data = lessonData;

  if (!data) return <p>Không có dữ liệu.</p>;

  return (
    <main className="result-page">
      <h1>Kết quả học tập</h1>

      {/* Tổng quan */}
      <section>
        <h2>Tổng quan</h2>
        <p>{data.overview || "Chưa có tổng quan."}</p>
      </section>

      {/* Bài giảng */}
      <section>
        <h2>Bài giảng</h2>
        <p className="title">{data.lesson?.lesson_title || "Chưa có tiêu đề bài học"}</p>
        <p>{data.lesson?.greeting || "Chưa có lời chào."}</p>

        <ul>
          {(data.lesson?.learning_objectives || []).map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>

        {(data.lesson?.sections || []).map((sec, i) => (
          <div key={i} className="card">
            <h3>{sec.title || "Chưa có tiêu đề mục"}</h3>
            <p dangerouslySetInnerHTML={{ __html: parseMarkdown(sec.content || "Chưa có nội dung mục.") }} />
            <p><strong>Ví dụ:</strong></p>
            <ul>
              {(sec.examples || []).map((ex, j) => <li key={j}>{ex}</li>)}
            </ul>
            <p><strong>Ý chính:</strong></p>
            <ul>
              {(sec.key_points || []).map((kp, j) => <li key={j}>{kp}</li>)}
            </ul>
          </div>
        ))}

        {/* Activities */}
        <div>
          <h3>Hoạt động</h3>
          {(data.lesson?.activities || []).map((act, i) => (
            <div key={i} className="card">
              <p><strong>Loại:</strong> {act.activity_type || "Chưa có"}</p>
              <p><strong>Tiêu đề:</strong> {act.title || "Chưa có"}</p>
              <p><strong>Mô tả:</strong> {act.description || "Chưa có"}</p>
              <p dangerouslySetInnerHTML={{ __html: parseMarkdown(`<strong>Nội dung:</strong> ${act.content || "Chưa có"}`) }} />
            </div>
          ))}
        </div>

        <p><strong>Kết luận bài giảng:</strong> {data.lesson?.conclusion || "Chưa có kết luận."}</p>
      </section>

      {/* Luyện tập */}
      <section>
        <h2>Luyện tập</h2>
        <p>{data.practice?.introduction || "Chưa có phần giới thiệu luyện tập."}</p>
        <p><strong>Trọng tâm:</strong> {(data.practice?.focus_areas || []).join(", ") || "Chưa có."}</p>

        {(data.practice?.exercise_groups || []).map((group, i) => (
          <div key={i}>
            <h3>{group.group_title || "Nhóm bài tập"}</h3>
            {group.concept && <p><em>Khái niệm:</em> {group.concept}</p>}

            {(group.exercises || []).map((ex, j) => {
              const [selected, setSelected] = useState(null);
              const [submitted, setSubmitted] = useState(false);
              const isCorrect = selected === ex.correct_answer;

              return (
                <div key={j} className="card">
                  <p><strong>Câu hỏi:</strong> {ex.question}</p>
                  {ex.options?.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {ex.options.map((opt, k) => (
                        <li key={k}>
                          <label>
                            <input
                              type="radio"
                              name={`question-${i}-${j}`}
                              value={opt.option_id}
                              disabled={submitted}
                              onChange={() => setSelected(opt.option_id)}
                            />
                            {" "}{opt.text}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    disabled={submitted || selected === null}
                    onClick={() => setSubmitted(true)}
                    style={{
                      marginTop: "8px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Nộp bài
                  </button>

                  {submitted && (
                    <div style={{ marginTop: "8px" }}>
                      <p style={{ color: isCorrect ? "green" : "red" }}>
                        {isCorrect ? "Chính xác!" : "Sai rồi!"}
                      </p>
                      {ex.explanation && (
                        <p><strong>Giải thích:</strong> {ex.explanation}</p>
                      )}
                      <p><strong>Đáp án đúng:</strong> {ex.options.find(o => o.option_id === ex.correct_answer)?.text}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Review Exercises */}
        <div>
          <h3>Ôn tập</h3>
          {(data.practice?.review_exercises || []).map((ex, i) => (
            <div key={i} className="card">
              <p><strong>Câu hỏi:</strong> {ex.question}</p>
              <p><strong>Đáp án:</strong> {ex.correct_answer}</p>
            </div>
          ))}
        </div>

        {/* Mistakes */}
        <div>
          <h3>Lỗi sai thường gặp</h3>
          {(data.practice?.mistake_reference_table || []).map((m, i) => (
            <div key={i} className="card">
              <p><strong>Lỗi:</strong> {m.mistake_type}</p>
              <p><strong>Mô tả:</strong> {m.description}</p>
              <p><strong>💡 Giải pháp:</strong> {m.solution}</p>
            </div>
          ))}
        </div>

        <p><strong>Kết luận luyện tập:</strong> {data.practice?.conclusion || "Chưa có kết luận."}</p>
      </section>

      {/* Lời động viên */}
      <section>
        <h2>Lời động viên</h2>
        <p>{data.encouragement || "Chưa có lời động viên."}</p>
      </section>

      <style>{`
        .result-page {
          font-family: Arial, sans-serif;
          margin: 20px auto;
          padding: 20px;
          line-height: 1.6;
        }

        .result-page h1 {
          font-size: 28px;
          color: #2c3e50;
        }

        .result-page h2 {
          font-size: 22px;
          margin-top: 24px;
          color: #34495e;
        }

        .result-page h3 {
          font-size: 18px;
          margin-top: 16px;
          color: #555;
        }

        .result-page p {
          margin: 8px 0;
        }

        .result-page ul {
          margin-left: 20px;
        }

        .result-page .card {
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 12px;
          margin-top: 10px;
        }

        strong {
          color: #1d4ed8;
        }

        em {
          color: #16a34a;
        }

        code {
          background-color: #eee;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }

        .title {
          font-weight: bold;
          font-size: 18px;
        }
      `}</style>
    </main>
  );
}
