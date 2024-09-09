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

executeCode("main.py", `def find_min_max(arr):
    if len(arr) == 0:
        return {'min': None, 'max': None}

    min_value = arr[0]
    max_value = arr[0]

    for num in arr[1:]:
        if num < min_value:
            min_value = num
        if num > max_value:
            max_value = num

    return {'min': min_value, 'max': max_value}

# Example usage
numbers = [3, 5, 1, 8, -2, 7]
result = find_min_max(numbers)
print('Min:', result['min'], 'Max:', result['max'])`);
