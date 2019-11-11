import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsAddComponent } from './add.component';

describe('AddComponent', () => {
  let component: TransactionsAddComponent;
  let fixture: ComponentFixture<TransactionsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
