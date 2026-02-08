import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaPremioComponent } from './tienda-premio.component';

describe('TiendaPremioComponent', () => {
  let component: TiendaPremioComponent;
  let fixture: ComponentFixture<TiendaPremioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaPremioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaPremioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
