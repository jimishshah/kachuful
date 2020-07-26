import { useRef } from "react";

export default function (onClickHandler) {
  const disableButton = useRef(false);
  return {
    onClick: async (e) => {
      e.preventDefault();
      if (!disableButton.current) {
        disableButton.current = true;
        const result = await onClickHandler(e);
        if (result) disableButton.current = false;
      }
    },
    onPress: async () => {
      if (!disableButton.current) {
        disableButton.current = true;
        const result = await onClickHandler();
        if (result) disableButton.current = false;
      }
    },
  };
}
