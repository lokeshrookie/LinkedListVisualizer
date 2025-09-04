
import React, { useState, useEffect } from 'react';
import { Algorithm } from '../types';

interface AlgorithmControlsProps {
    onNext: () => void;
    onPrev: () => void;
    onExit: () => void;
    onGoToStep: (step: number) => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    stepNumber: number;
    totalSteps: number;
    algorithmName: Algorithm | null;
}

// FIX: Update ControlButton props to allow `type` and make `onClick` optional to support form submission.
const ControlButton: React.FC<{
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}> = ({ onClick, children, className = 'bg-cyan-600 hover:bg-cyan-500', disabled = false, type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${className}`}
    >
        {children}
    </button>
);

const ProgressDots: React.FC<{
    total: number;
    current: number;
    onDotClick: (step: number) => void;
}> = ({ total, current, onDotClick }) => {
    // Limit dots to a reasonable number to prevent overflow
    const maxDots = 20;
    if (total <= 1) return null;
    
    if (total > maxDots) {
        return <div className="text-xs text-gray-400">Showing {current} of {total} steps</div>;
    }

    return (
        <div className="flex justify-center items-center flex-wrap gap-2 py-2">
            {Array.from({ length: total }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onDotClick(i + 1)}
                    className={`w-4 h-4 rounded-full transition-colors ${
                        i + 1 === current
                            ? 'bg-cyan-400 scale-125'
                            : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                />
            ))}
        </div>
    );
};


const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({ 
    onNext, 
    onPrev, 
    onExit, 
    onGoToStep,
    isFirstStep, 
    isLastStep, 
    stepNumber, 
    totalSteps,
    algorithmName
}) => {
    const [goToValue, setGoToValue] = useState(stepNumber.toString());

    useEffect(() => {
        setGoToValue(stepNumber.toString());
    }, [stepNumber]);

    const handleGoToSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const step = parseInt(goToValue, 10);
        if (!isNaN(step)) {
            onGoToStep(step);
        }
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 text-center">
                Algorithm: {algorithmName}
            </h2>
            
            <div className='flex-grow flex flex-col justify-center space-y-4'>
                <div className="text-center text-gray-300">
                    Step <span className="text-cyan-400 font-bold">{stepNumber}</span> of <span className="font-bold">{totalSteps}</span>
                </div>

                <ProgressDots total={totalSteps} current={stepNumber} onDotClick={onGoToStep} />

                <div className="flex justify-between gap-2">
                    <ControlButton onClick={onPrev} disabled={isFirstStep} className="bg-gray-600 hover:bg-gray-500 w-1/2">
                        Prev
                    </ControlButton>
                    <ControlButton onClick={onNext} disabled={isLastStep} className="bg-cyan-600 hover:bg-cyan-500 w-1/2">
                        Next
                    </ControlButton>
                </div>
                
                <form onSubmit={handleGoToSubmit} className="flex gap-2">
                    <input
                        type="number"
                        value={goToValue}
                        onChange={(e) => setGoToValue(e.target.value)}
                        min="1"
                        max={totalSteps}
                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition w-full text-center"
                    />
                    <ControlButton type="submit" className="bg-indigo-600 hover:bg-indigo-500">Go</ControlButton>
                </form>

                {isLastStep && (
                     <ControlButton onClick={onExit} className="bg-green-600 hover:bg-green-500 w-full">
                        Finish & Save Changes
                    </ControlButton>
                )}
            </div>

            <div className="pt-4 border-t border-gray-700">
                <ControlButton onClick={onExit} className="bg-red-600 hover:bg-red-500 w-full">
                    Exit Algorithm
                </ControlButton>
            </div>
        </div>
    );
};

export default AlgorithmControls;