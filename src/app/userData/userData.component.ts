import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-userData',
  templateUrl: './userData.component.html',
  styleUrls: ['./userData.component.scss']
})
export class UserDataComponent implements OnInit {
  repositoriesWithLanguages: any[] = [];
  userAvatar:string=""
  userBio:string=""
  userLocation:string=""
  userTwitterName:string=""
  userGithubLink:string=""

  @Input() inputUser:any=''

  // For Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pagedData: any[] = [];


  constructor(private apiService :ApiService) {}

  ngOnInit(): void {
    this.apiService.repositoriesWithLanguages$.subscribe((data:any) => {
      this.repositoriesWithLanguages = data.repositories;
      this.userAvatar = data.userAvatar;
      this.userBio = data.userBio;
      this.userLocation = data.userLocation;
      this.userTwitterName = data.userTwitterName;
      this.userGithubLink = data.userGithubLink;
    });

    this.setPage(this.currentPage);
  }

  setPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedData = this.repositoriesWithLanguages.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage <= this.repositoriesWithLanguages.length) {
      this.currentPage++;
      this.setPage(this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.repositoriesWithLanguages.length / this.itemsPerPage);  }
}
