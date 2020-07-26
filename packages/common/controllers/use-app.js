import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";

function useApp() {
  const initialConnectionId = useLocalStorage();
  const [connectionId, setConnectionId] = useState(initialConnectionId);

  const props = {
    connectionId,
    setConnectionId,
  };

  useEffect(() => {
    setConnectionId(initialConnectionId);
  }, [initialConnectionId]);

  return props;
}

export default useApp;

function useLocalStorage() {
  const [value, setValue] = useState();
  useEffect(() => {
    AsyncStorage.getItem("connectionID").then((storedValue) => {
      setValue(storedValue);
    });
  }, []);
  return value;
}
