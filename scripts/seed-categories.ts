import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: 'Công nghệ', slug: 'cong-nghe', description: 'Tin tức và bài viết về công nghệ' },
        { name: 'Lập trình', slug: 'lap-trinh', description: 'Hướng dẫn và kinh nghiệm lập trình' },
        { name: 'Thiết kế', slug: 'thiet-ke', description: 'UI/UX và thiết kế web' },
        { name: 'Kinh doanh', slug: 'kinh-doanh', description: 'Kiến thức về kinh doanh và khởi nghiệp' },
        { name: 'Đời sống', slug: 'doi-song', description: 'Chia sẻ về cuộc sống' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }

    console.log('✅ Đã seed categories thành công!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
