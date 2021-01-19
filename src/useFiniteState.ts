import { useEffect, useState } from "react";

export type FiniteStateMachine<TState, TContext> = {
    state: TState;
    context: TContext;
    setState: (
        newState: TState,
        newContext: (ctx: TContext) => TContext | TContext
    ) => void;
};

export type UseFiniteStateOptions<TState extends string, TContext> = {
    initialState: TState;
    initialContext: TContext;
    effects?: {
        [T in TState]?: (x: any) => void;
    };
};

export function useFiniteState<TState extends string, TContext = {}>({
                                                          initialState,
                                                          initialContext,
                                                          effects
                                                      }: UseFiniteStateOptions<TState, TContext>) {
    const [state, setState] = useState<TState>(initialState);
    const [context, setContext] = useState<TContext>(initialContext);

    const finiteStateMachine: FiniteStateMachine<TState, TContext> = {
        state,
        context,
        setState: (newState: TState, newContext = (_: TContext) => context) => {
            setState(newState);
            if (typeof newContext === "function") {
                setContext(newContext(context));
            } else if (typeof newContext === "object") {
                setContext(newContext);
            }
        }
    };

    useEffect(() => {
        console.log("UseFiniteState:", state, context);
    }, [state, context]);

    useEffect(() => {
        if (effects) {
            const effect = effects[state];
            if (effect && typeof effect === "function") {
                effect(finiteStateMachine);
            }
        }
    }, [state, context, effects]);

    return finiteStateMachine;
}
