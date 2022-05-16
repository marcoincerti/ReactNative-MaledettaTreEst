import React, { Component } from 'react';
import { StatusBar, Button, Text, View, StyleSheet, TouchableOpacity, Image, TextInput} from 'react-native';
import * as Location from 'expo-location';
import MapView, {Polyline} from 'react-native-maps';
import CommunicationController from '../CommunicationController';
import { MyContext } from '../context.js';


class MapPage extends React.Component {
    static contextType = MyContext

    state = {
        sid : this.context.sid,
        location : null,
        stations : [],
        lookLocation: null
    }

    componentDidMount(){
        const { did, stations } = this.props.route.params;
        this.state.stations = stations
        this.state.lookLocation = {latitude: parseFloat(stations[0].lat), longitude: parseFloat(stations[0].lon) }
        this.setState(this.state)
        this.locationPermissionAsync();
    }

    render() { 
        const stationsCord = this.state.stations.map((station, index) => 
                        ({latitude: parseFloat(station.lat), longitude: parseFloat(station.lon) }))
        let distanceStations
        if(this.state.location != null) // se ancora non abbiamo la posizione, non calcoliamo le distanze
            distanceStations = stationsCord.map((station, index) => ({station: station, distance: this.computeDistance(station.latitude, station.longitude)})).sort((s1, s2) => s1.distance - s2.distance) // stazioni ordinate per distanza dall'utente
        
        if(stationsCord.length != 0){
        return <View style={styles.container}>
            <View style={styles.mapWrapper}>
                <MapView style={styles.map}
                 onRegionChange={this.handleRegionChanged}
                initialRegion={{
                    latitude: 45.4847,
                    longitude: 9.236,
                    latitudeDelta: 1,
                    longitudeDelta: 1
                }}
                region={{
                    latitude: this.state.lookLocation.latitude,
                    longitude: this.state.lookLocation.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                }}
                >

                {this.state.location != null && (
                <MapView.Marker 
                    coordinate={{latitude: this.state.location.latitude, longitude: this.state.location.longitude}}
                    title = {"Tu"}
                    description = "La tua posizione"
                    image = {require('../assets/user.png')}
                />)}

                {
                    this.state.stations.map((station, index) => (
                    <MapView.Marker
                    key = {index}
                    coordinate={{latitude: parseFloat(station.lat), longitude: parseFloat(station.lon)}}
                    title={station.sname}
                    description = {(distanceStations!=undefined && this.isSameStation(station,distanceStations[0].station)) ? "La stazione più vicina" : "Stazione"}
                    image = {(distanceStations!=undefined && this.isSameStation(station,distanceStations[0].station)) ? require('../assets/near.png') :  undefined} //mostro con un marker diverso la stazione più vicina all'utente
                    />  ))
                }
                <Polyline coordinates={stationsCord}
                strokeColor="#000"
                strokeColors={[
                    '#7F0000',
                    '#00000000',
                    '#B24112',
                    '#E5845C',
                    '#238C23',
                    '#7F0000'
                ]}
		        strokeWidth={6}
                lineDashPattern={[0]} // altrimenti non funziona su android!!!!
                />
                </MapView>    
            </View>

            {this.state.location != null && (
            <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.touchableStyle}
                        onPress={() => this.centerUser()}
                        >
                        <Image
                            source={require('../assets/icon-user-pos.png')}
                            style={styles.floatingButtonStyle}
                        />
            </TouchableOpacity>
            )}
        </View>;
        }
        else return <View><Text>Loading...</Text></View>
    }

    centerUser(){
        this.state.lookLocation = this.state.location
        this.setState(this.state)
    }

    handleRegionChanged(region) {
        // console.log(region);   
    }

    isSameStation(s1, s2){
        return s1.lat == s2.latitude && s1.lon == s2.longitude
    }

    async locationPermissionAsync() {
        let canUseLocation = false;
        const grantedPermission = await Location.getForegroundPermissionsAsync()
        if (grantedPermission.status === "granted") {
            canUseLocation = true;
        }
        else {
            const permissionResponse = await Location.requestForegroundPermissionsAsync()
            if (permissionResponse.status === "granted") {  
                canUseLocation = true;   
            } 
        }  
        if (canUseLocation) {
            const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest})
            console.log("latitude: " + location.coords.latitude + " , longitude: " + location.coords.longitude)
            this.state.location = location.coords;
            this.setState(this.state)
        }
    }

    //computa al distanza con la formula di Haversine
    computeDistance(lat, long) {
        const prevLatInRad = this.toRad(parseFloat(this.state.location.latitude));
        const prevLongInRad = this.toRad(parseFloat(this.state.location.longitude));
        const latInRad = this.toRad(lat);
        const longInRad = this.toRad(long);
      
        return (
          // In kilometers
          6377.830272 *
          Math.acos(
            Math.sin(prevLatInRad) * Math.sin(latInRad) +
              Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
          )
        );
      }
      
    toRad(angle) {
        return (angle * Math.PI) / 180;
    }
 
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    mapWrapper: {
        flex: 3,
    },
    map:{
        ...StyleSheet.absoluteFillObject
    },
    touchableStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 40,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
          width: 1.5,
          height: 1.5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 30,
     },
     floatingButtonStyle: {
        resizeMode: 'contain',
        width: 36,
        height: 36,
      },
  });
 
export default MapPage;