const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestPurchase() {
    try {
        // Tìm user thường và source code
        const user = await prisma.user.findFirst({
            where: { role: 'USER' }
        });

        const sourceCode = await prisma.sourceCode.findFirst();

        if (!user || !sourceCode) {
            console.log('Need at least one user and one source code to create test purchase');
            return;
        }

        // Tạo test purchase
        const purchase = await prisma.purchase.create({
            data: {
                userId: user.id,
                sourceCodeId: sourceCode.id,
                amount: sourceCode.price,
                contactInfo: 'Email: test@example.com, Phone: 0123456789',
                status: 'PENDING'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                sourceCode: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            }
        });

        console.log('✅ Test purchase created successfully!');
        console.log('Purchase details:', {
            id: purchase.id,
            user: purchase.user.name,
            product: purchase.sourceCode.title,
            amount: purchase.amount,
            status: purchase.status
        });
    } catch (error) {
        console.error('❌ Error creating test purchase:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestPurchase();