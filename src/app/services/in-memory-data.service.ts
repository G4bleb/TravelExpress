import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from '@app/entities';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      {
        id: "11",
        mail: 'test@mail.com',
        password: 'testtest',
        tel: "000",
        firstName: "John",
        lastName: "Doe",
        vehicle: "Fiat Multipla",
        seats: 3,
        baggage: "medium",
        talk: "no",
        smoke: false,
        token: "1231456",
      },
    ];
    return { users };
  }

  // Overrides the genId method to ensure that a user always has an id.
  genId(users: User[]): string {
    return users.length > 0 ? Math.max(...users.map(user => +user.id)).toString(): "11";
  }
}