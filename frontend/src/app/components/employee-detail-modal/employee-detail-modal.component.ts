import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  template: `
    @if (employee) {
      <div class="overlay" (click)="close.emit()">
        <section class="modal-card" (click)="$event.stopPropagation()">
          <button type="button" class="close-button" (click)="close.emit()">Close</button>

          <div class="profile-header">
            <img
              [src]="employee.profile_picture || fallbackImage"
              [alt]="employee.first_name + ' ' + employee.last_name"
            />

            <div>
              <p class="eyebrow">Employee Details</p>
              <h3>{{ employee.first_name }} {{ employee.last_name }}</h3>
              <p>{{ employee.designation }} - {{ employee.department }}</p>
            </div>
          </div>

          <div class="detail-grid">
            <article>
              <span>Email</span>
              <strong>{{ employee.email || 'Not provided' }}</strong>
            </article>
            <article>
              <span>Gender</span>
              <strong>{{ employee.gender || 'Not provided' }}</strong>
            </article>
            <article>
              <span>Salary</span>
              <strong>{{ employee.salary | number:'1.2-2' }}</strong>
            </article>
            <article>
              <span>Date Joined</span>
              <strong>{{ employee.date_of_joining | date:'mediumDate' }}</strong>
            </article>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      display: grid;
      place-items: center;
      padding: 20px;
      z-index: 20;
    }

    .modal-card {
      width: min(680px, 100%);
      padding: 28px;
      border-radius: 28px;
      background: white;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
      position: relative;
      display: grid;
      gap: 24px;
    }

    .close-button {
      justify-self: end;
      border: 0;
      border-radius: 999px;
      padding: 10px 14px;
      background: #e2e8f0;
      cursor: pointer;
    }

    .profile-header {
      display: grid;
      gap: 20px;
      grid-template-columns: 120px 1fr;
      align-items: center;
    }

    img {
      width: 120px;
      height: 120px;
      border-radius: 24px;
      object-fit: cover;
      background: #e2e8f0;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: #1d4ed8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
    }

    h3,
    p {
      margin: 0;
    }

    .detail-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    article {
      padding: 16px;
      border-radius: 18px;
      background: #f8fafc;
      display: grid;
      gap: 6px;
    }

    span {
      color: #64748b;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media (max-width: 640px) {
      .profile-header,
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeDetailModalComponent {
  @Input() employee: Employee | null = null;
  @Output() close = new EventEmitter<void>();

  protected readonly fallbackImage =
    'https://placehold.co/320x320/e2e8f0/475569?text=Employee';
}
