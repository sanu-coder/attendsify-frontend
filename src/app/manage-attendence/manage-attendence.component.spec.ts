import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAttendenceComponent } from './manage-attendence.component';

describe('ManageAttendenceComponent', () => {
  let component: ManageAttendenceComponent;
  let fixture: ComponentFixture<ManageAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAttendenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
