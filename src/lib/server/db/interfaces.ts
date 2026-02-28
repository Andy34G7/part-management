export interface DropdownOption {
    id: number;
    category: string;
    value: string;
}

export type NewDropdownOption = Omit<DropdownOption, 'id'>;

export interface Form1Submission {
    id: number;
    empNo: string;
    empName: string;
    projectCode: string;
    partNumber: string;
    partName: string;
    supplier: string;
    mfgProcess: string;
    typeOfIssue: string;
    issue: string;
    failureMode: string;
    startingDate: string;
    endingDate: string;
    solution: string;
    standardisation: string;
    attachmentUrl: string | null;
    createdAt: Date;
}

export type NewForm1Submission = Omit<Form1Submission, 'id' | 'createdAt'>;

export interface Form2Submission {
    id: number;
    projectCode: string;
    partNumber: string;
    partName: string;
    vendorCode: string;
    vendorName: string;
    applicability: string;
    dhrProject: string;
    createdAt: Date;
}

export type NewForm2Submission = Omit<Form2Submission, 'id' | 'createdAt'>;

export interface IDropdownRepository {
    getOptions(category?: string): Promise<DropdownOption[]>;
    addOption(option: NewDropdownOption): Promise<DropdownOption>;
    deleteOption(id: number): Promise<void>;
}

export interface IForm1Repository {
    getSubmissions(): Promise<Form1Submission[]>;
    createSubmission(submission: NewForm1Submission): Promise<Form1Submission>;
}

export interface IForm2Repository {
    getSubmissions(): Promise<Form2Submission[]>;
    createSubmission(submission: NewForm2Submission): Promise<Form2Submission>;
    getPartDetailsByNumber(partNumber: string): Promise<Form2Submission | null>;
}
