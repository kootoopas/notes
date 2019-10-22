import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnDestroy {

  @Input() title: string
  @Output() titleEditRequest = new EventEmitter<string>()
  titleChange = new Subject<string>()
  private titleChangeSubscription: Subscription

  @Input() body: string
  @Output() bodyEditRequest = new EventEmitter<string>()
  bodyChange = new Subject<string>()
  private bodyChangeSubscription: Subscription

  @Input() meta: Map<string, string>

  constructor() { }

  ngOnInit(): void {
    this.titleChangeSubscription = this.titleChange.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(title => {
      this.titleEditRequest.emit(title);
    })

    this.bodyChangeSubscription = this.bodyChange.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(body => {
      this.bodyEditRequest.emit(body);
    })
  }

  ngOnDestroy(): void {
    // TODO wait for request to beperformed before unsubscribing
    this.titleChangeSubscription.unsubscribe()
    this.bodyChangeSubscription.unsubscribe()
  }
}
