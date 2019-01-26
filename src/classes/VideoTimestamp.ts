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
   * @param The time string, such as "0h1m25s"
   */
  public constructor(time?: string) {
    if (!time) {
      return;
    }

    const match = time.match(/^(\d+h)?(\d+m)?(\d+s)?$/);

    if (!match) {
      return;
    }

    const [, hoursMatch, minutesMatch, secondsMatch] = match;

    let count = 0;

    if (hoursMatch) {
      const hours = parseInt(hoursMatch, 10);
      if (hours > 0) {
        count += hours * 60 * 60;
      }
    }
    if (minutesMatch) {
      const minutes = parseInt(minutesMatch, 10);
      if (minutes > 0) {
        count += minutes * 60;
      }
    }
    if (secondsMatch) {
      const seconds = parseInt(secondsMatch, 10);
      if (seconds > 0) {
        count += seconds;
      }
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
    const hours = Math.floor(this.totalSeconds / (60 * 60));
    const minutes = Math.floor((this.totalSeconds - hours * 60 * 60) / 60);
    const seconds = this.totalSeconds - (hours * 60 * 60 + minutes * 60);
    return `${hours}h${minutes}m${seconds}s`;
  }
}
