import { View, Text, Dimensions, Touchable, Button } from "react-native";
import { LegacyRef, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Camera, Marker, Polyline } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";
import polyline from "@mapbox/polyline";

import AppleHealthkit, { HealthValue, HealthKitPermissions, AppleHealthKit } from "react-native-health";

import mapStyling from "./map-styling.json";

import Config from "react-native-config";
import RaceMap from "./RaceMap";

// show a start and finish point
// zoom in so those points are in view

let appleHealthkit: AppleHealthKit | null = AppleHealthkit;

const permissions = {
    permissions: {
        write: [appleHealthkit.Constants.Permissions.StepCount, appleHealthkit.Constants.Permissions.DistanceWalkingRunning],
        read: [appleHealthkit.Constants.Permissions.StepCount, appleHealthkit.Constants.Permissions.DistanceWalkingRunning],
    },
} as HealthKitPermissions;

// appleHealthkit.isAvailable((err, available) => {
//     if (err) {
//         console.log("error initializing Healthkit: ", err);
//         return;
//     }

//     appleHealthkit.initHealthKit(permissions, (error: string) => {
//         if (error) {
//             console.log("[ERROR] Cannot grant permissions!");
//         }
//     });
// });

export default function HomeScreen() {
    const [raceDistance, setRaceDistance] = useState<number>();
    const [walkingDistance, setWalkingDistance] = useState<number>(Math.floor(Math.random() * 72));
    const [stepsCount, setStepsCount] = useState<number>(0);

    const window = Dimensions.get("window");
    const { width, height } = window;

    const userPosition = useMemo(() => {}, [walkingDistance, raceDistance]);

    return (
        <SafeAreaView className="h-full">
            <View className="flex-1 flex-col direct items-center justify-center bg-blue">
                <View className="bg-green-400 p-4 w-full flex-col">
                    <Text className="text-center">Distance: {raceDistance} km</Text>
                    <Text className="text-center">Steps: {stepsCount}</Text>
                    <Text className="text-center">Walking distance: {walkingDistance} km</Text>
                </View>
                <RaceMap origin={"Ystad"} destination={"Haparanda"} userStepsCount={22000} />
            </View>
        </SafeAreaView>
    );
}
