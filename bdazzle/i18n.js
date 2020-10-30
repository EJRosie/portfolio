const NextI18Next = require('next-i18next').default

module.exports = new NextI18Next({
  caches: ['localStorage', 'cookie'],
  defaultLanguage: 'th',
  otherLanguages: ['en'],
})