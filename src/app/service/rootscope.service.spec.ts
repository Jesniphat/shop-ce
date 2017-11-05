/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RootscopeService } from './rootscope.service';

describe('RootscopeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RootscopeService]
    });
  });

  it('should ...', inject([RootscopeService], (service: RootscopeService) => {
    expect(service).toBeTruthy();
  }));
});
