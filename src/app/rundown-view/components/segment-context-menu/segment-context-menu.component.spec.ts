import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentContextMenuComponent } from './segment-context-menu.component';

describe('SegmentContextMenuComponent', () => {
  let component: SegmentContextMenuComponent;
  let fixture: ComponentFixture<SegmentContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentContextMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
