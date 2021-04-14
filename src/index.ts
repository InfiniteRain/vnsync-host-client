import { app, BrowserWindow, ipcMain } from "electron";
import {
  getOpenedWindows,
  windowExists,
  getCursorPosition,
  getWindowRectangle,
  showWindow,
  setCursorPosition,
  mouseClick,
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

ipcMain.handle("getOpenedWindows", () => {
  return getOpenedWindows();
});

ipcMain.handle("windowExists", (_, handle: number) => {
  return windowExists(handle);
});

ipcMain.handle("initiateClickOnWindow", (_, handle: number) => {
  if (!windowExists(handle)) {
    throw new Error("Incorrect window handle.");
  }

  const oldCursorPosition = getCursorPosition();
  const { left, top, right, bottom } = getWindowRectangle(handle);

  showWindow(handle);
  setCursorPosition(left + (right - left) / 2, top + (bottom - top) / 2);
  mouseClick();
  setCursorPosition(oldCursorPosition.x, oldCursorPosition.y);
});
