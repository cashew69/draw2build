import { useConnections } from '../Contexts/ConnectionContext';
import { useMemo, useCallback } from 'react';

export function useGraph() {
  const { connections, setConnections } = useConnections();

  const nodes = useMemo<string[]>(() => [], []);

  const addNode = useCallback((node: string): void => {
    if (!nodes.includes(node)) {
      nodes.push(node);
      setConnections(prev => {
        const newConnections = [...prev, new Array(nodes.length).fill(false)];
        return newConnections.map(row => [...row, false]);
      });
    }
  }, [nodes, setConnections]);

  const addConnection = useCallback((from: string, to: string): void => {
    const fromIndex = nodes.indexOf(from);
    const toIndex = nodes.indexOf(to);
    if (fromIndex !== -1 && toIndex !== -1) {
      setConnections(prev => {
        const newConnections = [...prev];
        newConnections[fromIndex][toIndex] = true;
        return newConnections;
      });
    }
  }, [nodes, setConnections]);

  const getConnections = useCallback((node: string): string[] => {
    const nodeIndex = nodes.indexOf(node);
    if (nodeIndex === -1) return [];

    return connections[nodeIndex].reduce((connectedNodes, value, index) => {
      if (value) {
        connectedNodes.push(nodes[index]);
      }
      return connectedNodes;
    }, [] as string[]);
  }, [nodes, connections]);

  const toString = useCallback((): string => {
    return nodes.map((node, i) => 
      `${node}: [${connections[i].map(v => v ? '1' : '0').join(', ')}]`
    ).join('\n');
  }, [nodes, connections]);

  return {
    addNode,
    addConnection,
    getConnections,
    toString
  };
}
