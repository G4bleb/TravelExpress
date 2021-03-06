import { User } from './user';

export interface Trip {
    _id: string;
    user: User | string;
    fromLocation: string;
    fromDate: Date;
    toLocation: string;
    toDate: Date;
    repeat: string;
    endRepeat: Date;
}
