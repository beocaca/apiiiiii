const axios = require('axios').default;

const avatarDefault = 'https://toppng.com/uploads/preview/roger-berry-avatar-placeholder-11562991561rbrfzlng6h.png'

var api = 'https://satlegal.ebitc.com/api/dummies/groups'
var api1 = 'https://satlegal.ebitc.com/api'

var listPage = []

const perPage = 20

function getApi(page) {
  axios.get(api + `/?page=${page}`)
    .then(function (response) {
      listPage = [...response.data.results]

      listPage.sort((a, b) => {
        return b.id - a.id
      })

      var totalPages = calcPagesNumber(response.data.count)

      renderPagesGroup(totalPages, page)

      renderApi(listPage)

      console.log(listPage)
    })
    .catch(function (error) {
      // handle error
      alert("Invalid Name")

      console.log(error);
    })
    .then(function () {
      console.log(listPage)
    });
}

function delGroup(id) {
  if (window.confirm(`Delete ${id} ?`)) {
    axios.delete(api + '/' + id)
      .then(function (response) {

        var indexId = listPage.findIndex(e => {
          return e.id === id
        })

        listPage.splice(indexId, 1)

        renderApi(listPage)

        console.log(listPage)
      })
      .catch(function (error) {
        alert("Invalid Name")

        // handle error
        console.log(error);
      });
  }
}

function getModal() {
  var modal = (document.querySelector('#myModal'))
  return modal
}

