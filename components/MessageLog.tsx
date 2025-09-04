import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OperationStatus } from '../types';

interface MessageLogProps {
    message: string;
    status: OperationStatus;
}

const MessageLog: React.FC<MessageLogProps> = ({ message, status }) => {
    const statusClasses = {
        success: 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
        error: 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    };
    
    const statusClass = status ? statusClasses[status] : 'border-gray-700';

    return (
        <div className={`mt-4 bg-gray-800/50 rounded-lg p-4 shadow-inner h-24 flex items-center justify-center transition-all duration-300 ${statusClass}`}>
            <AnimatePresence mode="wait">
                <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center text-gray-300"
                >
                    <span className="font-semibold text-cyan-400 mr-2">&gt;</span>{message}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

export default MessageLog;
