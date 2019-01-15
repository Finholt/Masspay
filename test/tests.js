QUnit.test("#submit-btn click event - valid input submitted", function(assert) {
    var done = assert.async();
    $("#submit-btn").click();
    
    setTimeout(function() {
        assert.ok(($('#input').css("display") == "none"), "Success section in DOM no longer displays");
        assert.ok(($('#success').css("display") != "none"), "Success section in DOM displays");
        done();
    });
});

QUnit.test("#add-btn click event - row added", function(assert) {
    assert.equal($('#input-table-body tr').length, 3, "Page loads with three rows");

    $("#add-btn").click();

    assert.equal($('#input-table-body tr').length, 4, "Input table has four rows after add button is clicked");
});

QUnit.test("updateTotals - totals updated, various input strings", function(assert) {
    assert.equal($("#total-amount").text(), "0.00", "Page loads with $0 as total");
    assert.equal($("#total-submitted").text(), "0.00", "Page loads with $0 as total");
    
    var amounts = ["44.99", "55", "$150.001"];
    updateTotals(amounts);

    assert.equal($("#total-amount").text(), "249.99", "$249.99 added to total");
    assert.equal($("#total-submitted").text(), "249.99", "$249.99 added to total");
});

QUnit.test("updateTotals - totals updated, but bad input is ignored - Added to test issue and fix for issue #3", function(assert) {
    assert.equal($("#total-amount").text(), "0.00", "Page loads with $0 as total");
    assert.equal($("#total-submitted").text(), "0.00", "Page loads with $0 as total");

    var amounts = ["44.99", "77dollars-bad", "55", "$150.001", "bad5input4"];
    updateTotals(amounts);

    assert.equal($("#total-amount").text(), "249.99", "$249.99 added to total");
    assert.equal($("#total-submitted").text(), "249.99", "$249.99 added to total");
});

QUnit.test("displayErrors - displays all errors", function(assert) {
    assert.ok(($('#errors-section').css("display") == "none"), "Error section in DOM does not display before method call");
    
    var errors = ["Recipient does not have a valid email address.", "Recipient does not have a valid payment amount.", "Recipient is not a valid receiver for you in the Masspay system."];
    displayErrors(errors);

    assert.equal(errors.length, $('.error').length, "Number of errors in DOM matches number in object");
    assert.ok(($('#errors-section').css("display") != "none"), "Error section in DOM displays");
});
QUnit.test("displayErrors - does nothing when empty array is passed", function(assert) {
    assert.ok(($('#errors-section').css("display") == "none"), "Error section in DOM does not display before method call");

    var errors = [];
    displayErrors(errors);

    assert.ok(($('#errors-section').css("display") == "none"), "Error section in DOM does not display after method call");
});

QUnit.test("validateOnSubmit - no errors", function(assert) {
    var recipients = ["vikram@test.com", "joel@test.com", ""];
    var amounts = ["45", "$123.25", ""];
    var items = [];
    var knownReceivers = ["joel@test.com", "vikram@test.com"];

    var returnedErrors = validateOnSubmit(recipients, amounts, items, knownReceivers);

    assert.equal(returnedErrors.length, 0, "No errors returned when input is valid");
});
QUnit.test("validateOnSubmit - errors with recipients", function(assert) {
    var recipients = ["kimberly@test.com", "", "joel@test.com", "emily"];
    var amounts = ["45", "$123.25", "62.55", "$101"];
    var items = [];
    var knownReceivers = ["joel@test.com", "vikram@test.com"];

    var returnedErrors = validateOnSubmit(recipients, amounts, items, knownReceivers);

    assert.equal(returnedErrors.length, 4, "Correct number of errors were returned for this input");
    assert.ok(returnedErrors.includes("Recipient kimberly@test.com is not a valid receiver for you in the Masspay system."), "Invalid recipient error");
    assert.ok(returnedErrors.includes("Recipient emily does not have a valid email address."), "Invalid email format error");
    assert.ok(returnedErrors.includes("Recipient 2 does not have a valid email address."), "Recipient not entered error");
});
QUnit.test("validateOnSubmit - errors with amounts", function(assert) {
    var recipients = ["vikram@test.com", "joel@test.com", ""];
    var amounts = ["", "$123.25", ""];
    var items = [];
    var knownReceivers = ["joel@test.com", "vikram@test.com"];

    var returnedErrors = validateOnSubmit(recipients, amounts, items, knownReceivers);

    assert.equal(returnedErrors.length, 1, "Correct number of errors were returned for this input");
    assert.ok(returnedErrors.includes("Recipient vikram@test.com does not have a valid payment amount."), "Amount not entered error");
});
QUnit.test("validateOnSubmit - errors with amounts - badinput with no recipient - Added to test issue and fix for issue #4", function(assert) {
    var recipients = ["vikram@test.com", "", ""];
    var amounts = ["$123.25", "badinput", ""];
    var items = [];
    var knownReceivers = ["joel@test.com", "vikram@test.com"];

    var returnedErrors = validateOnSubmit(recipients, amounts, items, knownReceivers);

    assert.equal(returnedErrors.length, 2, "Correct number of errors were returned for this input");
    assert.ok(returnedErrors.includes("Recipient 2 does not have a valid payment amount."), "badinput error for Amount");
    assert.ok(returnedErrors.includes("Recipient 2 does not have a valid email address."), "Invalid recipient error when not entered with badinput for Amount");
});
QUnit.test("validateOnSubmit - no recipients or amounts entered", function(assert) {
    var recipients = ["", "", ""];
    var amounts = ["", "", ""];
    var items = [];
    var knownReceivers = ["joel@test.com", "vikram@test.com"];

    var returnedErrors = validateOnSubmit(recipients, amounts, items, knownReceivers);

    assert.equal(returnedErrors.length, 1, "Correct number of errors were returned for this input");
    assert.ok(returnedErrors.includes("Please enter at least one recipient before submitting."), "No input entered error");
});