import React, { useEffect, useState } from "react";

import AppRouter from "./router/AppRouter";
import { User } from "./types/userTypes";
import { me } from "./utils/apiUtils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./Components/Form/SortableItem";

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
  const [lang, setLAng] = useState(["a", "b", "c"]);
  const handleDragEnd = (event: any) => {
    console.log(event);
    const { active, over } = event;
  };
  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={lang} strategy={verticalListSortingStrategy}>
        {lang.map((l) => (
          <SortableItem key={l} id={l} />
        ))}
      </SortableContext>
    </DndContext>
  );
  //<AppRouter currentUser={currentUser} />;
}

export default App;
