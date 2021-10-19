export class PagingParams {
    searchString:string;   // text box searching string
    sortColumn :string;  //asc or desc
    sortOrder:string; //column name

    tenantId: number;  //current page index
    pageNo: number;  //current page index
    pageSize: number;     //page size
    roleIds: string;
}

export class SearchParams {
    searchString:string;   // text box searching string
    sortColumn :string;  //asc or desc
    sortOrder:string; //column name
    
    pageNo: number;  //current page index
    pageSize: number;     //page size    
}