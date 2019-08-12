import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import logo from '../../assets/logo.png';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import itsamatch from '../../assets/itsamatch.png';

import {
  Container,
  Logo,
  CardContainer,
  Card,
  Avatar,
  FooterCard,
  Name,
  Bio,
  ButtonsContainer,
  Button,
  Empty,
  MatchContainer,
  MatchAvatar,
  MatchName,
  MatchBio,
  MatchButton,
  MatchButtonText,
} from './styles';

export default function Main({ navigation }) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = io('http://192.168.0.102:3333', {
      query: { user: id },
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id },
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id },
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <Container>
      <TouchableOpacity onPress={handleLogout}>
        <Logo source={logo} />
      </TouchableOpacity>

      <CardContainer>
        {users.length === 0 ? (
          <Empty>Acabou :(</Empty>
        ) : (
          users.map((user, index) => (
            <Card key={user._id} style={{ zIndex: users.length - index }}>
              <Avatar
                source={{
                  uri: user.avatar,
                }}
              />
              <FooterCard>
                <Name>{user.name}</Name>
                <Bio numberOfLines={3}>{user.bio}</Bio>
              </FooterCard>
            </Card>
          ))
        )}
      </CardContainer>

      {users.length > 0 && (
        <ButtonsContainer>
          <Button style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </Button>
          <Button style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </Button>
        </ButtonsContainer>
      )}

      {matchDev && (
        <MatchContainer style={styles.matchContainer}>
          <Image style={styles.matchImage} source={itsamatch} />

          <MatchAvatar
            source={{
              uri: matchDev.avatar,
            }}
          />
          <MatchName>{matchDev.name}</MatchName>
          <MatchBio>{matchDev.bio}</MatchBio>

          <MatchButton onPress={() => setMatchDev(null)}>
            <MatchButtonText>FECHAR</MatchButtonText>
          </MatchButton>
        </MatchContainer>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },
});
