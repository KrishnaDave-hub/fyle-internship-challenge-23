import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  apiUrl = 'https://api.github.com';
  access_token = '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';

  private repositoriesWithLanguagesSubject = new BehaviorSubject<any[]>([]);
  repositoriesWithLanguages$ = this.repositoriesWithLanguagesSubject.asObservable();

  getUserData(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }

  getUserAvatar(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/avatar_url`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }
  getUserBio(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/bio`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }
  getUserLocation(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/location`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }
  getUserTwitterName(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/twitter_username`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }
  getUserGithubLink(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/html_url`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }

  getUserRepositories(username: string): Observable<any[]> {
    const url = `${this.apiUrl}/users/${username}/repos`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }

  getRepositoryLanguages(username: string, repoName: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${username}/${repoName}/languages`;
    const headers = new HttpHeaders().set('Authorization', `token ${this.access_token}`);
    return this.httpClient.get<any>(url, { headers });
  }

  getUserRepositoriesWithLanguages(username: string): Observable<any> {
    return this.getUserData(username).pipe(
      mergeMap((userData: any) => {
        const userAvatar = userData.avatar_url;
        const userBio = userData.bio;
        const userLocation = userData.location;
        const userTwitterName = userData.twitter_username;
        const userGithubLink = userData.html_url;
        // console.log('User Avatar:', userLocation);

        return this.getUserRepositories(username).pipe(
          mergeMap((repos: any[]) => {

            const repoLangRequests = repos.map((repo: any) => {
              return this.getRepositoryLanguages(username, repo.name).pipe(
                map((languages) => ({
                  repoName: repo.name,
                  repoDesc: repo.description,
                  languages: Object.keys(languages),
                }))
              );
            });

            return forkJoin(repoLangRequests).pipe(
              map((repoLangData) => ({
                userAvatar,
                userBio,
                userLocation,
                userTwitterName,
                userGithubLink,
                repositories: repoLangData,
              }))
            );
          })
        );
      })
    );
  }


  setRepositoriesWithLanguages(data: any[]): void {
    this.repositoriesWithLanguagesSubject.next(data);
  }
}
