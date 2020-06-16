import { useState } from "react";

export default function useToggle(initialState) {
  const [state, setState] = useState(initialState);

  return [state, () => setState((state) => !state)];
}
