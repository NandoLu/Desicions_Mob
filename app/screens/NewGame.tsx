import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../index'; // Certifique-se de ajustar o caminho conforme necessário
import styles from './NewGame.styles';

interface Country {
  leaders: string[];
  year: number;
  pib: string;
  population: string;
  ideology: string;
}

interface Countries {
  [key: string]: Country;
}

const countries: Countries = {
  Brasil: {
    leaders: ['Líder 1', 'Líder 2', 'Líder 3'],
    year: 1935,
    pib: '100 bilhões',
    population: '40 milhões',
    ideology: 'Capitalismo',
  },
  Rússia: {
    leaders: ['Líder A', 'Líder B', 'Líder C'],
    year: 1935,
    pib: '150 bilhões',
    population: '60 milhões',
    ideology: 'Comunismo',
  },
};

interface LeaderImages {
  [key: string]: any;
}

const leaderImages: LeaderImages = {
  'Líder 1': require('../../assets/img/img.png'),
  'Líder 2': require('../../assets/img/img.png'),
  'Líder 3': require('../../assets/img/img.png'),
  'Líder A': require('../../assets/img/img.png'),
  'Líder B': require('../../assets/img/img.png'),
  'Líder C': require('../../assets/img/img.png'),
};

type NewGameNavigationProp = StackNavigationProp<RootStackParamList, 'NewGame'>;

const NewGame = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);
  const navigation = useNavigation<NewGameNavigationProp>();

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country);
    setSelectedLeader(null);
  };

  const handleLeaderChange = (leader: string | null) => {
    setSelectedLeader(leader);
  };

  const handleStartGame = async () => {
    if (selectedCountry && selectedLeader) {
      const scenario = {
        country: selectedCountry,
        leader: selectedLeader,
        details: countries[selectedCountry],
      };
      await AsyncStorage.setItem('currentScenario', JSON.stringify(scenario));
      // Navegar para a tela do jogo sem permitir voltar para a tela de "Novo Jogo"
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Main' },
            { name: 'GameMain' },
          ],
        })
      );
    }
  };

  const leaders = selectedCountry ? countries[selectedCountry].leaders : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Jogo</Text>
      <Picker
        selectedValue={selectedCountry}
        style={styles.picker}
        onValueChange={(itemValue) => handleCountryChange(itemValue)}
      >
        {Object.keys(countries).map((country) => (
          <Picker.Item label={country} value={country} key={country} />
        ))}
      </Picker>
      {selectedCountry && (
        <>
          <Image source={require('../../assets/img/img.png')} style={styles.flagImage} />
          <Text style={styles.info}>Ano: {countries[selectedCountry].year}</Text>
          <Text style={styles.info}>PIB: {countries[selectedCountry].pib}</Text>
          <Text style={styles.info}>População: {countries[selectedCountry].population}</Text>
          <Text style={styles.info}>Ideologia: {countries[selectedCountry].ideology}</Text>
          <Picker
            selectedValue={selectedLeader}
            style={styles.picker}
            onValueChange={(itemValue) => handleLeaderChange(itemValue)}
          >
            {leaders.map((leader) => (
              <Picker.Item label={leader} value={leader} key={leader} />
            ))}
          </Picker>
          {selectedLeader && (
            <Image source={leaderImages[selectedLeader]} style={styles.portraitImage} />
          )}
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !selectedLeader && styles.buttonDisabled]}
          disabled={!selectedLeader}
          onPress={handleStartGame}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewGame;