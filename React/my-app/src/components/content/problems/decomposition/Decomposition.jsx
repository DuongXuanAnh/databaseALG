import React from 'react';
import { Algorithm } from '../../../../algorithm/Algorithm';
import { useAttributeContext } from '../../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './decomposition.scss';

function Decomposition() {

  const algoInstance = new Algorithm();

  const { attributes } = useAttributeContext();
  const { dependencies } = useDependencyContext();

  

  const powerSet = algoInstance.powerSet(attributes);
  console.log(algoInstance.printFPlus(dependencies, powerSet));


  return (
    <div>
      <div>Decomposition</div>
      <div>
        {/* {
          powerSet.map((set, index) => (
            <div key={index}>{'{' + set.join(', ') + '}'}</div>
          ))
        } */}
      </div>

      <div>
        {/* {
          Fplus.map((set, index) => (
            <div key={index}>
              {'{' + set[0].join(', ') + '} -> {' + set[1].join(', ') + '}'}
            </div>
          ))
        } */}
      </div>
    </div>
    
  )
}

export default Decomposition