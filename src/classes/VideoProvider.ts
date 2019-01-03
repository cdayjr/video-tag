/**
 * What a video provider class should look like.
 */
export abstract class VideoProvider {
  /**
   * Let us know if this is a valid provider for the source
   * (usually a URL)
   */
  public static abstract isProvider(source: string): boolean;

  /**
   * Get the provider string.
   */
  public static getProviderString(): string {
    return this.providerString;
  }

  /**
   * Each provider should have a string to identify it.
   */
  protected static providerString: string = "Invalid";

  /**
   * All options related to the video, including its ID.
   */
  protected options: URLSearchParams = new URLSearchParams();

  /**
   * Build the object from the source URL
   */
  abstract constructor(source: string);

  /**
   * Get the video element
   */
  public abstract getElement(): HTMLIFrameElement;

  /**
   * Import options
   */
  public importOptions(options: string): void {
    this.options = new URLSearchParams(options);
  }

  /**
   * Get the options
   */
  public exportOptions(): string {
    return this.options.toString();
  }

  /**
   * Get the host from a URL.
   *
   * @param source - A URL to figure out the host from.
   *
   * @return The host string, defaults to "" if host can't be found.
   */
  protected getHostName(source: string): string {
    const test: HTMLAElement = document.createElement("a");
    test.setAttribute("href", source);

    if (
      source.startsWith(window.location.protocol) ||
      test.protocol !== window.location.protocol ||
      source.search(window.location.hostname) > -1
    ) {
      return test.hostname;
    }

    return "";
  }

  /**
   * Convert a time string to a number of seconds.
   *
   * @param time - The time string, such as "0h1m5s".
   *
   * @return The number of seconds in the time string, such as "65".
   */
  protected timeToSeconds(time: string): number {
    const match = time.match(
      /(?<hours>\d+h)?(?<minutes>\d+m)?(?<seconds>\d+s)?/
    );
    let count = 0;
    if (match) {
      if (match.groups.hours) {
        const hours = parseInt(match.group.hours, 10);
        if (hours > 0) {
          count += hours * 60 * 60;
        }
      }
      if (match.group.minutes) {
        const minutes = parseInt(match.group.minutes, 10);
        if (minutes > 0) {
          count += minutes * 60;
        }
      }
      if (match.group.seconds) {
        const seconds = parseInt(match.group.seconds, 10);
        if (seconds > 0) {
          count += seconds;
        }
      }
    }

    return count;
  }

  /**
   * Convert seconds to a time string.
   *
   * @param totalSeconds - The seconds to convert, such as 65.
   *
   * @return The time string, such as "0h1m5s".
   */
  protected secondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
    const seconds = totalSeconds - (hours * 60 * 60 + minutes * 60);
    return `${hours}h${minutes}m${seconds}s`;
  }
}

export default VideoProvider;
