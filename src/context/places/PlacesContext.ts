import { createContext } from 'react';
import { Feature } from '../../interfaces/places';

export interface PlacesContextProps {
	isLoading: boolean;
	userLocation?: [number, number];
	searchPlacesByTerm: (term: string) => Promise<Feature[]>;
	isLoadingPlaces: boolean;
	places: Feature[];
}

export const PlacesContext = createContext<PlacesContextProps>({} as PlacesContextProps);
