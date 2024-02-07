import { useAppSelector, useAppDispatch } from "../../../hooks/redux";

export function Filter() {
    const tableSelector = useAppSelector(state => state.tables);
    const dispatch = useAppDispatch();

    const data = tableSelector.data;
    return(
        <>
            
        </>
    )
}