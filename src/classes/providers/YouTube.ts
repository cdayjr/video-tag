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

      const match = source.trim().match(
        /* eslint-disable-next-line no-useless-escape */
        /^https?:\/\/(?:.+.)?youtu(?:be(?:-nocookie)?.com|\.be)\/(?:(?:embed(?:\/videoseries)?|watch|playlist)\/?)?([^?#\n\/]+)?/
      );

      if (match) {
        const [, idMatch] = match;

        const params = new ParameterMap(link.search);

        // Video ID
        if (idMatch) {
          this.options.set("id", idMatch);
        } else if (params.get("v")) {
          this.options.set("id", params.get("v") as string);
        }

        // Playlists
        if (params.get("listType") && params.get("list")) {
          this.options.set("listType", params.get("listType") as string);
          this.options.set("list", params.get("list") as string);
        } else if (params.get("list")) {
          this.options.set("listType", "playlist");
          this.options.set("list", params.get("list") as string);
        } else if (params.get("playlist")) {
          this.options.set("playlist", params.get("playlist") as string);
        }

        // Timestamp
        if (
          params.get("start") &&
          parseInt(params.get("start") as string, 10) > 0
        ) {
          this.options.set("start", params.get("start") as string);
        } else if (params.get("t")) {
          const timestamp = new VideoTimestamp(params.get("t"));
          if (timestamp.getSeconds() > 0) {
            this.options.set("start", `${timestamp.getSeconds()}`);
          }
        }
      }
    } else if (source.match(/^[a-zA-Z0-9_-]{11}$/)) {
      // With no URL to go off of maybe it's a video ID?
      // YouTube video IDs may change but this matches the current format
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
  public getEmbedUrl(): string {
    if (
      !this.options.get("id") &&
      !this.options.get("listType") &&
      !this.options.get("playlist")
    ) {
      return "";
    }

    let sourceAddress = "https://www.youtube-nocookie.com/embed";

    const options = new ParameterMap(this.options.toString());

    if (options.get("id")) {
      sourceAddress += `/${options.get("id")}`;
      options.delete("id");
    }

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
    iframe.setAttribute(
      "allow",
      "accelerometer; encrypted-media; gyroscope; picture-in-picture"
    );

    iframe.src = sourceAddress;

    return iframe;
  }
}
