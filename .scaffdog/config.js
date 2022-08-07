module.exports = {
  files: ["./*"],
  helpers: [
    {
      prismaModel: (context, value) => {
        const splitValue = value.split(",");

        const upperCaseValues = splitValue.map((split) => {
          return upperCaseFirstLetter(split);
        });

        const reversedValue = upperCaseValues.map((value) => {
          const fields = value.split(" ");
          return fields.reverse().join(" ");
        });

        return reversedValue.join(" ").toString();
      },

      lowerFirst: (context, value) => {
        const wordArray = splitWordByCamelCase(value);

        if (wordArray.length > 1) {
          const word = wordArray[0].toLowerCase().join(wordArray);

          return word;
        }
      },

      generateName: (context, value) => {
        const wordArray = splitWordByCamelCase(value);

        if (wordArray.lengt > 1) {
          return wordArray.join("-").toLowerCase();
        }
        return wordArray.toLowerCase();
      },
    },
  ],
};

const splitWordByCamelCase = (value) => {
  return value.split(/(?=[A-Z])/);
};

const splitWordByComma = (value) => {
  return value.split(",");
};
