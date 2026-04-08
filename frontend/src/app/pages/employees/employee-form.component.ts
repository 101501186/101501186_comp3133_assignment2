import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeFormValue } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">{{ isEditMode() ? 'Update Employee' : 'Add Employee' }}</p>
          <h2>{{ isEditMode() ? 'Edit Employee Information' : 'Create Employee Record' }}</h2>
          <p>Fill in all required employee fields and optionally attach a profile image.</p>
        </div>

        <a routerLink="/employees" class="secondary-link">Back to list</a>
      </div>

      @if (errorMessage()) {
        <p class="banner error">{{ errorMessage() }}</p>
      }

      <form class="form-card" [formGroup]="employeeForm" (ngSubmit)="onSubmit()" novalidate>
        <div class="field-grid">
          <label>
            First Name
            <input type="text" formControlName="first_name" />
          </label>

          <label>
            Last Name
            <input type="text" formControlName="last_name" />
          </label>

          <label>
            Email
            <input type="email" formControlName="email" />
          </label>

          <label>
            Gender
            <select formControlName="gender">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Department
            <input type="text" formControlName="department" />
          </label>

          <label>
            Designation
            <input type="text" formControlName="designation" />
          </label>

          <label>
            Salary
            <input type="number" formControlName="salary" min="1000" />
          </label>

          <label>
            Date of Joining
            <input type="date" formControlName="date_of_joining" />
          </label>
        </div>

        <div class="upload-block">
          <label>
            Profile Picture URL
            <input type="url" formControlName="profile_picture" placeholder="https://example.com/photo.jpg" />
          </label>

          <p class="hint">You can paste an image URL or choose a local file below.</p>

          <label class="file-input">
            Upload Local Image
            <input type="file" accept="image/*" (change)="onFileSelected($event)" />
          </label>

          @if (imagePreview()) {
            <img [src]="imagePreview()" alt="Employee preview" class="preview-image" />
          }
        </div>

        @if (employeeForm.invalid && (employeeForm.dirty || employeeForm.touched)) {
          <p class="banner error">Please complete the required fields before submitting.</p>
        }

        <div class="button-row">
          <button type="submit" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Saving...' : (isEditMode() ? 'Update Employee' : 'Add Employee') }}
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .form-shell {
      display: grid;
      gap: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: end;
      flex-wrap: wrap;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: #7c3aed;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
    }

    h2,
    p {
      margin: 0;
    }

    .secondary-link {
      padding: 12px 18px;
      border-radius: 999px;
      text-decoration: none;
      background: #e2e8f0;
      color: #1f2937;
      font-weight: 700;
    }

    .form-card {
      padding: 28px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.24);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
      display: grid;
      gap: 24px;
    }

    .field-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    label {
      display: grid;
      gap: 8px;
      color: #334155;
      font-weight: 600;
    }

    input,
    select {
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      padding: 12px 14px;
      font: inherit;
    }

    input:focus,
    select:focus {
      outline: 2px solid #7c3aed;
      outline-offset: 2px;
      border-color: #7c3aed;
    }

    .upload-block {
      display: grid;
      gap: 14px;
      padding: 18px;
      border-radius: 20px;
      background: #faf5ff;
    }

    .hint {
      color: #6b7280;
    }

    .file-input input {
      padding: 0;
      border: 0;
    }

    .preview-image {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 24px;
      border: 1px solid #d8b4fe;
      background: white;
    }

    .button-row {
      display: flex;
      justify-content: end;
    }

    button {
      border: 0;
      border-radius: 16px;
      padding: 14px 20px;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      color: white;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    .banner {
      margin: 0;
      padding: 14px 16px;
      border-radius: 16px;
    }

    .banner.error {
      background: #fee2e2;
      color: #b91c1c;
    }

    @media (max-width: 720px) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly isEditMode = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly imagePreview = signal<string | null>(null);

  private employeeId: string | null = null;

  protected readonly employeeForm = this.fb.nonNullable.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.email]],
    profile_picture: [''],
    gender: [''],
    designation: ['', [Validators.required]],
    salary: [1000, [Validators.required, Validators.min(1000)]],
    date_of_joining: ['', [Validators.required]],
    department: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (this.employeeId) {
      this.isEditMode.set(true);
      this.loadEmployee(this.employeeId);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.employeeForm.patchValue({ profile_picture: result });
      this.imagePreview.set(result);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.buildPayload();

    const request = this.isEditMode() && this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, formValue)
      : this.employeeService.addEmployee(formValue);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.message ?? 'Unable to save employee.');
      }
    });
  }

  private loadEmployee(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        const dateValue = employee.date_of_joining.slice(0, 10);

        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email ?? '',
          profile_picture: employee.profile_picture ?? '',
          gender: employee.gender ?? '',
          designation: employee.designation,
          salary: employee.salary,
          date_of_joining: dateValue,
          department: employee.department
        });

        this.imagePreview.set(employee.profile_picture ?? null);
      },
      error: (error) => {
        this.errorMessage.set(error.message ?? 'Unable to load employee.');
      }
    });
  }

  private buildPayload(): EmployeeFormValue {
    const rawValue = this.employeeForm.getRawValue();

    return {
      ...rawValue,
      email: rawValue.email || null,
      profile_picture: rawValue.profile_picture || null,
      gender: rawValue.gender || null,
      salary: Number(rawValue.salary)
    };
  }
}
