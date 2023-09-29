import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownHeaderContextMenuComponent } from './rundown-header-context-menu.component';

describe('HeaderContextMenuComponent', () => {
  let component: RundownHeaderContextMenuComponent;
  let fixture: ComponentFixture<RundownHeaderContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownHeaderContextMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownHeaderContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
