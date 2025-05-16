// context/DropContext.tsx
import React, {
  useRef,
  createContext,
  ReactNode,
  useState,
  useMemo,
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

// Interface for the context value
export interface SlotsContextValue<TData = unknown> {
  register: (id: number, slot: DropSlot<TData>) => void;
  unregister: (id: number) => void;
  getSlots: () => Record<number, DropSlot<TData>>;
  isRegistered: (id: number) => boolean;
  setActiveHoverSlot: (id: number | null) => void;
  activeHoverSlotId: number | null;
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
};

// Create the context
export const SlotsContext = createContext<SlotsContextValue<any>>(
  defaultSlotsContextValue
);

// Props for the DropProvider
interface DropProviderProps {
  children: ReactNode;
}

// The DropProvider component
export const DropProvider = <TData = unknown,>({
  children,
}: DropProviderProps): React.ReactElement => {
  const slotsRef = useRef<Record<number, DropSlot<TData>>>({});
  const [activeHoverSlotId, setActiveHoverSlotIdState] = useState<
    number | null
  >(null);

  const contextValue = useMemo<SlotsContextValue<TData>>(
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
      setActiveHoverSlot: (id: number | null) => setActiveHoverSlotIdState(id),
      activeHoverSlotId,
    }),
    [activeHoverSlotId]
  );

  return (
    <SlotsContext.Provider value={contextValue as SlotsContextValue<any>}>
      {children}
    </SlotsContext.Provider>
  );
};
