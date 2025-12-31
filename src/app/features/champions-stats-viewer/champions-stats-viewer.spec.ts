import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionsStatsViewer } from './champions-stats-viewer';

describe('ChampionsStatsViewer', () => {
  let component: ChampionsStatsViewer;
  let fixture: ComponentFixture<ChampionsStatsViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionsStatsViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionsStatsViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
