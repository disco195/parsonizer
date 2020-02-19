const parsonizer = {
  guesses: [],
  views: {
    editor: null,
    parsons: null,
    main: null,
    guesses: null
  },
  newJsParsons: function (parsonsCode) {

    function displayErrors(fb) {
      if (fb.errors.length > 0) {
        alert(fb.errors[0]);
      }
    }
    const parsonsInstance = new ParsonsWidget({
      'sortableId': 'sortable',
      'trashId': 'sortableTrash',
      // 'max_wrong_lines': 1, // ?
      'feedback_cb': displayErrors,
      'first_error_only': false,
    });

    parsonsInstance.init(parsonsCode);

    parsonsInstance.shuffleLines();
    $("#newInstanceLink").click(function (event) {
      event.preventDefault();
      parsonsInstance.shuffleLines();
    });
    $("#feedbackLink").click(function (event) {
      event.preventDefault();
      parsonsInstance.getFeedback();
    });

    return parsonsInstance;
  },
  init: function () {

    const editor = ace.edit(parsonizer.views.editor);

    editor.setTheme('ace/theme/chrome');
    editor.setFontSize(13);
    editor.getSession().setMode('ace/mode/javascript');
    editor.getSession().setTabSize(2);
    editor.on("change", (e) => {
      const code = editor.getValue()
      window.history.pushState({}, null, '?code=' + encodeURIComponent(code));
    });

    document.getElementById('edit-code').addEventListener('click', () => {
      editor.setValue(parsonizer.solution);

      parsonizer.views.main.removeChild(parsonizer.views.parsons);
      parsonizer.views.main.appendChild(parsonizer.views.editorContainer);
    });

    document.getElementById('parsonize-code').addEventListener('click', () => {

      parsonizer.solution = editor.getValue();
      parsonizer.guesses = [];
      parsonizer.views.guesses.innerHTML = '';

      parsonizer.views.main.removeChild(parsonizer.views.editorContainer);
      parsonizer.views.main.appendChild(parsonizer.views.parsons);

      parsonizer.instance = parsonizer.newJsParsons(editor.getValue());
    });


    this.views.main.removeChild(this.views.editorContainer);

    const parsonsCode = parsonizer.loadFromURL()
    parsonizer.solution = parsonsCode
    parsonizer.instance = this.newJsParsons(parsonsCode);

  },
  initModal: function () {

    var the_guesses = document.getElementById("the-guesses");
    while (the_guesses.firstChild) {
      the_guesses.removeChild(the_guesses.firstChild);
    };

    this.guesses = [];
  },
  registerGuess: function () {

    const user_actions = parsonizer.instance.user_actions;
    const guess = user_actions[user_actions.length - 1];
    const guesses = parsonizer.guesses;

    var ul_guess = document.getElementById("ul-sortable");
    var copy_guess = ul_guess.cloneNode(true);
    copy_guess.style = "list-style-type: none;";

    const guessLog = {};
    guessLog.view = copy_guess;
    guessLog.success = guess.errors.length === 0;
    guesses.push(guessLog);


    const the_guesses = document.getElementById("the-guesses");

    var next_font = document.createElement("font");
    if (guess.success) {
      next_font.innerHTML = "yup";
      next_font.style = "color: green;";
    } else {
      next_font.innerHTML = "nope";
      next_font.style = "color: red;";
    };
    var next_message = document.createElement("p");
    next_message.innerHTML = guesses.length + ": ";
    next_message.appendChild(next_font);

    var next_div = document.createElement("div");
    next_div.className = "sortable-code";
    next_div.appendChild(next_message);
    next_div.appendChild(copy_guess);

    the_guesses.appendChild(next_div);
    the_guesses.appendChild(document.createElement('br'));

  },
  loadFromURL: () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const snippet = url.searchParams.get("snippet");

    let parsonsCode;
    if (code !== null) {
      // console.log(1)
      const decoded = decodeURIComponent(code);
      parsonsCode = decoded.replace(/\%28/g, '(').replace(/\%29/g, ')');
    } else if (snippet !== null) {
      // console.log(2)
      const decoded = decodeURIComponent(snippet);
      parsonsCode = decoded.replace(/\%28/g, '(').replace(/\%29/g, ')');
    } else {
      // console.log(4)
      parsonsCode =
        "function revereString(str) {\n" +
        "  const splitted = str.split('');\n" +
        "  const reversed = splitted.reverse();\n" +
        "  const joined = reversed.join('');\n" +
        "  return joined;\n" +
        "};\n" +
        "return reversed; #distractor"
    };

    return parsonsCode;
  }
};
