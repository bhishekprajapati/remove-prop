# remove-prop

> Remove own nested properties (props) from a object using prop-path notation

## Install

`npm install remove-prop`

## API

### `removeOwnProp(obj, path, parserOptions)`

- `obj` : takes a object to perform prop deletion
- `path`: takes a string specifying the prop to be deleted
- `parserOptions`: takes of object of options

**throws**: `PropMissing` and `ObjectInvalid` errors
**returns** `true` if succeeds otherwise `false`

### Parser Options

1. `separator` (default: `.`): specify the prop separator which is to be used during parsing of the path
2. `optionalChar` (default: `?`): specify the optional character

## Features and Usage

#### Import

```
import { removeOwnProp } = require("remove-prop");
```

#### Example Target Object

```
const universe = {
  galaxies: {
    milkyway: {
      sun: "Burning",
      earth: "Life",
    },
    andromeda: {
      life: "not found"
    },
  }
};
```

##### Strict prop vs Optional prop

1. Path = `"galaxies"` // the prop must exist on the object otherwise `PropMissing` error will be thrown
2. Path = `"?galaxies"` // the prop is optional and only gets deleted if it exists

##### Path examples

1. `"galaxies"` : **_delete_** universe["galaxies"]
2. `"galaxies.milkyway"` : **_delete_** universe.galaxies["milkyway"]
3. `"galaxies.milkyway.?sun"`: **_delete_** universe.galaxies.milkyway["sun"]

##### To remove strict props on level 1

```
removeOwnProp(universe, "galaxies"); // => true
console.log(universe); // {}
```

##### To remove deep nested strict props

```
removeOwnProp(universe, "galaxies.milkyway.sun"); // => true
```

##### To remove optional prop on level 1

```
removeOwnProp(universe, "galaxies.?beautifulGalaxy"); // => false
```

##### To remove deep nested optional prop

```
removeOwnProp(universe, "galaxies.milkyway.?blackHole"); // => false
```

```
removeOwnProp(universe, "galaxies.milkyway.?earth"); // => true
```

#### ❌ Not Supported

- Cyclic Objects
- Symbolic keys
