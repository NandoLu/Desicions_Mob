// GameMain.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatsModal from './modals/StatsModal';
import AdviceModal from './modals/AdviceModal';
import { initializeGameState, advanceTurn } from './logic/GameLogic';
import styles from './GameMain.styles';

interface Scenario {
  country: string;
  leader: string;
  details: {
    year: number;
    pib: string;
    population: string;
    ideology: string;
  };
}

const GameMain = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isAdviceModalVisible, setIsAdviceModalVisible] = useState(false);
  const [gameState, setGameState] = useState(() => initializeGameState(new Date().getFullYear()));

  useEffect(() => {
    const fetchScenario = async () => {
      const savedScenario = await AsyncStorage.getItem('currentScenario');
      if (savedScenario) {
        const parsedScenario = JSON.parse(savedScenario);
        setScenario(parsedScenario);
        setGameState(initializeGameState(parsedScenario.details.year));
      }
    };

    fetchScenario();
  }, []);

  const handleAdvanceTurn = async () => {
    const newGameState = advanceTurn(gameState);
    setGameState(newGameState);
    await AsyncStorage.setItem('currentScenario', JSON.stringify({ ...scenario, gameState: newGameState }));
  };

  if (!scenario) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/img/img.png')} style={styles.flagImage} />
        <View style={styles.headerText}>
          <Text style={styles.countryText}>{scenario.country}</Text>
          <Text style={styles.infoText}>PIB: {scenario.details.pib}</Text>
        </View>
        <Image source={require('../../assets/img/img.png')} style={styles.leaderImage} />
      </View>
      <View style={styles.infoBar}>
        <Text> {gameState.currentMonth} / {gameState.currentYear}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => setIsStatsModalVisible(true)}>
          <Image source={require('../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
        <View style={styles.footerButtonStatic}>
          <Image source={require('../../assets/img/img.png')} style={styles.footerButtonImage} />
        </View>
        <TouchableOpacity style={styles.footerButton} onPress={() => setIsAdviceModalVisible(true)}>
          <Image source={require('../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleAdvanceTurn}>
          <Text >Avançar</Text>
        </TouchableOpacity>
      </View>
      <StatsModal
        visible={isStatsModalVisible}
        onClose={() => setIsStatsModalVisible(false)}
        country={scenario.country}
        pib={scenario.details.pib}
      />
      <AdviceModal
        visible={isAdviceModalVisible}
        onClose={() => setIsAdviceModalVisible(false)}
      />
    </View>
  );
};

export default GameMain;
