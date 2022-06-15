import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchqueryPage } from './searchquery.page';

describe('SearchqueryPage', () => {
  let component: SearchqueryPage;
  let fixture: ComponentFixture<SearchqueryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchqueryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchqueryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
