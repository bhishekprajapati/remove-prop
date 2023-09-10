const DEFAULT_SEPARATOR = ".";
const DEFAULT_OPTIONAL_CHAR = "?";

function createError(name, message) {
  return (description) => {
    const err = new Error(description ?? message);
    err.name = name;
    return err;
  };
}

const errors = {
  ObjectInvalid: createError("ObjectInvalid", "Pass an `object` type"),
  PropMissing: createError("PropMissing"),
};

function pathParser(separator, optionalChar) {
  return (path) => ({
    path,
    props: path.split(separator).map((propName) => {
      const isOptional = propName.startsWith(optionalChar);
      return {
        name: isOptional ? propName.slice(1) : propName,
        isOptional,
      };
    }),
  });
}
