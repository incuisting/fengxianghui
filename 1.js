var fun = function(i) {
  this.options = {
    number: i,
    current: 0
  }
}
fun.prototype.next = function() {
  if (this.options.current < this.options.number) {
    this.options.current++
  }

  console.log({
    value: this.options.current,
    done: this.options.current == this.options.number
  })
}
var test = new fun(2)
test.next()
test.next()
test.next()
