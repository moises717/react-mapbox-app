import { createContext } from 'react';

/* eslint import/no-webpack-loader-syntax: off */

// @ts-ignore
import { Map } from '!mapbox-gl';

interface MapContextProps {
	isMapReady: boolean;
	map?: Map;
	setMap: (map: Map) => void;
	getRouteBetweenPoints: (from: [number, number], to: [number, number]) => Promise<any>;
}

export const MapContext = createContext({} as MapContextProps);
