import { Readable } from 'stream'

class PageStream extends Readable {
  constructor (collection, opts) {
    super({ objectMode: true })
    this.collection = collection
    this.next = null
    this.itemStream = null
    this.count = 0
    this.currentPage = opts && opts.page !== undefined ? opts.page : 0
    this.startPage = this.currentPage
    this.endPage = (opts && opts.page !== undefined) ? this.currentPage : Infinity
    this.limit = (opts && opts.limit) ? opts.limit : Infinity
    this.proxyStreamData = this._proxyStreamData.bind(this)
    this.nextStream = this._nextStream.bind(this)
  }

  _proxyStreamData (data) {
    if (this.count >= this.limit) {
      this.push(null)
      // this is required for node 10
      process.nextTick(() => this.destroy())
      return
    }
    const ok = this.push(data)
    this.count++
    if (!ok) this.itemStream.pause()
    if (this.count === this.limit) {
    }
  }

  _nextStream () {
    if (this.next && (this.currentPage < this.endPage)) {
      this.next.next()
        .then(next => {
          this.next = next
          if (!next) {
            this.push(null)
            return
          }
          this.newItemStream(this.next.itemStream())
        })
    } else {
      this.push(null)
    }
  }

  newItemStream (stream) {
    this.itemStream = stream
    this.itemStream.on('data', this.proxyStreamData)
    this.itemStream.on('end', this.nextStream)
    this.itemStream.on('error', (err) => {
      this.emit('error', err)
    })
  }

  _destroy () {
    if (this.itemStream) {
      this.itemStream.removeListener('end', this.nextStream)
      this.itemStream.destroy()
    }
  }

  _read () {
    if (this.count >= this.limit) return
    if (!this.next && !this.itemStream) {
      this.collection.getPageAt(this.startPage)
        .then(next => {
          if (!next) {
            // no first page this is an unpaginated collection
            this.itemStream = this.newItemStream(this.collection.itemStream())
          } else {
            this.next = next
            this.newItemStream(next.itemStream())
          }
        })
      return
    }
    if (this.itemStream && this.itemStream.isPaused()) {
      this.itemStream.once('readable', (data) => {
        if (data !== null) {
          this.push(data)
        }
        this.itemStream.resume()
      })
    }
  }
}

export default PageStream
