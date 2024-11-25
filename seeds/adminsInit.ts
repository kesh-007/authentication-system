import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from '../drizzle';
import {adminModel} from '../models/adminModel'
import { UserSeedData } from '../types';
import dotenv from 'dotenv'
dotenv.config()


const seedUsers: UserSeedData[] = [
    { email: 'keshavbaskar005@gmail.com', password: process.env.USER_PASSWD || '',name: "B Keshav Baskar",role: 'admin'},
];

const seedDatabase = async () => {
    console.log('Seeding database...');

    for (const user of seedUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await db.insert(adminModel).values({
            email: user.email,
            password: hashedPassword,
            name: user.name,
            role: user.role,
        });

        console.log(`User ${user.email} seeded successfully.`);
    }

    console.log('Database seeded successfully.');
    process.exit();
};


seedDatabase().catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
