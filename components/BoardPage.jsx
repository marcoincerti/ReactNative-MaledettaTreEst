import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../CommunicationController';
import { MyContext } from '../context.js';
import Post from './Post';

class BoardPage extends React.Component {
    static contextType = MyContext

    state = {
        did: null,
        stations: [],
        postsFromAll: [],
        isFetching: false
    }

    componentDidMount(){
        const sid = this.context.sid
        this.checkDid().then(did => {
            console.log("Bacheca n." + did)
            this.state.did = did
            CommunicationController.getStations(sid, did)
            .then(unmarshelledObject => {
                this.state.stations = unmarshelledObject.stations
                CommunicationController.getPosts(sid, did)
                .then(unmarshelledObject => this.handlePosts(unmarshelledObject.posts))
            })
            .catch(error => {
                console.log(error)
                alert("Errore di Comunicazione, controlla la tua connessione o riprova tra qualche minuto")
            })
        })
        //hooks che permette di eseguire delle azioni quando l'activity ritorna in focus
        this.props.navigation.addListener('focus', () => this.refreshPosts(sid, this.state.did))

    }

    render() { 
        const sid = this.context.sid

        if(this.state.did != null && this.state.stations.length!=0){
        return <View style={styles.container}>
            <View style={styles.infoStyle}>
                <View style={styles.infoDirectionStyle}>
                    <Text style={{textAlign:'left', flex:1, marginLeft:6}}>Partenza</Text>
                    <Text style={{textAlign:'right', flex:1, marginRight:6}}>Arrivo</Text>
                </View>
                <View style={styles.infoDirectionStyle}>
                    <Text style={[styles.directionStyle, {textAlign:'left'}]}>{this.state.stations[0].sname}</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.switchButtonStyle}
                        onPress={() => this.switchDirection()}
                        >
                        <Image
                            source={require('../assets/icon-switch.png')}
                            style={styles.imgButtonSwitch}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.directionStyle, {textAlign:'right'}]}>{this.state.stations[this.state.stations.length-1].sname}</Text>
                </View>
                <TouchableOpacity
                 activeOpacity={0.7}
                 style={styles.detailBtnStyle}
                 onPress={() => this.handleDetailClick()}>
                     <Text style={styles.detailBtnTextStyle}>Dettagli Tratta</Text>
                 </TouchableOpacity>
            </View>

            <Text style={styles.infoListStyle}>Post</Text>
            {this.state.postsFromAll.length > 0 ?
            (<View style={styles.postListStyle}>
                <FlatList
                    data={this.state.postsFromAll}
                    renderItem={(item) => {return (<Post data={item} refreshBoard={() => this.refreshPosts(sid, this.state.did)}/>)}}
                    keyExtractor={item => item.datetime}
                    refreshing = {this.state.isFetching}
                    onRefresh={() => this.refreshPosts(sid, this.state.did)}
                />
            </View>)
            :
            <Text style={styles.infoText}>Nessun Post...</Text>}

            <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.touchableStyle}
                        onPress={() => this.handleCreatePost()}
                        >
                        <Image
                            source={require('../assets/icon-add.png')}
                            style={styles.floatingButtonStyle}
                        />
            </TouchableOpacity>
        </View>;
        }
        else
            return <View style={styles.container}>
                 <ActivityIndicator size="large" color="#656CEE" style={styles.activityIndicator}/>
            </View>
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

    switchDirection = () => {
        AsyncStorage.getItem("inverseDid")
        .then(inverseDid => {
            AsyncStorage.setItem("inverseDid", this.state.did)
            .then(AsyncStorage.setItem("did", inverseDid))
            .then(this.componentDidMount())
            .catch(error => console.log(error))
        })
    }

    handleCreatePost = () => {
        this.props.navigation.navigate("CreatePost", {did: this.state.did,
             departure: this.state.stations[0].sname, arrival:this.state.stations[this.state.stations.length-1].sname})
    }

    handleDetailClick = () => {
        this.props.navigation.navigate("Map", {did: this.state.did, stations: this.state.stations})
    }

    refreshPosts = (sid, did) => {
        console.log("Refresh Board " + did)
        if(sid != null && did != null){
            CommunicationController.getPosts(sid, did)
            .then(unmarshelledObject => {
                this.handlePosts(unmarshelledObject.posts)
            })
        }
    }

    handlePosts = (postsList) => {
        this.state.postsFromAll = []
        for(const post of postsList){
            this.state.postsFromAll.push(post)
        }
        this.setState(this.state)
    }

    handleProfileClick = () => {
        this.props.navigation.navigate("Profile")
    }

}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#f2f4f7'
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    infoStyle: {
        // flex:1,
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 2,
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 18,
            margin: 8,
    },
    infoDirectionStyle: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    directionStyle:{
        flex:1,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        alignSelf: 'center',
        color: '#333E63',
        marginLeft: 6,
        marginRight: 6
    },
    detailBtnStyle:{
        marginLeft: 10,
        marginRight:10,
        marginTop:20,
        width: "80%",
        height: 40,
        justifyContent: 'center',
        elevation: 1,
        backgroundColor: '#F8A059',
        borderRadius: 30,
    },
    detailBtnTextStyle:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400'
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
        width: 70,
        height: 70,
      },
      postListStyle:{
          flex:4,
          marginLeft: 12,
          marginRight: 12
      },
      infoListStyle:{
          fontSize: 24,
          marginTop: 0,
          marginLeft: 16,
          fontWeight: 'bold',
          color:'#333E63',
      },
      infoText:{
          marginLeft: 20,
          fontSize: 16,
          color: 'grey'
      },
      switchButtonStyle:{
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
      },
      imgButtonSwitch:{
        resizeMode: 'contain',
        width: 35,
        height: 35,
      },
      activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
     }
  });
 
export default BoardPage;