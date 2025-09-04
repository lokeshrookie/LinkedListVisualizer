import { Node, VisualizationStep } from '../../types';

export function* removeNthFromEndGenerator(
  initialNodes: Node<string>[],
  n: number,
): Generator<VisualizationStep> {
  const len = initialNodes.length;

  // Basic validation included in the generator
  if (n <= 0 || n > len) {
    yield {
      nodes: initialNodes,
      pointers: {},
      message: `Error: 'n' must be a number between 1 and the list length (${len}).`,
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

  // Move fast pointer n steps ahead
  yield {
    nodes: initialNodes,
    pointers: { slow, fast },
    message: `Move 'fast' pointer ${n} steps ahead to create a gap.`,
  };
  for (let i = 0; i < n; i++) {
    fast++;
     yield {
      nodes: initialNodes,
      pointers: { slow, fast },
      message: `Moving 'fast'... Step ${i + 1} of ${n}. 'fast' is now at index ${fast}.`,
    };
  }

  // This condition means fast is at the end, so we need to remove the head
  if (fast === len) {
      yield {
          nodes: initialNodes,
          pointers: { slow },
          message: `The node to remove is the head (index 0).`,
          deletedIndex: 0,
      };
      const finalNodes = initialNodes.slice(1);
      yield {
          nodes: finalNodes,
          pointers: {},
          message: `Removed the head node. Operation complete.`,
      };
      return;
  }

  // Move both pointers until fast reaches the end
  yield {
    nodes: initialNodes,
    pointers: { slow, fast },
    message: 'Now, move `slow` and `fast` together until `fast` reaches the end of the list.',
  };
  while (fast + 1 < len) {
    slow++;
    fast++;
    yield {
      nodes: initialNodes,
      pointers: { slow, fast },
      message: `Moving 'slow' and 'fast' one step.`,
    };
  }

  const deletedIndex = slow + 1;
  yield {
    nodes: initialNodes,
    pointers: { slow },
    message: `'fast' has reached the end. 'slow' is now just before the node to be deleted.`,
  };

  yield {
    nodes: initialNodes,
    pointers: { slow },
    message: `The node to remove is at index ${deletedIndex} (value "${initialNodes[deletedIndex].value}").`,
    deletedIndex: deletedIndex,
  };

  const finalNodes = initialNodes.filter((_, i) => i !== deletedIndex);
  yield {
    nodes: finalNodes,
    pointers: {},
    message: `Node at index ${deletedIndex} removed. Operation complete.`,
  };
}
