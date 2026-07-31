export interface RecentDocument {

    id: string;

    documentName: string;

    documentType: string;

    expiryDate: string | null;

    confidence: number;

}