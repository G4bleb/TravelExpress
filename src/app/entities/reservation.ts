import {Trip} from './trip';
import {User} from './user';


export interface Reservation {
    _id: number;
    trip: Trip;
    user: User;
    seats: number;
    paid: boolean;
}
