import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  _id?: string;
  name: string;
  dueDate: string;
  course: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = environment.ServerAPI + 'api/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(this.baseUrl, project);
  }

  deleteProject(id: string): Observable<Project> {
    return this.http.delete<Project>(`${this.baseUrl}/${id}`);
  }
}
