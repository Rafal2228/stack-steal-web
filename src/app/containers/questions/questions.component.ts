import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { GetQuestionsResponse, Question } from '../../models/question.model';

const questionsQuery = gql`
  query questionsQuery($intitle: String, $page: Int, $pagesize: Int) {
    getQuestions(intitle: $intitle, page: $page, pagesize: $pagesize) {
      data {
        tags
        isAnswered
        viewCount
        title
        lastActivityDate
        owner {
          profileImage
          displayName
          link
        }
      }
      hasMore
    }
  }
`;

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  query$: QueryRef<{ getQuestions: GetQuestionsResponse }>;
  questions$: Observable<Question[]>;
  loading$: Observable<boolean>;
  hasMore$: Observable<boolean>;

  page: number;
  pagesize: number;

  routeSub: Subscription;
  intitleForm: FormControl;
  intitleSub: Subscription;

  constructor(
    private readonly apollo: Apollo,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    const { queryParamMap } = this.route.snapshot;

    this.intitleForm = new FormControl(queryParamMap.get('intitle'));
    this.page = +queryParamMap.get('page') || 1;
    this.pagesize = +queryParamMap.get('pagesize') || 30;

    this.query$ = this.apollo.watchQuery({
      query: questionsQuery,
      variables: {
        intitle: this.intitleForm.value,
        page: this.page,
        pagesize: this.pagesize
      },
      fetchPolicy: 'cache-and-network'
    });

    this.loading$ = this.query$.valueChanges.pipe(map(res => (console.log(res), res.loading)));
    this.questions$ = this.query$.valueChanges.pipe(map(res => res.data && res.data.getQuestions.data));
    this.hasMore$ = this.query$.valueChanges.pipe(map(res => res.data && res.data.getQuestions.hasMore));

    this.intitleForm.valueChanges.pipe(debounceTime(1000)).subscribe(intitle => {
      this.router.navigate(['.'], { queryParams: { intitle } });
    });

    this.routeSub = this.route.queryParamMap.subscribe(query => {
      if (!query.has('intitle')) {
        return;
      }

      const intitle = query.get('intitle');

      if (intitle.length < 1) {
        return;
      }

      if (query.has('page')) {
        this.page = +query.get('page') || this.page;
      }

      if (query.has('pagesize')) {
        this.pagesize = +query.get('pagesize') || this.pagesize;
      }

      this.query$.setVariables({
        intitle,
        page: this.page,
        pagesize: this.pagesize
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
