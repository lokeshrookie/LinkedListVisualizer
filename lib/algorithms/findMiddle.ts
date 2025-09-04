import { Node, VisualizationStep } from '../../types';

export function* findMiddleGenerator(
  initialNodes: Node<string>[],
): Generator<VisualizationStep> {
  if (initialNodes.length === 0) {
    yield { nodes: [], pointers: {}, message: 'List is empty, no middle node.' };
    return;
  }
  if (initialNodes.length <= 2) {
    yield {
      nodes: initialNodes,
      pointers: { slow: 0 },
      message: `The list has ${initialNodes.length} node(s). The first node is the middle.`,
      highlightedIndex: 0,
    };
    return;
  }

  let slow = 0;
  let fast = 0;

  yield {
    nodes: initialNodes,
    pointers: { slow, fast },
    message: 'Start: Initialize `slow` and `fast` pointers at the head (index 0).',
  };

  while (fast + 1 < initialNodes.length && fast + 2 < initialNodes.length) {
    // Move slow
    slow++;
    yield {
      nodes: initialNodes,
      pointers: { slow, fast },
      message: '`slow` pointer moves one step.',
    };
    
    // Move fast
    fast += 2;
    yield {
      nodes: initialNodes,
      pointers: { slow, fast },
      message: '`fast` pointer moves two steps.',
    };
  }

  // Handle cases where the fast pointer can move one last time
  if (fast + 1 < initialNodes.length) {
      fast++;
       yield {
          nodes: initialNodes,
          pointers: { slow, fast },
          message: '`fast` pointer moves one final step to the end of the list.',
      };
  }


  yield {
    nodes: initialNodes,
    pointers: { slow },
    message: `Finished. 'fast' pointer reached the end. The middle node is at index ${slow}, with value "${initialNodes[slow].value}".`,
    highlightedIndex: slow,
  };
}
