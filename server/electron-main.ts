import { app, BrowserWindow, screen } from "electron";

const title = process.env.MINI_UI_TITLE ?? "mini-ui";
const position = process.env.MINI_UI_POSITION ?? "center";
const url = process.env.MINI_UI_URL ?? "http://localhost:5173";

app.whenReady().then(() => {
  const display = screen.getPrimaryDisplay();
  const { width: screenW, height: screenH } = display.workAreaSize;

  const winWidth = 480;
  const winHeight = 600;

  let x: number | undefined;
  let y: number | undefined;

  if (position === "top-right") {
    x = screenW - winWidth - 24;
    y = 24;
  } else if (position === "center") {
    x = Math.round((screenW - winWidth) / 2);
    y = Math.round((screenH - winHeight) / 2);
  }

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x,
    y,
    title,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(url);

  win.on("closed", () => {
    app.quit();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
