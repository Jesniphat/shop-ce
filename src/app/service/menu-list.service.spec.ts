import { TestBed, inject } from '@angular/core/testing';

import { MenuListService } from './menu-list.service';

describe('MenuListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuListService]
    });
  });

  it('should be created', inject([MenuListService], (service: MenuListService) => {
    expect(service).toBeTruthy();
  }));
});
