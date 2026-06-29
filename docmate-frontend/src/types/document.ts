export interface Document {

    id: string;

    documentName: string;

    documentType: string;

    issueDate: string | null;

    expiryDate: string | null;

    documentNumber: string | null;

    confidence: number;

    status: string;

}