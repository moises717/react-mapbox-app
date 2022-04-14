import { MapProvider, PlacesProvider } from "./context"
import { HomeScreen } from "./screens/HomeScreen"


export const MapsApp = () => {
    return (
        <PlacesProvider>
            <MapProvider>
                <HomeScreen />
            </MapProvider>
        </PlacesProvider>
    )
}
