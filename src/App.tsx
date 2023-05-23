import React, { useEffect, useState } from "react";

import AppRouter from "./router/AppRouter";
import { User } from "./types/userTypes";
import { me } from "./utils/apiUtils";

const getCurrentUSer = async (
  setCurrentUserCB: (currentUser: User) => void
) => {
  const currentUser = await me();
  setCurrentUserCB(currentUser);
};
function App() {
  const [currentUser, setCurrentUser] = useState<User>({ username: "" });
  useEffect(() => {
    getCurrentUSer(setCurrentUser);
  }, []);

  return <AppRouter currentUser={currentUser} />;
}

export default App;
