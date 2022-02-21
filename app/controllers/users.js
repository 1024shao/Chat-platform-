const userList = [{
  name: 'vue'
}]

class UserCtl {
  find (ctx) {
    ctx.body = userList
  }
  create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false }
    })
    userList.push(ctx.request.body)
    ctx.body = userList
  }
  del (ctx) {
    userList.pop()
    ctx.status = 204
  }
}


module.exports = new UserCtl()