import React, { useState } from 'react';
import { executeCode } from '../utils/CodeBlock_utils/Call_execute';

interface CodeBlock {
  name: string;
  content: string;
}

interface RunToolProps {
  codeBlocks: CodeBlock[];
}

const RunTool: React.FC<RunToolProps> = ({ codeBlocks }) => {
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRun = async () => {
    if (selectedBlock) {
      setIsRunning(true);
      console.log(selectedBlock);
      const content = codeBlocks.find(block => block.name === selectedBlock)?.content;
      const filename = selectedBlock
      if (content) {
        try {
          console.log(content);
          await executeCode(filename, content);
        } catch (error) {
          console.error('Error running code:', error);
        }
      }
      setIsRunning(false);
    }
  };

  return (
    <span>
      <select 
        value={selectedBlock} 
        onChange={(e) => setSelectedBlock(e.target.value)}
        disabled={isRunning}
      >
        <option value="">Select a code block</option>
        {codeBlocks.map((block) => (
          <option key={block.name} value={block.name}>
            {block.name}
          </option>
        ))}
      </select>
      {isRunning ? (
        <button style={{ backgroundColor: 'red' }} disabled>
          Running
        </button>
      ) : (
        <button 
          style={{ backgroundColor: 'green' }} 
          onClick={handleRun}
          disabled={!selectedBlock}
        >
          Run
        </button>
      )}
    </span>
  );
};

export default RunTool;
