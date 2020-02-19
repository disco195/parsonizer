window.onload = function init() {
  document.getElementById('feedbackLink').onclick = function () {
    setTimeout(parsonizer.registerGuess, 0);
  }

  parsonizer.views.editor = document.getElementById('editor');
  parsonizer.views.editorContainer = document.getElementById('editor-container');
  parsonizer.views.parsons = document.getElementById('parsons');
  parsonizer.views.main = document.getElementById('main');
  parsonizer.views.guesses = document.getElementById('the-guesses');

  parsonizer.init();

}

