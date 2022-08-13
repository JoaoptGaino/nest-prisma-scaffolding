module.exports = {
  files: ["./*"],
  tags: ["<%", "%>"],
  helpers: [
    {
      prismaModel: (context, value) => {
        const splitValue = splitWordByComma(value);

        const upperCaseValues = splitValue.map((split) => {
          return upperCaseFirstLetter(split);
        });

        const reversedValue = upperCaseValues.map((value) => {
          const fields = value.split(" ");
          return fields.reverse().join(" ");
        });

        return reversedValue.join(" ").toString();
      },

      createDto: (context, value) => {
        const fields = splitWordByComma(value);

        return fields.map((field) => {
          return `
              @IsOptional()
              @IsString({ message: '"${field}" must be a string '})
              ${field}:string;
            `;
        });
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
        return wordArray.join("").toLowerCase();
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

const upperCaseFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
