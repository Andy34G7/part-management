import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import { env } from '$env/dynamic/private';
import { eq, desc } from 'drizzle-orm';

import type {
    IDropdownRepository,
    IForm1Repository,
    IForm2Repository,
    DropdownOption,
    NewDropdownOption,
    Form1Submission,
    NewForm1Submission,
    Form2Submission,
    NewForm2Submission,
} from './interfaces';

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export class PostgresDropdownRepository implements IDropdownRepository {
    async getOptions(category?: string): Promise<DropdownOption[]> {
        if (category) {
            return await db.select().from(schema.dropdownOptions).where(eq(schema.dropdownOptions.category, category));
        }
        return await db.select().from(schema.dropdownOptions);
    }

    async addOption(option: NewDropdownOption): Promise<DropdownOption> {
        const [result] = await db.insert(schema.dropdownOptions).values(option).returning();
        return result;
    }

    async deleteOption(id: number): Promise<void> {
        await db.delete(schema.dropdownOptions).where(eq(schema.dropdownOptions.id, id));
    }
}

export class PostgresForm1Repository implements IForm1Repository {
    async getSubmissions(): Promise<Form1Submission[]> {
        return await db.select().from(schema.form1Submissions).orderBy(desc(schema.form1Submissions.createdAt));
    }

    async createSubmission(submission: NewForm1Submission): Promise<Form1Submission> {
        const [result] = await db.insert(schema.form1Submissions).values(submission).returning();
        return result;
    }
}

export class PostgresForm2Repository implements IForm2Repository {
    async getSubmissions(): Promise<Form2Submission[]> {
        return await db.select().from(schema.form2Submissions).orderBy(desc(schema.form2Submissions.createdAt));
    }

    async createSubmission(submission: NewForm2Submission): Promise<Form2Submission> {
        const [result] = await db.insert(schema.form2Submissions).values(submission).returning();
        return result;
    }

    async getPartDetailsByNumber(partNumber: string): Promise<Form2Submission | null> {
        const [result] = await db
            .select()
            .from(schema.form2Submissions)
            .where(eq(schema.form2Submissions.partNumber, partNumber))
            .orderBy(desc(schema.form2Submissions.createdAt))
            .limit(1);

        return result || null;
    }
}
