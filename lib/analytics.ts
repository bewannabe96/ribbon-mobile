import { Mixpanel } from "mixpanel-react-native";

// Mixpanel analytics service
class Analytics {
  private mixpanel: Mixpanel | null = null;
  private isInitialized = false;

  /**
   * Initialize Mixpanel SDK
   * Call this once when the app starts
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.mixpanel = new Mixpanel(
        process.env.EXPO_PUBLIC_MIXPANEL_TOKEN || "",
        true,
      );
      await this.mixpanel.init();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Mixpanel:", error);
    }
  }

  /**
   * Track a screen view
   */
  trackScreen(screenName: string): void {
    if (!this.isInitialized || !this.mixpanel) {
      return;
    }

    this.mixpanel.track("Screen View", { screen_name: screenName });
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized || !this.mixpanel) {
      return;
    }

    this.mixpanel.track(eventName, properties);
  }

  /**
   * Identify a user
   */
  async identifyUser(
    userId: string,
    username: string,
    email: string,
    avatar: string | null,
  ): Promise<void> {
    if (!this.isInitialized || !this.mixpanel) {
      return;
    }

    await this.mixpanel.identify(userId);
    this.mixpanel.getPeople().set({ $email: email, $name: username });
    if (avatar !== null) this.mixpanel.getPeople().set("$avatar", avatar);
  }

  /**
   * Reset user data (on logout)
   */
  reset(): void {
    if (!this.isInitialized || !this.mixpanel) {
      return;
    }

    this.mixpanel.reset();
  }
}

// Export singleton instance
export const analytics = new Analytics();
