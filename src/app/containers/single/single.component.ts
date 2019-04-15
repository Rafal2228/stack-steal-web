import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Answer } from 'src/app/models/answer.model';

const questionQuery = gql`
  query questionQuery($questionId: Int!, $page: Int, $pagesize: Int) {
    question(questionId: $questionId) {
      title
      tags
      isAnswered
      lastActivityDate
      owner {
        profileImage
        displayName
        link
      }
      answers(page: $page, pagesize: $pagesize) {
        data {
          owner {
            profileImage
            displayName
            link
          }
          isAccepted
          creationDate
          lastActivityDate
          bodyMarkdown
        }
        hasMore
      }
    }
  }
`;

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
  query$: QueryRef<{ question: Question }>;
  question$: Observable<Question>;
  loading$: Observable<boolean>;
  answers$: Observable<Answer[]>;
  acceptedAnswer$: Observable<Answer>;

  constructor(private readonly apollo: Apollo, private readonly route: ActivatedRoute) {}

  ngOnInit() {
    const { paramMap } = this.route.snapshot;
    const questionId = +paramMap.get('questionId');

    this.query$ = this.apollo.watchQuery({
      query: questionQuery,
      variables: {
        questionId,
        page: 1,
        pagesize: 30,
      },
      fetchPolicy: 'cache-and-network',
    });

    this.question$ = this.query$.valueChanges.pipe(map(res => res.data && res.data.question));
    this.loading$ = this.query$.valueChanges.pipe(map(res => res.loading));
    this.answers$ = this.question$.pipe(map(question => question && question.answers.data));
    this.acceptedAnswer$ = this.answers$.pipe(map(answers => answers && answers.find(a => a.isAccepted)));
  }
}
