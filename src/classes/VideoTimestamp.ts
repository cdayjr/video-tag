/**
 * @file Class for handling video timestamps.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

export default class VideoTimestamp {
  /**
   * The total number of seconds
   */
  private totalSeconds = 0;

  /**
   * Create a VideoTimestamp object
   *
   * @param time The time string, such as "0h1m25s" or just seconds
   */
  public constructor(time?: string | number) {
    if (!time) {
      return;
    }

    if (typeof time === "number") {
      this.totalSeconds = Math.floor(time);
      return;
    }
    if (time.match(/^\d+$/)) {
      this.totalSeconds = parseInt(time, 10);
      return;
    }

    this.totalSeconds = (
      this.constructor as typeof VideoTimestamp
    ).timestampToSeconds(time);
  }

  /**
   * Get the total seconds
   *
   * @returns The total seconds
   */
  public getSeconds(): number {
    return this.totalSeconds;
  }

  /**
   * Return a time string.
   *
   * @return The time string, such as "0h1m5s".
   */
  public toString(): string {
    let remainingSeconds = this.totalSeconds;

    const hours = Math.floor(remainingSeconds / (60 * 60));
    remainingSeconds -= hours * 60 * 60;

    const minutes = Math.floor(remainingSeconds / 60);
    remainingSeconds -= minutes * 60;

    const seconds = remainingSeconds;

    return `${hours}h${minutes}m${seconds}s`;
  }

  /**
   * Converts a given timestamp string to seconds
   *
   * @param timestamp The timestamp to convert
   *
   * @return  The time in seconds
   */
  private static timestampToSeconds(timestamp: string): number {
    let count = 0;

    // eslint-disable-next-line security/detect-unsafe-regex
    const match = timestamp.match(/^(\d+h)?(\d+m)?(\d+s)?$/);

    if (!match || match[0] === "") {
      return count;
    }

    const [, hours, minutes, seconds] = match;

    count += parseInt(hours, 10) * 60 * 60;
    count += parseInt(minutes, 10) * 60;
    count += parseInt(seconds, 10);

    return count;
  }
}
