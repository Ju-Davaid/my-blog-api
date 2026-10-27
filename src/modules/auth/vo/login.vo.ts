class LoginVO {
  username: string;
  role: number;
  accessToken: string;
  refreshToken: string;

  constructor({ username, accessToken, refreshToken, role }: LoginVO) {
    this.username = username;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.role = role;
  }
}

export default LoginVO;
