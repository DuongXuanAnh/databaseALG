import React, { useState } from 'react';
import { Algorithm } from '../../../../algorithm/Algorithm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './minimalCover.scss';


function MinimalCover() {

  const algoInstance = new Algorithm();

  const { dependencies, setDependencies } = useDependencyContext();

  const leftAttributes = dependencies.map(dep => dep.left);
  const rightAttributes = dependencies.map(dep => dep.right);
  
  const initialRewrittenFDs = algoInstance.rewriteFDSingleRHS(leftAttributes, rightAttributes);


  const [rewrittenFDs, setRewrittenFDs] = useState(initialRewrittenFDs);

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

    const reorderedFDs = reorder(
      rewrittenFDs,
      result.source.index,
      result.destination.index
    );
    
    setRewrittenFDs(reorderedFDs);

  }
  // Remove trivial FDs (those where the RHS is also in the LHS)
  const nonTrivial_FDs = algoInstance.removeTrivialFDs(rewrittenFDs);

  // Minimize LHS of each FD.
  const minimizeLHS_FDs = algoInstance.minimizeLHS(nonTrivial_FDs);


  const removeRedundant_FDs = algoInstance.removeRedundantFDs(minimizeLHS_FDs);

  // Function to check if an FD is non-trivial
  const isNonTrivial = (fd) => {
    return nonTrivial_FDs.some(nonTrivialFD => 
      nonTrivialFD[0].join(',') === fd[0].join(',') &&
      nonTrivialFD[1].join(',') === fd[1].join(',')
    );
  };

  const containRedundantAttributes = (fd) => {
    return !nonTrivial_FDs.some(nonTrivialFD => 
      nonTrivialFD[0].join(',') === fd[0].join(',') &&
      nonTrivialFD[1].join(',') === fd[1].join(',')
    );
  };
  
  // Function to check if an FD is redundant
  const isRedundant = (fd) => {
    return !removeRedundant_FDs.some(redundantFD => 
      redundantFD[0].join(',') === fd[0].join(',') && 
      redundantFD[1].join(',') === fd[1].join(',')
    );
  };

  return (

    <>
    <div className='MinimalCoverFinalResult'>
      <h3>Minimální pokrytí</h3>
      
      {
        removeRedundant_FDs.map((fd, index) => (
          <div key={index} className='functionalDependency'>
            {fd[0].join(",")} → {fd[1]}
          </div>
        ))
      }
    </div>

    <div className='DependenciesOneRigthAttrContainer'>
      <h3>Krok 1: Přepište FD na ty, které mají pouze jeden atribut na RHS. Získáváme:</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {
                rewrittenFDs.map((fd, index) => (
                  <Draggable key={index} draggableId={String(index)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='functionalDependency'
                      >
                        {fd[0].join(",")} → {fd[1]}
                      </div>
                    )}
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
      

      <div className='removedTrivialFDsContainer'>
        <h3>Krok 2: Odstraníme triviální FD (ta, kde je v RHS také v LHS). Získáváme:</h3>
        {
          rewrittenFDs.map((fd, index) => (
                <div
                  key={index} 
                  className={`functionalDependency ${!isNonTrivial(fd) ? 'line-through' : ''}`}
                >
                  {fd[0].join(",")} → {fd[1]}
                </div>
          ))
        }
      </div>

    <div className='minimizeLHS'>
        <h3>Krok 3: Odstraníme redudantní atributy na levé straně. Získáváme:</h3>
        {
          minimizeLHS_FDs.map((fd, index) => (
            <div 
              key={index} 
              className={`functionalDependency ${containRedundantAttributes(fd) ? 'hight-light-red' : ''}`}
            >
              {fd[0].join(",")} → {fd[1]}
            </div>
          ))
        }
    </div>

    <div className='removeRedundantFDs'>
        <h3>Krok 4: Odstraníme redudantní závislosti.(ty, které jsou implikovány ostatními) Získáváme:</h3>
        {
          minimizeLHS_FDs.map((fd, index) => (
            <div 
              key={index} 
              className={`functionalDependency ${isRedundant(fd) ? 'line-through' : ''}`}
            >
              {fd[0].join(",")} → {fd[1]}
            </div>
          ))
        }

    </div>

    </>
  )
}

export default MinimalCover;
