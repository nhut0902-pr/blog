const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedStore() {
    try {
        // Tìm admin user
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!admin) {
            console.log('No admin user found. Please create an admin user first.');
            return;
        }

        // Tạo sample source codes
        const sampleProducts = [
            {
                title: 'React E-commerce Template',
                description: 'Template e-commerce hoàn chỉnh với React, Next.js, và Stripe payment. Bao gồm admin dashboard, quản lý sản phẩm, giỏ hàng, và thanh toán.',
                price: 500000,
                imageUrl: 'https://via.placeholder.com/600x400/1e293b/22d3ee?text=React+E-commerce',
                demoUrl: 'https://demo.example.com/ecommerce',
                downloadUrl: 'https://github.com/example/react-ecommerce',
                tags: ['React', 'Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
                category: 'E-commerce',
                featured: true,
                authorId: admin.id
            },
            {
                title: 'Blog CMS với Next.js',
                description: 'Hệ thống quản lý blog đầy đủ tính năng với Next.js, Prisma, và PostgreSQL. Hỗ trợ markdown, SEO, comments, và admin panel.',
                price: 300000,
                imageUrl: 'https://via.placeholder.com/600x400/1e293b/22d3ee?text=Blog+CMS',
                demoUrl: 'https://demo.example.com/blog',
                downloadUrl: 'https://github.com/example/nextjs-blog',
                tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Markdown', 'SEO'],
                category: 'CMS',
                featured: true,
                authorId: admin.id
            },
            {
                title: 'Dashboard Analytics',
                description: 'Dashboard analytics với charts, real-time data, và responsive design. Sử dụng React, Chart.js, và Socket.io.',
                price: 400000,
                imageUrl: 'https://via.placeholder.com/600x400/1e293b/22d3ee?text=Analytics+Dashboard',
                demoUrl: 'https://demo.example.com/dashboard',
                downloadUrl: 'https://github.com/example/analytics-dashboard',
                tags: ['React', 'Chart.js', 'Socket.io', 'Dashboard', 'Analytics'],
                category: 'Dashboard',
                featured: false,
                authorId: admin.id
            }
        ];

        for (const product of sampleProducts) {
            await prisma.sourceCode.create({
                data: product
            });
        }

        console.log('✅ Store seeded successfully!');
        console.log(`Created ${sampleProducts.length} sample products`);
    } catch (error) {
        console.error('❌ Error seeding store:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedStore();