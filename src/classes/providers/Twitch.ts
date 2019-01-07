import URLSearchParams from "../URLSearchParams.ts";
import VideoProvider from "../VideoProvider.ts";

export default class Twitch extends VideoProvider {
  /**
   * Let us know if this is a valid provider for the source
   * (usually a URL)
   */
  public static isProvider(source: string): boolean {
    // First test if it's an URL
    const hostName: string = this.getHostName(source);

    return !!hostName.match(/^(?:.+\.)?twitch\.tv$/);
  }

  /**
   * Get the provider string.
   */
  public static getProviderString(): string {
    return "Twitch";
  }

  /**
   * Build an object from the source URL
   */
  constructor(source: string) {
    super();

    if (this.constructor.getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source.match(
        /https?:\/\/(?:.+\.)?twitch\.tv\/(?:(?:videos\/(?<id>\d+))|embed\/)?(?<channel>\w+)?/
      );
      if (match) {
        // temporary until regex named groups are supported
        if (!match.groups) {
          match.groups = {
            channel: match[2],
            id: match[1]
          };
        }

        if (match.groups.channel) {
          this.options.set("channel", match.groups.channel);
        } else if (match.groups.id) {
          // If video ID is gathered this way, we need to
          // manually add a `v` in front.
          this.options.set("id", `v${match.groups.id}`);
        }
        if (link.search) {
          const params = new URLSearchParams(link.search);
          if (!this.options.get("channel") && !this.options.get("id")) {
            if (params.get("channel")) {
              this.options.set("channel", params.get("channel"));
            } else if (params.get("video")) {
              this.options.set("id", params.get("video"));
            }
          }
          if (params.get("t")) {
            this.options.set(
              "start",
              this.constructor.timeToSeconds(params.get("t"))
            );
          }
        }
      }
    } else {
      // Could just be a video ID.
      if (source.match(/^\d+$/)) {
        this.options.set("id", `v${source}`);
      } else if (source.match(/^v\d+$/)) {
        this.options.set("id", source);
      } else {
        // Just assume it's a channel?
        this.options.set("channel", source);
      }
    }
  }

  public getElement(): HTMLIFrameElement {
    let sourceAddress = "";
    if (this.options.get("channel")) {
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
        sourceAddress += `&t=${this.constructor.secondsToTime(
          this.options.get("start")
        )}`;
      }
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("scrolling", "no");

    iframe.src = sourceAddress;

    return iframe;
  }
}
