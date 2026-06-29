export interface DashboardResponse {
  totalDocuments: number;
  activeDocuments: number;
  expiringSoonDocuments: number;
  expiredDocuments: number;
  noRenewalRequiredDocuments: number;
}