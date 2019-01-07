import providers from "./providers.ts";
import style from "./Video.scss";
import VideoProvider from "./VideoProvider.ts";

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
   * Stores the provider string.
   */

  /**
   * Build a Video object. All you need is an URL, but providng a provider
   * means you can get by with just a video ID.
   *
   * @param source - The video URL or ID.
   * @param provider - We can figure this out form an URL, but if an ID is
   *  provided, you'll want to share this. A string like "YouTube" or "Vimeo".
   *
   */
  constructor(source: string, providerString?: string) {
    if (providerString) {
      this.provider = this.getProviderFromString(
        source.trim(),
        providerString.trim()
      );
    } else {
      this.provider = this.guessProvider(source.trim());
    }
  }

  /**
   * If you already have parsed out options, you can call this to
   * rebuild the object based on those parameters.
   *
   * @param providerString - A string representing the provider, ex. "YouTube" or "Vimeo".
   * @param optionsString - A string representing the options, ex. "id=666&start=15".
   */
  public importOptions(providerString: string, optionsString: string): void {
    this.provider = getProviderFromString(providerString);
    this.provider.importOptions(optionsString);
  }

  /**
   * Get the HTML element that embeds the video from its provider.
   *
   * @return An HTMLDivElement containing the iframe or other embed code
   *  for the video.
   */
  public getElement(): HTMLDivElement {
    const container: HTMLDivElemenet = document.createElement("div");
    container.classList.add(style.videoContainer);

    if (this.provider instanceof VideoProvider) {
      const videoElement = this.provider.getElement();
      videoElement.classList.add(style.videoEmbed);
      container.appendChild(videoElement);
    } else {
      const message = document.createElement("p");
      message.textContent = "Invalid Video";
      container.appendChild(message);
    }

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
    } else {
      // No options if no provider
      return "";
    }
  }

  /**
   * Get a string representation of this video's provider.
   *
   * @return A string such as "YouTube" or "Vimeo".
   */
  public getProvider(): string {
    if (this.provider) {
      return this.provider.getProviderString();
    } else {
      return "Invalid";
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
  private guessProvider(source: string): VideoProvider | undefined {
    if (Array.find) {
      const provider = providers.find(currentProvider => {
        return currentProvider.isProvider(source);
      });
      if (provider) {
        return new provider(source);
      }
    } else {
      // For browsers without `Array.find`
      let provider;
      for (let i = 0; i < providers.length; ++i) {
        const currentProvider = providers[i];
        if (currentProvider.isProvider(source)) {
          provider = currentProvider;
          break;
        }
      }
      if (provider) {
        return new provider(source);
      }
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
  private getProviderFromString(
    source: string,
    providerString: string
  ): VideoProvider | undefined {
    if (providerString === "Invalid") {
      return undefined;
    }

    if (Array.find) {
      const provider = providers.find(currentProvider => {
        return (
          providerString.toLowerCase() ===
          currentProvider.getProviderString().toLowerCase()
        );
      });
      if (provider) {
        return new provider(source);
      }
    } else {
      // For browsers without `Array.find`
      let provider;
      for (let i = 0; i < providers.length; ++i) {
        const currentProvider = providers[i];
        if (
          providerString.toLowerCase() ===
          currentProvider.getProviderString().toLowerCase()
        ) {
          provider = currentProvider;
          break;
        }
      }
      if (provider) {
        return new provider(source);
      }
    }

    return undefined;
  }
}
