import React, { useState, useEffect  } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from 'react-router-dom';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './dependencyMobile.scss';

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

function DependencyMobile() {
  const { dependencies } = useDependencyContext();
  const [items, setItems] = useState(getItems(10));
  const navigate = useNavigate();

  useEffect(() => {
    const formattedItems = Object.keys(dependencies).map(key => {
      const leftSide = dependencies[key].left ? dependencies[key].left.join(", ") : "Nedefinováno";
      const rightSide = dependencies[key].right ? dependencies[key].right.join(", ") : "Nedefinováno";
      return {
        id: key,
        content: `${leftSide} → ${rightSide}`
      };
    });
    setItems(formattedItems);
  }, [dependencies]);

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(reorderedItems);
  };

  let lastTap = 0;

  function isMobileDevice() {
      return window.innerWidth <= 991; 
  }
    const handleDoubleTap = (itemId) => {
        if (!isMobileDevice()) return;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            navigate(`/editDependency/${itemId}`);
        }
        lastTap = currentTime;
    };

  const handleAddDependencyClick = () => {
    navigate("/addDependency");
  };

  return (

    <div className="dependencyContainer">
      <button 
        type="button" 
        className="btn-addDependency" 
        onClick={handleAddDependencyClick}
      >
        Přidat závislost
      </button>

      {items.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                className="dependencyWrapper"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        className="dependency"
                        onTouchEnd={() => handleDoubleTap(item.id)}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export default DependencyMobile;
