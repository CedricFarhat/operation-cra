import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyEventModalComponent } from './modify-event-modal.component';

describe('ModifyEventModalComponent', () => {
  let component: ModifyEventModalComponent;
  let fixture: ComponentFixture<ModifyEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyEventModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
