import 'regenerator-runtime/runtime'

const axios = require('axios').default;

const avatarDefault = 'https://toppng.com/uploads/preview/roger-berry-avatar-placeholder-11562991561rbrfzlng6h.png'

var baseUrl = 'https://satlegal.ebitc.com/api'

const perPage = 20

async function getGroup(page) {
  var endPoint = `${baseUrl}/dummies/groups/?page=${page}`
  try {
    var response = await axios.get(endPoint)
    var list = [...response.data.results]
    setListLocal('listGroup', list)
    var totalPages = calcPagesNumber(response.data.count)
    renderPagesGroup(totalPages, page)
    var crrLocalList = getListLocal('listGroup')
    checkEmpty(crrLocalList.length)
    renderPage(crrLocalList)
  } catch (error) {
    console.log(error);
  }
}

async function delGroup(id) {
  var endPoint = `${baseUrl}/dummies/groups/${id}`
  var list = getListLocal('listGroup')

  var indexId = list.findIndex(e => {
    return e.id === id
  })
  var crrGroupSelected = list[indexId]

  if (window.confirm(`Delete group: ${crrGroupSelected.name} ?`)) {
    try {
      var response = await axios.delete(endPoint)

      list.splice(indexId, 1)

      setListLocal('listGroup', list)
      renderPage(list)
      checkEmpty(list.length)

      console.log(response)

    } catch (e) {

    }
  }
}

async function addGroup() {
  var postData = getFieldValueOfForm()
  var postDataFormData = postData.formData
  var endPoint = `${baseUrl}/dummies/groups/`
  try {
    var response = await axios.post(endPoint, postDataFormData)
    var newGroup = response.data
    var list = getListLocal('listGroup')
    list.push(newGroup)
    removeMessErr()
    checkEmpty(list.length)
    setListLocal('listGroup', list)
    renderPage(list)
    console.log(list)
  } catch (error) {
    if (error.response) {
      var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}
      console.log(errors)
      removeMessErr()
      renderErrorOfForm(errors)
    }
  }
}

var groupId = null

//"groupId" in editGroup
async function handleSaveEditGroup() {
  var endPoint = `${baseUrl}/dummies/groups/${groupId}/`
  try {
    var dataPost = getFieldValueOfForm('data-update')
    var dataPostFormData = dataPost.formData
    var response = await axios.put(endPoint, dataPostFormData)

    removeMessErr('errEditGroup')
    var list = getListLocal('listGroup')
    var index = list.findIndex(e => {
      return e.id == `${groupId}`
    })
    list[index] = response.data
    checkEmpty(list.length)
    renderPage(list)
    setListLocal('listGroup', list)
    console.log(list)
    cancelUpdate()
  } catch (error) {
    if (error.response) {
      var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}
      console.log(errors)
      //removeMessErr first
      removeMessErr('errEditGroup')
      renderErrorOfForm(errors, 'errEditGroup')
    }
  }
}

window.handleSaveEditGroup = handleSaveEditGroup

window.cancelUpdate = function cancelUpdate() {
  document.querySelector('#form').classList.remove('show')
  document.getElementById('form').reset()
}

function editGroup(id) {
  // todo: 1 open modal
  /*var modal = getModal()
  modal.style.display = 'block'*/
  document.querySelector('#form').classList.add('show')

  // todo: 2 init value form
  groupId = `${id}`
  var list = getListLocal('listGroup')
  var groupEditSelected = list.find(e => {
    return e.id == `${id}`
  })
  initFormValueWhenEdit(groupEditSelected, 'data-update')
}

function getModal() {
  var modal = (document.querySelector('#myModal'))
  return modal
}

function closeModal() {
  getModal().style.display = 'none'
}

function clearInputValue() {
  document.querySelector('input[name = "name"]').value = ''
}

function hostUrl() {
  return location.host
}

function renderPage(list) {
  var htmls = list.map(e => {
    return `<li>
<h4> id : ${e.id}</h4>
<h2><a href="http://${hostUrl()}/detail.html?group=${e.id}">Group : ${e.name} </a></h2>
<button onclick="delGroup(${e.id})"> Del</button>
<button onclick="editGroup(${e.id})"> Edit</button>
</li>`
  })
  document.querySelector('#group-block').innerHTML = htmls.join('')
}

function validate(name) {
  if (!name || !name.trim() || name.trim().length < 3) {
    alert("Invalid Name")
    return false;
  }
  return name;
}

function calcPagesNumber(countTotal) {
  var pages = 1
  var a = countTotal / perPage
  pages = Math.floor(a)
  if (countTotal % perPage !== 0) {
    pages += 1
  }
  return pages
}

function renderPagesGroup(totalPage, page) {
  if (totalPage === 1) {
    return
  }
  var htmls = ''
  for (var i = 1; i <= totalPage; i++) {
    var cls = '' //disabledBtn

    if (page === i) {
      cls = 'disabledBtn'
    }
    htmls += `<button class="${cls}" onclick="getGroup(${i})"> Page ${i}</button>`
  }
  document.querySelector('#pages-number').innerHTML = htmls
}

