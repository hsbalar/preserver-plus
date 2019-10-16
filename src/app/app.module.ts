import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular2gridster';

import { CKEditorModule } from '../ckeditor/ckeditor.module';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditorComponent } from './components/editor/editor.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import en from '@angular/common/locales/en';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './services/auth.guard';
import { JwtInterceptor } from './services/jwt.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd/icon';
import { LogoutOutline, 
  DeleteFill, EditFill, 
  LoginOutline, DeleteOutline, 
  PlusOutline, AppstoreOutline, 
  UserOutline, LockOutline, SyncOutline,
  SearchOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [
  LogoutOutline, DeleteFill, 
  EditFill, LoginOutline, 
  DeleteOutline, PlusOutline, 
  UserOutline, LockOutline,
  AppstoreOutline, SearchOutline,
  SyncOutline
];

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EditorComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CKEditorModule,
    GridsterModule.forRoot(),
    NgZorroAntdModule,
    HttpClientModule,
    NzIconModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' },
    { provide: NZ_ICONS, useValue: icons },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
