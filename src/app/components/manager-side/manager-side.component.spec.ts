import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSideComponent } from './manager-side.component';

describe('ManagerSideComponent', () => {
  let component: ManagerSideComponent;
  let fixture: ComponentFixture<ManagerSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
