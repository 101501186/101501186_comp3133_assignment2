import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map, Observable, tap } from 'rxjs';
import { SessionService } from './session.service';

interface LoginResponse {
  login: string;
}

interface SignupResponse {
  signup: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apollo = inject(Apollo);
  private readonly sessionService = inject(SessionService);

  login(usernameOrEmail: string, password: string): Observable<string> {
    const isEmail = usernameOrEmail.includes('@');

    return this.apollo.query<LoginResponse>({
      query: gql`
        query Login($username: String, $email: String, $password: String!) {
          login(username: $username, email: $email, password: $password)
        }
      `,
      variables: {
        username: isEmail ? null : usernameOrEmail,
        email: isEmail ? usernameOrEmail : null,
        password
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((result) => {
        const token = result.data?.login;

        if (!token) {
          throw new Error('Login did not return a session token.');
        }

        return token;
      }),
      tap((token) => this.sessionService.setToken(token))
    );
  }

  signup(username: string, email: string, password: string): Observable<string> {
    return this.apollo.mutate<SignupResponse>({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password)
        }
      `,
      variables: {
        username,
        email,
        password
      }
    }).pipe(
      map((result) => result.data?.signup ?? 'User created successfully')
    );
  }
}
