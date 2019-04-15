import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subscription, of, combineLatest } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';
import { GetQuestionsResponse, Question } from '../../models/question.model';

const questionsQuery = gql`
  query questionsQuery($intitle: String, $page: Int, $pagesize: Int) {
    getQuestions(intitle: $intitle, page: $page, pagesize: $pagesize) {
      data {
        questionId
        title
        lastActivityDate
        owner {
          profileImage
          displayName
        }
      }
      hasMore
    }
  }
`;

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
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
    this.loading$ = of(false);
    this.questions$ = of([]);
    this.hasMore$ = of(false);

    const { queryParamMap } = this.route.snapshot;

    this.intitleForm = new FormControl(queryParamMap.get('intitle'));

    this.intitleSub = combineLatest(this.route.queryParamMap, this.intitleForm.valueChanges.pipe(debounceTime(400)))
      .pipe(
        filter(([query, intitle]) => query.get('intitle') !== intitle),
        map(values => values[1] as string)
      )
      .subscribe(intitle => {
        this.router.navigate(['.'], { queryParams: { intitle } });
      });

    this.routeSub = this.route.queryParamMap.subscribe(query => this.updateQueryFromParams(query));

    this.updateQueryFromParams(queryParamMap);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  createQuery(intitle: string, page: number, pagesize: number) {
    this.query$ = this.apollo.watchQuery({
      query: questionsQuery,
      variables: {
        intitle,
        page,
        pagesize,
      },
      fetchPolicy: 'cache-and-network',
    });

    this.loading$ = this.query$.valueChanges.pipe(map(res => res.loading));
    this.questions$ = this.query$.valueChanges.pipe(map(res => res.data && res.data.getQuestions.data));
    this.hasMore$ = this.query$.valueChanges.pipe(map(res => res.data && res.data.getQuestions.hasMore));
  }

  updateQueryFromParams(query: ParamMap) {
    const intitle = query.get('intitle');
    const page = +query.get('page') || 1;
    const pagesize = +query.get('pagesize') || 30;

    this.page = page;

    if (!intitle || !intitle.length) {
      return;
    }

    if (!this.query$) {
      this.createQuery(intitle, page, pagesize);
    } else {
      this.query$.refetch({
        intitle,
        page,
        pagesize,
      });
    }
  }
}
