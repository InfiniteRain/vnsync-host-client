import { app, BrowserWindow, ipcMain, clipboard } from "electron";
import {
  getOpenedWindows,
  windowExists,
  getCursorPosition,
  getWindowRectangle,
  showWindow,
  setCursorPosition,
  leftClickDown,
  leftClickUp,
  enterKeyDown,
  enterKeyUp,
} from "vnsync-win32-lib";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
  mainWindow.setMenuBarVisibility(false);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("getCurrentClipboardEntry", async () => {
  return clipboard.readText();
});

ipcMain.handle("getOpenedWindows", () => {
  return getOpenedWindows();
});

ipcMain.handle("windowExists", (_, handle: number) => {
  return windowExists(handle);
});

interface InputSettings {
  type: "leftMouseClick" | "enterKeyPress";
  isDoubleClick: boolean;
  timeoutBetweenDownAndUp: number;
  timeoutBetweenActivationAndInput: number;
}

const leftMouseClick = async (handle: number, inputSettings: InputSettings) => {
  const {
    isDoubleClick,
    timeoutBetweenDownAndUp,
    timeoutBetweenActivationAndInput,
  } = inputSettings;

  const { left, top, right, bottom } = getWindowRectangle(handle);
  const centerX = left + (right - left) / 2;
  const centerY = top + (bottom - top) / 2;

  showWindow(handle);
  await new Promise((resolve) =>
    setTimeout(resolve, timeoutBetweenActivationAndInput)
  );

  const oldCursorPosition = getCursorPosition();

  setCursorPosition(centerX, centerY);

  leftClickDown();
  await new Promise((resolve) => setTimeout(resolve, timeoutBetweenDownAndUp));
  leftClickUp();

  if (isDoubleClick) {
    await new Promise((resolve) =>
      setTimeout(resolve, timeoutBetweenDownAndUp)
    );
    leftClickDown();
    await new Promise((resolve) =>
      setTimeout(resolve, timeoutBetweenDownAndUp)
    );
    leftClickUp();
  }

  setCursorPosition(oldCursorPosition.x, oldCursorPosition.y);
};

const enterKeyPress = async (handle: number, inputSettings: InputSettings) => {
  const {
    timeoutBetweenDownAndUp,
    timeoutBetweenActivationAndInput,
  } = inputSettings;

  showWindow(handle);

  await new Promise((resolve) =>
    setTimeout(resolve, timeoutBetweenActivationAndInput)
  );

  enterKeyDown();

  await new Promise((resolve) => setTimeout(resolve, timeoutBetweenDownAndUp));

  enterKeyUp();
};

ipcMain.handle(
  "initiateInput",
  async (_, handle: number, inputSettings: InputSettings) => {
    if (!windowExists(handle)) {
      throw new Error("Incorrect window handle.");
    }

    if (inputSettings.type === "enterKeyPress") {
      await enterKeyPress(handle, inputSettings);
      return;
    }

    await leftMouseClick(handle, inputSettings);
  }
);

ipcMain.handle("activateWindow", (_, handle: number) => {
  if (!windowExists(handle)) {
    throw new Error("Incorrect window handle.");
  }

  showWindow(handle);
});
