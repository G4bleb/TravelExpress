import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTripComponent } from './book.component';

describe('BookComponent', () => {
  let component: BookTripComponent;
  let fixture: ComponentFixture<BookTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
