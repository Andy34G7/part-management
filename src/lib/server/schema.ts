import { pgTable, text, serial, date, timestamp } from 'drizzle-orm/pg-core';

export const dropdownOptions = pgTable('dropdown_options', {
    id: serial('id').primaryKey(),
    category: text('category').notNull(),
    value: text('value').notNull(),
});

export const form1Submissions = pgTable('form1_submissions', {
    id: serial('id').primaryKey(),
    empNo: text('emp_no').notNull(),
    empName: text('emp_name').notNull(),
    projectCode: text('project_code').notNull(),
    partNumber: text('part_number').notNull(),
    partName: text('part_name').notNull(),
    supplier: text('supplier').notNull(),
    mfgProcess: text('mfg_process').notNull(),
    typeOfIssue: text('type_of_issue').notNull(),
    issue: text('issue').notNull(),
    failureMode: text('failure_mode').notNull(),
    startingDate: date('starting_date').notNull(),
    endingDate: date('ending_date').notNull(),
    solution: text('solution').notNull(),
    standardisation: text('standardisation').notNull(),
    attachmentUrl: text('attachment_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const form2Submissions = pgTable('form2_submissions', {
    id: serial('id').primaryKey(),
    projectCode: text('project_code').notNull(),
    partNumber: text('part_number').notNull(),
    partName: text('part_name').notNull(),
    vendorCode: text('vendor_code').notNull(),
    vendorName: text('vendor_name').notNull(),
    applicability: text('applicability').notNull(),
    dhrProject: text('dhr_project').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
