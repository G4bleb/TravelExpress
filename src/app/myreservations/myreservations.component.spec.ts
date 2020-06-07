import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationsComponent } from './myreservations.component';

describe('MyreservationsComponent', () => {
  let component: MyReservationsComponent;
  let fixture: ComponentFixture<MyReservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyReservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
