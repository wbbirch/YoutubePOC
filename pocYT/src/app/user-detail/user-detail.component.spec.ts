import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserDetailComponent } from './user-detail.component';
import { AuthService } from 'src/app/auth.service';
import { YtService } from 'src/app/yt.service';
import { Router } from '@angular/router';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: undefined
        },
        {
          provide: YtService,
          useValue: undefined
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('*PENDING* is created', () => {
    expect(component).toBeTruthy();
  });
});