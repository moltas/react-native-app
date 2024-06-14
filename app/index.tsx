import { View, Text, Dimensions, Touchable, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Camera, Marker } from "react-native-maps";
import appleHealthKit from "react-native-health";

import mapStyling from "./map-styling.json";
import { LegacyRef, useEffect, useRef } from "react";

// show a start and finish point
// zoom in so those points are in view

export default function HomeScreen() {
    const mapRef = useRef<MapView>(null);

    let LATITUDE_DELTA = 0;
    let LONGITUDE_DELTA = 0;

    const window = Dimensions.get("window");
    const { width, height } = window;
    LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

    const stockholmPos: Position = {
        latitude: 59.3251172,
        longitude: 18.0710935,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    };

    const uppsalaPos: Position = {
        latitude: 59.8586126,
        longitude: 17.6387436,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    };

    useEffect(() => {
        if (mapRef) {
            mapRef.current?.animateCamera({
                zoom: 8,
                altitude: 8,
                center: { latitude: stockholmPos.latitude, longitude: stockholmPos.longitude },
            });
        }

        // const coords = predictions.map((element) => {
        //     return {
        //       latitude: element.coordinates.latitude,
        //       longitude: element.coordinates.longitude,
        //     };
        //   });

        //   this.mapRef.fitToCoordinates(coords, {
        //     edgePadding: {
        //       bottom: 200,
        //       right: 50,
        //       top: 150,
        //       left: 50,
        //     },
        //     animated: true,
        //   });
    }, []);

    return (
        <SafeAreaView className="bg-black h-full">
            <View className="flex-1 items-center justify-center bg-blue">
                <MapView className="w-full h-full" customMapStyle={mapStyling} provider="google" ref={mapRef} showsUserLocation>
                    <Marker coordinate={stockholmPos} title={"start"} />
                    <Marker coordinate={uppsalaPos} title={"finish"} />
                </MapView>
            </View>
        </SafeAreaView>
    );
}
