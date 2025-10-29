export interface LoginResponse {
  // API response shape is not documented; we safely probe common keys
  company_id?: string | number;
  companyId?: string | number;
  token?: string;
  status?: string;
  message?: string;
}
