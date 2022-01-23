import React from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CommunicationController from '../CommunicationController';

class Mappa extends React.Component {

    state = {
        sid: "",
        location: null,
        station: null,
    }

    showAlert = () => {
        Alert.alert(
            'Non hai una connesione internet!'
        )
    }

    componentDidMount() {
        this.state.sid = this.props.route.params.sid;
        this.state.did = this.props.route.params.direction.did;
        this.setState(this.state);

        this.locationPermissionAsync();

        //console.log(this.state.sid, this.state.did);
        CommunicationController.getStations(this.state.sid, this.state.did)
            .then(response => {
                this.state.station = response.stations;
                this.setState(this.state);
                //console.log(this.state.station);
            })
            .catch(error => {
                console.log(error);
                this.showAlert();
            });
    }

    async locationPermissionAsync() {
        let canUseLocation = false;
        const grantedPermission = await Location.getForegroundPermissionsAsync()
        if (grantedPermission.status === "granted") {
            canUseLocation = true;
        } else {
            const permissionResponse = await Location.requestForegroundPermissionsAsync()
            if (permissionResponse.status === "granted") {
                canUseLocation = true;
            }
        }
        console.log(canUseLocation);
        if (canUseLocation) {
            const location = await Location.getCurrentPositionAsync()
            //console.log("received location:", location);
            this.state.location = location;
            this.setState(this.state);
        }
    }


    render() {
        if (this.state.location == null || this.state.station == null) {
            return <View style={[this.styles.container, this.styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        } else {
            return (
                <View style={this.styles.container}>
                    <MapView style={this.styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            latitudeDelta: 0.122,
                            longitudeDelta: 0.121,
                        }}
                        showUserLocation={true}
                        showsMyLocationButton={true}>

                        {this.state.station.map((marker, index) => {
                            return (
                                <Marker
                                key={index}
                                coordinate={{
                                    latitude: Number(marker.lat),
                                    longitude: Number(marker.lon),
                                  }}
                                  title = {marker.sname}
                                />
                            );
                        })}
                    </MapView>
                </View>
            )
        }
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },

    });
}

export default Mappa;