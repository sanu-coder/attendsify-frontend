import { TestBed } from '@angular/core/testing';

import { AttendenceBackendService } from './attendence-backend.service';

describe('AttendenceBackendService', () => {
  let service: AttendenceBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendenceBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
