import providers from "../providers";
import style from "./Video.style.scss";
import VideoProvider from "./VideoProvider";

/**
 * Class for handling all functions related towards parsing Video URLs
 * into their embed URLs.
 */
export default class Video {
  /**
   * Stores what video provider this object contains.
   */
  private provider: VideoProvider | undefined = undefined;

  /**
   * Build a Video object. All you need is an URL, but providng a provider
   * means you can get by with just a video ID.
   *
   * @param source - The video URL or ID.
   * @param provider - We can figure this out form an URL, but if an ID is
   *  provided, you'll want to share this. A string like "YouTube" or "Vimeo".
   *
   */
  public constructor(source?: string, providerString?: string) {
    if (source && providerString) {
      this.provider = (this.constructor as typeof Video).getProviderFromString(
        source.trim(),
        providerString.trim()
      );
    } else if (source) {
      this.provider = (this.constructor as typeof Video).guessProvider(
        source.trim()
      );
    }
  }

  /**
   * Make an educated guess for what a provider should be from a provided URL-
   * useful when provider isn't manually provided.
   *
   * @param source - A string, usually a URL, to figure out the provider from.
   *
   * @return Provider - A Provider enum value.
   */
  private static guessProvider(source: string): VideoProvider | undefined {
    let Provider;
    for (let i = 0; i < providers.length; ++i) {
      const currentProvider = providers[i];
      if (currentProvider.isProvider(source)) {
        Provider = currentProvider;
        break;
      }
    }
    if (Provider) {
      return new Provider(source);
    }

    return undefined;
  }

  /**
   * Parse a provider string such as "YouTube" into a Provider enum value.
   *
   * @param providerString - A string such as "YouTube" or "Vimeo".
   *
   * @return - A Provider enum value.
   */
  private static getProviderFromString(
    source: string,
    providerString: string
  ): VideoProvider | undefined {
    if (providerString === "Invalid") {
      return undefined;
    }

    // For browsers without `Array.find`
    let Provider;
    for (let i = 0; i < providers.length; ++i) {
      const currentProvider = providers[i];
      if (
        providerString.toLowerCase() ===
        currentProvider.getProviderString().toLowerCase()
      ) {
        Provider = currentProvider;
        break;
      }
    }
    if (Provider) {
      return new Provider(source);
    }

    return undefined;
  }

  /**
   * If you already have parsed out options, you can call this to
   * rebuild the object based on those parameters.
   *
   * @param providerString - A string representing the provider, ex. "YouTube" or "Vimeo".
   * @param optionsString - A string representing the options, ex. "id=666&start=15".
   */
  public importOptions(
    source: string,
    providerString: string,
    optionsString: string
  ): void {
    this.provider = (this.constructor as typeof Video).getProviderFromString(
      source.trim(),
      providerString.trim()
    );
    if (this.provider) {
      this.provider.importOptions(optionsString);
    }
  }

  /**
   * Get the HTML element that embeds the video from its provider.
   *
   * @return An HTMLDivElement containing the iframe or other embed code
   *  for the video.
   */
  public getElement(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement("div");
    container.classList.add(style.videoContainer);

    if (this.provider instanceof VideoProvider) {
      const videoElement = this.provider.getElement();
      if (videoElement) {
        videoElement.classList.add(style.videoEmbed);
        container.appendChild(videoElement);
        return container;
      }
    }

    const message = document.createElement("p");
    message.textContent = "Invalid Video";
    container.appendChild(message);

    return container;
  }

  /**
   * Get an options string compatible with our `importOptions` function.
   *
   * @return An options string such as 'id=7&start=15'.
   */
  public exportOptions(): string {
    if (this.provider instanceof VideoProvider) {
      return this.provider.exportOptions();
    }
    // No options if no provider
    return "";
  }

  /**
   * Get a string representation of this video's provider.
   *
   * @return A string such as "YouTube" or "Vimeo".
   */
  public getProvider(): string {
    if (this.provider) {
      return this.provider.getProviderString();
    }
    return "Invalid";
  }
}
