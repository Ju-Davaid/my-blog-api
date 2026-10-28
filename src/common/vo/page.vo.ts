class PageVO<T> {
  total: number;
  list: T[];
  pageSize: number;
  pageNum: number;
  constructor({ total, list, pageSize, pageNum }: PageVO<T>) {
    this.total = total;
    this.list = list;
    this.pageSize = pageSize;
    this.pageNum = pageNum;
  }
}

export default PageVO;
