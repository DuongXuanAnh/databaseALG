import React, { useState, useCallback, useEffect } from 'react';
import { ListManager } from "react-beautiful-dnd-grid";
import './attributeMobile.scss';
import './attribute.scss';
import { useNavigate } from 'react-router-dom';
import { useAttributeContext } from '../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../contexts/DependencyContext';

export default function Attribute() {

  const navigate = useNavigate();
  
  const [maxItems, setMaxItems] = useState(window.innerWidth <= 991 ? 2 : 5);

  const updateMaxItems = () => {
    setMaxItems(window.innerWidth <= 991 ? 2 : 5);
  };

  const { attributes, setAttributes } = useAttributeContext();

  const { setDependencies } = useDependencyContext();
  
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    updateMaxItems(); // Aktualizujeme maxItems při prvním renderování

    window.addEventListener('resize', updateMaxItems);

    return () => {
      window.removeEventListener('resize', updateMaxItems);
    };
  }, []); 

  const handleAddAttribute = useCallback(() => {
    if (attributes.includes(inputValue)) {
      alert('Tento atribut již byl přidán.');
      return;
    }

    if (inputValue && attributes.length < 15) {
      setAttributes(prevAttributes => [...prevAttributes, inputValue]);
      setInputValue('');
    } else if (attributes.length >= 15) {
      alert('Můžete přidat maximálně 15 atributů.');
    }
  }, [attributes, inputValue]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      handleAddAttribute();
    }
  }, [handleAddAttribute]);

  const handleRemoveAttribute = useCallback((attributeId) => {
    setAttributes(prevAttributes => prevAttributes.filter(attr => attr !== attributeId));
}, []);

  const handleInputChange = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const reorderList = (sourceIndex, destinationIndex) => {
    if (destinationIndex === sourceIndex) return;

    const list = [...attributes];
    const [movedItem] = list.splice(sourceIndex, 1);
    list.splice(destinationIndex, 0, movedItem);

    setAttributes(list);
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const fileContent = e.target.result;
  
        // Zde provádíme zpracování obsahu souboru a získáme atributy a závislosti
        const attributesRegex = /Attributes:\s*\[([^\]]+)\]/;
        const dependenciesRegex = /Dependencies:\s*(\[\s*{[\s\S]*?}\s*\])/;

  
        const attributesMatches = attributesRegex.exec(fileContent);
        const dependenciesMatches = dependenciesRegex.exec(fileContent);
  
        if (attributesMatches && attributesMatches.length >= 2) {
          const fileAttributes = attributesMatches[1].split(',').map((attr) => attr.trim());
  
          // Aktualizujeme stav atributů ve vaší aplikaci
          setAttributes(fileAttributes);
        }
  
        if (dependenciesMatches && dependenciesMatches.length >= 2) {
          const fileDependencies = JSON.parse(dependenciesMatches[1]);

          console.log(fileDependencies);
  
          // Aktualizujeme stav závislostí ve vaší aplikaci pomocí funkce z DependencyContext
          setDependencies(fileDependencies);

        }
      };
  
      reader.readAsText(file);
    }
  }, [setAttributes, setDependencies]);

  const uploadFile = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  }

  

  return (
    <React.Fragment>
      <div className='attributeContainer'>

      <h1 className='title'>Návrh relačních schémat</h1>

          <button type="button" className="btn-loadExample">Načíst příklad</button>

          <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

          <button type="button" className="btn-uploadFile" onClick={() => uploadFile()}>Nahrát soubor</button>

          <p className='label'>Přidat atributy do schématu</p>

          <input 
            type="text" 
            placeholder='nový atribut...'
            className='newAttrTextBox'
            value={inputValue} 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={15}
          />
          <button type="button" className="btn-addNewAttribute" onClick={handleAddAttribute}>+</button>

          <div className="area-attributes">
          {attributes.length === 0 ? (
            <p>Vaše schéma bude zde vygenerované po přidání nových atributů nebo po Nahrání souboru</p>
          ) : (
            <ListManager
              key={maxItems}
              items={attributes.map((attr, index) => ({ id: attr, order: index }))}
              direction="horizontal"
              maxItems={maxItems}
              render={(item) => (
                <div className='wholeAttribute'>
                  <div className='attributeName'>{item.id}</div>
                  <button className='removeButton' onClick={() => handleRemoveAttribute(item.id)}>x</button>
                </div>
              )}
              onDragEnd={reorderList}
            />
          )}
        </div>

          <div className='schema'>
            <h2>Schéma</h2>
            {attributes.length > 0 ? (
                <p className="IS">IS ( {attributes.join(', ')} )</p>
              ):(
                <p>Zde uvidíte schéma</p>
              )}
          </div>

          {attributes.length > 0 &&
            <button type="button"
             className="btn-nextPageDependency"
              onClick={ () => navigate('/dependencies') } 
            >
                Zadat závislosti
            </button>
          }
      </div>
      
    </React.Fragment>
  );
}
