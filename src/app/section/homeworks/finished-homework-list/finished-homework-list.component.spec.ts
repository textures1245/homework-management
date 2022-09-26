import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedHomeworkListComponent } from './finished-homework-list.component';

describe('FinishedHomeworkListComponent', () => {
  let component: FinishedHomeworkListComponent;
  let fixture: ComponentFixture<FinishedHomeworkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedHomeworkListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedHomeworkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
