import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import CommunicationController from '../CommunicationController';
import { MyContext } from '../context.js';
import StorageManager from '../StorageManager';
import * as ImagePicker from 'expo-image-picker';


const Separator = () => (
    <View style={styles.separator} />
  );

class ProfilePage extends React.Component {
    static contextType = MyContext

    state = {
        sid : this.context.sid,
        username: "",
        pic: "",
        placeholderPic: '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'
    }

    componentDidMount(){
        CommunicationController.getProfile(this.state.sid)
        .then(unmarshelledObject => {
            // console.log(unmarshelledObject)
            this.state.username = unmarshelledObject.name
            this.state.pic = unmarshelledObject.picture
            let sm = new StorageManager()
            sm.storeUserPicture(unmarshelledObject.uid, unmarshelledObject.pversion, unmarshelledObject.picture,
                result => {console.log("Pic di " + unmarshelledObject.uid + " aggiornata")},
                error => {console.log(error)}
            )
            this.setState(this.state)
        })
        .catch(error => {
            console.log(error)
            alert("Errore di Comunicazione, controlla la tua connessione o riprova tra qualche minuto")
        })
    }

    render() { 
        return <View style={styles.container}>
            <Image style={styles.imgStyle} source={{uri:'data:image/png;base64,' + (this.state.pic==null ? this.state.placeholderPic : this.state.pic)}}/>
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.btnActions, styles.btnChangePicStyle]}
                onPress={this.openImagePickerAsync}>
                    <Text style={styles.btnActionsText}>{"Cambia Foto"}</Text>
                </TouchableOpacity>
            <Separator/>
            <Text style={styles.infoText}>Username:</Text>
            <TextInput style={styles.input} onChangeText={this.onChangeName} placeholder={this.state.username}></TextInput>
            <View style={styles.btnContainerRow}>
                <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.btnActions, styles.btnCancel]}
                onPress={()=>this.props.navigation.goBack()}>
                    <Text style={styles.btnActionsText}>{"Annulla"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.btnActions, styles.btnSave]}
                onPress={()=>this.saveProfile()}>
                    <Text style={styles.btnActionsText}>{"Salva"}</Text>
                </TouchableOpacity>
            </View>
        </View>;
    }

    onChangeName = (value) => {
        if(value.length > 20)
            alert("Nome più piccolo di 20 caratteri, pls")
        else {
            this.state.username = value;
        }
    }

    openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true});
        if(pickerResult.cancelled === true)
            return
        else {
            //TODO controllare che sia rettangolare e la size (attr.b width e height dell'oggetto pickResult)
            if(pickerResult.width != pickerResult.height){
                alert("Caricare immagini quadrate !")
                return
            }
            if(pickerResult.base64.length >= 137000){
                alert("Caricare immagini con grandezza inferiore a 100KB !")
                return
            }
            this.state.pic = pickerResult.base64
            this.setState(this.state)
        }
      }
    
      saveProfile(){
          CommunicationController.setProfile(this.state.sid, this.state.username, this.state.pic)
          .then(unmarshelledObject => {
              console.log("Profilo Salvato")
              this.props.navigation.goBack()
            })
          .catch(error => console.log(error))
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f4f7",
        alignItems:'center',
        justifyContent: 'space-between'
      },
    separator: {
        flex: 0.10,
        marginVertical: 10,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    imgStyle:{
        flex:0.6,
        width: "50%",
        resizeMode: 'contain',
        borderWidth:5,
        borderColor: '#F8A059',
        marginTop: 10
    },
    btnChangePicStyle:{
       flex:0.15,
       width:200
    },
    infoText:{
        fontSize: 20,
        color: '#333E63'
    },
    input: {
        flex:0.10,
        width: "50%",
        marginLeft: 4,
        marginRight:4,
        marginTop:6,
        borderWidth:0.6,
        padding: 10,
        borderRadius: 30,
        fontSize: 16,
    },
    btnContainerRow:{
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btnActions:{
        flex:1,
        marginLeft: 30,
        marginRight:30,
        marginTop:20,
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#F8A059',
        borderRadius: 20,
    },
    btnActionsText:{
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '400',
    },
    btnCancel:{
        backgroundColor: '#a6b0bf'
    },
    btnSave:{
        backgroundColor: '#737aff'
    }
})
 
export default ProfilePage;