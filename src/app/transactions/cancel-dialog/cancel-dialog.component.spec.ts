import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDialogComponent } from './cancel-dialog.component';

describe('CancelTransactionDialogComponent', () => {
  let component: CancelTransactionDialogComponent;
  let fixture: ComponentFixture<CancelTransactionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
