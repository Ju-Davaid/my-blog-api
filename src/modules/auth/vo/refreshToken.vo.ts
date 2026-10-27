class RefreshTokenVO {
  accessToken: string;
  refreshToken: string;
  constructor({ accessToken, refreshToken }: RefreshTokenVO) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export default RefreshTokenVO;
