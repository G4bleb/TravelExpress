import {User} from './user';

export interface Trip {
    _id: number;
    user: User;
    fromLocation: string;
    fromDate: Date;
    toLocation: string;
    toDate: Date;
    repeat: string;
    endRepeat: Date;
}
