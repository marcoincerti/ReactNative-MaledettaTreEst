import React from 'react';
import { StyleSheet, SafeAreaView, TextInput, Alert, Button, StatusBar, View, Text } from 'react-native';
import CommunicationController from './CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';


class PostWriter extends React.Component {
    _isMounted = false;
    state = {
        delay: "0",
        status: "0",
        comment: "",
        errorStatus: true,
        errorMessage: "* Devi indicare almeno uno dei tre campi.",
        almostOne: false,
        sid: "",
        textButton: "Pubblica",
        caricamento: false,
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('sid');
            this.state.sid = value;
            this.setState(this.state)
        } catch (e) {
            console.log(e);
            // error reading value
        }
    }

    showAlertInternet = () => {
        Alert.alert(
          'Non hai una connesione internet!'
        )
      }

    setDelay = (value) => {
        this.state.delay = value

    }
    setStatus = (value) => {
        this.state.status = value
    }
    setComment = (value) => {
        this.state.comment = value
    }

    
    updateProfile = () => {
        this.setState({ errorStatus: true, caricamento: true });
        this.setState(this.state)
        CommunicationController.addPost(this.state.sid, this.props.did, this.state.delay, this.state.status, this.state.comment)
            .then(() => {
                this.setState({ errorStatus: true, textButton: "FATTO", caricamento: false });
                this.showAlert();
            }).catch(error => {
                console.log(error);
                this.showAlertInternet();
              });
    }

    componentDidMount() {
        this._isMounted = true;

        this.getData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onEnterText = (text) => {
        var bool = this.state.almostOne;
        if (text.length != 0) {
            this.setState({ almostOne: true });
            bool = true;
        } else {
            bool = false;
            this.setState({ almostOne: false });
        }
        if (bool && (text == "0" || text == "1" || text == "2" || text == "3")) {
            this.setState({ errorMessage: "", errorStatus: false, delay: text });
        } else {
            this.setState({ errorMessage: "* Puoi mettere solo i valori 0,1,2,3", errorStatus: true });
        }
    }

    onEnterTextStatus = (text) => {
        var bool = this.state.almostOne;
        if (text.length != 0) {
            this.setState({ almostOne: true });
            bool = true;
        } else {
            bool = false;
            this.setState({ almostOne: false });
        }
        if (bool && (text == "0" || text == "1" || text == "2")) {
            this.setState({ errorMessage: "", errorStatus: false, status: text });
        } else {
            this.setState({ errorMessage: "* Puoi mettere solo i valori 0,1,2", errorStatus: true });
        }
    }

    onEnterTextComment = (text) => {
        var bool = this.state.almostOne;
        if (text.length != 0) {
            this.setState({ almostOne: true });
            bool = true;
        } else {
            bool = false;
            this.setState({ almostOne: false });
        }
        if (bool) {
            this.setState({ errorMessage: "", errorStatus: false, comment: text });
        } else {
            this.setState({ errorMessage: "* Puoi mettere solo i valori 0,1,2", errorStatus: true });
        }
    }

    showAlert = () => {
        Alert.alert(
            'Hai pubblicato il tuo post'
        )
    }

    render() {
        return (
            <SafeAreaView>
                <TextInput
                    style={this.styles.input}
                    onChangeText={val => this.setDelay(val)}
                    placeholder="Ritardo"
                    keyboardType="numeric"
                    clearButtonMode="while-editing"
                    onChangeText={text => this.onEnterText(text)}
                    underlineColorAndroid="transparent"
                />

                <TextInput
                    style={this.styles.input}
                    onChangeText={val => this.setStatus(val)}
                    placeholder="Stato"
                    keyboardType="numeric"
                    clearButtonMode="while-editing"
                    onChangeText={text => this.onEnterTextStatus(text)}
                    underlineColorAndroid="transparent"

                />
                <TextInput
                    style={this.styles.input}
                    onChangeText={val => this.setComment(val)}
                    placeholder="Commento"
                    clearButtonMode="while-editing"
                    underlineColorAndroid="transparent"
                />
                {this.state.errorStatus == true ? (
                    <Text style={this.styles.errorMessage}>
                        {this.state.errorMessage}
                    </Text>
                ) : null}

                <Button title={this.state.textButton} onPress={() => this.updateProfile()}
                    disabled={this.state.errorStatus ? true : false}></Button>

                {this.state.caricamento == true ? (
                    <Text style={this.styles.errorMessage}>
                        Sto caricando il tuo profilo
                    </Text>
                ) : null}

                <StatusBar style="auto"></StatusBar>
            </SafeAreaView>


        )


    }
    styles = StyleSheet.create({
        subTitle: {
            fontSize: 20,
            paddingTop: 10,
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



export default PostWriter;