import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';



import { GenericHttpService } from '../@shared/services/generic-http.service';
import { environment } from '../environments/environment';


const API_USERS_URL = `${environment.serverUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient,
    private genericHttpService: GenericHttpService
    ) {}


    checkmoobile(data: any): Observable<any> {
      return this.genericHttpService.post<any>(`/auth/mobile/check`, data);
    }

    loginWithPassword(data: { mobile: string; password: string }): Observable<any> {
      return this.genericHttpService.post<any>(`/auth/login/password`, data);
    }
    
    loginWithSms(data: { mobile: string; confirmCode: string }): Observable<any> {
      return this.genericHttpService.post<any>('/auth/login/sms', data);
    }
    resendConfirmCode(data: any): Observable<any> {     
      return this.genericHttpService.post<any>(`/auth/sms/resend`, data);
    }
    setPassword(data:any):Observable<any> {      
      return this.genericHttpService.put(`/auth/password/set`, data);
    }

    resetPassword(data:any):Observable<any> {
      return this.genericHttpService.post('/auth/password/forgot', data);
    }

    loginPassword(data: any): Observable<any> {
      return this.genericHttpService.post<any>(`/auth/login/password`, data);
    }
    verifyToken(): Observable<any> {
      return this.genericHttpService.get(`/users/me`);
    }

}
