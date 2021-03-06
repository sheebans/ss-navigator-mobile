import { Component, Input, OnInit } from '@angular/core';
import { ContentFormatComponent } from '@components/player/content-format.component';

@Component({
  selector: 'multiple-choice-format',
  templateUrl: 'multiple-choice-format.html'
})
export class MultipleChoiceFormatComponent
  implements ContentFormatComponent, OnInit {
  @Input() content: any;

  @Input() isActive: boolean;

  question: any;

  constructor() {}

  ngOnInit() {
    this.question = this.content;
  }
}
