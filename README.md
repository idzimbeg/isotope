# Isotope State Management Library

Isotope is a lightweight and flexible state management library for React applications. It provides a simple yet powerful way to manage and share state across components.

## Features

- **Simple API:** Get started with just a few lines of code.
- **Reactive Updates:** Components automatically re-render when the shared state changes.
- **Type Safety:** Leverage TypeScript for enhanced development experience.
- **Global State:** Share state across your entire application.

## Installation

```bash
npm install isotope
```

## Example

```
import React from 'react';
import { isotope, useIsotopeValue, useIsotope } from '@your-organization/isotope';

const counterAtom = isotope(0);

function Counter() {
  const count = useIsotopeValue(counterAtom);
  const setCount = useIsotope(counterAtom)[1];

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Reacting to State Changes

```
import React from 'react';
import { isotope, useIsotopeValue, useIsotope } from '@your-organization/isotope';

const messageAtom = isotope('Hello, Isotope!');

function DisplayMessage() {
  const message = useIsotopeValue(messageAtom);

  return <p>{message}</p>;
}

function MessageUpdater() {
  const setMessage = useIsotope(messageAtom)[1];

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
    </div>
  );
}
```

## API Reference

- isotope(initialValue: IsotopeType | IsotopeGetter<IsotopeType>): Isotope<IsotopeType>
  Creates a new Isotope with the provided initial value or a getter function.

- initialValue: Initial value or a function that returns the initial value.
  Returns an object with get, set, subscribe, and \_subscribers methods.

- useIsotope(isotope: Isotope<IsotopeType>): [IsotopeType, (newValue: IsotopeType) => void]
  React hook to access and modify the value of an Isotope.

- isotope: The Isotope object.
  Returns an array with the current value and a setter function.

- useIsotopeValue(isotope: Isotope<IsotopeType>): IsotopeType
  React hook to access the current value of an Isotope.
