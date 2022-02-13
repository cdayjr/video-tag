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

import { sanitize } from "dompurify";
import ParameterMap from "../ParameterMap";
import VideoProvider from "../VideoProvider";

enum EmbedType {
  Undefined,
  Video,
  Album,
}

export default class Vimeo extends VideoProvider {
  /**
   * Store what type of embed this is
   */
  private embedType = EmbedType.Undefined;

  /**
   * Store a video timestamp
   */
  private timestamp = "";

  /**
   * Build an object from the source URL
   *
   * @param source A source string, usually an URL.
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof Vimeo).isProvider(source)) {
      // we have a URL, let's break it up

      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      if (typeof link.pathname === "undefined") {
        return;
      }

      this.fetchAlbumFromPath(link.pathname);
      this.fetchVideoFromPath(link.pathname);

      const params = new ParameterMap(link.hash.substr(1));
      this.fetchTimestampFromParams(params);
    }
    this.parseNonURL(source);
  }

  /**
   * Let us know if this is a valid provider for the source
   * (usually a URL)
   *
   * @param source A source string, usually an URL.
   *
   * @return True if the source is valid for the provider, false otherwise.
   */
  public static isProvider(source: string): boolean {
    // First test if it's an URL
    const hostName: string = this.getHostName(source);

    return !!hostName.match(/\.?vimeo\.com$/);
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
  public getEmbedURL(): string {
    return (
      [this.generateAlbumEmbedURL(), this.generateVideoEmbedURL()].find(
        (url: string): boolean => {
          return url !== "";
        }
      ) ?? ""
    );
  }

  /**
   * Return the video element
   *
   * @return An Iframe element if one can be created from the source,
   *  null otherwise.
   */
  public getElement(): HTMLIFrameElement | null {
    const sourceAddress = this.getEmbedURL();

    if (!sourceAddress) {
      return null;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("webkitallowfullscreen", "");
    iframe.setAttribute("mozallowfullscreen", "");

    // eslint-disable-next-line scanjs-rules/assign_to_src
    iframe.src = sanitize(sourceAddress);

    return iframe;
  }

  /**
   * Fetch an album from a path
   *
   * @param path  The path to search for the album ID in
   */
  private fetchAlbumFromPath(path: string): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    const match = path.match(/^\/album\/(\d+)/);
    if (!match || match.shift() === "") {
      return;
    }
    this.embedType = EmbedType.Album;
    this.id = match.shift() as string;
  }

  /**
   * Fetch a video from a path
   *
   * @param path  The path to search for the video ID in
   */
  private fetchVideoFromPath(path: string): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    const match = path.match(/^\/(?:video\/)?(\d+)/);
    if (!match || match.shift() === "") {
      return;
    }
    this.embedType = EmbedType.Video;
    this.id = match.shift() as string;
  }

  /**
   * Grabs the timetamp from the given parameters if it's found,
   * and saves it on the object.
   *
   * @param params  The params to parse
   */
  private fetchTimestampFromParams(params: ParameterMap): void {
    if (this.embedType !== EmbedType.Video) {
      return;
    }
    if (params.get("t") !== "undefined") {
      this.timestamp = params.get("t") as string;
    }
  }

  /**
   * Parse a source input that isn't a URL
   *
   * @param source  The source to parse
   */
  private parseNonURL(source: string): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    if (source.match(/^\d+$/)) {
      this.embedType = EmbedType.Video;
      this.id = source;
    }
  }

  /**
   * Generate an album embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generateAlbumEmbedURL(): string {
    if (this.embedType !== EmbedType.Album) {
      return "";
    }

    return `https://vimeo.com/album/${this.id}/embed`;
  }

  /**
   * Generate a video embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generateVideoEmbedURL(): string {
    if (this.embedType !== EmbedType.Video) {
      return "";
    }
    const params = new ParameterMap();

    params.set("autoplay", "0");
    params.set("byline", "0");
    params.set("color", "ffffff");
    params.set("portrait", "0");
    params.set("title", "0");

    let sourceAddress = `https://player.vimeo.com/video/${
      this.id
    }?${params.toString()}`;

    if (this.timestamp) {
      sourceAddress += `#t=${this.timestamp}`;
    }

    return sourceAddress;
  }
}
