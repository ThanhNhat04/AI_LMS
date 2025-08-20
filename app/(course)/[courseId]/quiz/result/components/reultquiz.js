"use client";
import React, { useState, useCallback, useMemo } from "react";

// Debug component to show raw markdown when needed
function MarkdownDebugger({ text, parsed }) {
  const [showRaw, setShowRaw] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
      <button onClick={() => setShowRaw(!showRaw)} style={{ marginBottom: '10px' }}>
        {showRaw ? 'Hide Raw' : 'Show Raw'} Markdown
      </button>
      {showRaw && (
        <div>
          <strong>Raw:</strong>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {text}
          </pre>
          <strong>Parsed:</strong>
          <pre style={{ background: '#f0f8ff', padding: '10px', overflow: 'auto' }}>
            {parsed}
          </pre>
        </div>
      )}
    </div>
  );
}

// HTML escape function for security
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Safe markdown renderer component
function SafeMarkdownRenderer({ content, fallback = "Không có nội dung" }) {
  const parsedContent = useMemo(() => {
    if (!content) return null;
    
    try {
      const parsed = parseMarkdown(content);
      return parsed;
    } catch (error) {
      console.warn('Markdown parsing error:', error);
      // Fallback to simple text with basic formatting
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }
  }, [content]);

  if (!content) {
    return <p>{fallback}</p>;
  }

  if (!parsedContent) {
    return <p>{content}</p>;
  }

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: parsedContent }}
      className="markdown-content"
    />
  );
}
function parseMarkdown(text = "") {
  if (!text || typeof text !== 'string') return '';
  
  // Clean and normalize the text first
  let cleanText = text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove extra spaces but preserve intended formatting
    .replace(/[ \t]+/g, ' ')
    // Clean up multiple newlines but preserve paragraph breaks
    .replace(/\n{3,}/g, '\n\n');
  
  return cleanText
    // Handle headers (must be at start of line)
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    
    // Handle bold text - more specific patterns to avoid conflicts
    .replace(/\*{2}([^*\n]+?)\*{2}/g, '<strong>$1</strong>')
    .replace(/_{2}([^_\n]+?)_{2}/g, '<strong>$1</strong>')
    
    // Handle italic text - avoid conflict with bold
    .replace(/\*([^*\n<>]+?)\*/g, '<em>$1</em>')
    .replace(/_([^_\n<>]+?)_/g, '<em>$1</em>')
    
    // Handle code spans
    .replace(/`([^`\n]+?)`/g, '<code>$1</code>')
    
    // Handle links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Handle lists - improved to handle various formats
    .replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>')
    
    // Wrap consecutive list items in ul tags
    .replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gs, (match) => {
      return `<ul>${match}</ul>`;
    })
    
    // Handle paragraphs and line breaks
    .split(/\n\s*\n/)  // Split on double newlines
    .map(paragraph => {
      paragraph = paragraph.trim();
      if (!paragraph) return '';
      
      // Don't wrap block elements in paragraphs
      if (paragraph.match(/^<(h[1-6]|ul|ol|li|div)/)) {
        return paragraph;
      }
      
      // Convert single line breaks to <br> within paragraphs
      return `<p>${paragraph}</p>`;
    })
    .join('')
    
    // Clean up malformed HTML and adjacent elements
    .replace(/<\/ul>\s*<ul>/g, '')  // Merge adjacent lists
    .replace(/<p>\s*<\/p>/g, '')   // Remove empty paragraphs
    .replace(/<br>\s*<\/p>/g, '</p>') // Clean up paragraph endings
    .replace(/<p>\s*<br>/g, '<p>');   // Clean up paragraph beginnings
}

// Component for individual exercise to avoid hooks inside loops
function ExerciseItem({ exercise, exerciseId }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);
  
  const isCorrect = selected === exercise.correct_answer;

  return (
    <div className="card">
      <div><strong>Câu hỏi:</strong></div>
      <SafeMarkdownRenderer content={exercise.question} fallback="Không có câu hỏi" />
      
      {exercise.options?.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {exercise.options.map((opt, k) => (
            <li key={k}>
              <label>
                <input
                  type="radio"
                  name={`question-${exerciseId}`}
                  value={opt.option_id}
                  disabled={submitted}
                  onChange={() => setSelected(opt.option_id)}
                />
                <div className="markdown-content">
                  <SafeMarkdownRenderer content={opt.text} fallback={opt.text} />
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}

      <button
        disabled={submitted || selected === null}
        onClick={handleSubmit}
        style={{
          marginTop: "8px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: submitted || selected === null ? "not-allowed" : "pointer",
          opacity: submitted || selected === null ? 0.6 : 1,
        }}
      >
        Nộp bài
      </button>

      {submitted && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ color: isCorrect ? "green" : "red" }}>
            {isCorrect ? "Chính xác!" : "Sai rồi!"}
          </p>
          {exercise.explanation && (
            <div>
              <strong>Giải thích:</strong>
              <SafeMarkdownRenderer content={exercise.explanation} fallback="Không có giải thích" />
            </div>
          )}
          <p><strong>Đáp án đúng:</strong></p>
          <SafeMarkdownRenderer 
            content={exercise.options?.find(o => o.option_id === exercise.correct_answer)?.text} 
            fallback="Không tìm thấy đáp án" 
          />
        </div>
      )}
    </div>
  );
}

export default function LessonResult({ lessonData }) {
  const data = lessonData;

  // Early return with better loading state
  if (!data) {
    return (
      <div className="result-page">
        <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>
          Không có dữ liệu bài học.
        </p>
      </div>
    );
  }

  return (
    <main className="result-page">
      <h1>Kết quả học tập</h1>

      {/* Tổng quan */}
      <section>
        <h2>Tổng quan</h2>
        <SafeMarkdownRenderer 
          content={data.overview} 
          fallback="Chưa có tổng quan." 
        />
      </section>

      {/* Bài giảng */}
      <section>
        <h2>Bài giảng</h2>
        <p className="title">{data.lesson?.lesson_title || "Chưa có tiêu đề bài học"}</p>
        <SafeMarkdownRenderer 
          content={data.lesson?.greeting} 
          fallback="Chưa có lời chào." 
        />

        {data.lesson?.learning_objectives?.length > 0 && (
          <div>
            <h3>Mục tiêu học tập:</h3>
            <ul>
              {data.lesson.learning_objectives.map((obj, i) => (
                <li key={i}>
                  <SafeMarkdownRenderer content={obj} fallback={obj} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {(data.lesson?.sections || []).map((sec, i) => (
          <div key={i} className="card">
            <h3>{sec.title || "Chưa có tiêu đề mục"}</h3>
            <SafeMarkdownRenderer 
              content={sec.content} 
              fallback="Chưa có nội dung mục." 
            />
            
            {sec.examples?.length > 0 && (
              <div>
                <p><strong>Ví dụ:</strong></p>
                <ul>
                  {sec.examples.map((ex, j) => (
                    <li key={j}>
                      <SafeMarkdownRenderer content={ex} fallback={ex} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {sec.key_points?.length > 0 && (
              <div>
                <p><strong>Ý chính:</strong></p>
                <ul>
                  {sec.key_points.map((kp, j) => (
                    <li key={j}>
                      <SafeMarkdownRenderer content={kp} fallback={kp} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {/* Activities */}
        {data.lesson?.activities && data.lesson.activities.length > 0 && (
          <div>
            <h3>Hoạt động</h3>
            {data.lesson.activities.map((act, i) => (
              <div key={i} className="card">
                <p><strong>Loại:</strong> {act.activity_type || "Chưa có"}</p>
                <p><strong>Tiêu đề:</strong> {act.title || "Chưa có"}</p>
                <p><strong>Mô tả:</strong> <SafeMarkdownRenderer content={act.description} fallback="Chưa có" /></p>
                <div><strong>Nội dung:</strong></div>
                <SafeMarkdownRenderer content={act.content} fallback="Chưa có nội dung" />
              </div>
            ))}
          </div>
        )}

        <div>
          <strong>Kết luận bài giảng:</strong>
          <SafeMarkdownRenderer 
            content={data.lesson?.conclusion} 
            fallback="Chưa có kết luận." 
          />
        </div>
      </section>

      {/* Luyện tập */}
      <section>
        <h2>Luyện tập</h2>
        <SafeMarkdownRenderer 
          content={data.practice?.introduction} 
          fallback="Chưa có phần giới thiệu luyện tập." 
        />
        <p><strong>Trọng tâm:</strong> {(data.practice?.focus_areas || []).join(", ") || "Chưa có."}</p>

        {(data.practice?.exercise_groups || []).map((group, i) => (
          <div key={i}>
            <h3>{group.group_title || "Nhóm bài tập"}</h3>
            {group.concept && <p><em>Khái niệm:</em> {group.concept}</p>}

            {(group.exercises || []).map((ex, j) => (
              <ExerciseItem 
                key={`${i}-${j}`} 
                exercise={ex} 
                exerciseId={`${i}-${j}`} 
              />
            ))}
          </div>
        ))}

        {/* Mistakes */}
        {data.practice?.mistake_reference_table && data.practice.mistake_reference_table.length > 0 && (
          <div>
            <h3>Lỗi sai thường gặp</h3>
            {data.practice.mistake_reference_table.map((m, i) => (
              <div key={i} className="card">
                <p><strong>Lỗi:</strong> <SafeMarkdownRenderer content={m.mistake_type} fallback={m.mistake_type} /></p>
                <p><strong>Mô tả:</strong> <SafeMarkdownRenderer content={m.description} fallback={m.description} /></p>
                <p><strong>💡 Giải pháp:</strong> <SafeMarkdownRenderer content={m.solution} fallback={m.solution} /></p>
              </div>
            ))}
          </div>
        )}

        <div>
          <strong>Kết luận luyện tập:</strong>
          <SafeMarkdownRenderer 
            content={data.practice?.conclusion} 
            fallback="Chưa có kết luận." 
          />
        </div>
      </section>

      {/* Lời động viên */}
      <section>
        <h2>Lời động viên</h2>
        <SafeMarkdownRenderer 
          content={data.encouragement} 
          fallback="Chưa có lời động viên." 
        />
      </section>

      <style>{`
        /* Reset and Base Styles */
        .result-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          max-width: 1800px;
          min-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          background: #ffffff;
          color: #1a202c;
          line-height: 1.6;
        }

        /* Typography */
        .result-page h1 {
          font-size: 36px;
          font-weight: 700;
          color: #1a365d;
          margin: 0 0 40px 0;
          padding-bottom: 20px;
          border-bottom: 4px solid #3182ce;
          text-align: center;
        }

        .result-page h2 {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin: 48px 0 24px 0;
          padding: 20px 24px;
          background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
          border-left: 6px solid #3182ce;
          border-radius: 0 8px 8px 0;
        }

        .result-page h3 {
          font-size: 22px;
          font-weight: 600;
          color: #4a5568;
          margin: 32px 0 20px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }

        .result-page p {
          margin: 16px 0;
          color: #4a5568;
          text-align: justify;
          line-height: 1.7;
        }

        .result-page .title {
          font-size: 24px;
          font-weight: 700;
          color: #1a365d;
          margin: 0 0 20px 0;
          padding: 16px 24px;
          background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
          border-radius: 12px;
          border: 1px solid #3182ce;
          text-align: center;
        }

        /* Sections */
        .result-page section {
          margin-bottom: 60px;
          position: relative;
        }

        .result-page section:last-child {
          margin-bottom: 0;
        }

        /* Cards */
        .result-page .card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          margin: 24px 0;
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .result-page .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3182ce, #63b3ed);
        }

        .result-page .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 20px -5px rgba(0, 0, 0, 0.1);
          border-color: #3182ce;
        }

        /* Lists */
        .result-page ul {
          margin: 20px 0;
          padding-left: 0;
          list-style: none;
        }

        .result-page li {
          margin: 12px 0;
          padding-left: 32px;
          color: #4a5568;
          line-height: 1.6;
          position: relative;
        }

        .result-page li::before {
          content: '→';
          color: #3182ce;
          font-weight: bold;
          font-size: 18px;
          position: absolute;
          left: 12px;
        }

        /* Quiz specific styles */
        .result-page ul[style*="list-style: none"] {
          padding-left: 0;
        }

        .result-page ul[style*="list-style: none"] li {
          padding-left: 0;
          margin: 16px 0;
        }

        .result-page ul[style*="list-style: none"] li::before {
          display: none;
        }

        .result-page ul[style*="list-style: none"] li label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f7fafc;
          min-height: 60px;
        }

        .result-page ul[style*="list-style: none"] li label:hover {
          background: #edf2f7;
          border-color: #3182ce;
          transform: translateX(4px);
        }

        .result-page input[type="radio"] {
          transform: scale(1.3);
          accent-color: #3182ce;
          margin: 0;
          flex-shrink: 0;
        }

        .result-page ul[style*="list-style: none"] li label .markdown-content {
          flex: 1;
          margin: 0;
        }

        .result-page ul[style*="list-style: none"] li label .markdown-content p {
          margin: 0;
          line-height: 1.5;
        }

        .result-page ul[style*="list-style: none"] li label .markdown-content strong {
          padding: 0;
        }

        /* Buttons */
        .result-page button {
          font-family: inherit;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
          min-width: 120px;
        }

        .result-page button:not(:disabled) {
          background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
          color: white;
          box-shadow: 0 6px 20px rgba(49, 130, 206, 0.4);
        }

        .result-page button:not(:disabled):hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(49, 130, 206, 0.5);
        }

        .result-page button:not(:disabled):active {
          transform: translateY(-1px);
        }

        .result-page button:disabled {
          background: #cbd5e0;
          color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Feedback Messages */
        .result-page [style*="color: green"] {
          color: #2f855a !important;
          font-weight: 700;
          background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
          padding: 16px 20px;
          border-radius: 12px;
          border-left: 6px solid #38a169;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(56, 161, 105, 0.15);
        }

        .result-page [style*="color: red"] {
          color: #c53030 !important;
          font-weight: 700;
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          padding: 16px 20px;
          border-radius: 12px;
          border-left: 6px solid #e53e3e;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.15);
        }

        /* Markdown Content Styling */
        .markdown-content {
          line-height: 1.7;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          margin-top: 32px;
          margin-bottom: 16px;
          font-weight: 600;
          color: #2d3748;
        }

        .markdown-content h1 { font-size: 32px; color: #1a365d; }
        .markdown-content h2 { font-size: 28px; color: #2a4365; }
        .markdown-content h3 { font-size: 24px; color: #2c5282; }
        .markdown-content h4 { font-size: 20px; color: #3182ce; }

        .markdown-content p {
          margin: 16px 0;
          color: #4a5568;
          text-align: justify;
        }

        .markdown-content ul,
        .markdown-content ol {
          margin: 20px 0;
          padding-left: 0;
        }

        .markdown-content li {
          margin: 10px 0;
          padding-left: 32px;
          color: #4a5568;
          line-height: 1.6;
          position: relative;
        }

        .markdown-content ul li::before {
          content: '→';
          color: #3182ce;
          font-weight: bold;
          position: absolute;
          left: 12px;
        }

        .markdown-content ol {
          counter-reset: item;
        }

        .markdown-content ol li::before {
          content: counter(item) '.';
          counter-increment: item;
          color: #3182ce;
          font-weight: bold;
          position: absolute;
          left: 8px;
        }

        .markdown-content strong {
          color: #1a365d;
          font-weight: 700;
        }

        .markdown-content em {
          color: #2f855a;
          font-style: italic;
          font-weight: 500;
        }

        .markdown-content code {
          background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
          color: #2d3748;
          padding: 4px 8px;
          border-radius: 6px;
          font-family: 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 0.9em;
          border: 1px solid #cbd5e0;
          font-weight: 500;
        }

        .markdown-content a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 600;
          padding-bottom: 2px;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .markdown-content a:hover {
          border-bottom-color: #3182ce;
          color: #2c5282;
          transform: translateY(-1px);
        }

        .markdown-content blockquote {
          margin: 24px 0;
          padding: 20px 24px;
          background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
          border-left: 6px solid #3182ce;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          position: relative;
        }

        .markdown-content blockquote::before {
          content: '"';
          font-size: 48px;
          color: #3182ce;
          position: absolute;
          top: -5px;
          left: 8px;
          opacity: 0.3;
        }

        /* Special Components */
        .result-page .exercise-group {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          margin: 32px 0;
          position: relative;
        }

        .result-page .exercise-group::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #3182ce, #63b3ed, #90cdf4);
          border-radius: 16px;
          z-index: -1;
        }

        .result-page .concept-tag {
          display: inline-block;
          background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
          color: #1a365d;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 2px solid #38a169;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-page .error-section {
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border: 2px solid #fc8181;
          border-radius: 16px;
          padding: 24px;
          margin: 24px 0;
        }

        .result-page .success-section {
          background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
          border: 2px solid #68d391;
          border-radius: 16px;
          padding: 24px;
          margin: 24px 0;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .result-page {
            padding: 32px;
          }
        }

        @media (max-width: 768px) {
          .result-page {
            padding: 20px;
          }
          
          .result-page h1 {
            font-size: 28px;
          }
          
          .result-page h2 {
            font-size: 24px;
            padding: 16px 20px;
          }
          
          .result-page h3 {
            font-size: 20px;
          }
          
          .result-page .card {
            padding: 24px;
            margin: 20px 0;
          }
          
          .result-page .title {
            font-size: 20px;
            padding: 12px 16px;
          }
        }

        @media (max-width: 480px) {
          .result-page {
            padding: 16px;
          }
          
          .result-page h1 {
            font-size: 24px;
          }
          
          .result-page h2 {
            font-size: 20px;
            padding: 12px 16px;
          }
          
          .result-page .card {
            padding: 20px;
          }
          
          .result-page button {
            padding: 12px 24px;
            font-size: 14px;
          }
        }

        /* Print Styles */
        @media print {
          .result-page {
            padding: 0;
            max-width: none;
            font-size: 12px;
            color: #000;
          }
          
          .result-page .card {
            break-inside: avoid;
            box-shadow: none;
            border: 1px solid #000;
            background: white !important;
          }
          
          .result-page button {
            display: none;
          }
          
          .result-page h1,
          .result-page h2,
          .result-page h3 {
            color: #000 !important;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .result-page {
            background: #1a202c;
            color: #e2e8f0;
          }
          
          .result-page .card {
            background: #2d3748;
            border-color: #4a5568;
          }
          
          .result-page h1,
          .result-page h2,
          .result-page h3 {
            color: #e2e8f0;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .result-page * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for accessibility */
        .result-page button:focus,
        .result-page input:focus,
        .result-page a:focus {
          outline: 3px solid #63b3ed;
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}
