export interface Search {
    fromLocation: string;
    toLocation: string;
    minFromDate: Date;
    maxFromDate: Date;
    minToDate: Date;
    maxToDate: Date;
    minSeats: number;
    minLuggage: string;
    minTalk: string;
    maxTalk: string;
    smoke: boolean;
    page: number;
    pageSize: number;
}
