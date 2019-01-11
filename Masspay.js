const Masspay = function() {

  const KNOWN_RECIEVERS = [
    'juliana@test.com',
    'ike@test.com',
    'cordell@test.com',
    'kendrick@test.com',
    'hiawatha@test.com',
    'skyler@test.com',
    'julio@test.com',
    'bai@test.com',
    'vikram@test.com',
    'emerald@test.com'
  ];

  function getKnownReceivers() {
    return new Promise(function(resolve) {
      return resolve(KNOWN_RECIEVERS.slice());
    });
  }

  function isKnownReceiver(email) {
    return new Promise(function(resolve) {
      return resolve(KNOWN_RECIEVERS.includes(email));
    });
  }

  function isEmailAddress(email) {
    return email.includes('@');
  }

  async function isValidReceiver(receiver) {
    return !!receiver && await isKnownReceiver(receiver);
  }

  function hasTwoOrLessDecimalPlaces(amount) {
    const timesHundred = amount * 100;
    return Math.floor(timesHundred) === timesHundred;
  }

  function isValidAmount(amount) {
    return !isNaN(amount) && amount > 0 && hasTwoOrLessDecimalPlaces(amount);
  }

  function itemsAreEmpty(items) {
    return !items || !Array.isArray(items) || items.length < 1;
  }

  async function submit(items) {
    if (itemsAreEmpty(items)) {
      return new Promise(function(resolve) {
        return resolve({
          "success": false,
          "error": "empty"
        });
      });
    }

    for (var i = 0; i < items.length; i++) {
      const validReceiver = await isValidReceiver(items[i].receiver);
      if (!validReceiver) {
        return {
          "success": false,
          "error": "invalidReceiver",
          "item": i
        };
      }
      if (!isValidAmount(items[i].amount)) {
        return {
          "success": false,
          "error": "invalidAmount",
          "item": i
        };
      }
    }

    return {
      "success": true
    };
  }

  return {
    getKnownReceivers: getKnownReceivers,
    isEmailAddress: isEmailAddress,
    isValidReceiver: isValidReceiver,
    isValidAmount: isValidAmount,
    submit: submit
  };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Masspay;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Masspay;
    });
  } else {
    window.Masspay = Masspay;
  }
}
