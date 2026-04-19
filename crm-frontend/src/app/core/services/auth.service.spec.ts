import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token on login', () => {
    const mockResponse = { token: 'fake-jwt-token', id: '1', email: 'test@crm.com', fullName: 'Tester' };
    
    service.login({ email: 'test@crm.com', password: 'password' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('crm_token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('crm_user')).toBeTruthy();
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should clear storage on logout', () => {
    localStorage.setItem('crm_token', 'exists');
    service.logout();
    expect(localStorage.getItem('crm_token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should check authentication status', () => {
    expect(service.isLoggedIn()).toBeFalse();
    // Simulate re-initialization or signal update
    const user = { id: '1', email: 'test@crm.com', fullName: 'Tester' };
    localStorage.setItem('crm_user', JSON.stringify(user));
    // Note: in actual app, refreshing would call constructor
    // For test, we verify the computed property works if user signal is set
    (service as any).userSignal.set(user);
    expect(service.isLoggedIn()).toBeTrue();
  });
});
