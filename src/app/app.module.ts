import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular2gridster';

import { CKEditorModule } from '../ckeditor/ckeditor.module';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditorComponent } from './components/editor/editor.component';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
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

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

const NzModules = [
  NzMenuModule,
  NzButtonModule,
  NzInputModule,
  NzEmptyModule,
  NzLayoutModule,
  NzDropDownModule,
  NzMessageModule,
  NzAvatarModule,
  NzFormModule,
  NzCheckboxModule,
  NzIconModule,
];

import { NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd/icon';
import {
  LogoutOutline,
  GithubOutline,
  DeleteFill,
  EditFill,
  LoginOutline,
  DeleteOutline,
  PlusOutline,
  AppstoreOutline,
  UserOutline,
  LockOutline,
  SyncOutline,
  SearchOutline,
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [
  LogoutOutline,
  DeleteFill,
  EditFill,
  LoginOutline,
  DeleteOutline,
  PlusOutline,
  UserOutline,
  LockOutline,
  AppstoreOutline,
  SearchOutline,
  SyncOutline,
  GithubOutline,
];

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EditorComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    CKEditorModule,
    GridsterModule.forRoot(),
    HttpClientModule,
    ...NzModules,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' },
    { provide: NZ_ICONS, useValue: icons },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
