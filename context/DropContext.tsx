// context/DropContext.tsx
import React, {
  useRef,
  createContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

// Define DropAlignment and DropOffset types here
export type DropAlignment =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface DropOffset {
  x: number;
  y: number;
}

// Define type for the draggable-to-droppable mapping
export interface DroppedItemsMap<TData = unknown> {
  [draggableId: string]: {
    droppableId: string;
    data: TData;
  };
}

// Interface for a single drop slot
export interface DropSlot<TData = unknown> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onDrop: (data: TData) => void;
  dropAlignment?: DropAlignment;
  dropOffset?: DropOffset;
}

// Listener type for position updates
type PositionUpdateListener = () => void;

// Interface for the context value
export interface SlotsContextValue<TData = unknown> {
  register: (id: number, slot: DropSlot<TData>) => void;
  unregister: (id: number) => void;
  getSlots: () => Record<number, DropSlot<TData>>;
  isRegistered: (id: number) => boolean;
  setActiveHoverSlot: (id: number | null) => void;
  activeHoverSlotId: number | null;
  registerPositionUpdateListener: (
    id: string,
    listener: PositionUpdateListener
  ) => void;
  unregisterPositionUpdateListener: (id: string) => void;
  requestPositionUpdate: () => void;

  // Update method signatures to use string IDs for droppables
  registerDroppedItem: (
    draggableId: string,
    droppableId: string,
    itemData: any
  ) => void;
  unregisterDroppedItem: (draggableId: string) => void;
  getDroppedItems: () => DroppedItemsMap<any>;
}

// Default context value using 'any' for broad compatibility
const defaultSlotsContextValue: SlotsContextValue<any> = {
  register: (_id: number, _slot: DropSlot<any>) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: register called without a Provider.");
    }
  },
  unregister: (_id: number) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: unregister called without a Provider.");
    }
  },
  getSlots: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: getSlots called without a Provider.");
    }
    return {} as Record<number, DropSlot<any>>;
  },
  isRegistered: (_id: number) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: isRegistered called without a Provider.");
    }
    return false;
  },
  setActiveHoverSlot: (_id: number | null) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: setActiveHoverSlot called without a Provider."
      );
    }
  },
  activeHoverSlotId: null,
  registerPositionUpdateListener: (
    _id: string,
    _listener: PositionUpdateListener
  ) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: registerPositionUpdateListener called without a Provider."
      );
    }
  },
  unregisterPositionUpdateListener: (_id: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: unregisterPositionUpdateListener called without a Provider."
      );
    }
  },
  requestPositionUpdate: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: requestPositionUpdate called without a Provider (internally)."
      );
    }
  },
  // Update default implementations
  registerDroppedItem: (
    _draggableId: string,
    _droppableId: string,
    _itemData: any
  ) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: registerDroppedItem called without a Provider."
      );
    }
  },
  unregisterDroppedItem: (_draggableId: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: unregisterDroppedItem called without a Provider."
      );
    }
  },
  getDroppedItems: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: getDroppedItems called without a Provider.");
    }
    return {} as DroppedItemsMap<any>;
  },
};

// Create the context
export const SlotsContext = createContext<SlotsContextValue<any>>(
  defaultSlotsContextValue
);

// Props for the DropProvider
interface DropProviderProps {
  children: ReactNode;
  onLayoutUpdateComplete?: () => void;
  onDroppedItemsUpdate?: (droppedItems: DroppedItemsMap) => void;
}

// Type for the imperative handle exposed by DropProvider
export interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}

// The DropProvider component, now forwardRef
export const DropProvider = forwardRef<DropProviderRef, DropProviderProps>(
  (
    {
      children,
      onLayoutUpdateComplete,
      onDroppedItemsUpdate,
    }: DropProviderProps,
    ref: React.ForwardedRef<DropProviderRef>
  ): React.ReactElement => {
    const slotsRef = useRef<Record<number, DropSlot<any>>>({});
    const [activeHoverSlotId, setActiveHoverSlotIdState] = useState<
      number | null
    >(null);

    // New state for tracking dropped items
    const [droppedItems, setDroppedItems] = useState<DroppedItemsMap>({});

    const positionUpdateListenersRef = useRef<
      Record<string, PositionUpdateListener>
    >({});

    const registerPositionUpdateListener = useCallback(
      (id: string, listener: PositionUpdateListener) => {
        positionUpdateListenersRef.current[id] = listener;
      },
      []
    );

    const unregisterPositionUpdateListener = useCallback((id: string) => {
      delete positionUpdateListenersRef.current[id];
    }, []);

    // Call the update callback whenever droppedItems changes
    useEffect(() => {
      if (onDroppedItemsUpdate) {
        onDroppedItemsUpdate(droppedItems);
      }
    }, [droppedItems, onDroppedItemsUpdate]);

    // Update method to use string IDs
    const registerDroppedItem = useCallback(
      (draggableId: string, droppableId: string, itemData: any) => {
        setDroppedItems((prev) => ({
          ...prev,
          [draggableId]: {
            droppableId,
            data: itemData,
          },
        }));
      },
      []
    );

    const unregisterDroppedItem = useCallback((draggableId: string) => {
      setDroppedItems((prev) => {
        const newItems = { ...prev };
        delete newItems[draggableId];
        return newItems;
      });
    }, []);

    const getDroppedItems = useCallback(() => {
      return droppedItems;
    }, [droppedItems]);

    // This is the actual function that does the work
    const internalRequestPositionUpdate = useCallback(() => {
      const listeners = positionUpdateListenersRef.current;
      Object.values(listeners).forEach((listener) => {
        listener();
      });
      onLayoutUpdateComplete?.();
    }, [onLayoutUpdateComplete]);

    // Expose requestPositionUpdate and getDroppedItems via ref
    useImperativeHandle(ref, () => ({
      requestPositionUpdate: internalRequestPositionUpdate,
      getDroppedItems,
    }));

    const contextValue = useMemo<SlotsContextValue<any>>(
      () => ({
        register: (id, slot) => {
          slotsRef.current[id] = slot;
        },
        unregister: (id) => {
          delete slotsRef.current[id];
        },
        isRegistered: (id) => {
          return slotsRef.current[id] !== undefined;
        },
        getSlots: () => slotsRef.current,
        setActiveHoverSlot: (id: number | null) =>
          setActiveHoverSlotIdState(id),
        activeHoverSlotId,
        registerPositionUpdateListener,
        unregisterPositionUpdateListener,
        // Provide internalRequestPositionUpdate to the context for hooks that might still need it,
        // though direct calls should now prefer the ref method.
        requestPositionUpdate: internalRequestPositionUpdate,
        // Add the new methods to the context value
        registerDroppedItem,
        unregisterDroppedItem,
        getDroppedItems,
      }),
      [
        activeHoverSlotId,
        registerPositionUpdateListener,
        unregisterPositionUpdateListener,
        internalRequestPositionUpdate,
        // Add the new methods as dependencies
        registerDroppedItem,
        unregisterDroppedItem,
        getDroppedItems,
      ]
    );

    return (
      <SlotsContext.Provider value={contextValue as SlotsContextValue<any>}>
        {children}
      </SlotsContext.Provider>
    );
  }
);

// Adding a display name for better debugging in React DevTools
DropProvider.displayName = "DropProvider";
