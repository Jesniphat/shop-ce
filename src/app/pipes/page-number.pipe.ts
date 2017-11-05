import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageNumber'
})
export class PageNumberPipe implements PipeTransform {

  transform(data: any[], start: any): any {
    // console.log(start);
    let result = {"data":[],"page":[]};
    let pageNumber = data.length / start.row ;
    let startNo = (start.pageNo * start.row) - start.row;
    let finishNo = (start.pageNo * start.row);
    // console.log(Math.ceil(pageNumber));
    for(let j = 1; j <= Math.ceil(pageNumber); j++){
      result.page.push(j);
    }
    for(let i = startNo; i < finishNo; i++){
        if(!data[i]){
            break;
        }
        result.data.push(data[i]);
    }
    return result.data;
  }
}
