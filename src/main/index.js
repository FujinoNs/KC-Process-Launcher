import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'
import os from 'os'
import { exec } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const dataPath = join(app.getPath('userData'), 'kc-launcher-data.json')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('clean-temp', async () => {
    const tempDir = os.tmpdir()
    const log = { deleted: 0, errors: [] }
    try {
      const files = await fs.readdir(tempDir)
      for (const file of files) {
        try {
          await fs.rm(join(tempDir, file), { recursive: true, force: true })
          log.deleted++
        } catch (err) {
          log.errors.push({ file, error: err.message })
        }
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
    return { success: true, ...log }
  })

  ipcMain.handle('get-items', async () => {
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  })

  ipcMain.handle('save-items', async (_, items) => {
    try {
      await fs.writeFile(dataPath, JSON.stringify(items, null, 2))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    if (canceled) {
      return null
    }
    return filePaths[0]
  })

  ipcMain.handle('launch-process', async (_, payload) => {
    const target = typeof payload === 'object' ? payload.path : payload
    const args = (typeof payload === 'object' && payload.args) ? payload.args : ''

    if (target.startsWith('http://') || target.startsWith('https://')) {
      await shell.openExternal(target)
      return { success: true, type: 'url' }
    }

    if (args) {
      exec(`"${target}" ${args}`)
      return { success: true, type: 'command' }
    }

    const err = await shell.openPath(target)
    if (err) {
      return { success: false, error: err }
    }
    return { success: true, type: 'path' }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
