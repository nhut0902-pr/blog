import React from 'react';

export const metadata = {
    title: 'Điều khoản dịch vụ | BlogApp',
    description: 'Điều khoản dịch vụ và quy định sử dụng của BlogApp',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Điều khoản dịch vụ</h1>

            <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">Chào mừng bạn đến với BlogApp. Khi truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">1. Chấp nhận điều khoản</h2>
                <p className="mb-4">Bằng việc truy cập và sử dụng BlogApp, bạn chấp nhận và đồng ý bị ràng buộc bởi các điều khoản và quy định này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng website.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">2. Nội dung và Bản quyền</h2>
                <p className="mb-4">Tất cả nội dung trên BlogApp bao gồm bài viết, hình ảnh, logo đều thuộc bản quyền của BlogApp hoặc các tác giả. Bạn không được sao chép, tái bản hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">3. Trách nhiệm người dùng</h2>
                <p className="mb-4">Khi sử dụng BlogApp, bạn cam kết:</p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Không đăng tải nội dung vi phạm pháp luật, đồi trụy, hoặc xúc phạm người khác.</li>
                    <li>Không spam hoặc phát tán virus, mã độc.</li>
                    <li>Tôn trọng cộng đồng và các thành viên khác.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-3">4. Giới hạn trách nhiệm</h2>
                <p className="mb-4">Nội dung trên BlogApp chỉ mang tính chất tham khảo. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng thông tin trên website này.</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">5. Thay đổi điều khoản</h2>
                <p className="mb-4">Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng website sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
            </div>
        </div>
    );
}
