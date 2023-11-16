import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttributeContext } from '../../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './addDependency.scss';

export default function AddDependency() {
    const { attributes } = useAttributeContext();
    const { dependencies, setDependencies } = useDependencyContext();
    const navigate = useNavigate();

    const [leftAttributes, setLeftAttributes] = useState([]);
    const [rightAttributes, setRightAttributes] = useState([]);

    const handleAddDependency = useCallback(() => {
        setDependencies(prev => [...prev, { left: leftAttributes, right: rightAttributes }]);
        setLeftAttributes([]);
        setRightAttributes([]);

        navigate('/dependencies');

    }, [leftAttributes, rightAttributes, setDependencies]);

    const handleAddAttribute = useCallback((side, value) => {
        if (value === "default") return;
        const setter = side === 'left' ? setLeftAttributes : setRightAttributes;
        setter(prev => [...prev, value]);
    }, []);

    const handleRemoveAttribute = useCallback((side, indexToRemove) => {
        const setter = side === 'left' ? setLeftAttributes : setRightAttributes;
        setter(prevAttributes => prevAttributes.filter((_, index) => index !== indexToRemove));
    }, []);

    const renderComboBoxes = useCallback((side) => {
        const attributesList = side === 'left' ? leftAttributes : rightAttributes;
        return (
            <>
                {attributesList.map((selectedAttribute, index) => (
                    <div key={index} className="comboBoxWrapper">
                        <span className="attributeTag">
                            {selectedAttribute}
                            <button onClick={() => handleRemoveAttribute(side, index)} className='removeBtn'>x</button>
                        </span>
                    </div>
                ))}
                <select 
                    value="default" 
                    onChange={(e) => handleAddAttribute(side, e.target.value)}
                    className='addAttrComboBox'
                >
                    <option value="default" disabled>+</option>
                    {attributes.filter(attr => !attributesList.includes(attr)).map(attr => (
                        <option key={attr} value={attr}>{attr}</option>
                    ))}
                </select>
            </>
        );
    }, [leftAttributes, rightAttributes, attributes, handleAddAttribute, handleRemoveAttribute]);

    return (
        <div className='addDependencyContainer'>
            <h1>Přidat závislost</h1>
            <h2>Levá strana</h2>
            <div className='leftAttributes'>
                {renderComboBoxes('left')}
            </div>
            <h2>Pravá strana</h2>
            <div className='rightAttributes'>
                {renderComboBoxes('right')}
            </div>
            <button onClick={handleAddDependency} className='addBtn'>Přidat závislost</button>
        </div>
    );
}
