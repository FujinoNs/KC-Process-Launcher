let items = []
let editIndex = -1
let modalInstance = null

$(document).ready(async () => {
  $('head').append(`
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --primary-gradient: linear-gradient(135deg, #2563eb 0%, #9333ea 50%, #db2777 100%);
        --bg-color: #f8f9fa;
        --text-color: #2d3748;
        --card-bg: #ffffff;
        --card-shadow: rgba(0,0,0,0.05);
        --input-bg: #ffffff;
        --input-border: #e2e8f0;
        --btn-light-bg: #f8f9fa;
        --btn-light-text: #4a5568;
      }
      [data-theme="dark"] {
        --bg-color: #1a202c;
        --text-color: #e2e8f0;
        --card-bg: #2d3748;
        --card-shadow: rgba(0,0,0,0.2);
        --input-bg: #2d3748;
        --input-border: #4a5568;
        --btn-light-bg: #4a5568;
        --btn-light-text: #e2e8f0;
      }
      body {
        font-family: 'Kanit', sans-serif;
        background-color: var(--bg-color);
        color: var(--text-color);
        transition: background-color 0.3s, color 0.3s;
      }
      input.form-control {
        -webkit-app-region: no-drag;
        user-select: text;
        border-radius: 10px;
        padding: 10px 15px;
        border: 1px solid var(--input-border);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        background-color: var(--input-bg);
        color: var(--text-color);
      }
      input.form-control:focus {
        border-color: #9333ea;
        box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.25);
        background-color: var(--input-bg);
        color: var(--text-color);
      }
      .card {
        border: none;
        border-radius: 16px;
        background: var(--card-bg);
        box-shadow: 0 4px 6px var(--card-shadow);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
      }
      [data-theme="dark"] .card:hover {
        box-shadow: 0 10px 25px rgba(234, 51, 51, 0.3), 0 0 15px rgba(0, 81, 255, 0);
      }
      .btn {
        border-radius: 8px;
        font-weight: 500;
      }
      .btn-run {
        background: var(--primary-gradient);
        border: none;
        color: white;
      }
      .btn-run:hover {
        opacity: 0.95;
        color: white;
        box-shadow: 0 4px 12px rgba(219, 39, 119, 0.4);
      }
      .badge-type {
        font-size: 0.7rem;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .btn-light-custom {
        background-color: var(--btn-light-bg);
        color: var(--btn-light-text);
      }
      .btn-light-custom:hover {
        filter: brightness(0.95);
        color: var(--btn-light-text);
      }
      .modal-content {
        background-color: var(--card-bg);
        color: var(--text-color);
      }
      .modal-header, .modal-footer {
        border-color: var(--input-border);
      }
      .btn-close {
        filter: var(--btn-close-filter, none);
      }
      [data-theme="dark"] {
        --btn-close-filter: invert(1) grayscale(100%) brightness(200%);
      }
      [data-theme="dark"] .text-muted {
        color: #a0aec0 !important;
      }
      [data-theme="dark"] .card-title {
        color: #ffffff;
      }
    </style>
  `)

  $('body').append(`
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1050">
      <button id="btnThemeToggle" class="btn btn-light-custom shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
        <svg id="iconMoon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16" style="display: none;">
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
        <svg id="iconSun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16">
          <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.557a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707z"/>
        </svg>
      </button>
    </div>
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

  const toggleTheme = () => {
    const isDark = $('body').attr('data-theme') === 'dark'
    if (isDark) {
      $('body').removeAttr('data-theme')
      $('#iconSun').show()
      $('#iconMoon').hide()
      localStorage.setItem('theme', 'light')
    } else {
      $('body').attr('data-theme', 'dark')
      $('#iconSun').hide()
      $('#iconMoon').show()
      localStorage.setItem('theme', 'dark')
    }
  }

  $(document).on('click', '#btnThemeToggle', toggleTheme)

  if (localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme')) {
    $('body').attr('data-theme', 'dark')
    $('#iconSun').hide()
    $('#iconMoon').show()
  }

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

    const typeColor = isUrl ? '#2563eb' : '#db2777'
    const typeBg = isUrl ? '#dbeafe' : '#fce7f3'
    const typeText = isUrl ? 'WEBSITE' : 'APPLICATION'

    const iconSvg = isUrl
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="${typeColor}" class="bi bi-globe" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.592.325 1.052.561 1.333C6.258 13.89 6.874 14.5 7.5 14.923V12H5.145zm8.5-7.923v2.923h2.355a7.967 7.967 0 0 0-1.76-2.355 5.484 5.484 0 0 0-.595-.568zM1.674 11a6.957 6.957 0 0 0 .656 2.5h2.141c-.174-.782-.282-1.623-.312-2.5H1.674zm11.774-2.5a12.499 12.499 0 0 0-.338-2.5H10.5v2.5h2.948zm-2.948 3.5h2.653a12.5 12.5 0 0 0 .338-2.5H10.5v2.5zm-1.005 2.923V12h2.355a7.967 7.967 0 0 0 1.76-2.355 5.484 5.484 0 0 0 .595-.568z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="${typeColor}" class="bi bi-window" viewBox="0 0 16 16"><path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm13 2v2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zM1 13V6h14v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/></svg>`

    const cardHtml = `
      <div class="col-md-4 col-sm-6 mb-4">
        <div class="card h-100">
          <div class="card-body d-flex flex-column p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <span class="badge-type" style="color: ${typeColor}; background-color: ${typeBg};">${typeText}</span>
              ${iconSvg}
            </div>
            
            <h5 class="card-title fw-bold mb-1">${item.name}</h5>
            <p class="card-text text-muted small text-truncate mb-4" title="${item.path}">${item.path}</p>
            
            <div class="mt-auto">
              <button class="btn btn-run w-100 mb-2 py-2 shadow-sm" onclick="runItem(${index})">
                เปิดใช้งาน
              </button>
              <div class="d-flex gap-2">
                <button class="btn btn-light-custom flex-fill border-0" onclick="editItem(${index})">แก้ไข</button>
                <button class="btn btn-light-custom flex-fill border-0 text-danger" onclick="deleteItem(${index})">ลบ</button>
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
  window.electron.ipcRenderer.invoke('minimize-app')
  setTimeout(() => {
    showToast(`กำลังเปิดใช้งาน: ${item.name}`)
    window.electron.ipcRenderer.invoke('close-app')
  }, 5000)
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
