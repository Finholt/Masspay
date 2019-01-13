$(document).ready(function(){
    var knownReceivers = [];
    Masspay().getKnownReceivers().then(function(result) {
        knownReceivers = result;
    });
    
    $("#submit-btn").click(function(){
        var recipients = getTextVals($(".recipient-textbox"));
        var amounts = getTextVals($(".amount-textbox"));
        var items = [];
        $(".error").remove(); // Removing previously displayed errors

        // Validating as much on the front-end as possible to avoid submit() calls that would result in an error being returned
        var errors = validateOnSubmit(recipients, amounts, items, knownReceivers);

        if(errors.length == 0) {
            Masspay().submit(items).then(function(result) {
                if(result.success) {
                    $("#input").hide();
                    $("#success").show();
                } else {
                    // Converting returned error strings into more helpful error messages
                    switch(String(result.error)) {
                        case "empty":
                            errors.push("Please enter at least one recipient before submitting.");
                            break;
                        case "invalidReceiver":
                            errors.push("Recipient " + $(recipients[result.item]).val() + " is not a valid receiver for you in the Masspay system.");
                            break;
                        case "invalidAmount":
                            errors.push("Recipient " + $(recipients[result.item]).val() + " does not have a valid payment amount.");
                            break;
                        default:
                            errors.push("An error has occurred. Please try again later.");
                    }

                    // Errors returned from submit() call
                    displayErrors(errors);
                }
                
            }, function(err) {
                // Even when Masspay returns an 'error', it's returned as a result.
                // Doesn't look like the Promise is rejected anywhere, so I don't think this
                // code will ever run, but I'm including it just in case.
                console.log(err);
            });
        } else {
            // Errors found in front end validation
            displayErrors(errors);
        }
    });

    $("#new-masspay-btn").click(function(){
        // With more time, I would've liked to have implemented a more elegant solution here
        location.reload();
    });

    $("#add-btn").click(function(){
        if($('#input-table-body tr').length < 50) {
            $('#input-table-body tr:last').after(
                '<tr>'
                    +'<td>'
                        +'<input name="receiver" type="email" class="textbox recipient-textbox form-control" aria-labelledby="label-recipient" placeholder="Email Address" />'
                    +'</td>'
                    +'<td>'
                        +'<input name="amount" type="text" class="textbox amount-textbox form-control" maxlength="12" aria-labelledby="label-amount" placeholder="Dollar Amount" style="text-align: right;" />'
                    +'</td>'
                +'</tr>'
            );
        }
    });

    $("#input-table-body").on('blur', '.amount-textbox', function(){
        var amounts = getTextVals($(".amount-textbox"));
        updateTotals(amounts);
        
    });
});

function getTextVals(arraySelector) {
    var textVals = [];
    for(var i = 0; i < arraySelector.length; i++) {
        textVals.push($(arraySelector[i]).val());
    }
    return textVals;
}

function updateTotals(amounts) {
    var total = 0;
    
    for(var i = 0; i < amounts.length; i++) {
        var amount = amounts[i].replace(/\$/g, '');
        if(amount && !isNaN(amount) && isFinite(amount)) {
            total += parseFloat(amount);
        }
    }

    $("#total-amount").text(total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    $("#total-submitted").text(total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
}

function validateOnSubmit(recipients, amounts, items, knownReceivers) {
    var errors = [];

    for(var i = 0; i < recipients.length; i++) {
        var recipient = recipients[i];
        var amount = amounts[i].replace(/\$/g, '');
        var isError = false;
        var item = {};
        
        if(!recipient && !amount) {
            continue;
        }

        if(!recipient || !Masspay().isEmailAddress(recipient)) {
            errors.push("Recipient " + (recipient ? recipient : (i+1)) + " does not have a valid email address.");
            isError = true;
        }
        if(!amount || !Masspay().isValidAmount(amount)) {
            errors.push("Recipient " + recipient + " does not have a valid payment amount.");
            isError = true;
        }
        if(recipient && !(knownReceivers.includes(recipient))) {
            errors.push("Recipient " + recipient + " is not a valid receiver for you in the Masspay system.");
            isError = true;
        }

        if(!isError) {
            item.receiver = recipient;
            item.amount = amount;
            items.push(item);
        }
    }

    if(errors.length == 0 && items.length == 0) {
        errors.push("Please enter at least one recipient before submitting.");
    }

    return errors;
}

function displayErrors(errors) {
    if(errors.length > 0) {
        for(var j=0; j<errors.length; j++) {
            $('#error-title').after(
                '<p class="error">' + errors[j] + '</p>'
            );
        }
        $("#errors-section").show();
    }
}