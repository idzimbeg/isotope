import { useSyncExternalStore } from "react";

type IsotopeGetter<IsotopeType> = (
  get: <Target>(i: Isotope<Target>) => Target
) => IsotopeType;

interface Isotope<IsotopeType> {
  get: () => IsotopeType;
  set: (newValue: IsotopeType) => void;
  subscribe: (callback: (newValue: IsotopeType) => void) => () => void;
  _subscribers: () => number;
}

export function isotope<IsotopeType>(
  initialValue: IsotopeType | IsotopeGetter<IsotopeType>
): Isotope<IsotopeType> {
  let value: IsotopeType =
    typeof initialValue === "function" ? (null as IsotopeType) : initialValue;

  const subscribers = new Set<(newValue: IsotopeType) => void>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribed = new Set<Isotope<any>>();

  function get<Target>(isotope: Isotope<Target>) {
    let currentValue = isotope.get();

    if (!subscribed.has(isotope)) {
      subscribed.add(isotope);
      isotope.subscribe(function (newValue) {
        if (currentValue === newValue) return;
        currentValue = newValue;
        computeValue();
      });
    }

    return currentValue;
  }

  async function computeValue() {
    const newValue =
      typeof initialValue === "function"
        ? (initialValue as IsotopeGetter<IsotopeType>)(get)
        : initialValue;
    value = null as IsotopeType;
    value = await newValue;
    subscribers.forEach((callback) => callback(value));
  }
  computeValue();

  return {
    get: () => value,
    set: (newValue) => {
      initialValue = newValue;
      computeValue();
    },
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
    _subscribers: () => subscribers.size,
  };
}

export function useIsotope<IsotopeType>(isotope: Isotope<IsotopeType>) {
  return [useSyncExternalStore(isotope.subscribe, isotope.get), isotope.set];
}

export function useIsotopeValue<IsotopeType>(isotope: Isotope<IsotopeType>) {
  return useSyncExternalStore(isotope.subscribe, isotope.get);
}
