# Drag & Drop Library Feature Checklist

## Core Functionality & Mechanics

### High Priority

- [x] Basic Draggable Item (`useDraggable`)
- [x] Basic Droppable Zone (`useDroppable`)
- [x] Data Transfer (Passing data from Draggable to Droppable on drop)
- [x] Custom Drop Animation (`animationFunction` in `useDraggable`)
- [x] Dragging Event (`onDragging` with position/translation updates)
- [x] Drag Bounds (`dragBoundsRef` to confine dragging to a view)
- [x] Drop Alignment & Offset (gravity options like 'top-left', 'center', and `dropOffset` for fine-tuning)
- [x] **Drag Axis Constraints:** Restrict dragging to X-axis, Y-axis, or both.
- [x] **Customizable Drop Zone Active Styles (via prop):** Allow passing `activeStyle` to `Droppable`/`useDroppable`.
- [x] **Drag Handles:** Allow specifying a child element as the drag initiator.

### Medium Priority

- [x] Drag Start/End Events (`onDragStart`, `onDragEnd`)
- [x] Droppable Active State Change (`onActiveChange` for hover indication)
- [x] Disabled Draggables (`dragDisabled` prop)
- [x] Disabled Droppables (`dropDisabled` prop)
- [x] **`onHoverEnter` / `onHoverLeave` for Drop Zones:** More granular hover events.
- [x] **Dynamic Disabling/Enabling of Drop Zones:** Based on app state or drag data.
- [x] **Collision Detection Algorithm Options:** Added "center", "intersect" and "contain"
- [x] **Droppable capacities:** Added "capacities", how many draggables a droppable can allow (defaults to 1)

### Low Priority

- [x] **Conditional Dragging:** `dragDisabled` as a function.
- [x] Add drag state management to Draggable and update useDraggable hook to have IDLE, DRAGGING, and DROPPED states.
- [ ] **Snap-to-Grid / Snap Lines:** For precise placement.
- [ ] **`onOutOfBounds` Event for Draggables:** Event when bounded drag is clamped.
- [ ] **External Control over Drag Position:** Programmatic positioning.
- [ ] **Multiple Draggables Selection & Dragging:** Complex but powerful.
- [ ] **Throttling/Debouncing `onDragging`:** For performance-sensitive callbacks.

## Developer Experience & Documentation

- [ ] **Clearer Prop Names & API Design:** Ongoing review.
- [ ] **Comprehensive Documentation:** For all hooks and components.
- [ ] **Varied Examples:** Showcasing different use cases (lists, grids, etc.).
- [ ] **Guidance on Persistence/Serialization:** Helping users save/restore layouts.
