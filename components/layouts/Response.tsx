import { FC, useState } from 'react'
import parse from 'html-react-parser'

interface ResponseProps {
    text: string
    code?: string
    html?: string
}

const Response: FC<ResponseProps> = () => {
    const aiResponse = {
        text: 'Đây là câu trả lời văn bản từ AI.',
        code: 'console.log("Đây là mã từ AI.")',
        html: '<h1>This is HTML<h1>'
    }

    const [response, setResponse] = useState(aiResponse)

    return (
        <div>
            <p>{response.text}</p>
            <pre><code>{response.code}</code></pre>
            {parse(response.html)}
        </div>
    )
}

export default Response