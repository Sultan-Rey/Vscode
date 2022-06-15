import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpcenterPage } from './helpcenter.page';

describe('HelpcenterPage', () => {
  let component: HelpcenterPage;
  let fixture: ComponentFixture<HelpcenterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpcenterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpcenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
