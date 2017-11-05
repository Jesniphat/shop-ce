import { Injectable } from '@angular/core';
declare var dialogPolyfill: any;

@Injectable()
export class DialogService {
  public $dialog: any;

  constructor() {}

  public build(element){
    this.$dialog = element;
    if (!this.$dialog.showModal) {
      dialogPolyfill.registerDialog(this.$dialog);
    }
    return this.$dialog;
  }
}
