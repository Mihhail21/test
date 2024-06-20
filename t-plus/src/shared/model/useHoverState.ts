import { useState } from 'react';

interface HoverState {
 close: boolean;
 open: boolean;
 done1: boolean;
 done2: boolean;
 auto: boolean;
 hand: boolean;
 stepBack: boolean;
 stepUp: boolean;
 avr?: boolean;
 work?: boolean;

}

const useHoverState = (): [HoverState, (key: keyof HoverState, value: boolean) => void] => {
 const [hoverState, setHoverState] = useState<HoverState>({
    close: false,
    open: false,
    done1: false,
    done2: false,
    auto: false,
    hand: false,
    stepBack: false,
    stepUp: false,
    avr:false,
    work:false,

 });

 const setHover = (key: keyof HoverState, value: boolean) => {
    setHoverState(prevState => ({ ...prevState, [key]: value }));
 };

 return [hoverState, setHover];
};

export default useHoverState;
