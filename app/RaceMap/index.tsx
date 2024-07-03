import { useRef, useEffect, useState } from "react";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import mapStyling from "../map-styling.json";
import polyline from "@mapbox/polyline";
import Mapbox from "@rnmapbox/maps";

import Config from "react-native-config";
import { View } from "react-native";

console.log(Config);

Mapbox.setAccessToken(Config.MAPBOX_API_KEY!);
Mapbox.setTelemetryEnabled(false);
Mapbox.setWellKnownTileServer("mapbox");

interface Props {
    origin: string;
    destination: string;
    userStepsCount: number;
}

export default function RaceMap({ origin, destination, userStepsCount }: Props) {
    const mapRef = useRef<MapView>(null);

    const [raceDistance, setRaceDistance] = useState<number>();
    const [route, setRoute] = useState<any>();
    const [userCoords, setUserCoords] = useState<LatLng>();
    const [raceCoords, setRaceCoords] = useState<{ origin: LatLng; destination: LatLng }>();

    // const stockholmPos: Position = {
    //     latitude: 59.3251172,
    //     longitude: 18.0710935,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA,
    // };

    useEffect(() => {
        // getDirections(origin, destination).then((result) => {
        //     const route = result.routes[0];
        //     const firstLeg = route.legs[0];
        //     const decodedPolyline = polyline.decode(route.overview_polyline.points);
        //     const fractionWalked = 22000 / firstLeg.distance.value;
        //     const test = interpolatePosition(decodedPolyline, fractionWalked);
        //     console.log("test", test);
        //     setUserCoords(test);
        //     setRoute(decodedPolyline.map((coord: number[]) => ({ latitude: coord[0], longitude: coord[1] })));
        //     setRaceDistance(firstLeg.distance.value);
        //     setRaceCoords({
        //         origin: { latitude: firstLeg.start_location.lat, longitude: firstLeg.start_location.lng },
        //         destination: { latitude: firstLeg.end_location.lat, longitude: firstLeg.end_location.lng },
        //     });
        //     if (mapRef) {
        //         mapRef.current?.animateCamera({
        //             zoom: 9,
        //             altitude: 8,
        //             pitch: 4,
        //             center: { latitude: firstLeg.start_location.lat, longitude: firstLeg.end_location.lng },
        //         });
        //     }
        // });
    }, []);

    return (
        <View className="flex-1 w-full">
            <Mapbox.MapView
                className="flex-1 w-full"
                // styleURL="mapbox://styles/tobify/cly4exnlg009m01qv316e7ptn"
                styleURL="mapbox://styles/mapbox/streets-v12"
                zoomEnabled={true}
                scaleBarEnabled={false}
            >
                <Mapbox.Camera
                    zoomLevel={15}
                    centerCoordinate={[18.0710935, 59.3251172]} // Put any coordinates
                    pitch={60}
                    animationMode={"flyTo"}
                    animationDuration={3000}
                />
                <Mapbox.PointAnnotation id="start" coordinate={[18.0710935, 59.3251172]}>
                    <View />
                </Mapbox.PointAnnotation>
            </Mapbox.MapView>
        </View>

        // <MapView className="w-full flex-1" customMapStyle={mapStyling} provider="google" ref={mapRef}>
        //     {raceCoords && (
        //         <>
        //             <Marker coordinate={raceCoords.origin} title={"start"} />
        //             <Marker coordinate={raceCoords.destination} title={"finish"} />
        //         </>
        //     )}
        //     {userCoords && <Marker coordinate={userCoords} title={"user"} />}
        //     <Polyline coordinates={route} strokeColor="orange" strokeWidth={3} />
        // </MapView>
    );
}

const getDirections = async (origin: string, destination: string): Promise<DirectionsResponse> => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${Config.GOOGLE_MAPS_API_KEY}&mode=walking`;
    return await fetch(url).then((response) => response.json());
};

const interpolatePosition = (path: any[], fraction: number): LatLng => {
    const totalPoints = path.length;
    const targetPointIndex = Math.floor(fraction * (totalPoints - 1));
    const nextPointIndex = Math.ceil(fraction * (totalPoints - 1));

    const targetPoint = path[targetPointIndex];
    const nextPoint = path[nextPointIndex];

    const interpolateLat = targetPoint[0] + (nextPoint[0] - targetPoint[0]) * (fraction * (totalPoints - 1) - targetPointIndex);
    const interpolateLng = targetPoint[1] + (nextPoint[1] - targetPoint[1]) * (fraction * (totalPoints - 1) - targetPointIndex);

    console.log(interpolateLat, interpolateLng);

    return { latitude: interpolateLat, longitude: interpolateLng };
};

interface DirectionsResponse {
    geocoded_waypoints: {
        geocoder_status: string;
        place_id: string;
        types: string[];
    }[];
    routes: [
        {
            bounds: {
                northeast: { lat: number; lng: number };
                southwest: { lat: number; lng: number };
            };
            copyrights: string;
            legs: {
                distance: { text: string; value: number };
                duration: { text: string; value: number };
                end_address: string;
                end_location: { lat: number; lng: number };
                start_address: string;
                start_location: { lat: number; lng: number };
                steps: {
                    distance: { text: string; value: number };
                    duration: { text: string; value: number };
                    end_location: { lat: number; lng: number };
                    html_instructions: string;
                    polyline: { points: string };
                    start_location: { lat: number; lng: number };
                    travel_mode: "DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT";
                }[];
                traffic_speed_entry: [];
                via_waypoint: [];
            }[];
            overview_polyline: {
                points: string;
            };
            summary: string;
            warnings: [];
            waypoint_order: [0, 1];
        }
    ];
    status: string;
}
