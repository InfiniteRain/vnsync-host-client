import { contextBridge, ipcRenderer } from "electron";
import { SettingsState } from "./renderer/reducers/settingsReducer";

contextBridge.exposeInMainWorld("vnSync", {
  getCurrentClipboardEntry: async () =>
    await ipcRenderer.invoke("getCurrentClipboardEntry"),
  getOpenedWindows: async () => await ipcRenderer.invoke("getOpenedWindows"),
  windowExists: async (handle: number) => {
    return await ipcRenderer.invoke("windowExists", handle);
  },
  initiateInput: async (handle: number, inputSettings: SettingsState) => {
    return await ipcRenderer.invoke("initiateInput", handle, inputSettings);
  },
  activateWindow: async (handle: number) => {
    if (typeof handle !== "number") {
      throw new TypeError("Argument 1 is expected to be a number.");
    }

    return await ipcRenderer.invoke("activateWindow", handle);
  },
});
