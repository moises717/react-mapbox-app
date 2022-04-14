import { ChangeEvent, useContext, useRef } from "react";
import { PlacesContext } from "../context";
import { SearchResult } from "./SearchResult";

export const SearchBar = () => {
    const { searchPlacesByTerm } = useContext(PlacesContext)

    const debounceRef = useRef<NodeJS.Timeout>();

    const onQueryChanged = (query: ChangeEvent<HTMLInputElement>) => {

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            searchPlacesByTerm(query.target.value);
        }, 350);

    }


    return (
        <div className="search-container">
            <input type="text" placeholder="Buscar lugar" className="form-control" onChange={onQueryChanged} />
            <SearchResult />
        </div>
    )
}
