import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import { Employee, EmployeeFormValue } from '../models/employee.model';

interface GetEmployeesResponse {
  getEmployees: Employee[];
}

interface GetEmployeeResponse {
  getEmployeeById: Employee;
}

interface AddEmployeeResponse {
  addEmployee: Employee;
}

interface UpdateEmployeeResponse {
  updateEmployee: Employee;
}

interface DeleteEmployeeResponse {
  deleteEmployee: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apollo = inject(Apollo);

  getEmployees(): Observable<Employee[]> {
    return this.apollo.query<GetEmployeesResponse>({
      query: gql`
        query GetEmployees {
          getEmployees {
            _id
            first_name
            last_name
            email
            profile_picture
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `,
      fetchPolicy: 'no-cache'
    }).pipe(
      map((result) => result.data?.getEmployees ?? [])
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query<GetEmployeeResponse>({
      query: gql`
        query GetEmployeeById($id: ID!) {
          getEmployeeById(id: $id) {
            _id
            first_name
            last_name
            email
            profile_picture
            gender
            designation
            salary
            date_of_joining
            department
          }
        }
      `,
      variables: { id },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((result) => {
        const employee = result.data?.getEmployeeById;

        if (!employee) {
          throw new Error('Employee not found.');
        }

        return employee;
      })
    );
  }

  addEmployee(employee: EmployeeFormValue): Observable<Employee> {
    return this.apollo.mutate<AddEmployeeResponse>({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!
          $last_name: String!
          $email: String
          $profile_picture: String
          $gender: String
          $designation: String!
          $salary: Float!
          $date_of_joining: String!
          $department: String!
        ) {
          addEmployee(
            first_name: $first_name
            last_name: $last_name
            email: $email
            profile_picture: $profile_picture
            gender: $gender
            designation: $designation
            salary: $salary
            date_of_joining: $date_of_joining
            department: $department
          ) {
            _id
          }
        }
      `,
      variables: employee
    }).pipe(
      map((result) => {
        const createdEmployee = result.data?.addEmployee;

        if (!createdEmployee) {
          throw new Error('Employee could not be created.');
        }

        return createdEmployee;
      })
    );
  }

  updateEmployee(id: string, employee: Partial<EmployeeFormValue>): Observable<Employee> {
    return this.apollo.mutate<UpdateEmployeeResponse>({
      mutation: gql`
        mutation UpdateEmployee(
          $id: ID!
          $first_name: String
          $last_name: String
          $email: String
          $profile_picture: String
          $gender: String
          $designation: String
          $salary: Float
          $date_of_joining: String
          $department: String
        ) {
          updateEmployee(
            id: $id
            first_name: $first_name
            last_name: $last_name
            email: $email
            profile_picture: $profile_picture
            gender: $gender
            designation: $designation
            salary: $salary
            date_of_joining: $date_of_joining
            department: $department
          ) {
            _id
            first_name
            last_name
          }
        }
      `,
      variables: {
        id,
        ...employee
      }
    }).pipe(
      map((result) => {
        const updatedEmployee = result.data?.updateEmployee;

        if (!updatedEmployee) {
          throw new Error('Employee could not be updated.');
        }

        return updatedEmployee;
      })
    );
  }

  deleteEmployee(id: string): Observable<string> {
    return this.apollo.mutate<DeleteEmployeeResponse>({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id }
    }).pipe(
      map((result) => result.data?.deleteEmployee ?? 'Employee deleted')
    );
  }
}
