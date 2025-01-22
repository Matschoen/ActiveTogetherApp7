import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {StoreService} from '../../shared/store.service';
import {BackendService} from '../../shared/backend.service';
import {MatFormField, MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    NgForOf,
    MatLabel,
    MatOption,
    MatFormField,
    NgIf
  ]
})
export class AddDataComponent implements OnInit {
  public registrationForm!: FormGroup;
  public showToast = false;

  constructor(
    private formBuilder: FormBuilder,
    public storeService: StoreService,
    private backendService: BackendService
  ) {
  }

  ngOnInit(): void {
    const savedData = JSON.parse(localStorage.getItem('registrationData') || '{}');

    this.registrationForm = this.formBuilder.group({
      name: [savedData.name || '', [Validators.required]],
      courseId: [savedData.courseId || '', Validators.required],
      birthdate: [savedData.birthdate || null, Validators.required],
      newsletter: [savedData.newsletter || false]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const newRegistration = {
        ...this.registrationForm.value,
        registrationDate: new Date().toISOString()
      };

      localStorage.setItem('registrationData', JSON.stringify(this.registrationForm.value));

      this.backendService.addRegistration(newRegistration, this.storeService.currentPage);

      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);

      this.registrationForm.reset();
    }
  }
}
