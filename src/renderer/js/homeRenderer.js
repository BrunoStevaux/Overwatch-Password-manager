$(function () {
  $("#accountAdd").on("submit", function (event) {
    event.preventDefault();
    const inputs = ["email", "password", "battleTag"];
    const account = {};
    let rowMarkup = "<tr>";

    for (const input of inputs) {
      account[input] = $(this)
        .find("input#" + input + "Add")
        .val();
      $(this)
        .find("input#" + input + "Add")
        .val("");

      rowMarkup += "<td>" + account[input] + "</td>";
    }
    rowMarkup += "</tr>";

    $("table#accounts tbody").append(rowMarkup);

    console.log(account);
  });
});
