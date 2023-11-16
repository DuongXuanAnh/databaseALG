import React from 'react';
import { Algorithm } from '../../../../algorithm/Algorithm';
import { useAttributeContext } from '../../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './allKeys.scss';

function AllKeys() {
  const algoInstance = new Algorithm();

  const { attributes } = useAttributeContext();
  const { dependencies } = useDependencyContext();

  const schema = attributes;


  const leftAttributeInput = dependencies.map(dep => dep.left);
  const rightAttributeInput = dependencies.map(dep => dep.right);

  const candidateKey = algoInstance.findFirstKey(leftAttributeInput, rightAttributeInput, schema);

  const minimalCover = algoInstance.minimalCover(leftAttributeInput, rightAttributeInput);

  // console.log(minimalCover);

  const allKeys = algoInstance.getAllKeys(minimalCover, schema);

  return;

  return (
    <div>
        <h3>První klíč: {candidateKey.candidateKey.join(', ')}</h3>

        {allKeys.map((key, index) => (
            <li key={index}>{key.join(', ')}</li>
        ))}

        <h3>Detail</h3>

        <div className='minimalCover'>
        <div>Krok 1: Najdeme minimální pokrytí:</div>
        {
          minimalCover.map((fd, index) => (
            <div key={index}>
              {fd[0].join(",")} -&gt; {fd[1]}
            </div>
          ))
        }
    </div>
    </div>
  )
}

export default AllKeys