function editGroup(id) {
  var modal = getModal()

  modal.style.display = 'block'

  var a = listPage.find(e => {
    return e.id === id
  })

  var nameInput = document.querySelector('input[name = "groupEdit"]')

  nameInput.value = a.name
  document.querySelector('#save').onclick = (e) => {
    var nameNew = validate(nameInput.value)
    if (nameNew) {
      axios.put(api + '/' + id, {
        name: nameNew,
      })
        .then(function (response) {
          var index = listPage.findIndex(e => {
            return e.id === id
          })
          listPage[index] = response.data
          renderApi(listPage)
          console.log(listPage)
        })
        .catch(function (error) {
          alert("Already Name, try again")
          console.log(error);
        })
        .then(closeModal)
    }
    closeModal()
  }
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

function renderApi(list) {

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

function addGroup() {

  var postData = getFieldValueOfForm()

  var postDataFormData = postData.formData

  axios.post(api + '/',
    postDataFormData)
    .then(function (response) {
      var newGroup = response.data
      listPage.push(newGroup)
      renderApi(listPage)
      removeMessErr()
      console.log(listPage)
    })
    .catch(function (error) {
      if (error.response) {
        var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}

        console.log(errors)
        //removeMessErr first
        removeMessErr()

        renderErrorOfForm(errors)
      }

    });

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
    htmls += `<button class="${cls}" onclick="getApi(${i})"> Page ${i}</button>`
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

function run() {
  getUser(1)
}

function getGroupId() {
  var url = new URL(location.href)
  var idGroup = parseInt(url.searchParams.get('group'), 10)
  return idGroup
}

function initFakerOfForm() {
  var allInput = document.querySelectorAll('[faker-attr]')
  allInput.forEach(input => {
    var attr = input.getAttribute('faker-attr')
    var arr = attr.split('.')
    var firstKey = arr[0] // => a["name"]
    var lastKey = arr[1] // => a["firstName"]
    var value = faker[firstKey][lastKey]()
    console.log(value)
    input.value = value
  })

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

  function readFile1() {
    if (this.files && this.files[0]) {
      var FR = new FileReader();
      FR.onload = function (e) {
        document.getElementById("imgupload1").style.width = "80px";
        document.getElementById("imgupload1").src = e.target.result;
      };
      FR.readAsDataURL(this.files[0]);
    }
  }

  document.getElementById("avatar").addEventListener("change", readFile, false);
  document.getElementById("avatar1").addEventListener("change", readFile1, false);
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

function addUser(evt) {

  var dataPost = getFieldValueOfForm()

  var dataPostFormData = dataPost.formData

  // var dataPostJsonData = dataPost.jsonData

  axios.post(`https://satlegal.ebitc.com/api/dummies/groups/${getGroupId()}/users/`,
    dataPostFormData)
    .then(function (response) {

      var newUser = response.data
      var l = getListUser()

      l.push(newUser)

      checkEmpty(l.length)

      renderUsers(l)
      setListUser(l)
      removeMessErr()

      console.log(newUser);

    })

    .catch(function (error) {

      if (error.response) {
        var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}

        console.log(errors)
        //removeMessErr first
        removeMessErr()

        renderErrorOfForm(errors, 'err')
      }
    });
  return false
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
  allMess.forEach(elm => elm.textContent = '')
}

function getFieldValueOfForm(attrName = 'data-field') {
  var allFieldElm = document.querySelectorAll(`[${attrName}]`)

  var jsonData = {}
  var formData = new FormData()

  allFieldElm.forEach(elmInput => {
    var fieldName = elmInput.getAttribute(`${attrName}`)

    if (elmInput.files) {
      var arrFiles = Object.values(elmInput.files)
      for (var i = 0; i < arrFiles.length; i++) {
        jsonData[fieldName] = arrFiles[i]
        formData.append([fieldName], arrFiles[i])
      }
    } else {
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

function getListUser() {
  var a = JSON.parse(localStorage.getItem('listUser'))
  return a
}

function setListUser(results) {
  localStorage.setItem('listUser', JSON.stringify(results))
}

function getUser(page = 1) {
  axios.get(`https://satlegal.ebitc.com/api/dummies/groups/${getGroupId()}/users/?page=${page}`)
    .then(function (response) {
      // listUsers = [...response.data.results]
      //  listUsers = getListUser() || []
      setListUser([...response.data.results])

      var totalPages = calcPagesNumber(response.data.count)

      renderPagesUser(totalPages, page)

      checkEmpty(getListUser().length)

      renderUsers(getListUser())

      console.log(getListUser())
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
    });
}

const $ = document

function getCrrUser(id) {
  var a = getListUser().find(e => {
    return e.id === id
  })
  return a
}

function getCrrIndexUser(id) {
  var a = getListUser().findIndex(e => {
    return e.id === id
  })
  return a
}

function delUser(idGroup, idUser) {

  var a = getCrrUser(idUser)

  if (window.confirm(`Delete User :  ${a.first_name} ${a.last_name} ?`)) {
    axios.delete(`https://satlegal.ebitc.com/api/dummies/groups/${idGroup}/users/${idUser}`)

      .then(function (response) {

        var indexId = getCrrIndexUser(idUser)
        var l = getListUser()
        l.splice(indexId, 1)

        checkEmpty(l.length)

        renderUsers(l)
        setListUser(l)

        console.log(a)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

var userEditSelected = null

function showFormEdit(idGroup, idUser) {
  var a = getCrrUser(idUser)

  userEditSelected = a
  getModal().style.display = 'block'

  var allUpdateForm = document.querySelectorAll('[data-update]')

  allUpdateForm.forEach(elm => {

    var fieldName = elm.getAttribute('data-update')

    var isFieldFileUpload = elm.hasAttribute('data-file-upload') // if file upload boolean
    if (isFieldFileUpload) { //neu co attributes data-file-upload thi lam
      if (document.querySelector(`[data-image=${fieldName}]`)) {
        //neu co phan mo ta thi moi add SRC dc
        //<img src = '...'>
        //file .doc .exl ko add SRC
        if (userEditSelected[fieldName]) { //user[fieldName] KHONG la NULL ????
          document.querySelector(`[data-image=${fieldName}]`).src = userEditSelected[fieldName]
        } else {
          //khi show phai show 1 trong 2
          //show 1 hoac 2 se ko get dc 1 trong 2
          document.querySelector(`[data-image=${fieldName}]`).src = avatarDefault
        }
      }
    } else {
      elm.value = userEditSelected[fieldName]
    }
  })
  console.log(getGroupId(), userEditSelected.id)
}

function editUser() {
  var postData = getFieldValueOfForm('data-update')
  var postDataFormData = postData.formData
  axios.put(`https://satlegal.ebitc.com/api/dummies/groups/${getGroupId()}/users/${userEditSelected.id}/`,
    postDataFormData)
    .then(function (response) {

      var newUser = response.data

      var index = getCrrIndexUser(userEditSelected.id)
      var l = getListUser()
      l[index] = newUser
      setListUser(l)
      checkEmpty(l.length)

      renderUsers(l)

      removeMessErr('errEdit')

      console.log(l);

    })

    .catch(function (error) {

      if (error.response) {
        var errors = error.response.data // {first_name: ['loi 1', 'loi 2']}

        console.log(errors)
        //removeMessErr first
        removeMessErr('errEdit')

        renderErrorOfForm(errors, 'errEdit')
      }
    });
  return false
}

window.onclick = function (event) {
  if (event.target === getModal()) {
    getModal().style.display = "none";
  }
}

window.getApi = getApi
window.editGroup = editGroup
window.delGroup = delGroup
window.addGroup = addGroup
window.getUser = getUser
window.delUser = delUser
window.addUser = addUser;
window.showFormEdit = showFormEdit
window.editUser = editUser
window.previewImg = previewImg
window.initFakerOfForm = initFakerOfForm
window.run = run












