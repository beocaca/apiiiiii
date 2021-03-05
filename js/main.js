const axios = require('axios').default;

var api = 'https://satlegal.ebitc.com/api/dummies/groups'

var listPage = []

const perPage = 20

window.getApi = function getApi(page) {
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

window.delGroup = function delGroup(id) {
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

window.editGroup = function editGroup(id) {
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

window.onclick = function (event) {
  if (event.target === getModal()) {
    getModal().style.display = "none";
  }
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

window.addGroup = function addGroup() {

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

var listUsers = []

window.run = function run() {
  var idGroup = getGroupId()
  getUser(idGroup)
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

window.initFakerOfForm = initFakerOfForm

window.previewImg = function previewImg() {
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
<button type="button" onclick="showFormEditOf(${getGroupId()},${e.id})"> Show Form Edit</button>
</li>`
  })
  document.querySelector('#detail').innerHTML = htmls.join('')
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
    htmls += `<button class="${cls}" onclick="getUser(${getGroupId()},${i})"> Page ${i}</button>`
  }
  document.querySelector('#pages-number').innerHTML = htmls
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

      listUsers.push(newUser)

      checkEmpty(listUsers.length)

      renderUsers(listUsers)

      removeMessErr()

      console.log(newUser);

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
  return false
}

window.addUser = addUser;

function renderErrorOfForm(errors) {
  var errkeys = Object.keys(errors) // [first_name]
  errkeys.forEach(k => {
    var mess = errors[k].join()
    document.querySelector(`[err=${k}]`).textContent = mess
    // document.querySelector(`[err=first_name]`).textContent = mess
  })
}

function removeMessErr() {
  var allMess = document.querySelectorAll('[err]')
  allMess.forEach(elm => elm.textContent = '')
}

function getFieldValueOfForm() {
  var allFieldElm = document.querySelectorAll('[data-field]')

  var jsonData = {}
  var formData = new FormData()

  allFieldElm.forEach(elmInput => {
    var fieldName = elmInput.getAttribute('data-field')

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

window.getUser = function getUser(idGroup, page = 1) {
  axios.get(`https://satlegal.ebitc.com/api/dummies/groups/${idGroup}/users/?page=${page}`)
    .then(function (response) {
      listUsers = [...response.data.results]

      var totalPages = calcPagesNumber(response.data.count)

      renderPagesUser(totalPages, page)

      checkEmpty(listUsers.length)

      renderUsers(listUsers)

      console.log(listUsers)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
    });
}

window.delUser = function delUser(idGroup, idUser) {
  if (window.confirm(`Delete User :  ${idUser} ?`)) {
    axios.delete(`https://satlegal.ebitc.com/api/dummies/groups/${idGroup}/users/${idUser}`)

      .then(function (response) {

        var indexId = listUsers.findIndex(e => {
          return e.id === idUser
        })

        listUsers.splice(indexId, 1)

        checkEmpty(listUsers.length)

        renderUsers(listUsers)

        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

window.showFormEditOf = function showFormEditOf(idGroup, idUser) {
  getModal().style.display = 'block'
  return a
}

/*
function editUser(idGroup, idUser) {
  var postData = getFieldValueOfForm()
  var postDataFormData = postData.formData
  axios.put(`https://satlegal.ebitc.com/api/dummies/groups/${idGroup}/users/${idUser}`,
    postDataFormData)
    .then(function (response) {
      var index = listPage.findIndex(e => {
        return e.id === id
      })
      listUsers[index] = response.data

      renderApi(listUsers)

      console.log(listUsers)
    })
    .catch(function (error) {
      console.log(error);
    });

}
*/




















