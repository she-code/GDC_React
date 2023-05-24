import React, { useRef } from "react";
import EditableField from "../../common/EditableField";
import Divider from "../../common/Divider";
import { FormFieldType } from "../../../types/formTypes";
import type { Identifier, XYCoord } from "dnd-core";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";

interface DragItem {
  index: number;
  id: string;
  type: string;
}
export default function TextField(props: {
  field: FormFieldType;
  id: number;
  handleChangeCB: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  removeFieldCB: (id: number, label: string) => void;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}) {
  const { field, removeFieldCB, id, moveCard, index } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      className="divide divide-x-2"
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <EditableField
        field={field}
        formId={id}
        handleChangeCB={(e: React.ChangeEvent<HTMLInputElement>) => {}}
        removeFieldCB={removeFieldCB}
      />
      <Divider />
    </div>
  );
}
