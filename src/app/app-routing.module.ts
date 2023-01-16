import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component/home.component';
import {HomeModule} from './home.component/home.module';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '**', redirectTo: '/home'},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
