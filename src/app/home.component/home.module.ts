import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

  ],
  declarations: [
    HomeComponent,
  ],
  providers: [],
  bootstrap: [HomeComponent],
})
export class HomeModule {
}
