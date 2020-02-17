const loadFromURL = () => {
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
}
