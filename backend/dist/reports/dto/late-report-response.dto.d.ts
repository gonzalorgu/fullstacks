export interface LateReservation {
    id: string;
    reservationId: string;
    clientName: string;
    clientPhone: string;
    dressName: string;
    dressImage: string | null;
    rentalStartDate: string;
    rentalEndDate: string;
    actualReturnDate?: string;
    daysLate: number;
    lateFee: number;
    status: string;
}
export interface LateReportSummary {
    totalLateReservations: number;
    totalLateFees: number;
    averageDaysLate: number;
}
