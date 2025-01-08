import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient, private storeService: StoreService) {}

  public getCourses() {
    this.http
    .get<Course[]>('http://localhost:5000/courses?_expand=eventLocation')
    .subscribe(data => {
      this.storeService.courses = data;
    });
  }

  public getRegistrations(page: number, order: 'asc' | 'desc' = 'desc'): void {
    const options = {
      observe: 'response' as const,
      transferCache: {
        includeHeaders: ['X-Total-Count']
      }
    };

    this.http
    .get<Registration[]>(
      `http://localhost:5000/registrations?_expand=course&_page=${page}&_limit=2&_sort=registrationDate&_order=${order}`,
      options
    )
    .subscribe(response => {
      this.storeService.registrations = response.body!;
      this.storeService.registrationTotalCount = Number(
        response.headers.get('X-Total-Count')
      );
    });
  }

  public addRegistration(registration: any, page: number) {
    this.http
    .post('http://localhost:5000/registrations', registration)
    .subscribe(_ => {
      this.getRegistrations(page, 'desc');
    });
  }

  public deleteRegistration(registrationId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:5000/registrations/${registrationId}`
    );
  }
}
