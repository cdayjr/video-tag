import VideoProvider from "../VideoProvider";

export default class Vimeo extends VideoProvider {
  /**
   * Build an object from the source URL
   */
  public constructor(source: string) {
    super(source);

    if ((this.constructor as typeof VideoProvider).getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source.match(
        /^https?:\/\/(?:.+\.)?vimeo\.com\/(?:video\/)?(\d+)\??(?:.*)?$/
      );
      if (match) {
        const [, idMatch] = match;

        if (idMatch) {
          this.options.set("id", idMatch);

          if (link.hash) {
            const params = (this
              .constructor as typeof VideoProvider).mapFromString(
              link.hash.substr(1)
            );
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
      }
    } else if (source.match(/^\d+$/)) {
      // With no URL to go off of maybe it's a video ID?

      this.options.set("id", source);
    }
  }

  /**
   * Let us know if this is a valid provider for the source
   * (usually a URL)
   */
  public static isProvider(source: string): boolean {
    // First test if it's an URL
    const hostName: string = this.getHostName(source);

    return !!hostName.match(/^(?:.+\.)?vimeo\.com$/);
  }

  /**
   * Get the provider string.
   */
  public static getProviderString(): string {
    return "Vimeo";
  }

  /**
   * Return the video element
   */
  public getElement(): HTMLIFrameElement | null {
    if (!this.options.get("id")) {
      return null;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("webkitallowfullscreen", "");
    iframe.setAttribute("mozallowfullscreen", "");

    let sourceAddress = `https://player.vimeo.com/video/${this.options.get(
      "id"
    )}?color=ffffff&title=0&byline=0&portrait=0&autoplay=0`;

    if (this.options.get("start")) {
      sourceAddress += `#t=${(this
        .constructor as typeof VideoProvider).secondsToTime(
        parseInt(String(this.options.get("start")), 10)
      )}`;
    }

    iframe.src = sourceAddress;

    return iframe;
  }
}
