import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBoardComponent } from './transaction-board.component';

describe('TransactionBoardComponent', () => {
  let component: TransactionBoardComponent;
  let fixture: ComponentFixture<TransactionBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
