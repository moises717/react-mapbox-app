import { useContext, useState } from "react"
import { PlacesContext, MapContext } from "../context"
import { Feature } from "../interfaces/places"
import { LoadingPlaces } from "./LoadingPlaces"

export const SearchResult = () => {
    const [activeId, setActiveId] = useState('');

    const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext)
    const { map, getRouteBetweenPoints } = useContext(MapContext)

    const onPlaceClicked = (place: Feature) => {

        const [lng, lat] = place.center;
        setActiveId(place.id);
        map?.flyTo({
            zoom: 15,
            center: [lng, lat]
        })
    }

    const getRoute = async (place: Feature) => {
        if (!userLocation) return;
        const [lng, lat] = place.center;
        getRouteBetweenPoints(userLocation, [lng, lat]);
    }

    if (isLoadingPlaces) return <LoadingPlaces />
    if (places.length === 0) return <></>

    return (
        <ul className="list-group mt-3">

            {
                places.map(place => (
                    <li key={place.id} className={`${activeId === place.id && 'active'} list-group-item list-group-item-action`} style={{ cursor: 'pointer' }}
                        onClick={() => onPlaceClicked(place)}
                    >
                        <h6> {place.place_name_es} </h6>
                        <p
                            style={{
                                fontSize: '12px'
                            }}>
                            {place.text_es}
                        </p>
                        <button className={`btn btn-sm ${activeId === place.id ? 'btn-outline-light' : 'btn-outline-primary'}`} onClick={() => getRoute(place)}>
                            Direcciones
                        </button>
                    </li>
                ))
            }


        </ul>

    )
}
