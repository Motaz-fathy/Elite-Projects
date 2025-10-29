export const EMPLOYEE_STATUSES = ['All', 'Active', 'Suspended'] as const;
export type EmployeeStatusFilter = (typeof EMPLOYEE_STATUSES)[number];
