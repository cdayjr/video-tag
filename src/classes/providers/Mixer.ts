/**
 * @file Mixer provider class
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 * @link https://dev.mixer.com/guides/embeds Documentation
 *  for Mixer iframe embeds
 */

import ParameterMap from "../ParameterMap";
import VideoProvider from "../VideoProvider";

/**
 * Mixer video provider
 */
export default class Mixer extends VideoProvider {
  /**
   * Build an object from the source string
   *
   * @param source The video source- usually an URL
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof VideoProvider).getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source
        .trim()
        .match(/^https?:\/\/(?:.+\.)?mixer\.com\/(?:embed\/player\/)?(\w+)/);

      if (match) {
        const [, idMatch] = match;

        const params = new ParameterMap(link.search);

        this.options.set("channel", idMatch);

        // VOD
        if (params.get("vod")) {
          this.options.set("vod", params.get("vod") as string);
          // Timestamp
          if (params.get("t")) {
            this.options.set("t", params.get("t") as string);
          }
        }
      }
    } else if (source.match(/^\w+$/)) {
      // With no URL to go off of maybe it's a channel name?

      this.options.set("channel", source);
    }
  }

  /**
   * Let us know if this is a valid provider for the source
   *
   * @param source The source URL of the video
   *
   * @return `true` if it's a valid source, `false` otherwise.
   */
  public static isProvider(source: string): boolean {
    // First test if it's an URL
    const hostName: string = this.getHostName(source);

    return !!hostName.match(/^(?:.+\.)?mixer\.com$/);
  }

  /**
   * Get the provider string.
   *
   * @return "Mixer"
   */
  public static getProviderString(): string {
    return "Mixer";
  }

  /**
   * Get the video embed URL
   *
   * @return The appropriate embed URL to stick in an iframe element.
   */
  public getEmbedUrl(): string {
    if (!this.options.get("channel")) {
      return "";
    }

    let sourceAddress = `https://mixer.com/embed/player/${this.options.get(
      "channel"
    )}`;

    const options = new ParameterMap(this.options.toString());
    options.delete("channel");

    sourceAddress += `?${options.toString()}`;

    return sourceAddress;
  }

  /**
   * Return the video element
   *
   * @return An Iframe element if one can be created from the source,
   *  null otherwise.
   */
  public getElement(): HTMLIFrameElement | null {
    const sourceAddress = this.getEmbedUrl();

    if (!sourceAddress) {
      return null;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");

    iframe.src = sourceAddress;

    return iframe;
  }
}
