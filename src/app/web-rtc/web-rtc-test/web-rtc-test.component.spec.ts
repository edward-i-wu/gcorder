import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebRtcTestComponent } from './web-rtc-test.component';

describe('WebRtcTestComponent', () => {
  let component: WebRtcTestComponent;
  let fixture: ComponentFixture<WebRtcTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebRtcTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebRtcTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