function renderPagesUser(totalPage, page) {
  if (totalPage === 1) {
    return
  }
  var htmls = ''
  for (var i = 1; i <= totalPage; i++) {
    var cls = '' //disabledBtn

    if (page === i) {
      cls = 'disabledBtn'
    }
    htmls += `<button class="${cls}" onclick="getUser(${i})"> Page ${i}</button>`
  }
  document.querySelector('#pages-number').innerHTML = htmls
}


function getGroupId() {
  var url = new URL(location.href)
  var idGroup = parseInt(url.searchParams.get('group'), 10)
  return idGroup
}

/*function initFakerOfForm() {
  var allInput = document.querySelectorAll('[faker-attr]')
  allInput.forEach(input => {
    var attr = input.getAttribute('faker-attr')
    var arr = attr.split('.')
    var firstKey = arr[0] // => a["name"]
    var lastKey = arr[1] // => a["firstName"]
    var value = faker[firstKey][lastKey]()
    input.value = value
  })
}*/

function initFakerOfForm() {
  var allInput = document.querySelectorAll('[faker-attr]')
  allInput.forEach(input => {
    var attr = input.getAttribute('faker-attr')
    var arr = attr.split('.')
    var firstKey = arr[0]// => a['name']
    var lastKey = arr[1]
    var value = faker[arr[0]][arr[1]]()
    input.value = value
  })
}

function changeFileUpload(evt) {
  console.log(evt.target)
  let elm = evt.target //input
  let files = elm.files //input.files
  if (files && files[0]) {
    var FR = new FileReader();
    FR.onload = function (e) {
      var attrImage = elm.getAttribute('data-field')
      var elmImage = document.querySelector(`[mo-ta=${attrImage}]`)
      elmImage.src = e.target.result;
    };
    FR.readAsDataURL(files[0]);
  }
}


function previewImg() {
  function readFile() {
    if (this.files && this.files[0]) {
      var FR = new FileReader();
      FR.onload = function (e) {
        document.getElementById("imgupload").src = e.target.result;
        document.getElementById("imgupload").style.width = "80px";
      };
      FR.readAsDataURL(this.files[0]);
    }
  }

  document.getElementById("avatar").addEventListener("change", readFile, false);
}

function renderUsers(listUser) {
  var htmls = listUser.map(e => {
    var srcAvatar = e.avatar ? e.avatar : ''
    return `<li>
<h4> id : ${e.id}</h4>
<div><img src="${srcAvatar}" alt=""></div>
<h2>First Name : ${e.first_name} </a></h2>
<h2>Last Name : ${e.last_name} </a></h2>
<h3>Email: ${e.email}</h3>
<button onclick="delUser(${getGroupId()},${e.id})"> Del</button>
<button type="button" onclick="showFormEdit(${getGroupId()},${e.id})"> Show Form Edit</button>
</li>`
  })
  document.querySelector('#detail').innerHTML = htmls.join('')
}

function checkEmpty(totalList) {
  if (totalList === 0) return document.querySelector('#empty').style.display = 'block'
  //if ko co {}
  return document.querySelector('#empty').style.display = 'none'
}

function renderErrorOfForm(errors, attrName = 'err') {
  var errkeys = Object.keys(errors) // [first_name]
  errkeys.forEach(k => {
    var mess = errors[k].join()
    document.querySelector(`[${attrName}=${k}]`).textContent = mess
    // document.querySelector(`[err=first_name]`).textContent = mess
  })
}

function removeMessErr(attrErrName = 'err') {
  var allMess = document.querySelectorAll(`[${attrErrName}]`)
  allMess.forEach(elm => elm.textContent = null)
}

function getFieldValueOfForm(attrName = 'data-field') {
  var allFieldElm = document.querySelectorAll(`[${attrName}]`)

  var jsonData = {}
  var formData = new FormData()

  allFieldElm.forEach(elmInput => {
    var fieldName = elmInput.getAttribute(`${attrName}`)
    // var isFileUpload = elmInput.getAttribute('is-file-upload')

    var isFileUpload1 = elmInput.files

    if (isFileUpload1) { // la input type=file
      /*<input class="hidden" style="" type="file" multiple id="avatar1"
               data-file-upload
               data-update="avatar"
               name="avatarUser1"/>*/
      var arrFiles = Object.values(elmInput.files)
      for (var i = 0; i < arrFiles.length; i++) {
        jsonData[fieldName] = arrFiles[i]
        formData.append([fieldName], arrFiles[i])
      }
    } else { // input type=text,number,date,date-timelocal,...
      /*<input style="width: 100%;" type="email"
               data-update="email"
               name="emailUser1"/>*/
      var fieldValue = elmInput.value
      jsonData[fieldName] = fieldValue
      formData.append([fieldName], fieldValue)
    }
  })

  return {
    jsonData, // => {first_name: 'nam', last_name: 'reduce'}
    formData
  }
}

