import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Promotion } from '../shared/promotion';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(
    private http: HttpClient,
    private errorService: ProcessHTTPMsgService, 
  ) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.errorService.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
    .pipe(catchError(this.errorService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true')
    .pipe(map(promo => promo[0]))
    .pipe(catchError(this.errorService.handleError));
  }
}
