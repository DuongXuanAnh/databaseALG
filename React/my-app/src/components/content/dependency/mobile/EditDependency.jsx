import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttributeContext } from '../../../../contexts/AttributeContext';
import { useDependencyContext } from '../../../../contexts/DependencyContext';
import './editDependency.scss';

export default function EditDependency() {
    const { attributes } = useAttributeContext();
    const { id: stringId } = useParams();
    const id = parseInt(stringId, 10);
    const { dependencies, setDependencies } = useDependencyContext();
    const navigate = useNavigate();

    const [leftAttributes, setLeftAttributes] = useState([]);
    const [rightAttributes, setRightAttributes] = useState([]);

    useEffect(() => {
        if (dependencies[id]) {
            setLeftAttributes(dependencies[id].left);
            setRightAttributes(dependencies[id].right);
        }
    }, [id, dependencies]);

    const handleSave = useCallback(() => {
        setDependencies(prev => {
            const updatedDependencies = [...prev];
            updatedDependencies[id] = {
                left: leftAttributes,
                right: rightAttributes
            };
            return updatedDependencies;
        });
        navigate('/dependencies');
    }, [id, leftAttributes, rightAttributes, navigate, setDependencies]);

    const handleAddAttribute = useCallback((side, value) => {
        if (value === "default") return;
        const setter = side === 'left' ? setLeftAttributes : setRightAttributes;
        setter(prev => [...prev, value]);
    }, []);

    const handleRemoveAttribute = useCallback((side, indexToRemove) => {
        const setter = side === 'left' ? setLeftAttributes : setRightAttributes;
        setter(prevAttributes => prevAttributes.filter((_, index) => index !== indexToRemove));
    }, []);

    const handleDelete = useCallback(() => {
        setDependencies(prev => prev.filter((_, index) => index !== id));
        navigate('/dependencies');
    }, [id, navigate, setDependencies]);

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
        <div className='editDependencyContainer'>
            <h1>Upravit závislost</h1>
            <h2>Levá strana</h2>
            <div className='leftAttributes'>
                {renderComboBoxes('left')}
            </div>
            <h2>Pravá strana</h2>
            <div className='rightAttributes'>
                {renderComboBoxes('right')}
            </div>
            <button onClick={handleSave} className='saveChangeBtn'>Uložit změny</button>
            <button onClick={handleDelete} className='deleteBtn'>Smazat</button>
        </div>
    );
}
