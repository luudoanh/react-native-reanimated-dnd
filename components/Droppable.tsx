// Node Modules
import React, {
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { View, StyleProp, ViewStyle } from "react-native";

export interface DropSlot<TData = unknown> {
  x: number;
  y: number;
  width: number;
  height: number;
  onDrop: (data: TData) => void;
}

// The registry context
export interface SlotsContextValue<TData = unknown> {
  register: (id: number, slot: DropSlot<TData>) => void;
  unregister: (id: number) => void;
  getSlots: () => Record<number, DropSlot<TData>>;
  isRegistered: (id: number) => boolean;
}

// Using 'any' for the default context to accommodate generic TData variance.
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
};

// Context is initialized with SlotsContextValue<any>.
// Consumers cast to SlotsContextValue<TData> with specific TData.
export const SlotsContext = createContext<SlotsContextValue<any>>(
  defaultSlotsContextValue
);

interface DropProviderProps {
  children: ReactNode;
}

export const DropProvider = <TData = unknown,>({
  children,
}: DropProviderProps): React.ReactElement => {
  const slotsRef = useRef<Record<number, DropSlot<TData>>>({});

  const contextValue = React.useMemo<SlotsContextValue<TData>>(
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
    }),
    []
  );

  // Cast to SlotsContextValue<any> is necessary because contextValue is SlotsContextValue<TData>.
  return (
    <SlotsContext.Provider value={contextValue as SlotsContextValue<any>}>
      {children}
    </SlotsContext.Provider>
  );
};

let _nextDroppableId = 1;

interface DroppableProps<TData = unknown> {
  onDrop: (data: TData) => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  dropDisabled?: boolean;
}

export const Droppable = <TData = unknown,>({
  onDrop,
  style,
  children,
  dropDisabled,
}: DroppableProps<TData>): React.ReactElement => {
  const id = useRef(_nextDroppableId++).current;
  const viewRef = useRef<View>(null);

  // Cast to SlotsContextValue<TData> is an assertion by this component
  // that the DropProvider<TData> above it provides the correct specific context type.
  const { register, unregister, isRegistered } = useContext(
    SlotsContext
  ) as SlotsContextValue<TData>;

  const handleLayout = useCallback(() => {
    if (viewRef.current) {
      viewRef.current.measure(
        (_frameX, _frameY, width, height, pageX, pageY) => {
          register(id, { x: pageX, y: pageY, width, height, onDrop });
        }
      );
    }
  }, [id, onDrop, register, viewRef]);

  useEffect(() => {
    if (dropDisabled) {
      unregister(id);
    } else {
      // Ensure the droppable is registered if enabled and not already registered.
      // The View's onLayout will also call handleLayout if the layout changes or onDrop (a dependency of handleLayout) changes.
      if (!isRegistered(id)) {
        handleLayout();
      }
    }
  }, [dropDisabled, id, register, unregister, isRegistered, handleLayout]);

  useEffect(() => {
    // Cleanup: unregister on unmount
    return () => {
      unregister(id);
    };
  }, [id, unregister]);

  return (
    <View ref={viewRef} onLayout={handleLayout} style={style}>
      {children}
    </View>
  );
};
