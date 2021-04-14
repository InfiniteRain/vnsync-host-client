import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("vnSync", {
  getOpenedWindows: async () => await ipcRenderer.invoke("getOpenedWindows"),
  windowExists: async (handle: number) => {
    if (typeof handle !== "number") {
      throw new TypeError("Argument 1 is expected to be a number.");
    }

    return await ipcRenderer.invoke("windowExists", handle);
  },
  initiateClickOnWindow: async (handle: number) => {
    if (typeof handle !== "number") {
      throw new TypeError("Argument 1 is expected to be a number.");
    }

    return await ipcRenderer.invoke("initiateClickOnWindow", handle);
  },
  activateWindow: async (handle: number) => {
    if (typeof handle !== "number") {
      throw new TypeError("Argument 1 is expected to be a number.");
    }

    return await ipcRenderer.invoke("activateWindow", handle);
  },
});
