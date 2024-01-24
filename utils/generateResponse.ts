const responses = [
  'Tôi nghĩ bình luận "#c%o&m@m*e!n$t" của bạn mang cảm xúc #p%r&i@d*i!c$t.',
  'Có thể bình luận "#c%o&m@m*e!n$t" của bạn mang cảm xúc #p%r&i@d*i!c$t.',
  'Bình luận "#c%o&m@m*e!n$t" mang cảm xúc #p%r&i@d*i!c$t.',
  'Bình luận "#c%o&m@m*e!n$t" của bạn có vẻ mang cảm xúc #p%r&i@d*i!c$t.',
  'Dựa vào những gì tôi được học, bình luận "#c%o&m@m*e!n$t" có thể mang cảm xúc #p%r&i@d*i!c$t.',
  'Tôi cho rằng bình luận "#c%o&m@m*e!n$t" có thể mang cảm xúc #p%r&i@d*i!c$t.',
  'Tôi cảm thấy sự #p%r&i@d*i!c$t trong bình luận "#c%o&m@m*e!n$t" của bạn.',
  'Theo tôi, bình luận "#c%o&m@m*e!n$t" mang cảm xúc #p%r&i@d*i!c$t.',
  'Tôi phân tích rằng bình luận "#c%o&m@m*e!n$t" của bạn có thể mang cảm xúc #p%r&i@d*i!c$t.',
  'Theo những gì tôi được huấn luyện, bình luận "#c%o&m@m*e!n$t" của bạn có thể mang cảm xúc #p%r&i@d*i!c$t.',
  'Tôi nhận thấy rằng bình luận "#c%o&m@m*e!n$t" của bạn có thể mang cảm xúc #p%r&i@d*i!c$t.',
  'Tôi dự đoán bình luận "#c%o&m@m*e!n$t" mang cảm xúc #p%r&i@d*i!c$t.',
  'Tôi có thể giúp bạn dự đoán bình luận "#c%o&m@m*e!n$t". Bình luận của bạn mang cảm xúc #p%r&i@d*i!c$t.',
  'Có vẻ bình luận "#c%o&m@m*e!n$t của bạn có cảm xúc #p%r&i@d*i!c$t',
  'Theo tôi, khả năng cao là bình luận "#c%o&m@m*e!n$t" của bạn đang mang cảm xúc #p%r&i@d*i!c$t',
  'Bình luận "#c%o&m@m*e!n$t" có khả năng mang cảm xúc #p%r&i@d*i!c$t.',
]

const generateRandomResponse = (comment: string, predict: string): string => {
  const randomIndex = Math.floor(Math.random() * responses.length)
  const randomResponse = responses[randomIndex]
  const finalResponse = randomResponse.replace('#c%o&m@m*e!n$t', comment).replace('#p%r&i@d*i!c$t', predict)
  return finalResponse
}