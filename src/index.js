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

function traversePath(obj, props) {
  let i = 0;
  let at = obj;
  if (!at[props[0].name]) return undefined;
  while (i < props.length - 1) {
    const prop = props[i];
    if (!at[prop.name]) return undefined;
    at = at[prop.name];
    ++i;
  }
  return at;
}

exports.removeOwnProp = function (
  obj,
  path,
  parserOptions = {
    separator: DEFAULT_SEPARATOR,
    optionalChar: DEFAULT_OPTIONAL_CHAR,
  }
) {
  if (!(obj instanceof Object)) throw errors.ObjectInvalid();
  const parsedPath = pathParser(
    parserOptions.separator,
    parserOptions.optionalChar
  )(path);
  const props = parsedPath.props; // all props in a given path

  const targetProp = props[props.length - 1];
  const targetObject = traversePath(obj, props);

  if (!targetObject && !targetProp.isOptional)
    throw errors.PropMissing(
      `Prop named "${targetProp.name}" missing on the given path "${path}"`
    );

  if (targetObject) return delete targetObject[targetProp.name];
  return false;
};
