declare const vnSync: {
  getCurrentClipboardEntry: () => Promise<string>;
  getOpenedWindows: () => Promise<{ handle: number; title: string }[]>;
  windowExists: (handle: number) => Promise<boolean>;
  initiateInput: (
    handle: number,
    inputSettings: {
      type: "leftMouseClick" | "enterKeyPress";
      isDoubleClick: boolean;
      timeoutBetweenDownAndUp: number;
      timeoutBetweenActivationAndInput: number;
    }
  ) => Promise<void>;
  activateWindow: (handle: number) => Promise<void>;
};
