import axios from 'axios';

export const executeCode = async (filename: string, content: string) => {
  const code = {
    filename: filename,
    content: content
  }
  try {
    console.log(code);
    const response = await axios.post('http://127.0.0.1:5000/execute', { code });
    console.log('Execution result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
};

executeCode("main.py", "print(699999*9)");