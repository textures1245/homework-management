import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHomeworkComponent } from './group-homework.component';

describe('GroupHomeworkComponent', () => {
  let component: GroupHomeworkComponent;
  let fixture: ComponentFixture<GroupHomeworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupHomeworkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
