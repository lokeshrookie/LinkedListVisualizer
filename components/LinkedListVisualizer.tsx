import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Node as LinkedListNode, PointerMap } from '../types';

interface LinkedListVisualizerProps {
    nodes: LinkedListNode<string>[];
    highlightedIndex: number | null;
    operation: { type: string; index?: number } | null;
    pointers?: PointerMap;
    algoHighlightedIndex?: number | null;
    algoDeletedIndex?: number | null;
}

const nodeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.1,
            type: 'spring',
            stiffness: 260,
            damping: 20
        },
    }),
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

const arrowVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { delay: i * 0.1 + 0.2, type: "spring", duration: 1, bounce: 0 },
            opacity: { delay: i * 0.1 + 0.2, duration: 0.01 }
        }
    }),
    exit: { opacity: 0, transition: { duration: 0.1 } },
};

const pointerColors: { [key: string]: string } = {
    current: 'border-yellow-400 text-yellow-400',
    prev: 'border-pink-400 text-pink-400',
    next: 'border-green-400 text-green-400',
    slow: 'border-orange-400 text-orange-400',
    fast: 'border-indigo-400 text-indigo-400',
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ nodes, highlightedIndex, operation, pointers = {}, algoHighlightedIndex, algoDeletedIndex }) => {
    return (
        <div className="flex items-center justify-center w-full h-full p-4 overflow-x-auto">
            <div className="flex items-center">
                <AnimatePresence>
                    {nodes.map((node, index) => {
                        const isOpHighlighted = highlightedIndex === index;
                        const isAlgoHighlighted = algoHighlightedIndex === index;
                        const isOpDeleted = operation && operation.index === index && operation.type.includes('delete');
                        const isAlgoDeleted = algoDeletedIndex === index;
                        const isOpInserted = operation && operation.index === index && (operation.type.includes('insert') || operation.type.includes('append') || operation.type.includes('prepend'));
                        
                        return (
                            <motion.div key={node.id} className="flex items-center" layout>
                                <div className="relative">
                                    <motion.div
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={nodeVariants}
                                        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex flex-col items-center justify-center border-2 shadow-lg transition-all duration-300
                                        ${isOpHighlighted || isAlgoHighlighted ? 'bg-yellow-500/80 border-yellow-300 scale-110' : 'bg-cyan-800 border-cyan-500'}
                                        ${pointers.next === index ? 'border-green-400' : ''}
                                        ${pointers.prev === index ? 'border-pink-400' : ''}
                                        ${pointers.current === index ? 'border-yellow-400' : ''}
                                        ${pointers.slow === index ? 'border-orange-400' : ''}
                                        ${pointers.fast === index ? 'border-indigo-400' : ''}
                                        ${isOpDeleted || isAlgoDeleted ? 'bg-red-500/80 border-red-300' : ''}
                                        ${isOpInserted ? 'bg-green-500/80 border-green-300' : ''}
                                        `}
                                    >
                                        <span className="text-xs text-gray-300 absolute top-1">val</span>
                                        <span className="text-xl sm:text-2xl font-bold text-white truncate px-1">{node.value}</span>
                                        <span className="text-xs text-gray-300 absolute bottom-1">next</span>

                                        {index === 0 && (
                                            <div className="absolute -top-6 text-cyan-400 text-sm font-semibold">HEAD</div>
                                        )}
                                    </motion.div>
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max flex flex-col items-center gap-1">
                                        {Object.entries(pointers).map(([key, value]) => 
                                            value === index && (
                                                <motion.div
                                                    key={key}
                                                    layoutId={`pointer-${key}`}
                                                    className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${pointerColors[key] || 'border-gray-400 text-gray-400'}`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    {key}
                                                </motion.div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {index < nodes.length - 1 && (
                                    <motion.svg
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={arrowVariants}
                                        className="w-12 h-12 sm:w-16 mx-2"
                                        viewBox="0 0 100 100"
                                    >
                                        <motion.path
                                            d="M0 50 L90 50"
                                            stroke="#60A5FA"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <motion.path
                                            d="M80 40 L100 50 L80 60"
                                            stroke="#60A5FA"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                    </motion.svg>
                                )}
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
                {nodes.length > 0 && (
                     <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: nodes.length * 0.1 } }}
                        exit={{ opacity: 0 }}
                      >
                         <motion.svg
                            className="w-12 h-12 sm:w-16 mx-2"
                            viewBox="0 0 100 100"
                            >
                            <motion.path
                                d="M0 50 L90 50"
                                stroke="#60A5FA"
                                strokeWidth="4"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1, transition: { delay: nodes.length * 0.1 + 0.2, duration: 0.5 } }}
                                exit={{ pathLength: 0 }}
                            />
                             <motion.path
                                d="M80 40 L100 50 L80 60"
                                stroke="#60A5FA"
                                strokeWidth="4"
                                fill="none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: nodes.length * 0.1 + 0.4, duration: 0.3 } }}
                                exit={{ opacity: 0 }}
                            />
                        </motion.svg>
                        <div className="relative">
                            <motion.div 
                                className="text-2xl font-bold text-gray-500"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: nodes.length * 0.1 + 0.5 } }}
                                exit={{ opacity: 0 }}
                            >
                                NULL
                            </motion.div>
                             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max flex flex-col items-center gap-1">
                                {Object.entries(pointers).map(([key, value]) => 
                                    value === null && (
                                        <motion.div
                                            key={key}
                                            layoutId={`pointer-${key}`}
                                            className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${pointerColors[key] || 'border-gray-400 text-gray-400'}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {key}
                                        </motion.div>
                                    )
                                )}
                            </div>
                        </div>
                     </motion.div>
                )}
            </div>
        </div>
    );
};

export default LinkedListVisualizer;