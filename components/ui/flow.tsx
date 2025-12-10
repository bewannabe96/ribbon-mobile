import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type OpenType<ID, OD> = (input: ID) => Promise<OD | void>;

type CloseType<OD> = (output: OD | void) => Promise<void>;

export interface FlowRef<ID, OD> {
  open: OpenType<ID, OD>;
}

export type FlowProps<Props, ID, OD> = Props & {
  input?: ID;
  isOpened?: boolean;
  close: CloseType<OD>;
};

export function createFlow<Props, ID, OD>(
  flowName: string,
  component: React.FC<FlowProps<Props, ID, OD>>,
) {
  const Flow = forwardRef<FlowRef<ID, OD>, Props>((props, ref) => {
    const [isOpened, setIsOpened] = useState(false);
    const refResolve = useRef<(output: OD | void) => void>(null);
    const [input, setInput] = useState<ID>();

    const open = useCallback<OpenType<ID, OD>>(async (input) => {
      return new Promise<OD | void>((resolve) => {
        refResolve.current = resolve;
        setInput(input);
        setIsOpened(true);
      });
    }, []);

    const close = useCallback<CloseType<OD>>(async (output) => {
      setIsOpened(false);
      setInput(undefined);
      refResolve.current?.(output);
    }, []);

    useImperativeHandle(ref, () => ({ open: open }));

    return React.createElement<FlowProps<Props, ID, OD>>(component, {
      ...props,
      input: input,
      isOpened: isOpened,
      close: close,
    } as FlowProps<Props, ID, OD>);
  });
  Flow.displayName = flowName;

  return Flow;
}
