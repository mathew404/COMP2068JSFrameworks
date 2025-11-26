import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];

  _id: string = '';
  name: string = '';
  dueDate: string = '';
  course: string = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
    });
  }

  addProject(): void {
    const newProject: Project = {
      name: this.name,
      dueDate: this.dueDate,
      course: this.course,
    };

    this.projectService.addProject(newProject).subscribe(() => {
      this.clearForm();
      this.loadProjects();
    });
  }

  selectProject(project: Project): void {
    this._id = project._id ?? '';
    this.name = project.name;
    this.dueDate = project.dueDate?.substring(0, 10) ?? '';
    this.course = project.course;
  }

  updateProject(): void {
    if (!this._id) return;

    const updatedProject: Project = {
      _id: this._id,
      name: this.name,
      dueDate: this.dueDate,
      course: this.course,
    };

    this.projectService.updateProject(updatedProject).subscribe(() => {
      this.clearForm();
      this.loadProjects();
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.projectService.deleteProject(id).subscribe(() => {
      this.loadProjects();
    });
  }

  clearForm(): void {
    this._id = '';
    this.name = '';
    this.dueDate = '';
    this.course = '';
  }
}
