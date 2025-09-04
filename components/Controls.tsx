import React, { useState } from 'react';
import { PlusIcon, TrashIcon, SearchIcon, RefreshIcon, ArrowRightIcon } from './Icons';
import { Algorithm } from '../types';

interface ControlsProps {
    onAppend: (value: string) => void;
    onPrepend: (value: string) => void;
    onInsertAt: (value: string, index: string) => void;
    onDelete: (value: string) => void;
    onDeleteAt: (index: string) => void;
    onFind: (value: string) => void;
    onReset: () => void;
    onStartAlgorithm: (algo: Algorithm, ...args: any[]) => void;
}

const ControlInput: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type?: string;
    className?: string;
}> = ({ value, onChange, placeholder, type = 'text', className = '' }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition w-full ${className}`}
        autoComplete="off"
    />
);

const ControlButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}> = ({ onClick, children, className = 'bg-cyan-600 hover:bg-cyan-500', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${className}`}
    >
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({
    onAppend,
    onPrepend,
    onInsertAt,
    onDelete,
    onDeleteAt,
    onFind,
    onReset,
    onStartAlgorithm
}) => {
    const [appendValue, setAppendValue] = useState('');
    const [prependValue, setPrependValue] = useState('');
    const [insertValue, setInsertValue] = useState('');
    const [insertIndex, setInsertIndex] = useState('');
    const [deleteValue, setDeleteValue] = useState('');
    const [deleteIndex, setDeleteIndex] = useState('');
    const [findValue, setFindValue] = useState('');
    const [removeNthValue, setRemoveNthValue] = useState('1');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 mb-4">Operations</h2>
                {/* Add / Insert */}
                <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex gap-2">
                        <ControlInput value={appendValue} onChange={(e) => setAppendValue(e.target.value)} placeholder="Value"/>
                        <ControlButton onClick={() => { onAppend(appendValue); setAppendValue(''); }}>
                            <PlusIcon /> Append
                        </ControlButton>
                    </div>
                    <div className="flex gap-2">
                        <ControlInput value={prependValue} onChange={(e) => setPrependValue(e.target.value)} placeholder="Value"/>
                        <ControlButton onClick={() => { onPrepend(prependValue); setPrependValue(''); }}>
                            <PlusIcon /> Prepend
                        </ControlButton>
                    </div>
                    <div className="flex gap-2">
                        <ControlInput value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Value" className="w-1/2"/>
                        <ControlInput value={insertIndex} onChange={(e) => setInsertIndex(e.target.value)} placeholder="Index" type="number" className="w-1/2"/>
                        <ControlButton onClick={() => { onInsertAt(insertValue, insertIndex); setInsertValue(''); setInsertIndex(''); }}>
                            <ArrowRightIcon/> Insert
                        </ControlButton>
                    </div>
                </div>

                {/* Delete */}
                <div className="space-y-4 p-4 mt-4 bg-gray-900/50 rounded-lg">
                     <div className="flex gap-2">
                        <ControlInput value={deleteValue} onChange={(e) => setDeleteValue(e.target.value)} placeholder="Value"/>
                        <ControlButton onClick={() => { onDelete(deleteValue); setDeleteValue(''); }} className="bg-red-600 hover:bg-red-500">
                            <TrashIcon /> Delete
                        </ControlButton>
                    </div>
                    <div className="flex gap-2">
                        <ControlInput value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} placeholder="Index" type="number"/>
                        <ControlButton onClick={() => { onDeleteAt(deleteIndex); setDeleteIndex(''); }} className="bg-red-600 hover:bg-red-500">
                            <TrashIcon /> Delete At
                        </ControlButton>
                    </div>
                </div>

                {/* Find & Reset */}
                <div className="space-y-4 p-4 mt-4 bg-gray-900/50 rounded-lg">
                    <div className="flex gap-2">
                        <ControlInput value={findValue} onChange={(e) => setFindValue(e.target.value)} placeholder="Value to find"/>
                        <ControlButton onClick={() => onFind(findValue)} className="bg-indigo-600 hover:bg-indigo-500">
                            <SearchIcon /> Find
                        </ControlButton>
                    </div>
                     <ControlButton onClick={onReset} className="bg-gray-600 hover:bg-gray-500 w-full">
                        <RefreshIcon /> Reset List
                    </ControlButton>
                </div>
            </div>

            <div>
                 <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 mb-4">Algorithms</h2>
                 <div className="p-4 bg-gray-900/50 rounded-lg space-y-3">
                    <ControlButton onClick={() => onStartAlgorithm('Reverse List')} className="bg-purple-600 hover:bg-purple-500 w-full">
                        Reverse List
                    </ControlButton>
                     <ControlButton onClick={() => onStartAlgorithm('Find Middle Node')} className="bg-purple-600 hover:bg-purple-500 w-full">
                        Find Middle Node
                    </ControlButton>
                    <div className="flex gap-2">
                         <ControlInput value={removeNthValue} onChange={(e) => setRemoveNthValue(e.target.value)} placeholder="n" type="number" className="w-1/3 text-center"/>
                         <ControlButton onClick={() => onStartAlgorithm('Remove Nth From End', parseInt(removeNthValue, 10))} className="bg-purple-600 hover:bg-purple-500 w-2/3">
                            Remove Nth From End
                        </ControlButton>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default Controls;