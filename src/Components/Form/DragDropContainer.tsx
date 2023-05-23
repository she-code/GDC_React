import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { FormItem } from "../../types/formTypes";
import SortableItem from "./SortableItem";

export default function DragDropContainer(props: {
  forms: FormItem[];
  search: string;
}) {
  const handleDragEnd = (event: any) => {
    console.log(event);
  };
  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext
        items={props.forms.map((form) => ({
          id: form.id as number,
        }))}
        strategy={verticalListSortingStrategy}
      >
        {props.forms
          ?.filter((form: FormItem) =>
            form.title.toLowerCase().includes(props.search?.toLowerCase() || "")
          )
          .map((form: FormItem) => (
            <div
              className="flex gap-2 justify-between my-2 items-center"
              key={form.id}
            >
              <SortableItem key={form} id={form.id} />
            </div>
          ))}
      </SortableContext>
    </DndContext>
  );
}
