import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveAttendenceComponent } from './give-attendence.component';

describe('GiveAttendenceComponent', () => {
  let component: GiveAttendenceComponent;
  let fixture: ComponentFixture<GiveAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveAttendenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
