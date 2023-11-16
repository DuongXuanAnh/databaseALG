import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAttributeContext } from '../../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './dependencyPC.scss';

function DependencyPC() {
  const { attributes } = useAttributeContext();
  const { dependencies, setDependencies } = useDependencyContext();

  const navigate = useNavigate();

  const handleAddDependency = () => {
    setDependencies([...dependencies, { left: [], right: [] }]);
  };

  const handleAddAttribute = (index, side, value) => {
    if (value === "default") return;
    const newDependencies = [...dependencies];
    newDependencies[index][side].push(value);
    setDependencies(newDependencies);
  };

  const handleSolveProblem = () => {
      navigate('/problems');
  };

  const handleRemoveAttribute = (depIndex, side, attrIndex) => {
    const newDependencies = [...dependencies];
    newDependencies[depIndex][side].splice(attrIndex, 1);
    setDependencies(newDependencies);
  };

  const handleRemoveDependency = (index) => {
    const newDependencies = [...dependencies];
    newDependencies.splice(index, 1);
    setDependencies(newDependencies);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const reorderedDependencies = reorder(
      dependencies,
      result.source.index,
      result.destination.index
    );
    setDependencies(reorderedDependencies);
  };

  return (
    <div>
    <button  className="addDependencyBtn" onClick={handleAddDependency}>Přidat relaci</button>

    <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="dependencyContainer"
        >
      {dependencies.map((dep, depIndex) => (
              <Draggable key={depIndex} draggableId={`dep-${depIndex}`} index={depIndex}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="dependency"
                  >
        <div className="leftAttributes">
          {dep.left.map((attr, attrIndex) => (
              <span key={attrIndex} className="attributeTag">
                {attr}
                <button onClick={() => handleRemoveAttribute(depIndex, "left", attrIndex)} className="removeBtn">x</button>
              </span>
            ))}
          <select value="default" className="addAttrComboBox" onChange={(e) => handleAddAttribute(depIndex, "left", e.target.value)}>
            <option value="default" disabled>Přidat atribut</option>
            {attributes.filter(attr => !dep.left.includes(attr)).map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
          </div>
        <div className="arrow">→</div>
        <div className="rightAttributes">
          {dep.right.map((attr, attrIndex) => (
              <span key={attrIndex} className="attributeTag">
                {attr}
                <button onClick={() => handleRemoveAttribute(depIndex, "right", attrIndex)} className="removeBtn">x</button>
              </span>
            ))}
            <select value="default" className="addAttrComboBox" onChange={(e) => handleAddAttribute(depIndex, "right", e.target.value)}>
            <option value="default" disabled>Přidat atribut</option>
            {attributes.filter(attr => !dep.right.includes(attr)).map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
          </div>
        <button onClick={() => handleRemoveDependency(depIndex)} className="removeDependencyBtn">Odstranit</button>
      </div>
    )}
    </Draggable>
  ))}
  {provided.placeholder}
</div>
)}
</Droppable>
</DragDropContext>
<button className="solveProblemBtn" onClick={handleSolveProblem}>Řešení problémů →</button>
</div>
   
);
}

export default DependencyPC;
