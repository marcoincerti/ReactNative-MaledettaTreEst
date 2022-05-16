import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState, createContext, useContext } from 'react';
import { MyContext } from '../context.js';
import CommunicationController from '../CommunicationController';
import Row from './Row';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Separator = () => (
    <View style={styles.separator} />
);

class LinesPage extends React.Component {
    static contextType = MyContext

    state = {
        lines:[]
    }

    componentDidMount(){
        // se ho già scelto un did in precedenza mi riporta alla corrispettiva bacheca
        this.checkDid().then(did => {
            if(did != -1)
                this.props.navigation.navigate("Board")
        })
        
        const sid = this.context.sid
        CommunicationController.getLines(sid)
        .then(unmarshelledObject => {
            this.state.lines = unmarshelledObject["lines"]
            this.setState(this.state)
        })
        .catch(error => {
            console.log("ERRORE " + error)
            alert("Errore di Comunicazione, controlla la tua connessione o riprova tra qualche minuto")
        })
    }

    render() {
        if(this.state.lines.length != 0) {
        return <View style={styles.container}>
        <Text style={styles.titleLine}>Scegli una Direzione</Text>
            <View style={styles.listLines}>
                <FlatList
                    data={this.state.lines}
                    renderItem={(item) => {return (<Row data={item} handleLineClick={this.handleLineClick}/>)}}
                    keyExtractor={item => item["terminus1"]["sname"] + " - " + item["terminus2"]["sname"]}
                />
            </View>
        </View>
        }
        else
            return <ActivityIndicator size="large" color="#656CEE" style={styles.activityIndicator} />
    }

    handleLineClick = (direction, inverseDirection) => {
        // console.log(nameLine + " : " + direction)
        AsyncStorage.setItem("did", direction.did.toString());
        AsyncStorage.setItem("inverseDid", inverseDirection.did.toString());
        this.props.navigation.navigate("Board")
    }

    handleProfileClick = () => {
        this.props.navigation.navigate("Profile")
    }

    async checkDid() {
        const did = await AsyncStorage.getItem("did")
        if (did) {    
            console.log("Ho già il DID: " + did)
            return did
        }
        else
          return -1
      }
}


const styles = StyleSheet.create({
    container: {
      backgroundColor: "#f2f4f7",
      flex: 1,
      justifyContent: 'space-evenly',
    },
    listLines:{
        flex:4,
        fontSize: 10,
        color: "black",
        backgroundColor: "#f2f4f7",
        justifyContent: "center",
        alignItems: "center",
    },
    titleLine:{
        fontSize: 25,
        flex:0.5,
        marginTop: 20,
        marginLeft: 20,
        fontWeight:'500',
        color: '#333E63'
    },
    singleLine:{
        flex: 1
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
     }
  });

export default LinesPage;