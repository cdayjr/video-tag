/**
 * @file Vimeo provider class
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 * @link https://vimeo.zendesk.com/hc/en-us/sections/203874347-Embedding-Videos
 *  Documentation for Vimeo iframe embeds
 */

import ParameterMap from "../ParameterMap";
import VideoProvider from "../VideoProvider";

export default class Vimeo extends VideoProvider {
  /**
   * Build an object from the source URL
   *
   * @param A source string, usually an URL.
   */
  public constructor(source: string) {
    super(source);

    if (this.constructor.prototype.getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source.match(
        /^https?:\/\/(?:.+\.)?vimeo\.com\/(?:album\/(\d+)|(?:video\/)?(\d+))\??(?:.*)?$/
      );
      if (match) {
        const [, albumMatch, idMatch] = match;

        if (albumMatch) {
          this.options.set("album", albumMatch);
        } else {
          this.options.set("id", idMatch);

          const params = new ParameterMap(link.hash.substr(1));
          if (params.get("t")) {
            this.options.set("timestamp", params.get("t") as string);
          }
        }
      }
    } else if (source.match(/^\d+$/)) {
      // With no URL to go off of maybe it's a video ID?

      this.options.set("id", source);
    }
  }

  /**
   * Let us know if this is a valid provider for the source
   * (usually a URL)
   *
   * @param A source string, usually an URL.
   *
   * @return True if the source is valid for the provider, false otherwise.
   */
  public static isProvider(source: string): boolean {
    // First test if it's an URL
    const hostName: string = this.getHostName(source);

    return !!hostName.match(/^(?:.+\.)?vimeo\.com$/);
  }

  /**
   * Get the provider string. Other than "Invalid", this must be lowercase.
   *
   * @return "vimeo"
   */
  public static getProviderString(): string {
    return "vimeo";
  }

  /**
   * Get the video embed URL
   *
   * @return The appropriate embed URL to stick in an iframe element.
   */
  public getEmbedUrl(): string {
    if (!this.options.get("id") && !this.options.get("album")) {
      return "";
    }

    let sourceAddress = this.options.get("id")
      ? `https://player.vimeo.com/video/${this.options.get(
          "id"
        )}?color=ffffff&title=0&byline=0&portrait=0&autoplay=0`
      : `https://vimeo.com/album/${this.options.get("album")}/embed`;

    if (this.options.get("id") && this.options.get("timestamp")) {
      sourceAddress += `#t=${this.options.get("timestamp")}`;
    }

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
    iframe.setAttribute("webkitallowfullscreen", "");
    iframe.setAttribute("mozallowfullscreen", "");

    iframe.src = sourceAddress;

    return iframe;
  }
}