function getListLocal(key = 'listUser') {
  var a = JSON.parse(localStorage.getItem(`${key}`))
  return a
}

function setListLocal(key = 'listUser', results) {
  localStorage.setItem(`${key}`, JSON.stringify(results))
}


function getCrrUser(id) {
  var a = getListLocal('listUser').find(e => {
    return e.id === id
  })
  return a
}

function getCrrIndexUser(id) {
  var a = getListLocal('listUser').findIndex(e => {
    return e.id === id
  })
  return a
}

async function getUser(page = 1) {
  try {
    var endPoint = `${baseUrl}/dummies/groups/${getGroupId()}/users/?page=${page}`
    var response = await axios.get(endPoint)
    setListLocal('listUser', [...response.data.results])
    var totalPages = calcPagesNumber(response.data.count)
    renderPagesUser(totalPages, page)
    var list = getListLocal('listUser')
    checkEmpty(list.length)
    renderUsers(list)
    console.log(list)
  } catch (err) {
    console.error(err.message)
  }
}

async function addUser(evt) {
  var dataPost = getFieldValueOfForm()
  var dataPostFormData = dataPost.formData
  // var dataPostJsonData = dataPost.jsonData
  var endPoint = `${baseUrl}/dummies/groups/${getGroupId()}/users/`
  try {
    var response = await axios.post(endPoint, dataPostFormData)
    var newUser = response.data
    var list = getListLocal('listUser')
    list.push(newUser)
    checkEmpty(list.length)
    renderUsers(list)
    setListLocal('listUser', list)
    removeMessErr()
    console.log(list)
  } catch (error) {
    if (error.response) {
      var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}
      //removeMessErr first
      removeMessErr()
      renderErrorOfForm(errors, 'err')
    }
    console.log(error.response.data)

  }
  // return false
}

async function delUser(idGroup, idUser) {
  try {
    var endPoint = `${baseUrl}/dummies/groups/${idGroup}/users/${idUser}`
    var crrUser = getCrrUser(idUser)
    if (window.confirm(`Delete User :  ${crrUser.first_name} ${crrUser.last_name} ?`)) {
      var response = await axios.delete(endPoint)
      var indexId = getCrrIndexUser(idUser)
      var list = getListLocal('listUser')
      list.splice(indexId, 1)
      checkEmpty(list.length)
      renderUsers(list)
      setListLocal('listUser', list)
      console.log(list)
    }
  } catch (err) {
    console.log(err);
  } finally {
  }
}

//userEditSelected in showFormEdit
var userEditSelected = null

function showFormEdit(idGroup, idUser) {
  userEditSelected = getCrrUser(idUser)
  getModal().style.display = 'block'

  initFormValueWhenEdit(userEditSelected, 'data-update')
}

function initFormValueWhenEdit(item, attrUpdate = 'data-update') {
  var allUpdateForm = document.querySelectorAll(`[${attrUpdate}]`)

  allUpdateForm.forEach(elm => {

    var fieldName = elm.getAttribute(`${attrUpdate}`)

    var isFieldFileUpload = elm.hasAttribute('data-file-upload') // if file upload boolean
    if (isFieldFileUpload) { //neu co attributes data-file-upload thi lam
      if (document.querySelector(`[data-image=${fieldName}]`)) {
        //neu co phan mo ta thi moi add SRC dc
        //<img src = '...'>
        //file .doc .exl ko add SRC
        if (item[fieldName]) { //user[fieldName] KHONG la NULL ????
          document.querySelector(`[data-image=${fieldName}]`).src = item[fieldName]
        } else {
          //khi show phai show 1 trong 2
          //show 1 hoac 2 se ko get dc 1 trong 2
          document.querySelector(`[data-image=${fieldName}]`).src = avatarDefault
        }
      }
    } else {
      elm.value = item[fieldName]
    }
  })
}

async function editUser() {
  var postData = getFieldValueOfForm('data-update')
  var postDataFormData = postData.formData
  var endPoint = `${baseUrl}/dummies/groups/${getGroupId()}/users/${userEditSelected.id}/`
  try {
    var response = await axios.put(endPoint, postDataFormData)
    var newUser = response.data
    var index = getCrrIndexUser(userEditSelected.id)
    var list = getListLocal('listUser')
    list[index] = newUser
    setListLocal('listUser', list)
    checkEmpty(list.length)
    renderUsers(list)
    removeMessErr('errEdit')
    console.log(list)
  } catch (error) {
    if (error.response) {
      var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}
      console.log(errors)
      //removeMessErr first
      removeMessErr('errEdit')
      renderErrorOfForm(errors, 'errEdit')
    }
  }
  // return false
}


window.changeFileUpload = changeFileUpload
window.getGroup = getGroup
window.editGroup = editGroup
window.delGroup = delGroup
window.addGroup = addGroup
window.getUser = getUser
window.delUser = delUser
window.addUser = addUser;
window.showFormEdit = showFormEdit
window.editUser = editUser
// window.previewImg = previewImg
window.initFakerOfForm = initFakerOfForm
window.closeModal = closeModal












