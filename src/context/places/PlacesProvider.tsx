import { useEffect, useReducer } from "react";
import { searchApi } from "../../apis";
import { getUserLocation } from "../../helpers";
import { Feature, PlacesResponse } from "../../interfaces/places";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";

export interface PlacesState {
    isLoading: boolean;
    userLocation?: [number, number];
    isLoadingPlaces: boolean,
    places: Feature[]
}

const INITIAL_STATE: PlacesState = {
    isLoading: true,
    userLocation: undefined,
    isLoadingPlaces: false,
    places: []

}

interface Props {
    children: JSX.Element | JSX.Element[];
}

export const PlacesProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE)


    const searchPlacesByTerm = async (term: string): Promise<Feature[]> => {
        if (term.length === 0) {
            dispatch({ type: 'setPlaces', payload: [] });
            return []
        }
        if (!state.userLocation) throw new Error("No user location");

        dispatch({ type: "setLoadingPlaces" });

        const resp = await searchApi.get<PlacesResponse>(`/${term}.json`, {
            params: {
                proximity: state.userLocation.join(","),
            }
        })
        dispatch({ type: "setPlaces", payload: resp.data.features });
        return resp.data.features

    }


    useEffect(() => {
        getUserLocation().then((lgnLat) => {
            dispatch({
                type: 'setUserLocation',
                payload: lgnLat,
            })
        })
    }, [])

    return (
        <PlacesContext.Provider value={{
            ...state,
            searchPlacesByTerm,

        }}>
            {children}
        </PlacesContext.Provider>
    )
}
