import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { OverviewComponent } from '../section/overview/overview.component';
import { HomeworkListComponent } from '../section/homeworks/homework-list/homework-list.component';
import { HomeworkManagementComponent } from '../section/management/homework-management/homework-management.component';
import { SubjectManagementComponent } from '../section/management/subject-management/subject-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'overviews', pathMatch: 'full' },
  { path: 'overviews', component: OverviewComponent },
  { path: 'homework-list', component: HomeworkListComponent },
  { path: 'homework-management', component: HomeworkManagementComponent },
  { path: 'course-management', component: SubjectManagementComponent},
  { path: '**', redirectTo: 'overviews' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouteModule {}
