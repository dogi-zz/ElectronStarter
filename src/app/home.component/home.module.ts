import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MyInputNumberModule} from '../components/my-input-number/my-input-number.module';
import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    MyInputNumberModule,
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [],
  bootstrap: [HomeComponent],
})
export class HomeModule {
}
