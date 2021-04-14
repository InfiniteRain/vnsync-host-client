declare const vnSync: {
  getOpenedWindows: () => Promise<{ handle: number; title: string }[]>;
  windowExists: (handle: number) => Promise<boolean>;
  initiateClickOnWindow: (handle: number) => Promise<void>;
};
