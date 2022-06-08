import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyacountComponent } from './myacount.component';

describe('MyacountComponent', () => {
  let component: MyacountComponent;
  let fixture: ComponentFixture<MyacountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyacountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyacountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
