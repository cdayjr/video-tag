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
   * @param The time string, such as "0h1m25s" or just seconds
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

    const match = time.match(/^(\d+h)?+(\d+m)?+(\d+s)?+$/);

    if (!match || match[0] === "") {
      return;
    }

    const [, hoursMatch, minutesMatch, secondsMatch] = match;

    let count = 0;

    const hours = parseInt(hoursMatch, 10);
    if (hours > 0) {
      count += hours * 60 * 60;
    }
    const minutes = parseInt(minutesMatch, 10);
    if (minutes > 0) {
      count += minutes * 60;
    }
    const seconds = parseInt(secondsMatch, 10);
    if (seconds > 0) {
      count += seconds;
    }

    this.totalSeconds = count;
  }

  /**
   * Get the total seconds
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
}
