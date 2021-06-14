import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MyInputNumberComponent } from './my-input-number.component';

import {InputTextModule} from 'primeng/inputtext';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
  ],
  declarations: [
    MyInputNumberComponent,
  ],
  exports: [
    MyInputNumberComponent,
  ],
})
export class MyInputNumberModule { }
