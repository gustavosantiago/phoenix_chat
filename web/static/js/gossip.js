class Gossip {
  static init(socket){
    var $status   = $("#status")
    var $messages = $("#messages")
    var $input    = $("#message-input")
    var $username = $("#username")

    socket.onOpen( en => console.log("OPEN", ev) )
    socket.onError( en => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e) )

    var chan = socket.channel("rooms:lobby", {})
    chan.join()
      .receive("ignore", () => console.log("auth error"))
      .receive("ok", () => console.log("join ok"))
      .receive("timeout", () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    $input.off("keypress").on("keypress", e => {
      if(e.keyCode == 13){
        chan.push("new:msg", {user: $username.val(), body: $input.val()}, 10000)
        $input.val("")
      }
    })

    chan.on("new:msg", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append('<br/><i>[${username} entered]</i>')
    })
  }
  
  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`)
  }

}

export default Gossip