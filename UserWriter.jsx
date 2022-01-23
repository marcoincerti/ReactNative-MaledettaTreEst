import React from 'react';
import { StyleSheet, SafeAreaView, TextInput, Alert, Button, StatusBar, Text, Image } from 'react-native';
import CommunicationController from './CommunicationController';
import * as ImagePicker from 'expo-image-picker';


class UserWriter extends React.Component {
    state = {
        errorStatus: true,
        errorMessage: "* Devi modificare almeno uno dei campi.",
        almostOne: false,
        sid: "",
        name: "",
        picture: null,
        textButton: "Salva",
        base64Icon: 'data:image/png;base64,',
        caricamento: false,
    }

    openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0,
        });

        if (pickerResult.cancelled === true) {
            return;
        }
        

        if (pickerResult.height == pickerResult.width) {
            this.state.base64Icon += pickerResult.base64;
            this.setState({ picture: pickerResult.base64, base64: this.state.base64Icon });
        } else {
            Alert.alert(
                'Devi caricare una immagine quadrata.'
            )
        }
    }


    getData = async () => {
        this.state.base64Icon += this.props.picture;
        this.setState({ sid: this.props.sid, name: this.props.name, picture: this.props.picture, base64Icon: this.state.base64Icon});
    }

    showAlertInternet = () => {
        Alert.alert(
            'Non hai una connesione internet!'
        )
    }

    setName = (value) => {
        this.state.name = value
    }


    updateUser = () => {
        this.setState({ errorStatus: true, caricamento: true });
        this.setState(this.state)
        console.log(this.state.sid)
        CommunicationController.setProfile(this.state.sid, this.state.name, this.state.picture)
            .then(() => {
                this.setState({ errorStatus: false, textButton: "Salva", caricamento: false });
                this.showAlert();
            }).catch(error => {
                console.log(error);
                this.showAlertInternet();
            });
    }

    onEnterText = (text) => {
        if (text.length != 0) {
            this.setState({ almostOne: true });
            this.setState({ errorMessage: "", errorStatus: false, name: text });
        } else {
            this.setState({ errorMessage: "", errorStatus: false, name: text });
            this.setState({ errorMessage: "* Devi modificare almeno uno dei campi, non puoi lasciare il nome vuoto", errorStatus: true });
            this.setState({ almostOne: false });
        }
    }

    showAlert = () => {
        Alert.alert(
            'Hai modificato il tuo profilo!'
        )
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <SafeAreaView>
                <Text style={this.styles.subTitle}>Cambia la tua foto:</Text>

                {this.state.picture ? (
                    <Image style={{ width: 150, height: 150, margin: 16 }} source={{ uri: this.state.base64Icon }} />
                ) : (
                    <Image style={{ width: 150, height: 150, margin: 16 }} source={require('./assets/icon.png')} />
                )}
                <Button title="Carica foto" onPress={() => this.openImagePickerAsync()}></Button>

                <Text style={this.styles.subTitle}>Inserisci il nuovo nome:</Text>
                <TextInput
                    style={this.styles.input}
                    onChangeText={val => this.setName(val)}
                    placeholder={this.state.name}
                    clearButtonMode="while-editing"
                    onChangeText={text => this.onEnterText(text)}
                    underlineColorAndroid="transparent"
                />

                <Button title={this.state.textButton} onPress={() => this.updateUser()}></Button>

                <StatusBar style="auto"></StatusBar>
            </SafeAreaView>
        )
    }

    styles = StyleSheet.create({
        subTitle: {
            fontSize: 20,
            marginTop: 40,
            marginLeft: 10,
        },
        button: {
            alignItems: "center",
            backgroundColor: "#DDDDDD",
            padding: 10,
            width: 400
        },
        container: {
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",

        },
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        },
        errorMessage: {
            fontSize: 12,
            color: "red",
            marginLeft: 8,
            paddingTop: 10,
            paddingBottom: 10,
        },
    });
}

export default UserWriter;