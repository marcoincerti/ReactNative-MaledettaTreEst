import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, Alert, StyleSheet, SafeAreaView, ActivityIndicator, Image, View, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../CommunicationController';
import StorageManager from '../StorageManager';
import UserWriter from '../UserWriter';



class Profilo extends React.Component {

    state = {
        jsonData: null,
        sid: "",
        base64Icon: 'data:image/png;base64,',
        userWriterVisible: false,
    }

    showAlert = () => {
        Alert.alert(
            'Non hai una connesione internet!'
        );
    }

    showUserWriter = () => {
        this.state.userWriterVisible = !this.state.userWriterVisible;
        !this.state.userWriterVisible ? this.getData() : null;
        this.setState(this.state);
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('sid')
            if (value !== null) {
                this.setState({ sid: value });
                this.setState({ jsonData:null});
                CommunicationController.getProfile(this.state.sid)
                    .then(response => {
                        this.setState({ jsonData: response });

                        const sm = new StorageManager();
                        sm.getUserPicture(this.state.jsonData.uid, this.state.jsonData.pversion,
                            result => {
                                //console.log("risultato", result)
                                if (result.rows.length > 0) {//se ho una picture aggiornata
                                    //console.log("picture: " + queryResult.rows._array[0].value)
                                } else {
                                    CommunicationController.getUserPicture(this.state.sid, this.state.jsonData.uid)
                                        .then(result => {
                                            this.state.base64Icon += result.picture;
                                            console.log(this.state.base64Icon);
                                            this.setState(this.state);
                                        })
                                        .catch(error => console.log(error))
                                }
                            },
                            error => console.log("error", error));
                    })
                    .catch(error => {
                        console.log(error);
                        this.showAlert();
                    });
            }
        } catch (e) {
            console.log(e);
            // error reading value
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        if (!this.state.userWriterVisible && this.state.jsonData != null) {
            if(this.state.jsonData.picture){
                return (
                    <SafeAreaView>
                            <Image style={{ width: 150, height: 150 }} source={{ uri: this.state.base64Icon }} />
    
                            <Text>Il tuo nickname: {this.state.jsonData.name}</Text>
                            <Text>Il tuo uid: {this.state.jsonData.uid}</Text>
                            <Button title="Cambia" onPress={() => this.showUserWriter()}></Button>
                        <StatusBar styles="auto" />
                    </SafeAreaView>
                )
            }else{
                return (
                    <SafeAreaView>
                        <View >
                            <Image style={{ width: 150, height: 150 }} source={require('../assets/icon.png')} />
    
                            <Text>Il tuo nickname: {this.state.jsonData.name}</Text>
                            <Text>Il tuo uid: {this.state.jsonData.uid}</Text>
                            <Button title="Cambia" onPress={() => this.showUserWriter()}></Button>
                        </View>
                        <StatusBar styles="auto" />
                    </SafeAreaView>
                )
            }
        } else if (this.state.userWriterVisible) {
            console.log(this.state.jsonData);
            return <SafeAreaView>
                    <UserWriter sid={this.state.sid} name={this.state.jsonData.name} picture={this.state.jsonData.picture}/>
                    <Button title="Torna indietro" onPress={() => this.showUserWriter()}></Button>
            </SafeAreaView>
        } else {
            return <View style={[this.styles.container, this.styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        }
    }

    styles = StyleSheet.create({
        title: {
            fontSize: 36,
            paddingTop: 20,
        },
        subTitle: {
            fontSize: 20,
            paddingTop: 10,
        },
        button: {
            backgroundColor: "#DDDDDD",
            padding: 10,
            width: 400
        },
        container: {
            flex: 1,
            justifyContent: "center"
        },
        horizontal: {
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10
        },
        padding: {
            padding: 20
        }

    });
}

export default Profilo;