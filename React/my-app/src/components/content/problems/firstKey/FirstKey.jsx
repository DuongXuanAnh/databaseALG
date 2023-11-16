import React from 'react';
import { Algorithm } from '../../../../algorithm/Algorithm';
import { useAttributeContext } from '../../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './firstKey.scss';

function FirstKey() {

  const algoInstance = new Algorithm();

  const { attributes } = useAttributeContext();
  const { dependencies } = useDependencyContext();

  const schema = attributes;
  const leftAttributeInput = dependencies.map(dep => dep.left);
  const rightAttributeInput = dependencies.map(dep => dep.right);

  const candidateKey = algoInstance.findFirstKey(leftAttributeInput, rightAttributeInput, schema);

  return (
    <div>
        <h3>První klíč: {candidateKey.candidateKey.join(', ')}</h3>
        {candidateKey.outputText.map((line, index) => <p key={index}>{line}</p>)}
    </div>
  )
}

export default FirstKey