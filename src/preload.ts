import { contextBridge, ipcRenderer } from "electron";
import { InputSettings } from "./renderer/Interfaces/InputSettings";

contextBridge.exposeInMainWorld("vnSync", {
  getOpenedWindows: async () => await ipcRenderer.invoke("getOpenedWindows"),
  windowExists: async (handle: number) => {
    return await ipcRenderer.invoke("windowExists", handle);
  },
  initiateInput: async (handle: number, inputSettings: InputSettings) => {
    return await ipcRenderer.invoke("initiateInput", handle, inputSettings);
  },
  activateWindow: async (handle: number) => {
    if (typeof handle !== "number") {
      throw new TypeError("Argument 1 is expected to be a number.");
    }

    return await ipcRenderer.invoke("activateWindow", handle);
  },
});
