/**
 * @file Video class- all HTML video tags get plugged into this
 *  and here is where we start figuring out what provider it belongs
 *  to and what to do with it.
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 */

import style from "./Video.style.scss";
import VideoProvider from "./VideoProvider";
import VideoProviderFactory from "./VideoProviderFactory";

/**
 * Class for handling all functions related towards parsing Video URLs
 * into their embed URLs.
 */
export default class Video {
  /**
   * Stores what video provider this object contains.
   */
  private provider: VideoProvider | null = null;

  /**
   * Build a Video object. All you need is an URL, but providng a provider
   * means you can get by with just a video ID.
   *
   * @param source - The video URL or ID.
   * @param provider - We can figure this out form an URL, but if an ID is
   *  provided, you'll want to share this. A string like "YouTube" or "Vimeo".
   *
   */
  public constructor(source?: string, providerName?: string) {
    if (source) {
      this.provider = VideoProviderFactory.createProvider(source, providerName);
    }
  }

  /**
   * If you already have parsed out options, you can call this to
   * rebuild the object based on those parameters.
   *
   * @param A string representing the provider, ex. "YouTube" or "Vimeo".
   * @param A string representing the options, ex. "id=777&start=15".
   */
  public importOptions(providerName: string, options: string): void {
    this.provider = VideoProviderFactory.createProvider("", providerName);

    if (this.provider) {
      this.provider.importOptions(options);
    }
  }

  /**
   * Get the HTML element that embeds the video from its provider.
   *
   * @return An HTMLDivElement containing the iframe or other embed code
   *  for the video. If there's no provider an error message will be
   *  displayed instead.
   */
  public getElement(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement("div");
    container.classList.add(style.videoContainer);

    if (this.provider instanceof VideoProvider) {
      const videoElementHTML = this.provider.getElement() as HTMLElement;
      videoElementHTML.classList.add(style.videoEmbed);
      // eslint-disable-next-line xss/no-mixed-html
      container.appendChild(videoElementHTML);
      return container;
    }

    const message = document.createElement("p");
    message.classList.add(style.errorMessage);
    message.textContent = "Invalid Video";
    container.appendChild(message);

    return container;
  }

  /**
   * Get an options string compatible with our `importOptions` function.
   *
   * @return An options string such as 'id=7&start=15'.
   */
  public exportOptions(): string {
    if (this.provider instanceof VideoProvider) {
      return this.provider.exportOptions();
    }
    // No options if no provider
    return "";
  }

  /**
   * Get a string representation of this video's provider.
   *
   * @return A string such as "YouTube" or "Vimeo".
   */
  public getProvider(): string {
    if (this.provider) {
      return this.provider.getProviderString();
    }
    return "Invalid";
  }
}
