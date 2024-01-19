class Storage {
  prefix = ''

  // 添加localStorage
  setLocal(key: string, value: any) {
    let v = value
    v = typeof v === 'object' ? 'obj-' + JSON.stringify(v) : 'str-' + v
    localStorage.setItem(this.getKey(key), v)
  }
  // 获取localStorage
  getLocal(key: string): any {
    let v = localStorage.getItem(this.getKey(key))
    if (v) {
      v = this.getStorageValue(v)
      return v
    }
  }
  // 添加session
  setSession(key: string, value: any) {
    let v = value
    v = typeof v === 'object' ? 'obj-' + JSON.stringify(v) : 'str-' + v
    sessionStorage.setItem(this.getKey(key), v)
  }
  // 获取session
  getSession(key: string): any {
    let v = sessionStorage.getItem(this.getKey(key))
    if (v) {
      v = this.getStorageValue(v)
      return v
    }
  }
  // 清空某个localStorage
  rmLocal(key: string) {
    key && localStorage.removeItem(this.getKey(key))
  }
  // 清空所有localStorage
  clearLocal() {
    localStorage.clear()
  }
  // 清空某个session
  rmSession(key: string) {
    key && sessionStorage.removeItem(this.getKey(key))
  }
  // 清空所有session
  clearSession() {
    sessionStorage.clear()
  }
  // 获取key
  private getKey(key: string) {
    return `${this.prefix}-${key}`
  }
  // 获取值
  private getStorageValue(v: string) {
    if (v.indexOf('obj-') === 0) {
      v = v.slice(4)
      return JSON.parse(v)
    } else if (v.indexOf('str-') === 0) {
      return v.slice(4)
    }
  }
}

export default new Storage()
