import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatChipsModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionsComponent } from './containers/questions/questions.component';
import { SingleComponent } from './containers/single/single.component';
import { QuestionDetailsComponent } from './components/question-details/question-details.component';
import { AnswerDetailsComponent } from './components/answer-details/answer-details.component';

const uri = 'http://localhost:3000/graphql';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,

    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    QuestionsComponent,
    QuestionListComponent,
    SingleComponent,
    QuestionDetailsComponent,
    AnswerDetailsComponent,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
