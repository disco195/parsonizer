window.onload = function init() {
  document.getElementById('feedbackLink').onclick = function () {
    setTimeout(parsonizer.registerGuess, 0);
  }

  parsonizer.init();

}

