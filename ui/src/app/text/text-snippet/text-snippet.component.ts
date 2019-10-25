import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-text-snippet',
  templateUrl: './text-snippet.component.html',
  styleUrls: ['./text-snippet.component.scss']
})
export class TextSnippetComponent implements OnInit {

  @Input() id: string

  @Input() header: string
  @Input() set headerLimit(headerLimit: number) {
    if (!this.limitIsValid(headerLimit)) {
      throw new Error(`header limit should be positive non-infinite integer; provided ${headerLimit}`)
    }

    this.headerLimit1 = headerLimit
  }
  headerLimit1: number

  @Input() body: string
  bodyLimit1: number
  @Input() set bodyLimit(bodyLimit: number) {
    if (!this.limitIsValid(bodyLimit)) {
      throw new Error(`body limit should be positive non-infinite integer; provided ${bodyLimit}`)
    }

    this.bodyLimit1 = bodyLimit
  }

  @Input() footer: string
  @Input() active = false
  @Output() activationRequest = new EventEmitter<string>()


  constructor() { }

  ngOnInit() {
  }

  private limitIsValid(limit: number): boolean {
    return limit >= 0 && limit !== Infinity && Number.isInteger(limit)
  }
}
