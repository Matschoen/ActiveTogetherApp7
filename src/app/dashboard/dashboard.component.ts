import { Component } from '@angular/core';
import { DataComponent } from './data/data.component';
import { AddDataComponent } from './add-data/add-data.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataComponent, AddDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

}
