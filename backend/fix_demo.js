import prisma from './src/lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Seeding role permissions and updating passwords...');

    // 1. Update Passwords
    const users = {
        'doctor1': 'doctor123',
        'pharmacist1': 'pharmacist123',
        'optician1': 'optician123',
        'reception1': 'reception123'
    };

    for (const [username, plainPassword] of Object.entries(users)) {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        await prisma.user.updateMany({
            where: { username },
            data: { password: hashedPassword }
        });
        console.log(`Updated password for ${username}`);
    }

    // 2. Clear old permissions just in case
    await prisma.rolePermission.deleteMany({});

    // 3. Define Permissions
    const fullPermissions = { canRead: true, canCreate: true, canUpdate: true, canDelete: true };
    const readOnly = { canRead: true, canCreate: false, canUpdate: false, canDelete: false };

    const roleMap = {
        'DOCTOR': ['patients', 'appointments', 'preliminary_exams', 'clinical_exams', 'surgery', 'medicine_prescriptions', 'optical_prescriptions', 'reports_clinical', 'reports_appointments', 'reports_patients', 'reports_inventory', 'optical', 'pharmacy'],
        'PHARMACIST': ['patients', 'medicine_prescriptions', 'reports_inventory', 'pharmacy', 'inventory'],
        'OPTICIAN': ['patients', 'optical_prescriptions', 'reports_inventory', 'optical', 'inventory', 'billing'],
        'RECEPTIONIST': ['patients', 'appointments', 'preliminary_exams', 'clinical_exams', 'billing']
    };

    let count = 0;
    for (const [roleName, modules] of Object.entries(roleMap)) {
        for (const moduleName of modules) {
            await prisma.rolePermission.create({
                data: {
                    roleName,
                    module: moduleName,
                    ...fullPermissions
                }
            });
            count++;
        }
    }

    console.log(`Successfully seeded ${count} permissions for non-admin roles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
