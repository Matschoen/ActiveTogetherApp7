import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {

  constructor(
    public storeService: StoreService,
    private backendService: BackendService
  ) {}

  public page: number = 0;

  // Hier sammeln wir alle Registrierung-IDs, die gerade gelöscht werden,
  // damit wir den Spinner/Overlay nur in der betroffenen Zeile anzeigen.
  public deletingRegistrations: string[] = [];

  selectPage(i: number) {
    this.page = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(i);
  }

  public returnAllPages() {
    const pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2);
    const res: number[] = [];
    for (let i = 0; i < pagesCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  // Methode zum Löschen (Abmelden) einer Registrierung
  public deleteRegistration(registrationId: string) {
    // 1) Merken, dass diese Registrierung im "Lösch-Prozess" ist:
    this.deletingRegistrations.push(registrationId);

    // 2) Request an das Backend
    this.backendService.deleteRegistration(registrationId).subscribe({
      next: () => {
        // Nach erfolgreichem Löschen -> Neue Daten holen
        // und removing aus dem "deletingRegistrations"-Array
        this.deletingRegistrations = this.deletingRegistrations.filter(id => id !== registrationId);
      },
      error: () => {
        // Falls Fehler, Spinner wieder entfernen:
        this.deletingRegistrations = this.deletingRegistrations.filter(id => id !== registrationId);
      }
    });
  }

  // Check, ob gerade gelöscht wird:
  public isDeleting(registrationId: string): boolean {
    return this.deletingRegistrations.includes(registrationId);
  }

}
