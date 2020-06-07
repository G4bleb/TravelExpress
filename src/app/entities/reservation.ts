import {Trip} from './trip';
import {User} from './user';


export interface Reservation {
    _id: number;
    trip: Trip | string;
    user: User | string;
    seats: number;
    paid: boolean;
}
