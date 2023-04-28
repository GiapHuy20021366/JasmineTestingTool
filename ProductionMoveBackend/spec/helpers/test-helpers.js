const customMatcher = {
  toHaveProperties: function (util, customEqualityTesters) {
    return {
      compare: function (actual, expected) {
        const result = { pass: true };
        const missingProps = [];

        for (let prop in expected) {
          if (
            !actual.hasOwnProperty(prop) ||
            !util.equals(actual[prop], expected[prop], customEqualityTesters)
          ) {
            result.pass = false;
            missingProps.push(prop);
          }
        }

        if (missingProps.length > 0) {
          result.message = `Expected ${JSON.stringify(
            actual
          )} to have properties ${JSON.stringify(
            expected
          )}, but missing properties ${JSON.stringify(missingProps)}`;
        } else {
          result.message = `Expected ${JSON.stringify(
            actual
          )} not to have properties ${JSON.stringify(expected)}`;
        }

        return result;
      },
    };
  },
};

module.exports = customMatcher;
