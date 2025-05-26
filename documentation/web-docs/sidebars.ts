import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/basic-concepts',
        'getting-started/setup-provider',
      ],
    },
    {
      type: 'category',
      label: 'Core Components',
      items: [
        'components/draggable',
        'components/droppable',
        'components/sortable',
        'components/sortable-item',
      ],
    },
    {
      type: 'category',
      label: 'Hooks',
      items: [
        'hooks/useDraggable',
        'hooks/useDroppable',
        'hooks/useSortable',
        'hooks/useSortableList',
      ],
    },
    {
      type: 'category',
      label: 'Context & Providers',
      items: [
        'context/DropProvider',
        'context/DragDropContext',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/basic-drag-drop',
        'examples/sortable-lists',
        'examples/drag-handles',
        'examples/collision-detection',
        'examples/bounded-dragging',
        'examples/axis-constraints',
        'examples/custom-animations',
        'examples/drop-zones',
        'examples/visual-feedback',
        'examples/advanced-features',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/animations',
        'guides/collision-algorithms',
        'guides/constraints-bounds',
        'guides/performance',
        'guides/accessibility',
        'guides/troubleshooting',
      ],
    },
  ],

  // API Reference sidebar
  apiSidebar: [
    'api/overview',
    {
      type: 'category',
      label: 'Components',
      items: [
        'api/components/draggable',
        'api/components/droppable',
        'api/components/sortable',
        'api/components/sortable-item',
      ],
    },
    {
      type: 'category',
      label: 'Hooks',
      items: [
        'api/hooks/useDraggable',
        'api/hooks/useDroppable',
        'api/hooks/useSortable',
        'api/hooks/useSortableList',
      ],
    },
    {
      type: 'category',
      label: 'Context & Providers',
      items: [
        'api/context/DropProvider',
        'api/context/DragDropContext',
      ],
    },
    {
      type: 'category',
      label: 'Types & Interfaces',
      items: [
        'api/types/draggable-types',
        'api/types/droppable-types',
        'api/types/sortable-types',
        'api/types/context-types',
        'api/types/enums',
      ],
    },
    {
      type: 'category',
      label: 'Utilities',
      items: [
        'api/utilities/collision-algorithms',
        'api/utilities/animation-functions',
        'api/utilities/helper-functions',
      ],
    },
  ],
};

export default sidebars;
