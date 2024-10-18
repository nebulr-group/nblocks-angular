import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NblocksAngularComponent } from './nblocks-angular.component';

describe('NblocksAngularComponent', () => {
  let component: NblocksAngularComponent;
  let fixture: ComponentFixture<NblocksAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NblocksAngularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NblocksAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
