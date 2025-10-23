module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],
    require: ['src/step_definitions/**/*.js', 'src/support/**/*.js'],
    requireModule: ['dotenv/config'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publish: false
  }
};
