/**
 * useQueryState hook v1.0
 *
 * A custom hook that simplifies working with react-query states and allows for manually updating displayed data and the cache.
 *
 * Author: Elwan Mayencourt
 * GitHub: https://github.com/YungBricoCoop/react-query-utils
 *
 * @param queryData The initial query data.
 * @returns A tuple containing the current query state, a function to update the query state, and a function to manually update the cache.
 */

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey, Updater, SetDataOptions } from '@tanstack/react-query';

/**
 * This hook is used to update the state of a query data and the cache.
 * The state is updated automatically when the query data changes.
 * @param queryData Result data from useQuery
 * @returns [state, setState, setCache]
 */
function useQueryState<T>(
    queryData: T
): [
    T,
    Dispatch<SetStateAction<T>>,
    (queryKey: QueryKey, updater: Updater<T, SetDataOptions>) => void
] {
    const [state, setState] = useState(queryData);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!queryData) return;
        setState(queryData);
    }, [queryData]);

    /**
     * This function is used to update the cache of the query.
     * @param queryKey The query key ([queryKey, queryVariables]
     * @param updater The new value or a function that returns the new value
     * @returns
     */
    const setCache = (
        queryKey: QueryKey,
        updater: Updater<T, SetDataOptions>
    ) => {
        const prevData = queryClient.getQueryData<T>(queryKey);

        if (typeof updater === 'function') {
            const newData = updater(prevData || queryData);
            queryClient.setQueryData(queryKey, newData);
            return;
        }

        queryClient.setQueryData(queryKey, updater);
    };

    return [state, setState, setCache];
}

export default useQueryState;