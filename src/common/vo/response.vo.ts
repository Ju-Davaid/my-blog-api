class ResponseVO {
  private code: number;
  private msg: string;
  private data: any;
  constructor(code: number, msg: string, data: any) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
  public static success(data: any) {
    return new ResponseVO(200, 'success', data);
  }
  public static error(code: number, msg: string, data: any) {
    return new ResponseVO(code, msg, data);
  }
}
export default ResponseVO;
