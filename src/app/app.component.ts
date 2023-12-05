import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = "Fyle Internship Challenge"
  inputUser:any=''

  repositoriesWithLanguages: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getUserRepositories();
  }

  getUserRepositories(): void {
    this.apiService.getUserRepositoriesWithLanguages(this.inputUser).subscribe(
      (reposWithLangs: any[]) => {
        this.apiService.setRepositoriesWithLanguages(reposWithLangs);
      },
      error => {
        console.error('Error fetching repositories and languages:', error);
      }
    );
  }
}
