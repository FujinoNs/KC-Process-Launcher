let items = []
let editIndex = -1
let modalInstance = null

$(document).ready(async () => {
  $('head').append(`
    <style>
      input.form-control {
        -webkit-app-region: no-drag;
        user-select: text;
      }
    </style>
  `)

  $('body').append(`
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
      <div id="liveToast" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body" id="toastBody"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `)

  if ($('#inputArgs').length === 0) {
    $('#itemModal .modal-body form').append(`
      <div class="mb-3">
        <label for="inputArgs" class="form-label">Arguments (Optional)</label>
        <input type="text" class="form-control" id="inputArgs" placeholder="เช่น -launcher_lang=th-th">
      </div>
    `)
  }

  modalInstance = new bootstrap.Modal(document.getElementById('itemModal'))

  $('#itemModal').on('shown.bs.modal', () => {
    $('#inputName').focus()
  })

  await loadItems()

  $('#btnAdd').click(() => {
    editIndex = -1
    $('#modalTitle').text('เพิ่มรายการใหม่')
    $('#itemForm')[0].reset()
    modalInstance.show()
  })

  $('#btnBrowse').click(async () => {
    const path = await window.electron.ipcRenderer.invoke('open-file-dialog')
    if (path) {
      $('#inputPath').val(path)
    }
  })

  $('#btnCleanTemp').click(async () => {
    const result = await window.electron.ipcRenderer.invoke('clean-temp')
    if (result.success) {
      showToast(`ล้างไฟล์เรียบร้อย! ลบไป ${result.deleted} ไฟล์`)
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`)
    }
  })

  $('#btnSave').click(async () => {
    const name = $('#inputName').val()
    const path = $('#inputPath').val()
    const args = $('#inputArgs').val()

    if (!name || !path) {
      alert('กรุณากรอกชื่อและ Path ให้ครบถ้วน')
      return
    }

    const newItem = { name, path, args }

    if (editIndex === -1) {
      items.push(newItem)
    } else {
      items[editIndex] = newItem
    }

    await saveItems()
    modalInstance.hide()
    renderItems()
  })
})

async function loadItems() {
  items = await window.electron.ipcRenderer.invoke('get-items')
  renderItems()
}

async function saveItems() {
  await window.electron.ipcRenderer.invoke('save-items', items)
}

function renderItems() {
  const container = $('#cardContainer')
  container.empty()

  items.forEach((item, index) => {
    const isUrl = item.path.startsWith('http://') || item.path.startsWith('https://')

    const borderClass = isUrl ? 'border-info' : 'border-primary'
    const headerClass = isUrl ? 'bg-info text-dark bg-opacity-25' : 'bg-primary text-white bg-opacity-75'
    const typeText = isUrl ? 'WEBSITE' : 'APPLICATION'
    const iconSvg = isUrl 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.592.325 1.052.561 1.333C6.258 13.89 6.874 14.5 7.5 14.923V12H5.145zm8.5-7.923v2.923h2.355a7.967 7.967 0 0 0-1.76-2.355 5.484 5.484 0 0 0-.595-.568zM1.674 11a6.957 6.957 0 0 0 .656 2.5h2.141c-.174-.782-.282-1.623-.312-2.5H1.674zm11.774-2.5a12.499 12.499 0 0 0-.338-2.5H10.5v2.5h2.948zm-2.948 3.5h2.653a12.5 12.5 0 0 0 .338-2.5H10.5v2.5zm-1.005 2.923V12h2.355a7.967 7.967 0 0 0 1.76-2.355 5.484 5.484 0 0 0 .595-.568z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-window" viewBox="0 0 16 16"><path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm13 2v2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zM1 13V6h14v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/></svg>`

    const cardHtml = `
      <div class="col-md-4 col-sm-6">
        <div class="card h-100 shadow-sm ${borderClass}">
          <div class="card-header d-flex justify-content-between align-items-center ${headerClass}">
            <small class="fw-bold">${typeText}</small>
            ${iconSvg}
          </div>
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text text-truncate text-muted" title="${item.path}">${item.path}</p>
            <div class="card-actions mt-3">
              <button class="btn btn-success btn-sm w-100 mb-2" onclick="runItem(${index})">รัน</button>
              <div class="d-flex gap-2">
                <button class="btn btn-warning btn-sm flex-fill" onclick="editItem(${index})">แก้ไข</button>
                <button class="btn btn-danger btn-sm flex-fill" onclick="deleteItem(${index})">ลบ</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    container.append(cardHtml)
  })
}

function showToast(message) {
  $('#toastBody').text(message)
  const toastEl = document.getElementById('liveToast')
  const toast = new bootstrap.Toast(toastEl)
  toast.show()
}

window.runItem = async (index) => {
  const item = items[index]
  const result = await window.electron.ipcRenderer.invoke('clean-temp')
  if (result.success && result.deleted > 0) {
    showToast(`ลบไฟล์ขยะไป ${result.deleted} ไฟล์`)
  }
  window.electron.ipcRenderer.invoke('launch-process', item)
}

window.editItem = (index) => {
  editIndex = index
  const item = items[index]
  $('#itemModalLabel').text('แก้ไขรายการ')
  $('#inputName').val(item.name)
  $('#inputPath').val(item.path)
  $('#inputArgs').val(item.args || '')
  modalInstance.show()
}

window.editItem = (index) => {
  editIndex = index
  const item = items[index]
  $('#modalTitle').text('แก้ไขรายการ')
  $('#inputName').val(item.name)
  $('#inputPath').val(item.path)
  $('#inputArgs').val(item.args)
  modalInstance.show()
}

window.deleteItem = async (index) => {
  if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
    items.splice(index, 1)
    await saveItems()
    renderItems()
  }
}
