/* eslint-disable no-undef */

const patterns = {
  email: /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]{2,11})/,
  battleTag: /[a-zA-Z][a-zA-Z|0-9]{2,11}#[0-9]+/,
};

$(async () => {
  const fields = {
    email: { $input: $("input#emailAdd"), $error: $("span#emailError") },
    password: { $input: $("input#passwordAdd"), $error: $("span#passwordError") },
    battleTag: { $input: $("input#battleTagAdd"), $error: $("span#battleTagError") },
  };

  // Request all account data from the database through IPCMain
  const accounts = await window.api.getAccounts();
  if (accounts) populateAccountsTable(accounts.data);

  $("form#accountAdd").on("submit", async (event) => {
    event.preventDefault();
    const $formStatus = $("span#accountAddStatus");
    let account = {};
    let validInputs = 0;

    // Check each input field to ensure that they are valid and not empty
    // Assign appropriate classes based on evaluation
    Object.keys(fields).forEach((key) => {
      if (fields[key].$input.val().length === 0) {
        fields[key].$input.attr("class", "invalid");
        fields[key].$error.attr("class", "error active");
        fields[key].$error.text("This field is required!");
        $formStatus.attr("class", "success");
        $formStatus.text("");
      } else if (patterns[key] && !patterns[key].test(fields[key].$input.val())) {
        fields[key].$input.attr("class", "invalid");
        fields[key].$error.attr("class", "error active");
        fields[key].$error.text("Pattern Mismatch!");
        $formStatus.attr("class", "success");
        $formStatus.text("");
      } else {
        fields[key].$input.attr("class", "valid");
        fields[key].$error.attr("class", "error");
        fields[key].$error.text("");
        account[key] = fields[key].$input.val();
        validInputs++;
      }
    });

    if (validInputs === 3) {
      // Pass the validated data through to IPCMain and wait for a response
      const response = await window.api.sendAccountDetails(account);
      account = {};

      if (!response) {
        $formStatus.attr("class", "error active");
        $formStatus.text("✘ A fatal error occured while processing your request.");
      } else if (response.error) {
        $formStatus.attr("class", "error active");
        $formStatus.text(`✘ ${response.error}`);
      } else {
        let rowMarkup;

        // Iterate through the resulting data and create a table cell for each one
        Object.keys(response.data).forEach((key) => {
          rowMarkup += `<td>${response.data[key]}</td>`;
        });

        $("table#accounts tbody").append(`<tr>${rowMarkup}</tr>`);
        $formStatus.attr("class", "success active");
        $formStatus.text(`✔ Successfully added ${response.data.battleTag}`);
      }

      // Clear user input
      Object.keys(response.data).forEach((key) => {
        fields[key].$input.val("");
      });
    } else {
      account = {};
    }
  });

  // Clear the status message if any of the input fields are interacted with
  $("input#emailAdd, input#passwordAdd, input#battleTagAdd").on("input focus", () => {
    $("span#accountAddStatus").attr("class", "success");
    $("span#accountAddStatus").text("");
  });

  /*
    Clear the error message corresponding to which field received new input data
  */
  $("input#emailAdd").on("input", () => {
    fields.email.$input.attr("class", "valid");
    fields.email.$error.attr("class", "error");
    fields.email.$error.text("");
  });

  $("input#passwordAdd").on("input", () => {
    fields.password.$input.attr("class", "valid");
    fields.password.$error.attr("class", "error");
    fields.password.$error.text("");
  });

  $("input#battleTagAdd").on("input", () => {
    fields.battleTag.$input.attr("class", "valid");
    fields.battleTag.$error.attr("class", "error");
    fields.battleTag.$error.text("");
  });

  // Clear user input, the database, and all other status messages
  $("button.btnRemove").on("click", () => {
    $("table#accounts tbody").empty();

    window.api.deleteAllAccounts();

    $("span#accountAddStatus").attr("class", "success");
    $("span#accountAddStatus").text("");
    Object.keys(fields).forEach((key) => {
      fields[key].$input.attr("class", "valid");
      fields[key].$error.attr("class", "error");
      fields[key].$error.text("");
    });
  });
});

// Iterate through the saved account list and create a row for each one
function populateAccountsTable(accounts) {
  accounts.forEach((entry) => {
    let rowMarkup;

    Object.keys(entry).forEach((key) => {
      rowMarkup += `<td>${entry[key]}</td>`;
    });

    $("table#accounts tbody").append(`<tr>${rowMarkup}</tr>`);
  });
}
