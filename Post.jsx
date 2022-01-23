import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import CommunicationController from './CommunicationController';
import StorageManager from './StorageManager';

class Post extends React.Component {
    isMounted = false;

    state = {
        base64Icon: 'data:image/png;base64,',
        sid: "",
        followingAuthor: false,
    }

    componentDidMount() {
        //this._isMounted = true;
        const sm = new StorageManager();
        let d = this.props.data.item
        this.setState({sid: this.props.sid, followingAuthor: d.followingAuthor});

        sm.getUserPicture(d.author, d.pversion,
            result => {
                //console.log("risultato", result)
                if (result.rows.length > 0) {//se ho una picture aggiornata
                    //console.log("picture: " + queryResult.rows._array[0].value)
                } else {
                    CommunicationController.getUserPicture(this.state.sid, d.author)
                        .then(result => {
                            this.state.base64Icon += result.picture
                            this.setState(this.state)
                        })
                        .catch(error => console.log(error))

                }
            },
            error => console.log("error", error))
    }

    componentWillUnmount() {
        //this._isMounted = false;
    }

    follow = (uid, bool) => {
        if(bool){
            CommunicationController.unfollow(this.state.sid, uid)
            .then(response => {
                //console.log("response " + response)
                this.state.followingAuthor = false;
                this.setState(this.state);
            })
            .catch(error => console.log("errore " + error))
        }else{
            CommunicationController.follow(this.state.sid, uid)
            .then(response => {
                //console.log("response " + response)
                this.state.followingAuthor = true;
                this.setState(this.state);
            })
            .catch(error => console.log("errore " + error))
        }
    }

    render() {
        let d = this.props.data.item
        return (
            <View>
                {
                    <View>
                        <Image style={{ width: 50, height: 50 }} source={{ uri: this.state.base64Icon }} />
                        <Text>Delay: {d.delay}</Text>
                        <Text>Status: {d.status}</Text>
                        <Text>Comments: {d.comment}</Text>
                        <Text>datetime: {d.datetime}</Text>
                        <Text>authorName: {d.authorName}</Text>
                        <Text>pversion: {d.pversion}</Text>
                        <Button title={this.state.followingAuthor ? "Smetti di seguire" : "Segui"} style={this.styles.button}
                            onPress={() => this.follow(d.author, this.state.followingAuthor)}></Button>
                    </View>

                }
            </View>
        )



    }
    styles = StyleSheet.create({
        title: {
            fontSize: 48,
            paddingTop: 20,
        },
        subTitle: {
            fontSize: 20,
            paddingTop: 10,
        },
        button: {
            margin: 10,
        },
        container: {
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",

        }
    });
}

export default Post;