export const sampleQuizData = {
  article: {
    title: "Khái quát Vật lý phổ thông",
    content: `
Trong môn Vật lý phổ thông, chúng ta tìm hiểu về các hiện tượng tự nhiên, 
từ cơ học, nhiệt học, điện học cho tới quang học.  
Mục tiêu chính là nắm được các khái niệm, quy luật và ứng dụng thực tiễn.  

1. **Cơ học**: Nghiên cứu chuyển động, lực và sự cân bằng.  
2. **Âm học**: Tìm hiểu sự truyền sóng âm, đặc tính âm thanh.  
3. **Điện học**: Nghiên cứu điện tích, dòng điện và mạch điện.  
4. **Quang học**: Khảo sát sự truyền sáng, phản xạ, khúc xạ và các loại gương, thấu kính.  
5. **Nhiệt học**: Giải thích sự truyền nhiệt, sự thay đổi trạng thái vật chất.  

Điểm quan trọng là biết **liên hệ lý thuyết với thực tế**:  
- Vì sao cầu vồng xuất hiện?  
- Tại sao tiếng vang nghe rõ trong hang động?  
- Vì sao khi trời lạnh, tay ta có cảm giác buốt hơn khi chạm vào kim loại so với gỗ?  

Các câu hỏi trắc nghiệm dưới đây sẽ giúp ôn tập kiến thức cơ bản.`,
    subject: "Khoa học - Vật lý",
    difficulty: "Dễ",
  },
  quizList: [
    {
      question: "Âm thanh truyền trong môi trường nào thì không thể lan truyền?",
      options: ["A) Chất rắn", "B) Chất lỏng", "C) Không khí", "D) Chân không"],
      answer: "D",
      explanation: "Âm thanh không thể truyền trong chân không vì không có hạt môi trường để dao động.",
    },
    {
      question: "Hiện tượng ánh sáng đổi hướng khi truyền từ nước ra không khí gọi là gì?",
      options: ["A) Phản xạ", "B) Khúc xạ", "C) Tán sắc", "D) Nhiễu xạ"],
      answer: "B",
      explanation: "Ánh sáng đổi hướng khi đi qua mặt phân cách hai môi trường gọi là khúc xạ.",
    },
    {
      question: "Khi thả vật bằng gỗ vào nước, vật nổi lên vì lý do nào?",
      options: ["A) Khối lượng nhỏ hơn nước", "B) Lực đẩy Ác-si-mét lớn hơn trọng lượng", "C) Do áp suất khí quyển", "D) Do nhiệt độ nước"],
      answer: "B",
      explanation: "Vật nổi khi lực đẩy Ác-si-mét lớn hơn hoặc bằng trọng lượng của vật.",
    },
    {
      question: "Tiếng vang thường nghe rõ trong điều kiện nào?",
      options: ["A) Khoảng cách vật phản xạ xa hơn 17 m", "B) Âm lượng cực nhỏ", "C) Không khí loãng", "D) Ngoài trời thoáng đãng"],
      answer: "A",
      explanation: "Tai người phân biệt được âm vang khi khoảng cách vật phản xạ > 17 m.",
    },
    {
      question: "Loại gương nào cho ảnh ảo, cùng chiều và lớn hơn vật?",
      options: ["A) Gương phẳng", "B) Gương cầu lõm", "C) Gương cầu lồi", "D) Thấu kính hội tụ"],
      answer: "B",
      explanation: "Gương cầu lõm có thể tạo ảnh ảo, cùng chiều và lớn hơn vật khi vật đặt gần gương.",
    },
    {
      question: "Vì sao vào mùa hè, đường nhựa thường nóng hơn đất?",
      options: ["A) Nhựa có màu tối, hấp thụ nhiệt tốt hơn", "B) Nhựa có khối lượng riêng nhỏ", "C) Đất có khả năng phản xạ cao", "D) Gió làm đất mát hơn"],
      answer: "A",
      explanation: "Màu tối hấp thụ nhiệt tốt hơn, do đó đường nhựa nóng nhanh hơn đất.",
    },
    {
      question: "Khi ta nghe thấy sấm sau khi thấy chớp, điều này chứng tỏ điều gì?",
      options: ["A) Tốc độ âm thanh lớn hơn ánh sáng", "B) Tốc độ ánh sáng lớn hơn âm thanh", "C) Sấm và chớp không cùng hiện tượng", "D) Do phản xạ âm"],
      answer: "B",
      explanation: "Ánh sáng truyền nhanh hơn âm thanh nên ta thấy chớp trước rồi mới nghe thấy sấm.",
    },
    {
      question: "Thủy tinh thường vỡ khi rót nước sôi vào vì lý do nào?",
      options: ["A) Thủy tinh giòn", "B) Sự giãn nở không đều", "C) Do lực đẩy của nước", "D) Do áp suất khí quyển"],
      answer: "B",
      explanation: "Thủy tinh nóng lên không đều → giãn nở khác nhau → dễ nứt vỡ.",
    },
    {
      question: "Mắt người nhìn thấy vật là do đâu?",
      options: ["A) Vật phát sáng", "B) Vật hấp thụ ánh sáng", "C) Ánh sáng từ vật truyền vào mắt", "D) Mắt phát ra tia sáng chiếu vào vật"],
      answer: "C",
      explanation: "Mắt nhìn thấy vật vì ánh sáng từ vật truyền vào mắt.",
    },
    {
      question: "Tại sao khi chạm tay vào kim loại trong mùa đông lại thấy lạnh hơn so với gỗ?",
      options: ["A) Kim loại dẫn nhiệt tốt hơn gỗ", "B) Kim loại có khối lượng lớn hơn", "C) Gỗ phản xạ nhiệt tốt hơn", "D) Gỗ cách âm tốt hơn"],
      answer: "A",
      explanation: "Kim loại dẫn nhiệt nhanh nên truyền nhiệt từ tay ra ngoài nhanh hơn gỗ, tạo cảm giác lạnh.",
    },
  ],
};
