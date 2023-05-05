import React, { useEffect, useState } from "react";

import AppRouter from "./router/AppRouter";
import { me } from "./utils/apiUtils";
import { User } from "./types/userTypes";

const getCurrentUSer = async (
  setCurrentUserCB: (currentUser: User) => void
) => {
  const currentUser = await me();
  setCurrentUserCB(currentUser);
};
function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    getCurrentUSer(setCurrentUser);
  }, []);

  return <AppRouter currentUser={currentUser} />;
}

export default App;
