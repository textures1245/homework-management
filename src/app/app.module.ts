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
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreModule.forRoot(reducers),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
