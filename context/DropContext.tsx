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

// Interface for a single drop slot
export interface DropSlot<TData = unknown> {
  x: number;
  y: number;
  width: number;
  height: number;
  onDrop: (data: TData) => void;
  dropAlignment?: DropAlignment; // New optional property
  dropOffset?: DropOffset; // New optional property
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
  requestPositionUpdate: () => void; // This will be called internally by the ref method
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
};

// Create the context
export const SlotsContext = createContext<SlotsContextValue<any>>(
  defaultSlotsContextValue
);

// Props for the DropProvider
interface DropProviderProps {
  children: ReactNode;
  onLayoutUpdateComplete?: () => void;
}

// Type for the imperative handle exposed by DropProvider
export interface DropProviderRef {
  requestPositionUpdate: () => void;
}

// The DropProvider component, now forwardRef
export const DropProvider = forwardRef<DropProviderRef, DropProviderProps>(
  (
    { children, onLayoutUpdateComplete }: DropProviderProps,
    ref: React.ForwardedRef<DropProviderRef>
  ): React.ReactElement => {
    const slotsRef = useRef<Record<number, DropSlot<any>>>({});
    const [activeHoverSlotId, setActiveHoverSlotIdState] = useState<
      number | null
    >(null);
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

    // This is the actual function that does the work
    const internalRequestPositionUpdate = useCallback(() => {
      const listeners = positionUpdateListenersRef.current;
      Object.values(listeners).forEach((listener) => {
        listener();
      });
      onLayoutUpdateComplete?.();
    }, [onLayoutUpdateComplete]);

    // Expose requestPositionUpdate via ref
    useImperativeHandle(ref, () => ({
      requestPositionUpdate: internalRequestPositionUpdate,
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
      }),
      [
        activeHoverSlotId,
        registerPositionUpdateListener,
        unregisterPositionUpdateListener,
        internalRequestPositionUpdate, // Use the internal one here
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
