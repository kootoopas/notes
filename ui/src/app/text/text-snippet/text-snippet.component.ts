import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-text-snippet',
  templateUrl: './text-snippet.component.html',
  styleUrls: ['./text-snippet.component.scss']
})
export class TextSnippetComponent implements OnInit {

  @Input() id: string
  @Input() header: string
  @Input() body: string
  bodyLimit1: number
  @Input()
  set bodyLimit(bodyLimit: number) {
    if (bodyLimit === Infinity || bodyLimit < 0 || !Number.isInteger(bodyLimit)) {
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

}
