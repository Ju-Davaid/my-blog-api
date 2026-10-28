class TimeUtils {
  private static readonly UNIT_MAP: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };
  /**
   * 分钟转换为毫秒
   * @param minute 分钟
   * @returns 毫秒
   */
  public static minuteToMilliseconds = (
    minute: number,
    reverse: boolean = false,
  ) => (!reverse ? 1000 * 60 * minute : minute / 60 / 1000);
  /**
   * 小时转换为毫秒
   * @param hour 小时
   * @param reverse 是否反转
   *
   * @returns 毫秒
   */
  public static hourToMilliseconds = (
    hour: number,
    reverse: boolean = false,
  ) => (!reverse ? 1000 * 60 * 60 * hour : hour / (60 * 60 * 1000) / 1000);
  /**
   * 天转换为毫秒
   * @param day 天
   * @param reverse 是否反转
   *
   * @returns 毫秒
   */
  public static dayToMilliseconds = (day: number, reverse: boolean = false) =>
    !reverse ? 1000 * 24 * 60 * 60 * day : day / (24 * 60 * 60 * 1000) / 1000;
  /**
   * 周转换为毫秒
   * @param week 周
   * @param reverse 是否反转
   *
   * @returns 毫秒
   */
  public static weekToMilliseconds = (
    week: number,
    reverse: boolean = false,
  ) =>
    !reverse
      ? 1000 * 7 * 24 * 60 * 60 * week
      : week / (7 * 24 * 60 * 60 * 1000) / 1000;

  /**
   * 时间字符串转换为毫秒
   * @param date 时间字符串
   *
   * @returns 毫秒
   */
  public static timeStrToMilliseconds(date: string | number) {
    if (typeof date === 'number') {
      return date * 1000;
    }

    const PART_RE = /\d+(?:\.\d+)?\s*[smhdy]/gi;
    const input = date.trim();
    const parts = input.match(PART_RE);

    const stripped = input.replace(/\s/g, '');
    const covered = parts?.join('').replace(/\s/g, '');
    if (!parts || covered !== stripped) {
      throw new Error(`无法解析时间字符串: ${date}`);
    }

    return parts.reduce((total, part) => {
      const value = parseFloat(part);
      const unit = part.replace(/[\d.\s]/g, '').toLowerCase();
      return total + value * this.UNIT_MAP[unit];
    }, 0);
  }
}

export default TimeUtils;
