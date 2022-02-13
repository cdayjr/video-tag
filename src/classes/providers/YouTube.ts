/**
 * @file YouTube provider class
 *
 * @author Chad Wade Day, Jr. <cdayjr@chadwadedayjr.info>
 * @license MIT <https://opensource.org/licenses/MIT>
 *
 * @link https://github.com/cdayjr/video-tag Github repo
 * @link https://developers.google.com/youtube/player_parameters Documentation
 *  for YouTube iframe embeds
 */

import { sanitize } from "dompurify";
import ParameterMap from "../ParameterMap";
import VideoProvider from "../VideoProvider";
import VideoTimestamp from "../VideoTimestamp";

enum EmbedType {
  Undefined,
  Video,
  Playlist,
  List,
}

/**
 * YouTube video provider
 */
export default class YouTube extends VideoProvider {
  /**
   * Store what type of embed this is
   */
  private embedType = EmbedType.Undefined;

  /**
   * Store the video timestamp
   */
  private timestamp: VideoTimestamp | null = null;

  /**
   * Store the list type
   */
  private listType = "";

  /**
   * Store the video ID to start with when playign a playlist
   */
  private startVideoID = "";

  /**
   * Build an object from the source string
   *
   * @param source The video source- usually an URL
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof YouTube).isProvider(source)) {
      // we have a URL, let's break it up

      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const params = new ParameterMap(link.search);

      this.fetchVideoFromSource(link.pathname ?? "", params);

      this.fetchListFromParams(params);
      this.fetchPlaylistFromParams(params);

      this.fetchTimestampFromParams(params);
    }
    this.parseNonURL(source);
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

    return !!hostName.match(/\.?youtu(?:be(?:-nocookie)?\.com|\.be)$/);
  }

  /**
   * Get the provider string. Other than "Invalid", this must be lowercase.
   *
   * @return "youtube"
   */
  public static getProviderString(): string {
    return "youtube";
  }

  /**
   * Get the video embed URL
   *
   * @return The appropriate embed URL to stick in an iframe element.
   */
  public getEmbedURL(): string {
    return (
      [
        this.generateListEmbedURL(),
        this.generatePlaylistEmbedURL(),
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
    iframe.setAttribute(
      "allow",
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );

    // eslint-disable-next-line scanjs-rules/assign_to_src
    iframe.src = sanitize(sourceAddress);

    return iframe;
  }

  /**
   * Get a list from params, will also set the type
   *
   * @param params  The params to search for the list in
   */
  private fetchListFromParams(params: ParameterMap): void {
    if ([EmbedType.Undefined, EmbedType.Video].indexOf(this.embedType) < 0) {
      // don't reset type
      return;
    }
    if (typeof params.get("list") === "undefined") {
      return;
    }
    this.setStartVideo();
    this.embedType = EmbedType.List;
    this.id = params.get("list") as string;
    // default type is playlist
    this.listType = params.get("listType") ?? "playlist";
  }

  /**
   * Get a playlist from params, will also set the type
   *
   * @param params  The params to search for the list in
   */
  private fetchPlaylistFromParams(params: ParameterMap): void {
    if ([EmbedType.Undefined, EmbedType.Video].indexOf(this.embedType) < 0) {
      // don't reset type
      return;
    }
    if (typeof params.get("playlist") === "undefined") {
      return;
    }
    this.setStartVideo();
    this.embedType = EmbedType.Playlist;
    this.id = params.get("playlist") as string;
  }

  /**
   * Fetch a video from a source URL
   *
   * @param path  The path to search for the video ID in
   * @param params  The params to search for the video ID in
   */
  private fetchVideoFromSource(path: string, params: ParameterMap): void {
    if (this.embedType !== EmbedType.Undefined) {
      // don't reset type
      return;
    }
    const match = path.match(/\/([a-zA-Z0-9_-]{11})$/);
    if (match) {
      this.embedType = EmbedType.Video;
      [, this.id] = match;
      return;
    }
    if (typeof params.get("v") !== "undefined") {
      this.embedType = EmbedType.Video;
      this.id = params.get("v") as string;
    }
  }

  /**
   * Sometimes a playlist or list will be configured to start with a specific
   * video
   *
   * Converts a stored ID to a start video ID.
   */
  private setStartVideo(): void {
    if (this.embedType !== EmbedType.Video) {
      return;
    }
    this.embedType = EmbedType.Undefined;
    this.startVideoID = this.id;
  }

  /**
   * Grabs the timetamp from the given parameters if it's found,
   * and saves it on the object.
   *
   * @param params  The parameters to parse
   */
  private fetchTimestampFromParams(params: ParameterMap): void {
    if (
      typeof params.get("start") !== "undefined" &&
      parseInt(params.get("start") as string, 10) > 0
    ) {
      this.timestamp = new VideoTimestamp(params.get("start") as string);
    } else if (params.get("t")) {
      this.timestamp = new VideoTimestamp(params.get("t"));
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
    if (source.match(/^[a-zA-Z0-9_-]{11}$/)) {
      // With no URL to go off of maybe it's a video ID?
      // YouTube video IDs may change but this matches the current format
      // https://stackoverflow.com/a/4084332

      this.embedType = EmbedType.Video;
      this.id = source;
    }
  }

  /**
   * Generate a list embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generateListEmbedURL(): string {
    if (this.embedType !== EmbedType.List) {
      return "";
    }
    const params = new ParameterMap();

    params.set("listType", this.listType);
    params.set("list", this.id);

    if (this.timestamp) {
      params.set("start", this.timestamp.getSeconds().toString());
    }

    let sourceAddress = "https://www.youtube-nocookie.com/embed";

    if (this.startVideoID) {
      sourceAddress += `/${this.startVideoID}`;
    }

    return `${sourceAddress}?${params.toString()}`;
  }

  /**
   * Generate a playlist embed URL
   *
   * @return  The generated URL or empty string if it could not be generated
   */
  private generatePlaylistEmbedURL(): string {
    if (this.embedType !== EmbedType.Playlist) {
      return "";
    }
    const params = new ParameterMap();

    params.set("playlist", this.id);

    if (this.timestamp) {
      params.set("start", this.timestamp.getSeconds().toString());
    }

    let sourceAddress = `https://www.youtube-nocookie.com/embed`;

    if (this.startVideoID) {
      sourceAddress += `/${this.startVideoID}`;
    }

    return `${sourceAddress}?${params.toString()}`;
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

    if (this.timestamp) {
      params.set("start", this.timestamp.getSeconds().toString());
    }

    return `https://www.youtube-nocookie.com/embed/${
      this.id
    }?${params.toString()}`;
  }
}
