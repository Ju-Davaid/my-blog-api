class CaptchaVO {
  captchaImg: string;
  captchaKey: string;
  constructor({ captchaImg, captchaKey }: CaptchaVO) {
    this.captchaImg = captchaImg;
    this.captchaKey = captchaKey;
  }
}

export default CaptchaVO;
