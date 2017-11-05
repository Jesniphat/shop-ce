import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageList'
})
export class PageListPipe implements PipeTransform {

  transform(data: any[], row: any): any {
    let result = [];
    let pageNumber = data.length / row ;
    for(let j = 1; j <= Math.ceil(pageNumber); j++){
      result.push(j);
    }
    return result;
  }

}
