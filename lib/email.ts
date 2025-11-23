import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Email template for new post notification
export function getNewPostEmailHTML(post: { title: string; content: string; id: string }) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const postUrl = `${baseUrl}/blog/${post.id}`;
    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4f46e5;
        }
        h1 {
            color: #4f46e5;
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .content {
            margin: 20px 0;
        }
        .post-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
        }
        .post-excerpt {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 25px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 10px 0;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .unsubscribe {
            color: #9ca3af;
            text-decoration: none;
            font-size: 12px;
        }
        .unsubscribe:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">📝 BÀI VIẾT MỚI</div>
            <h1>BlogApp</h1>
            <p style="color: #6b7280; margin: 0;">Bài viết mới nhất từ blog của chúng tôi</p>
        </div>
        
        <div class="content">
            <div class="post-title">${post.title}</div>
            <div class="post-excerpt">
                ${post.content.substring(0, 200)}...
            </div>
            <div style="text-align: center;">
                <a href="${postUrl}" class="button">Đọc bài viết đầy đủ →</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Bạn nhận được email này vì đã đăng ký nhận thông báo từ BlogApp.</p>
            <p>
                <a href="${unsubscribeUrl}" class="unsubscribe">Hủy đăng ký nhận tin</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Send email to single recipient
export async function sendEmail(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            from: `"BlogApp" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error };
    }
}

// Send new post notification to all active subscribers
export async function sendNewPostNotification(post: { title: string; content: string; id: string }, subscribers: string[]) {
    const html = getNewPostEmailHTML(post);
    const subject = `📝 Bài viết mới: ${post.title}`;

    const results = await Promise.allSettled(
        subscribers.map((email) => sendEmail(email, subject, html))
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return { successful, failed, total: subscribers.length };
}
