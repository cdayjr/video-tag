/**
 * @file Abstract VideoProvider class to define the attributes
 *  we expect all video providers to have.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

/**
 * What a video provider class should look like.
 */
export default abstract class VideoProvider {
  /**
   * Let us know if this is a valid provider for the source
   * (usually a URL)
   *
   * @param A source string, usually an URL, to test if it belongs to the given
   *  provider.
   *
   * @return A boolean if the provider matches or not.
   */
  /* eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars */
  public static isProvider(source: string): boolean {
    return false;
  }

  /**
   * Get the provider string.
   *
   * @return A provider string such as "YouTube" or "Vimeo"
   */
  public static getProviderString(): string {
    return "Invalid";
  }

  /**
   * Get the provider string, non-static version.
   *
   * @return A provider string such as "YouTube" or "Vimeo"
   */
  public getProviderString(): string {
    return (this.constructor as typeof VideoProvider).getProviderString();
  }

  /**
   * Create a Map object from an param string
   *
   * @param An url parameter string such as "id=777&start=15"
   *
   * @return A map object of parameter keys and values.
   */
  protected static mapFromString(input: string): Map<string, string> {
    const paramString = input.substr(0, 1) === "?" ? input.substr(1) : input;

    const items = paramString.split("&");
    const result = new Map<string, string>();
    items.forEach(item => {
      if (item.search("=") > -1) {
        const [key, value] = item.split("=");
        result.set(decodeURIComponent(key), decodeURIComponent(value));
      } else {
        result.set(decodeURIComponent(item), "");
      }
    });

    return result;
  }

  /**
   * Get a string from a Map object
   *
   * @param A map of string keys and string values.
   *
   * @return An URL param string such as "id=777&start=15"
   *
   */
  protected static stringFromMap(input: Map<string, string>): string {
    let paramString = "";
    input.forEach((value, key) => {
      paramString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    });
    if (paramString.length > 0) {
      paramString = paramString.slice(0, -1);
    }

    return paramString;
  }

  /**
   * Get the host from an URL.
   *
   * @param An URL to figure out the host from.
   *
   * @return The host string, defaults to "" if host can't be found.
   */
  protected static getHostName(source: string): string {
    const test: HTMLAnchorElement = document.createElement("a");
    test.setAttribute("href", source);

    // Since `String.startsWith` isn't supported everywhere, this will do
    const protocolMatch = new RegExp(`^${window.location.protocol}`, "i");

    if (
      source.match(protocolMatch) ||
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
   * @param The time string, such as "0h1m5s".
   *
   * @return The number of seconds in the time string, such as "65".
   */
  protected static timeToSeconds(time: string): number {
    const match = time.match(/(\d+h)?(\d+m)?(\d+s)?/) as (string | undefined)[];

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

    return count;
  }

  /**
   * Convert seconds to a time string.
   *
   * @param The seconds to convert, such as 65.
   *
   * @return The time string, such as "0h1m5s".
   */
  protected static secondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
    const seconds = totalSeconds - (hours * 60 * 60 + minutes * 60);
    return `${hours}h${minutes}m${seconds}s`;
  }

  /**
   * All options related to the video, including its ID.
   */
  protected options: Map<string, string> = new Map<string, string>();

  /**
   * Build the object from the source URL
   *
   * @param A source string, usually an URL.
   */
  /* eslint-disable-next-line no-useless-constructor, no-empty-function, no-unused-vars, @typescript-eslint/no-unused-vars */
  public constructor(source: string) {
    /* eslint-disable-next-line no-useless-return */
    return;
  }

  /**
   * Get the video element
   *
   * @return An iframe element with the correct atributes to embed a video from
   *  the provider, or null.
   */
  public abstract getElement(): HTMLIFrameElement | null;

  /**
   * Import options
   *
   * @param An options string such as "id=7&start=15"
   */
  public importOptions(options: string): void {
    this.options = (this.constructor as typeof VideoProvider).mapFromString(
      options
    );
  }

  /**
   * Get the options
   *
   * @return An options string such as "id=7&start=15"
   */
  public exportOptions(): string {
    return (this.constructor as typeof VideoProvider).stringFromMap(
      this.options
    );
  }
}
