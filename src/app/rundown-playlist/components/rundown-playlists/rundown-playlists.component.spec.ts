import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownPlaylistsComponent } from './rundown-playlists.component';

describe('RundownOverviewComponent', () => {
  let component: RundownPlaylistsComponent;
  let fixture: ComponentFixture<RundownPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownPlaylistsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
