/**
 * @file Twitch provider class
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 * @link https://dev.twitch.tv/docs/embed/video-and-clips/ Documentation for
 *  Twitch iframe embeds
 */

import { sanitize } from "dompurify";
import ParameterMap from "../ParameterMap";
import VideoProvider from "../VideoProvider";

enum EmbedType {
  Undefined,
  Channel,
  Video,
  Clip,
  Collection,
}

export default class Twitch extends VideoProvider {
  /**
   * Store the type of embed
   */
  private embedType = EmbedType.Undefined;

  /**
   * Store a timestamp to a specific point in a video
   */
  private timestamp = "";

  /**
   * Build an object from the source URL
   *
   * @param source A source string, usually an URL.
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof Twitch).isProvider(source)) {
      // we have a URL, let's break it up

      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      this.fetchCollectionFromPath(link.pathname);
      this.fetchVideoFromPath(link.pathname);
      this.fetchChannelFromPath(link.pathname);
      // must be checked last
      this.fetchClipFromPath(link.pathname);

      if (link.search) {
        const params = new ParameterMap(link.search);
        this.parseParams(params);
      }
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

    return !!hostName.match(/\.?twitch\.tv$/);
  }

  /**
   * Get the provider string. Other than "Invalid", this must be lowercase.
   *
   * @return "twitch"
   */
  public static getProviderString(): string {
    return "twitch";
  }

  /**
   * Get the video embed URL
   *
   * @return The appropriate embed URL to stick in an iframe element.
   */
  public getEmbedURL(): string {
    return (
      [
        this.generateChannelEmbedURL(),
        this.generateClipEmbedURL(),
        this.generateCollectionEmbedURL(),
        this.generateVideoEmbedURL(),
      ].find((url: string): boolean => {
        return url !== "";
      }) ?? ""
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
    iframe.setAttribute("scrolling", "no");

    // eslint-disable-next-line scanjs-rules/assign_to_src
    iframe.setAttribute("src", sanitize(sourceAddress));

    return iframe;
  }

  /**
   * Get a channel ID from a path, will also set the type
   *
   * @param path  The path to search for the channel ID in
   */
  private fetchChannelFromPath(path: string): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    const match = path.match(/\/(\w+)$/);
    if (!match || match.shift() === "") {
      return;
    }
    this.embedType = EmbedType.Channel;
    this.id = match.shift() as string;
  }

  /**
   * Get a clip ID from a path, will also set the type
   *
   * @param path  The path to search for the clip ID in
   */
  private fetchClipFromPath(path: string): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    const match = path.match(/\/\w+?\/clip\/(\w+)$/);
    if (!match || match.shift() === "") {
      return;
    }
    this.embedType = EmbedType.Clip;
    this.id = match.shift() as string;
  }

  /**
   * Fetch a collection ID from a path, will also set the type
   *
   * @param path  The path to search for the collection ID in
   */
  private fetchCollectionFromPath(path: string): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    const match = path.match(/\/collections\/(\w+)$/);
    if (!match || match.shift() === "") {
      return;
    }
    this.embedType = EmbedType.Collection;
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
    const match = path.match(/\/videos\/(\d+)$/);
    if (!match || match.shift() === "") {
      return;
    }
    this.embedType = EmbedType.Video;
    this.id = `v${match.shift()}`;
  }

  /**
   * Get a channel ID from params, will also set the type
   *
   * @param params  The params to search for the channel ID in
   */
  private fetchChannelFromParams(params: ParameterMap): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    if (typeof params.get("channel") === "undefined") {
      return;
    }
    this.embedType = EmbedType.Channel;
    this.id = params.get("channel") as string;
  }

  /**
   * Get a clip ID from params, will also set the type
   *
   * @param params  The params to search for the clip ID in
   */
  private fetchClipFromParams(params: ParameterMap): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    if (typeof params.get("clip") === "undefined") {
      return;
    }
    this.embedType = EmbedType.Clip;
    this.id = params.get("clip") as string;
  }

  /**
   * Get a collection ID from params, will also set the type
   *
   * @param params  The params to search for the collection ID in
   */
  private fetchCollectionFromParams(params: ParameterMap): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    if (typeof params.get("collection") === "undefined") {
      return;
    }
    this.embedType = EmbedType.Collection;
    this.id = params.get("collection") as string;
  }

  /**
   * Get a video ID from params, will also set the type
   *
   * @param params  The params to search for the video ID in
   */
  private fetchVideoFromParams(params: ParameterMap): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    if (typeof params.get("video") === "undefined") {
      return;
    }
    this.embedType = EmbedType.Video;
    this.id = params.get("video") as string;
  }

  /**
   * Grabs the timetamp from the given parameters if it's found,
   * and saves it on the object.
   *
   * @param params  The parameters to parse
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
   * Parse the given parameters to set the type, ID, and timestamp
   *
   * @param params  The parameters to parse
   */
  private parseParams(params: ParameterMap): void {
    if (this.embedType === EmbedType.Undefined) {
      this.fetchChannelFromParams(params);
      this.fetchClipFromParams(params);
      this.fetchCollectionFromParams(params);
      this.fetchVideoFromParams(params);
    }
    this.fetchTimestampFromParams(params);
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
    const idMatch = source.match(/^v?(\d+)$/);
    if (idMatch) {
      this.embedType = EmbedType.Video;
      const [, id] = idMatch;
      this.id = `v${id}`;
      return;
    }
    if (source.match(/^\w+$/)) {
      this.embedType = EmbedType.Channel;
      this.id = source;
    }
  }

  /**
   * Generate a channel embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generateChannelEmbedURL(): string {
    if (this.embedType !== EmbedType.Channel) {
      return "";
    }
    const params = new ParameterMap();

    params.set("autoplay", "false");
    params.set("channel", this.id);

    return `https://player.twitch.tv/?${params.toString()}`;
  }

  /**
   * Generate a clip embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generateClipEmbedURL(): string {
    if (this.embedType !== EmbedType.Clip) {
      return "";
    }
    const params = new ParameterMap();

    params.set("autoplay", "false");
    params.set("clip", this.id);

    return `https://clips.twitch.tv/embed?${params.toString()}`;
  }

  /**
   * Generate a collection embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generateCollectionEmbedURL(): string {
    if (this.embedType !== EmbedType.Collection) {
      return "";
    }
    const params = new ParameterMap();

    params.set("autoplay", "false");
    params.set("collection", this.id);

    return `https://player.twitch.tv/?${params.toString()}`;
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

    params.set("autoplay", "false");
    params.set("clip", this.id);

    if (this.timestamp) {
      params.set("t", this.timestamp);
    }

    return `https://player.twitch.tv/?${params.toString()}`;
  }
}
