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

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getCourses() {
    this.http.get<Course[]>('http://localhost:5000/courses?_expand=eventLocation').subscribe(data => {
      this.storeService.courses = data;
    });
  }

  // Sortierung nach registrationDate (DESC) + Pagination
  public getRegistrations(page: number) {
    const options = {
      observe: 'response' as const,
      transferCache: {
        includeHeaders: ['X-Total-Count']
      }
    };

    this.http.get<Registration[]>(
      `http://localhost:5000/registrations?_expand=course&_page=${page}&_limit=2&_sort=registrationDate&_order=desc`,
      options
    ).subscribe(data => {
      this.storeService.registrations = data.body!;
      this.storeService.registrationTotalCount = Number(data.headers.get('X-Total-Count'));
    });
  }

  public addRegistration(registration: any, page: number) {
    this.http.post('http://localhost:5000/registrations', registration).subscribe(_ => {
      this.getRegistrations(page);
    });
  }

  // DELETE-Request (Abmelden)
  public deleteRegistration(registrationId: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/registrations/${registrationId}`);
  }
}
