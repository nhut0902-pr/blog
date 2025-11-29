import React from 'react';

export const metadata = {
    title: 'Chính sách quyền riêng tư | BlogApp',
    description: 'Chính sách bảo mật và quyền riêng tư của người dùng trên BlogApp',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Chính sách quyền riêng tư</h1>

            <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">BlogApp cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">1. Thông tin chúng tôi thu thập</h2>
                <p className="mb-4">Chúng tôi có thể thu thập các thông tin sau:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Địa chỉ email khi bạn đăng ký nhận bản tin (newsletter).</li>
                    <li>Thông tin đăng nhập khi bạn tạo tài khoản.</li>
                    <li>Dữ liệu sử dụng website thông qua cookies và các công cụ phân tích.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-3">2. Cách sử dụng thông tin</h2>
                <p className="mb-4">Thông tin của bạn được sử dụng để:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Gửi bản tin và thông báo về bài viết mới.</li>
                    <li>Cải thiện trải nghiệm người dùng trên website.</li>
                    <li>Phản hồi các thắc mắc và yêu cầu hỗ trợ.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-3">3. Bảo mật thông tin</h2>
                <p className="mb-4">Chúng tôi cam kết không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, trừ khi có yêu cầu của pháp luật.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">4. Cookies</h2>
                <p className="mb-4">Website sử dụng cookies để lưu trữ tùy chọn của người dùng và hỗ trợ các tính năng như đăng nhập, dark mode.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">5. Liên hệ</h2>
                <p className="mb-4">Nếu bạn có bất kỳ câu hỏi nào về chính sách quyền riêng tư, vui lòng liên hệ với chúng tôi qua email: contact@blogapp.com.</p>
            </div>
        </div>
    );
}
