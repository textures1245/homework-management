import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { OverviewComponent } from '../section/overview/overview.component';
import { HomeworkListComponent } from '../section/homeworks/homework-list/homework-list.component';
import { HomeworkManagementComponent } from '../section/management/homework-management/homework-management.component';
import { SubjectManagementComponent } from '../section/management/subject-management/subject-management.component';
import { Homework } from '../shared/models/homework.model';
import { FinishedHomeworkListComponent } from '../section/homeworks/finished-homework-list/finished-homework-list.component';
import { HomeworkResolverService } from '../section/homeworks/homework.resolver';
import { CourseResolverService } from '../section/management/subject-management/courses.resolver';
import { GroupHomeworkComponent } from '../section/homeworks/group-homework/group-homework.component';
import { HomeworkService } from '../section/homeworks/homework.service';

const routes: Routes = [
  { path: '', redirectTo: 'overviews', pathMatch: 'full' },
  {
    path: 'overviews',
    component: OverviewComponent,
    resolve: [CourseResolverService, HomeworkResolverService]
  },
  {
    path: 'homework-list',
    component: HomeworkListComponent,
    resolve: [HomeworkResolverService],
  },
  { path: 'finished-homework-list', component: FinishedHomeworkListComponent },
  { path: 'group-homework-list', component: GroupHomeworkComponent},
  {
    path: 'homework-management',
    component: HomeworkManagementComponent,
    resolve: [CourseResolverService, HomeworkResolverService],
    children: [{ path: ':id', component: HomeworkManagementComponent }],
  },
  { path: 'course-management', component: SubjectManagementComponent, resolve: [CourseResolverService] },
  { path: '**', redirectTo: 'overviews' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouteModule {}
