import { getState, setState, State } from "../main";

export const userInputSystem = () => {
    const { userInput } = getState()    
    console.log(userInput)

    setState((state: State) => {
        state.userInput = null
    })
};

