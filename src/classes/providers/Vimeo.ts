import VideoProvider from "../VideoProvider.ts";

export default class Vimeo extends VideoProvider {
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
   * Build an object from the source URL
   */
  constructor(source: string) {
    super();

    if (Vimeo.getHostName(source)) {
      const link = document.createElement("a");
      link.setAttribute("href", source.trim());

      const match = source.match(
        /^https?:\/\/(?:.+\.)?vimeo\.com\/(?:video\/)?(?<id>\d+)\??(?:.*)?$/
      );
      if (match && match.groups.id) {
        this.options.set("id", match.groups.id);

        if (link.hash) {
          // Vimeo time params are stored in the hash section of the
          // URL, URLSearchParams doesn't strip the starting #
          // so we gotta do that ourselves.
          const params = new URLSearchParams(link.hash.substr(1));
          if (params.get("t")) {
            this.options.set("start", this.timeToSeconds(params.get("t")));
          }
        }
      }
    } else if (source.match(/^\d+$/)) {
      // With no URL to go off of maybe it's a video ID?

      this.options.set("id", source);
    }
  }

  public getElement(): HTMLIFrameElement {
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
      sourceAddress += `#t=${this.secondsToTime(this.options.get("start"))}`;
    }

    iframe.src = sourceAddress;

    return iframe;
  }
}
