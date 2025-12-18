import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionsVersus } from './champions-versus';

describe('ChampionsVersus', () => {
  let component: ChampionsVersus;
  let fixture: ComponentFixture<ChampionsVersus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionsVersus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionsVersus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
