import React from 'react';
import { useNavigate } from 'react-router-dom';
import './problems.scss';
import { useDependencyContext } from '../../../contexts/DependencyContext';
import { useAttributeContext } from '../../../contexts/AttributeContext';

export default function Problems() {
  const { attributes } = useAttributeContext();
  const { dependencies } = useDependencyContext();
  const navigate = useNavigate();

  const directTo = (path) => {
    navigate(path);
  };

  const saveProblem = () => {
     // Vytvoříme textový obsah s atributy a závislostmi
    const attributesText = attributes.join(', ');
    const dependenciesText = JSON.stringify(dependencies, null, 2);
    const content = `Attributes: [${attributesText}]\nDependencies: ${dependenciesText}`;

     // Vytvoříme funkci pro vytvoření a stažení souboru
     const downloadFile = (content, fileName) => {
       const blob = new Blob([content], { type: 'text/plain' });
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = fileName;
       a.style.display = 'none';
       document.body.appendChild(a);
       a.click();
       window.URL.revokeObjectURL(url);
       document.body.removeChild(a);
     };
 
     downloadFile(content, 'problem.txt');
  };

  const saveProblemAsAdmin = () => {
    console.log("save problem as admin");
  }

  return (
    <div className="problemContainer">
      <h1>Náš problém</h1>
      <h2>Schéma</h2>
      {attributes.length > 0 ? (
        <p className="IS">IS ( {attributes.join(', ')} )</p>
      ) : (
        <p>Zde uvidíte schéma</p>
      )}

      <h2>Závislosti:</h2>
      <p className='dependencies'>
        F = &#123;{' '}
        {dependencies.map((dep, index) => (
          <span key={index}>
            {`${dep.left.join(', ')} → ${dep.right.join(', ')}${
              index < dependencies.length - 1 ? '; ' : ''
            }`}
          </span>
        ))}
        &#125;
      </p>

      <button onClick={() => saveProblem()} className='saveButton'>Uložit tento příklad</button>
      <button onClick={() => saveProblemAsAdmin()} className='saveButton'>Uložit jako Admin</button>

      <div className="problemButtonsContainer">
        <button onClick={() => directTo('redundantAttribute')}>Redundantní atributy</button>
        <button onClick={() => directTo('redundantDependency')}>Redundantní závislost</button>
        <button onClick={() => directTo('minimalCover')}>Minimální pokrytí</button>
        <button onClick={() => directTo('firstKey')}>První klíč</button>
        <button onClick={() => directTo('allKeys')}>Všechny klíče</button>
        <button onClick={() => directTo('derivablity')}>Odvoditelnost</button>
        <button onClick={() => directTo('decomposition')}>Dekompozice</button>
        <button onClick={() => directTo('synthesis')}>Syntéza</button>
      </div>
    </div>
  );
}
