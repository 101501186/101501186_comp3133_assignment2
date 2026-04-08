import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDetailModalComponent } from '../../components/employee-detail-modal/employee-detail-modal.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ReactiveFormsModule, EmployeeDetailModalComponent],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">Employee Management</p>
          <h2>Employee List</h2>
          <p>Manage employees, open profile details, and move into edit or delete actions from one screen.</p>
        </div>

        <a routerLink="/employees/new" class="primary-link">Add Employee</a>
      </div>

      <form class="search-card" [formGroup]="searchForm" (ngSubmit)="searchEmployees()">
        <label>
          Search by Department or Position
          <input type="text" formControlName="searchTerm" placeholder="Sales, Manager, Developer..." />
        </label>

        <div class="search-actions">
          <button type="submit">Search</button>
          <button type="button" class="secondary" (click)="resetSearch()">Clear</button>
        </div>
      </form>

      @if (errorMessage()) {
        <p class="banner error">{{ errorMessage() }}</p>
      }

      @if (successMessage()) {
        <p class="banner success">{{ successMessage() }}</p>
      }

      @if (isSearchActive()) {
        <p class="search-summary">
          Showing filtered results for department or position matches.
        </p>
      }

      <div class="table-card">
        @if (isLoading()) {
          <p class="empty-state">Loading employees...</p>
        } @else if (employees().length === 0) {
          <p class="empty-state">No employees found</p>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Date Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (employee of employees(); track employee._id) {
                  <tr>
                    <td>
                      <img
                        [src]="employee.profile_picture || fallbackImage"
                        [alt]="employee.first_name + ' ' + employee.last_name"
                      />
                    </td>
                    <td>{{ employee.first_name }} {{ employee.last_name }}</td>
                    <td>{{ employee.email || 'N/A' }}</td>
                    <td>{{ employee.department }}</td>
                    <td>{{ employee.designation }}</td>
                    <td>{{ employee.date_of_joining | date:'mediumDate' }}</td>
                    <td>
                      <div class="action-group">
                        <button type="button" (click)="viewEmployee(employee._id)">View</button>
                        <button type="button" class="secondary" (click)="editEmployee(employee._id)">Edit</button>
                        <button type="button" class="danger" (click)="deleteEmployee(employee._id)">Delete</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </section>

    <app-employee-detail-modal
      [employee]="selectedEmployee()"
      (close)="selectedEmployee.set(null)"
    />
  `,
  styles: [`
    .page-shell {
      display: grid;
      gap: 22px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: end;
      flex-wrap: wrap;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: #0f766e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
    }

    h2,
    p {
      margin: 0;
    }

    .primary-link {
      padding: 12px 18px;
      border-radius: 999px;
      text-decoration: none;
      background: linear-gradient(135deg, #0f766e, #2563eb);
      color: white;
      font-weight: 700;
    }

    .banner {
      margin: 0;
      padding: 14px 16px;
      border-radius: 16px;
    }

    .search-card {
      padding: 20px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.24);
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
      display: grid;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 8px;
      color: #334155;
      font-weight: 600;
    }

    input {
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      padding: 12px 14px;
      font: inherit;
    }

    input:focus {
      outline: 2px solid #0f766e;
      outline-offset: 2px;
      border-color: #0f766e;
    }

    .search-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .banner.error {
      background: #fee2e2;
      color: #b91c1c;
    }

    .banner.success {
      background: #dcfce7;
      color: #166534;
    }

    .search-summary {
      color: #0f766e;
      font-weight: 600;
    }

    .table-card {
      padding: 18px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.24);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
    }

    .table-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 14px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }

    th {
      color: #475569;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    img {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      object-fit: cover;
      background: #e2e8f0;
    }

    .action-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    button {
      border: 0;
      border-radius: 999px;
      padding: 10px 14px;
      font: inherit;
      background: #dbeafe;
      color: #1d4ed8;
      cursor: pointer;
    }

    button.secondary {
      background: #ecfeff;
      color: #0f766e;
    }

    button.danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    .empty-state {
      padding: 36px 20px;
      text-align: center;
      color: #475569;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly selectedEmployee = signal<Employee | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSearchActive = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly fallbackImage =
    'https://placehold.co/200x200/e2e8f0/475569?text=Employee';
  protected readonly searchForm = this.fb.nonNullable.group({
    searchTerm: ['']
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message ?? 'Unable to load employees.');
        this.isLoading.set(false);
      }
    });
  }

  searchEmployees(): void {
    const { searchTerm } = this.searchForm.getRawValue();
    const trimmedSearchTerm = searchTerm.trim();
    const hasFilters = Boolean(trimmedSearchTerm);

    if (!hasFilters) {
      this.resetSearch();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.employeeService.searchEmployees(trimmedSearchTerm).subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.isSearchActive.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message ?? 'Unable to search employees.');
        this.isLoading.set(false);
      }
    });
  }

  resetSearch(): void {
    this.searchForm.reset({
      searchTerm: ''
    });
    this.isSearchActive.set(false);
    this.loadEmployees();
  }

  viewEmployee(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.selectedEmployee.set(employee);
      },
      error: (error) => {
        this.errorMessage.set(error.message ?? 'Unable to load employee details.');
      }
    });
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(id: string): void {
    const confirmed = window.confirm('Delete this employee record?');

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: (message) => {
        this.successMessage.set(message);
        this.employees.set(this.employees().filter((employee) => employee._id !== id));
      },
      error: (error) => {
        this.errorMessage.set(error.message ?? 'Unable to delete employee.');
      }
    });
  }
}
