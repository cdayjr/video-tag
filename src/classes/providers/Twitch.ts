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

import VideoProvider from "../VideoProvider";

export default class Twitch extends VideoProvider {
  /**
   * Build an object from the source URL
   *
   * @param A source string, usually an URL.
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof VideoProvider).getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source.match(
        /https?:\/\/(?:.+\.)?twitch\.tv(?:\/(?:videos\/(\d+)|embed|collections\/(\w+)))?(?:\/(\w+)(?:\/clip\/(\w+))?)?/
      );
      if (match) {
        const [, idMatch, collectionMatch, channelMatch, clipMatch] = match;

        if (collectionMatch) {
          this.options.set("collection", collectionMatch);
        } else if (clipMatch) {
          this.options.set("clip", clipMatch);
        } else if (channelMatch) {
          this.options.set("channel", channelMatch);
        } else if (idMatch) {
          // If video ID is gathered this way, we need to
          // manually add a `v` in front.
          this.options.set("id", `v${idMatch}`);
        }
        if (link.search) {
          const params = (this
            .constructor as typeof VideoProvider).mapFromString(link.search);
          if (
            !this.options.get("channel") &&
            !this.options.get("id") &&
            !this.options.get("clip") &&
            !this.options.get("collection")
          ) {
            if (params.get("collection")) {
              this.options.set("collection", params.get(
                "collection"
              ) as string);
            } else if (params.get("channel")) {
              this.options.set("channel", params.get("channel") as string);
            } else if (params.get("video")) {
              this.options.set("id", params.get("video") as string);
            } else if (params.get("clip")) {
              this.options.set("clip", params.get("clip") as string);
            }
          }
          if (this.options.get("id") && params.get("t")) {
            this.options.set(
              "start",
              `${(this.constructor as typeof VideoProvider).timeToSeconds(
                params.get("t") as string
              )}`
            );
          }
        }
      }
    } else if (source.match(/^\d+$/)) {
      this.options.set("id", `v${source}`);
    } else if (source.match(/^v\d+$/)) {
      this.options.set("id", source);
    } else if (source.match(/^\w+$/)) {
      this.options.set("channel", source);
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

    return !!hostName.match(/^(?:.+\.)?twitch\.tv$/);
  }

  /**
   * Get the provider string.
   *
   * @return "Twitch"
   */
  public static getProviderString(): string {
    return "Twitch";
  }

  /**
   * Return the video element
   *
   * @return An Iframe element if one can be created from the source,
   *  null otherwise.
   */
  public getElement(): HTMLIFrameElement | null {
    let sourceAddress = "";
    if (this.options.get("collection")) {
      // collection embed
      sourceAddress = `https://player.twitch.tv/?autoplay=false&collection=${this.options.get(
        "collection"
      )}`;
    } else if (this.options.get("channel")) {
      // stream embed
      sourceAddress = `https://player.twitch.tv/?autoplay=false&channel=${this.options.get(
        "channel"
      )}`;
    } else if (this.options.get("id")) {
      // vod embed
      sourceAddress = `https://player.twitch.tv/?autoplay=false&video=${this.options.get(
        "id"
      )}`;
      if (this.options.get("start")) {
        sourceAddress += `&t=${(this
          .constructor as typeof VideoProvider).secondsToTime(
          parseInt(this.options.get("start") as string, 10)
        )}`;
      }
    } else if (this.options.get("clip")) {
      // Clip embed
      sourceAddress = `https://clips.twitch.tv/embed?clip=${this.options.get(
        "clip"
      )}`;
    } else {
      return null;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("scrolling", "no");

    iframe.src = sourceAddress;

    return iframe;
  }
}
