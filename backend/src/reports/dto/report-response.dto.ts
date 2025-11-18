export interface MonthlyData {
  month: string;
  income: number;
  transactions: number;
}

export interface MonthlyIncomeResponse {
  year: number;
  months: MonthlyData[];
}

export interface PaymentMethodData {
  method: string;
  count: number;
  total: number;
}

export interface PaymentMethodsResponse {
  period: { startDate: Date; endDate: Date };
  methods: PaymentMethodData[];
}

export interface TopCustomerData {
  email: string;
  name: string;
  rentals: number;
  totalSpent: number;
}

export interface TopCustomersResponse {
  period: { startDate: Date; endDate: Date };
  topCustomers: TopCustomerData[];
}

export interface TopDressData {
  dressId: string;
  rentals: number;
}

export interface TopDressesResponse {
  topDresses: TopDressData[];
}

export interface ConversionMetrics {
  totalCustomers: number;
  payingCustomers: number;
  conversionRate: number;
}

export interface DashboardKPIs {
  totalIncome: number;
  totalPayments: number;
  pendingPayments: number;
  totalCustomers: number;
  activeRentals: number;
  completedRentals: number;
}

export interface DashboardResponse {
  period: { startDate: Date; endDate: Date };
  kpis: DashboardKPIs;
  timestamp: Date;
}

export interface SummaryMetrics {
  totalRevenue: number;
  averageTransactionValue: number;
  successRate: number;
  conversionMetrics: ConversionMetrics;
}

export interface SummaryResponse {
  period: { startDate: Date; endDate: Date };
  metrics: SummaryMetrics;
}

export interface QueryResult {
  total?: string;
  count?: string;
  month?: string;
  method?: string;
  email?: string;
  name?: string;
  rentals?: string;
  dressId?: string;
  average?: string;
}
