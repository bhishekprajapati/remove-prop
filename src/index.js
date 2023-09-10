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
  if (props.length === 1) return obj[props[0].name] ? obj : undefined;
  let currObj = obj;
  for (const [idx, prop] of props.entries()) {
    if (!currObj[prop.name]) return undefined;
    if (idx === props.length - 1) break;
    currObj = currObj[prop.name];
  }
  return currObj;
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
