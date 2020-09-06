import store from '../store/store'

export default function dateFilter(value, format = 'date') {
  const options = {}

  if (format.includes('date')) {
    options.day = 'numeric'
    options.month = 'long'
    options.year = 'numeric'
  }

  if (format.includes('datetime')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  const locale = store.getters.info.locale || 'ru-RU'
  return new Intl.DateTimeFormat(locale, options).format(new Date(value))
}
