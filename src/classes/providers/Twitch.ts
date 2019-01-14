import VideoProvider from "../VideoProvider";

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
    super(source);

    if ((this.constructor as typeof VideoProvider).getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source.match(
        /https?:\/\/(?:.+\.)?twitch\.tv\/(?:(?:videos\/(\d+))|embed\/)?(\w+)?/
      );
      if (match) {
        const [, idMatch, channelMatch] = match;

        if (channelMatch) {
          this.options.set("channel", channelMatch);
        } else if (idMatch) {
          // If video ID is gathered this way, we need to
          // manually add a `v` in front.
          this.options.set("id", `v${idMatch}`);
        }
        if (link.search) {
          const params = (this
            .constructor as typeof VideoProvider).mapFromString(link.search);
          if (!this.options.get("channel") && !this.options.get("id")) {
            if (params.get("channel")) {
              this.options.set("channel", String(params.get("channel")));
            } else if (params.get("video")) {
              this.options.set("id", String(params.get("video")));
            }
          }
          if (params.get("t")) {
            this.options.set(
              "start",
              String(
                (this.constructor as typeof VideoProvider).timeToSeconds(
                  String(params.get("t"))
                )
              )
            );
          }
        }
      }
    } else if (source.match(/^\d+$/)) {
      this.options.set("id", `v${source}`);
    } else if (source.match(/^v\d+$/)) {
      this.options.set("id", source);
    } else {
      // Just assume it's a channel?
      this.options.set("channel", source);
    }
  }

  public getElement(): HTMLIFrameElement | null {
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
        sourceAddress += `&t=${(this
          .constructor as typeof VideoProvider).secondsToTime(
          parseInt(String(this.options.get("start")), 10)
        )}`;
      }
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
