import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderNavbarComponent } from './header/header-navbar/header-navbar.component';
import { FooterComponent } from './footer/footer/footer.component';
import { HomeworkListComponent } from './section/homeworks/homework-list/homework-list.component';
import { HomeworkManagementComponent } from './section/management/homework-management/homework-management.component';
import { SubjectManagementComponent } from './section/management/subject-management/subject-management.component';
import { HomeworkDetailComponent } from './section/homeworks/homework-detail/homework-detail.component';
import { FinishedHomeworkListComponent } from './section/homeworks/finished-homework-list/finished-homework-list.component';
import { OverviewComponent } from './section/overview/overview.component';
import { AppRouteModule } from './app-route/app-route.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './shared/store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { HomeworkEffects } from './section/management/homework-management/store/homework.effects';
import { CourseEffect } from './section/management/subject-management/store/course.effect';
import { FilterMenuComponent } from './section/homeworks/filter-menu/filter-menu.component';
import { AlertsComponent } from './shared/alerts/alerts.component';
import { FormsModule } from '@angular/forms';
import { GroupHomeworkComponent } from './section/homeworks/group-homework/group-homework.component';
import {MatTableModule} from '@angular/material/table';

import { ShortenPipe } from './shared/pipes/shorten.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderNavbarComponent,
    FooterComponent,
    HomeworkListComponent,
    HomeworkManagementComponent,
    SubjectManagementComponent,
    HomeworkDetailComponent,
    FinishedHomeworkListComponent,
    OverviewComponent,
    FilterMenuComponent,
    AlertsComponent,
    GroupHomeworkComponent,
    ShortenPipe
  ],
  imports: [
    BrowserModule,
    AppRouteModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatPaginatorModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatTableModule,
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([HomeworkEffects, CourseEffect]),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
