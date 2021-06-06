/**
 * @file Abstract VideoProvider class to define the attributes
 *  we expect all video providers to have.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import ParameterMap from "./ParameterMap";

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
   * Get the provider string. Other than "Invalid", this must be lowercase.
   *
   * @return A provider string such as "youtube" or "vimeo".
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
   * Get the host from an URL.
   *
   * @param An URL to figure out the host from.
   *
   * @return The host string, defaults to "" if host can't be found.
   */
  protected static getHostName(source: string): string {
    const test: HTMLAnchorElement = document.createElement("a");
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
   * All options related to the video, including its ID.
   */
  protected options = new ParameterMap();

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
   * Get the video embed URL
   *
   * @return The appropriate embed URL to stick in an iframe element.
   */
  public abstract getEmbedUrl(): string;

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
    this.options.clear();
    this.options.importParams(options);
  }

  /**
   * Get the options
   *
   * @return An options string such as "id=7&start=15"
   */
  public exportOptions(): string {
    return this.options.toString();
  }
}
