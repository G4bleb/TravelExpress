import {User} from './user';

export interface Trip {
    id: number;
    user: User;
    fromLocation: string;
    fromDate: Date;
    toLocation: string;
    toDate: Date;
    repeat: string;
}
