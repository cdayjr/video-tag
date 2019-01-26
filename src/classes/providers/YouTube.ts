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

import ParameterMap from "../ParameterMap";
import VideoProvider from "../VideoProvider";
import VideoTimestamp from "../VideoTimestamp";

/**
 * YouTube video provider
 */
export default class YouTube extends VideoProvider {
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

      // embed URLs- typically people won't have these but good to check.
      const match = source.match(
        /https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?|$)/
      );
      if (match) {
        const [, idMatch] = match;

        const params = new ParameterMap(link.search);

        if (idMatch === "videoseries") {
          if (params.get("list")) {
            this.options.set("playlist", params.get("list") as string);
          }
        } else {
          this.options.set("id", idMatch);

          if (params.get("start")) {
            const timeCount = parseInt(params.get("start") as string, 10);
            if (timeCount > 0) {
              this.options.set("start", `${timeCount}`);
            }
          }
        }

        return;
      }

      // Regular URL, what most people will have.
      const match2 = source.match(/https?:\/\/(?:.+\.)?youtube\.com\/watch\?/);
      if (match2) {
        const params = new ParameterMap(link.search);
        if (params.get("v")) {
          this.options.set("id", params.get("v") as string);
        }
        if (
          params.get("start") &&
          parseInt(params.get("start") as string, 10) > 0
        ) {
          this.options.set("start", params.get("start") as string);
        } else if (params.get("t")) {
          // parse time...
          const timestamp = new VideoTimestamp(params.get("t"));
          if (timestamp.getSeconds() > 0) {
            this.options.set("start", `${timestamp.getSeconds()}`);
          }
        }

        return;
      }

      // youtu.be short URLs.
      const match3 = source.match(/https?:\/\/youtu\.be\/(.+$)/);
      if (match3) {
        const [, idMatch] = match3;

        this.options.set("id", idMatch);
      }

      // Playlist URL
      const match4 = source.match(
        /https?:\/\/(?:.+\.)?youtube\.com\/playlist\?/
      );
      if (match4) {
        const params = new ParameterMap(link.search);
        if (params.get("list")) {
          this.options.set("playlist", params.get("list") as string);
        }
      }
    } else if (source.match(/^[a-zA-Z0-9_-]{11}$/)) {
      // With no URL to go off of maybe it's a video ID?
      // https://stackoverflow.com/a/4084332

      this.options.set("id", source);
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

    return !!hostName.match(/^(?:.+\.)?youtu(?:be(?:-nocookie)?\.com|\.be)$/);
  }

  /**
   * Get the provider string.
   *
   * @return "YouTube"
   */
  public static getProviderString(): string {
    return "YouTube";
  }

  /**
   * Return the video element
   *
   * @return An Iframe element if one can be created from the source,
   *  null otherwise.
   */
  public getElement(): HTMLIFrameElement | null {
    if (!this.options.get("id") && !this.options.get("playlist")) {
      return null;
    }

    let sourceAddress = this.options.get("id")
      ? `https://www.youtube-nocookie.com/embed/${this.options.get("id")}`
      : `https://www.youtube-nocookie.com/embed/videoseries?list=${this.options.get(
          "playlist"
        )}`;

    if (this.options.get("id") && this.options.get("start")) {
      sourceAddress += `?start=${this.options.get("start")}`;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute(
      "allow",
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );

    iframe.src = sourceAddress;

    return iframe;
  }
}
