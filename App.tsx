
import React, { useState, useCallback, useRef, useEffect } from 'react';
// FIX: Import 'motion' from 'framer-motion' to be used for animations.
import { AnimatePresence, motion } from 'framer-motion';
import { LinkedList } from './lib/LinkedList';
import { Node as LinkedListNode, OperationStatus, VisualizationStep, Algorithm } from './types';
import Controls from './components/Controls';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import MessageLog from './components/MessageLog';
import AlgorithmControls from './components/AlgorithmControls';
import { reverseLinkedListGenerator } from './lib/algorithms/reverse';
import { findMiddleGenerator } from './lib/algorithms/findMiddle';
import { removeNthFromEndGenerator } from './lib/algorithms/removeNthFromEnd';

const App: React.FC = () => {
    const list = useRef(new LinkedList<string>());
    const [nodes, setNodes] = useState<LinkedListNode<string>[]>([]);
    const [message, setMessage] = useState<string>('Welcome! Add a node to start.');
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [operation, setOperation] = useState<{ type: string; index?: number } | null>(null);
    const [operationStatus, setOperationStatus] = useState<OperationStatus>(null);

    // State for Algorithm Mode
    const [isAlgorithmMode, setIsAlgorithmMode] = useState(false);
    const [algorithmSteps, setAlgorithmSteps] = useState<VisualizationStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm | null>(null);

    const triggerStatusUpdate = (status: 'success' | 'error') => {
        setOperationStatus(status);
        setTimeout(() => setOperationStatus(null), 500); // Duration of the flash
    };

    const updateState = useCallback((msg: string, op: { type: string; index?: number } | null = null) => {
        setNodes(list.current.toArray());
        setMessage(msg);
        setOperation(op);
        setHighlightedIndex(null);

        if (op) {
            setTimeout(() => setOperation(null), 700);
        }
    }, []);

    const handleOperationError = useCallback((errorMessage: string) => {
        setMessage(errorMessage);
        triggerStatusUpdate('error');
    }, []);

    const handleAppend = useCallback((value: string) => {
        if (!value.trim()) {
            handleOperationError('Error: Value cannot be empty.');
            return;
        }
        list.current.append(value);
        updateState(`Appended "${value}" to the list.`, { type: 'append' });
        triggerStatusUpdate('success');
    }, [updateState, handleOperationError]);

    const handlePrepend = useCallback((value: string) => {
        if (!value.trim()) {
            handleOperationError('Error: Value cannot be empty.');
            return;
        }
        list.current.prepend(value);
        updateState(`Prepended "${value}" to the list.`, { type: 'prepend' });
        triggerStatusUpdate('success');
    }, [updateState, handleOperationError]);

    const handleInsertAt = useCallback((value: string, indexStr: string) => {
        const index = parseInt(indexStr, 10);
        if (!value.trim()) {
            handleOperationError('Error: Value cannot be empty.');
            return;
        }
        if (isNaN(index) || index < 0 || index > list.current.size) {
            handleOperationError(`Error: Index must be between 0 and ${list.current.size}.`);
            return;
        }
        list.current.insertAt(index, value);
        updateState(`Inserted "${value}" at index ${index}.`, { type: 'insert', index });
        triggerStatusUpdate('success');
    }, [updateState, handleOperationError]);

    const handleDelete = useCallback((value: string) => {
        const index = list.current.findIndex(value);
        if (index === -1) {
            handleOperationError(`Value "${value}" not found.`);
            return;
        }
        list.current.delete(value);
        updateState(`Deleted first occurrence of "${value}".`, { type: 'delete', index });
        triggerStatusUpdate('success');
    }, [updateState, handleOperationError]);

    const handleDeleteAt = useCallback((indexStr: string) => {
        const index = parseInt(indexStr, 10);
        if (isNaN(index) || index < 0 || index >= list.current.size) {
            handleOperationError(`Error: Index must be between 0 and ${list.current.size - 1}.`);
            return;
        }
        list.current.deleteAt(index);
        updateState(`Deleted node at index ${index}.`, { type: 'delete', index });
        triggerStatusUpdate('success');
    }, [updateState, handleOperationError]);

    const handleFind = useCallback((value: string) => {
        const index = list.current.findIndex(value);
        if (index !== -1) {
            setMessage(`Found "${value}" at index ${index}.`);
            setHighlightedIndex(index);
            triggerStatusUpdate('success');
            setTimeout(() => setHighlightedIndex(null), 2000);
        } else {
            handleOperationError(`Value "${value}" not found in the list.`);
            setHighlightedIndex(null);
        }
    }, [handleOperationError]);

    const handleReset = useCallback(() => {
        list.current = new LinkedList<string>();
        updateState('LinkedList has been reset.');
        triggerStatusUpdate('success');
    }, [updateState]);
    
    // --- Algorithm Mode Handlers ---
    const handleStartAlgorithm = (algo: Algorithm, ...args: any[]) => {
        const initialNodes = list.current.toArray();
        if (initialNodes.length === 0) {
            handleOperationError("Cannot run algorithm on an empty list.");
            return;
        }

        // FIX: Explicitly type `generator` to ensure TypeScript correctly infers the type of `steps`, resolving the assignment error for `setAlgorithmSteps`.
        let generator: Generator<VisualizationStep>;
        switch (algo) {
            case 'Reverse List':
                generator = reverseLinkedListGenerator(initialNodes);
                break;
            case 'Find Middle Node':
                generator = findMiddleGenerator(initialNodes);
                break;
            case 'Remove Nth From End':
                const n = args[0];
                if (n === undefined || isNaN(n) || n <= 0) {
                    handleOperationError("Please provide a valid positive number for 'n'.");
                    return;
                }
                generator = removeNthFromEndGenerator(initialNodes, n);
                break;
            default:
                console.error("Unknown algorithm:", algo);
                return;
        }

        const steps = Array.from(generator);
        if (steps.length > 0) {
            setAlgorithmSteps(steps);
            setCurrentAlgorithm(algo);
            setCurrentStep(0);
            setIsAlgorithmMode(true);
        }
    };


    const handleNextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, algorithmSteps.length - 1));
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleGoToStep = (step: number) => {
        const newStepIndex = step - 1; // User sees 1-based, state is 0-based
        if (newStepIndex >= 0 && newStepIndex < algorithmSteps.length) {
            setCurrentStep(newStepIndex);
        }
    };

    const handleExitAlgorithmMode = () => {
        // Only update the list for algorithms that are meant to mutate it
        const mutatingAlgos: Algorithm[] = ['Reverse List', 'Remove Nth From End'];
        if (algorithmSteps.length > 0 && currentAlgorithm && mutatingAlgos.includes(currentAlgorithm)) {
            const finalStep = algorithmSteps[algorithmSteps.length - 1];
            if (finalStep.nodes) {
                list.current = new LinkedList<string>();
                finalStep.nodes.forEach(node => list.current.append(node.value));
                
                let finalMessage = "Algorithm finished.";
                if (currentAlgorithm === 'Reverse List') finalMessage = "List is now reversed.";
                if (currentAlgorithm === 'Remove Nth From End') finalMessage = "Node removed from list.";
                updateState(finalMessage);
            }
        } else {
            updateState("Exited algorithm mode.");
        }
    
        setIsAlgorithmMode(false);
        setAlgorithmSteps([]);
        setCurrentStep(0);
        setCurrentAlgorithm(null);
    };


    useEffect(() => {
        // Initial setup with some data
        handleAppend('10');
        setTimeout(() => handleAppend('20'), 500);
        setTimeout(() => handleAppend('30'), 1000);
        setTimeout(() => handleAppend('40'), 1500);
        setTimeout(() => handleAppend('50'), 2000);
        setTimeout(() => setMessage('Welcome! Try interacting with the list.'), 2500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentStepData = isAlgorithmMode ? algorithmSteps[currentStep] : null;
    const currentNodes = currentStepData?.nodes ?? nodes;
    const currentMessage = currentStepData?.message ?? message;
    const currentPointers = currentStepData?.pointers ?? {};
    const algoHighlightedIndex = currentStepData?.highlightedIndex;
    const algoDeletedIndex = currentStepData?.deletedIndex;


    return (
        <div className="min-h-screen bg-gray-900 flex flex-col p-4 sm:p-6 lg:p-8 font-mono">
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider">
                    LinkedList Visualizer
                </h1>
                <p className="text-gray-400 mt-2">
                    An interactive tool to understand LinkedList operations.
                </p>
            </header>

            <main className="flex-grow flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 xl:w-1/4 bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700 h-full">
                    <AnimatePresence mode="wait">
                        {isAlgorithmMode ? (
                            <motion.div key="algo-controls" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                               <AlgorithmControls
                                    onNext={handleNextStep}
                                    onPrev={handlePrevStep}
                                    onExit={handleExitAlgorithmMode}
                                    onGoToStep={handleGoToStep}
                                    isFirstStep={currentStep === 0}
                                    isLastStep={currentStep === algorithmSteps.length - 1}
                                    stepNumber={currentStep + 1}
                                    totalSteps={algorithmSteps.length}
                                    algorithmName={currentAlgorithm}
                                />
                            </motion.div>
                        ) : (
                            <motion.div key="main-controls" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                <Controls
                                    onAppend={handleAppend}
                                    onPrepend={handlePrepend}
                                    onInsertAt={handleInsertAt}
                                    onDelete={handleDelete}
                                    onDeleteAt={handleDeleteAt}
                                    onFind={handleFind}
                                    onReset={handleReset}
                                    onStartAlgorithm={handleStartAlgorithm}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex-grow flex flex-col lg:w-2/3 xl:w-3/4">
                    <div className="flex-grow bg-gray-800/50 rounded-lg p-4 sm:p-6 flex items-center justify-center border border-gray-700 min-h-[300px] lg:min-h-0">
                         <AnimatePresence>
                             {(currentNodes && currentNodes.length > 0) ? (
                                <LinkedListVisualizer 
                                    nodes={currentNodes}
                                    highlightedIndex={highlightedIndex}
                                    operation={operation}
                                    pointers={currentPointers}
                                    algoHighlightedIndex={algoHighlightedIndex}
                                    algoDeletedIndex={algoDeletedIndex}
                                />
                             ) : (
                                <div className="text-gray-500 text-2xl">List is empty</div>
                             )}
                        </AnimatePresence>
                    </div>
                     <MessageLog message={currentMessage} status={operationStatus} />
                </div>
            </main>
        </div>
    );
};

export default App;
