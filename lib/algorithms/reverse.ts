import { Node, VisualizationStep } from '../../types';

export function* reverseLinkedListGenerator(
  initialNodes: Node<string>[],
): Generator<VisualizationStep> {
  
  const originalNodes = JSON.parse(JSON.stringify(initialNodes));
  let reversedNodes = JSON.parse(JSON.stringify(initialNodes));

  if (originalNodes.length <= 1) {
    yield {
      nodes: originalNodes,
      pointers: {},
      message: 'List has 0 or 1 node. Nothing to reverse.',
    };
    return;
  }

  let prevIndex: number | null = null;
  let currentIndex: number | null = 0;

  // Initial state
  yield {
    nodes: originalNodes,
    pointers: { prev: prevIndex, current: currentIndex },
    message: 'Start reversal. `prev` is null, `current` is at HEAD (index 0).',
  };

  while (currentIndex !== null) {
    const nextIndex: number | null = currentIndex + 1 < originalNodes.length ? currentIndex + 1 : null;

    // Step 1: Store next
    yield {
      nodes: originalNodes,
      pointers: { prev: prevIndex, current: currentIndex, next: nextIndex },
      message: `Store the next node (at index ${nextIndex ?? 'null'}) before we change the link.`,
    };

    // Step 2: Reverse the link
    // The visual state change will happen in the next step when pointers move.
    yield {
      nodes: originalNodes,
      pointers: { prev: prevIndex, current: currentIndex, next: nextIndex },
      message: `Reverse the pointer. Node ${originalNodes[currentIndex].value}'s 'next' now points to where 'prev' is (index ${prevIndex ?? 'null'}).`,
    };

    // Step 3: Move prev
    prevIndex = currentIndex;
    yield {
      nodes: originalNodes,
      pointers: { prev: prevIndex, current: currentIndex, next: nextIndex },
      message: `Move 'prev' up to 'current'. Both now point to index ${currentIndex}.`,
    };

    // Step 4: Move current
    currentIndex = nextIndex;
    yield {
      nodes: originalNodes,
      pointers: { prev: prevIndex, current: currentIndex, next: nextIndex },
      message: `Move 'current' up to 'next'. 'current' now points to index ${currentIndex ?? 'null'}.`,
    };
  }
  
  // Final state
  yield {
    nodes: originalNodes,
    pointers: { prev: prevIndex, current: null },
    message: `'current' is now null. The loop terminates. 'prev' points to the new HEAD.`,
  };

  // Show final reversed list
  reversedNodes.reverse();
  yield {
      nodes: reversedNodes,
      pointers: {},
      message: 'Reversal complete! The list order is now updated.',
  }
}
