export function isUrlText(value: string) {
    const valueToTest = value || ''
    let urlRegexp = new RegExp(
      '^http(s?)://[0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[\\w\\s-\\w@\\+\\.~#\\?&/=%]*)?$'
    )
    if (valueToTest && !urlRegexp.test(valueToTest)) {
      return false
    }
    return true
  }
