//* USE FETCH API
//? https://medium.com/@farnam/creating-a-custom-hook-with-typescript-in-a-react-application-9bc34391ce8e
import { useReducer, useEffect } from 'react';

type State = {
    data: any;
    loading: boolean;
    error: Error | null;
};

type Action = 
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: any }
  | { type: 'ERROR'; payload: Error };

const dataFetchReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'LOADING':
            return { ...state, loading: true };
        case 'SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            throw new Error();
    }
}

const useFetchAPI = <T,>(url: string)=> {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        data: null,
        loading: false,
        error: null,
    });

    useEffect(() => {
        let didCancel = false;

        async function fetchData() {
            dispatch({ type: 'LOADING' });

            try {
                const response = await fetch(url);
                if (!didCancel) {
                    const data = await response.json();
                    dispatch({ type: 'SUCCESS', payload: data });
                }
            } catch (error) {
                if (!didCancel) {
                    dispatch({ type: 'ERROR', payload: error });
                }
            }
        }

        fetchData();

        return () => {
            didCancel = true;
        };
    }, [url]);

    return { ...state };
}

export default useFetchAPI;