module.exports = {
  default: {
    require: ['features/step_definations/**/*.js', 'features/support/**/*.js'],
    format: ['progress', 'html:cucumber-report.html'],
    paths: ['features/**/*.feature']
  }
};