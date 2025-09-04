export interface Node<T> {
  id: string;
  value: T;
}

export type OperationStatus = 'success' | 'error' | null;

export type Algorithm = 'Reverse List' | 'Find Middle Node' | 'Remove Nth From End';

// For Algorithm Visualization
export type PointerMap = { [key: string]: number | null }; // e.g. { prev: null, current: 0, next: 1 }

export interface VisualizationStep {
  nodes: Node<string>[];
  pointers: PointerMap;
  message: string;
  highlightedIndex?: number | null;
  deletedIndex?: number | null;
}