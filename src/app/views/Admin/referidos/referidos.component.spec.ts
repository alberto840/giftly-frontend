import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferidosComponent } from './referidos.component';

describe('ReferidosComponent', () => {
  let component: ReferidosComponent;
  let fixture: ComponentFixture<ReferidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
