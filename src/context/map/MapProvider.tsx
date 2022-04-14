/* eslint import/no-webpack-loader-syntax: off */

// @ts-ignore
import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "!mapbox-gl";
import { useContext, useEffect, useReducer } from "react";
import { directionsApi } from "../../apis";
import { DirectionResponse } from "../../interfaces/directions";
import { PlacesContext } from "../places/PlacesContext";
import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";

export interface MapState {
    isMapReady: boolean;
    map?: Map,
    markers?: Marker[],


}


const INITIAL_STATE: MapState = {
    isMapReady: false,
    map: undefined,
    markers: [],
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const MapProvider = ({ children }: Props) => {

    const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);
    const { places } = useContext(PlacesContext)

    useEffect(() => {
        state.markers?.forEach(marker => marker.remove())
        const newMarkers: Marker[] = [];


        for (const place of places) {
            const [lng, lat] = place.center;
            const popup = new Popup()
                .setHTML(
                    `
                <h6>${place.text_es}</h6>
                <p>${place.place_name_es}</p>
                `

                )

            const marker = new Marker().setPopup(popup).setLngLat([lng, lat])
                .addTo(state.map!);

            newMarkers.push(marker);
        }

        dispatch({
            type: 'setMarkers',
            payload: newMarkers
        })

    }, [places, state.map, state.markers])

    const setMap = (map: Map) => {
        const myLocationPopup = new Popup()
            .setHTML(`
            <h4>Estoy aquí</h4>
            <p>En algún lugar del mundo</p>
            `)


        new Marker({
            color: '#61DAFB'
        })
            .setLngLat(map.getCenter())
            .addTo(map)
            .setPopup(myLocationPopup)
        dispatch({
            type: "setMap",
            payload: map
        })
    }


    const getRouteBetweenPoints = async (from: [number, number], to: [number, number]) => {

        const resp = await directionsApi.get<DirectionResponse>(`/${from.join(',')};${to.join(',')}`);

        const { distance, duration, geometry } = resp.data.routes[0];
        const { coordinates: coords } = geometry;

        let kms = distance / 1000;
        kms = Math.round(kms * 100);
        kms /= 100;

        const minutes = Math.floor(duration / 60);

        const bounds = new LngLatBounds(
            from,
            from
        );

        for (const coord of coords) {
            const newCoord: [number, number] = [coord[0], coord[1]];
            bounds.extend(newCoord);
        }

        state.map?.fitBounds(bounds, {
            padding: 200,

        })

        // Polyline
        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: [],
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }

        }

        if (state.map?.getLayer('RouteString')) {
            state.map?.removeLayer('RouteString');
            state.map?.removeSource('RouteString');
        }

        state.map?.addSource('RouteString', sourceData);


        state.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#61DAFB',
                'line-width': 3
            }

        })


    }

    return (
        <MapContext.Provider value={{
            ...state,
            setMap,
            getRouteBetweenPoints
        }}>
            {children}
        </MapContext.Provider>
    )
}
