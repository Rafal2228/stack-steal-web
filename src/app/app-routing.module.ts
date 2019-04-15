import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsComponent } from './containers/questions/questions.component';
import { SingleComponent } from './containers/single/single.component';

const routes: Routes = [
  {
    component: QuestionsComponent,
    path: '',
  },
  {
    component: SingleComponent,
    path: ':questionId',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
