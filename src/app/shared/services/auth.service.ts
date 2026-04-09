import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { AuthNumberLoginState, AuthStateModal, AuthUserForgotModel, AuthUserStateModel, AuthVerifyNumberOTPState, RegisterModal, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  public redirectUrl: string | undefined;
  public otpType: string;

  constructor(private http: HttpClient) {}

  register(payload: RegisterModal): Observable<any>{
    return this.http.post(`${environment.URL}/register`, payload);
  }

  login(payload: AuthUserStateModel): Observable<any> {
    return this.http.post(`${environment.URL}/login`, payload);
  }

  loginWithNumber(payload: AuthNumberLoginState): Observable<AuthStateModal>{
    return this.http.post<AuthStateModal>(`${environment.URL}/login/number`,payload)
  }

  forgotPassword(payload: AuthUserForgotModel): Observable<any> {
    return this.http.post(`${environment.URL}/forgot-password`, payload);
  }

  verifyEmailOtp(payload: VerifyEmailOtpModel): Observable<any> {
    return this.http.post(`${environment.URL}/verify-token`, payload);
  }

  verifyNumberOtp(payload: AuthVerifyNumberOTPState): Observable<AuthStateModal> {
    return this.http.post<AuthStateModal>(`${environment.URL}/verify-otp`, payload);
  }

  updatePassword(payload: UpdatePasswordModel): Observable<any> {
    return this.http.post(`${environment.URL}/update-password`, payload);
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.URL}/logout`, {});
  }
  
  validatePinCode(payload: any): Observable<any> {
    return this.http.post(`${environment.URL}/validPincode`, payload);
  }

  // In-memory cache (across navigations within the SPA) and a sessionStorage
  // mirror (survives full page reloads within the same browser tab). The
  // /allCitiesList payload is large and rarely changes, so we fetch it at
  // most once per browser session.
  private citiesCache$: Observable<any> | null = null;
  private static readonly CITIES_CACHE_KEY = 'allCitiesList_cache_v1';

  fetchAreaPINCodeJSON(forceRefresh: boolean = false): Observable<any> {
    if (forceRefresh) {
      this.citiesCache$ = null;
      try { sessionStorage.removeItem(AuthService.CITIES_CACHE_KEY); } catch {}
    }

    if (this.citiesCache$) {
      return this.citiesCache$;
    }

    // Try sessionStorage (survives reloads within the same tab).
    try {
      const cached = sessionStorage.getItem(AuthService.CITIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        this.citiesCache$ = of(parsed).pipe(shareReplay(1));
        return this.citiesCache$;
      }
    } catch {}

    this.citiesCache$ = this.http.get<any>(`${environment.URL}/allCitiesList`).pipe(
      tap(res => {
        try {
          sessionStorage.setItem(AuthService.CITIES_CACHE_KEY, JSON.stringify(res));
        } catch {
          // sessionStorage may be full or unavailable; ignore.
        }
      }),
      shareReplay(1),
    );
    return this.citiesCache$;
  }


}
