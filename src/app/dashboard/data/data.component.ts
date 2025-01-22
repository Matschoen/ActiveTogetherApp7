import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  public sortOrder: 'asc' | 'desc' = 'desc';
  public searchQuery: string = '';
  public deletingRegistrations: string[] = [];

  constructor(
    public storeService: StoreService,
    private backendService: BackendService
  ) {}

  public page: number = 0;

  selectPage(i: number) {
    this.page = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(i, this.sortOrder);
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.backendService.getRegistrations(this.storeService.currentPage, this.sortOrder);
  }

  public returnAllPages() {
    const pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2);
    const res: number[] = [];
    for (let i = 0; i < pagesCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public deleteRegistration(registrationId: string) {
    const confirmed = confirm('Möchten Sie diese Registrierung wirklich löschen?');
    if (confirmed) {
      this.deletingRegistrations.push(registrationId);
      this.backendService.deleteRegistration(registrationId).subscribe({
        next: () => {
          this.backendService.getRegistrations(this.storeService.currentPage);
          this.deletingRegistrations = this.deletingRegistrations.filter(
            id => id !== registrationId
          );
        },
        error: () => {
          this.deletingRegistrations = this.deletingRegistrations.filter(
            id => id !== registrationId
          );
        }
      });
    }
  }

  public isDeleting(registrationId: string): boolean {
    return this.deletingRegistrations.includes(registrationId);
  }

  public getFilteredRegistrations() {
    const searchText = this.searchQuery.toLowerCase();
    return this.storeService.registrations.filter(registration =>
      registration.name.toLowerCase().includes(searchText) ||
      registration.course.name.toLowerCase().includes(searchText) ||
      registration.registrationDate?.toLowerCase().includes(searchText)
    );
  }
}
