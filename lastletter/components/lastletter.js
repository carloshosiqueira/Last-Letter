import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, Keyboard, Modal, TouchableOpacity, Image, ImageBackground } from 'react-native';

const INITIAL_TIME = 12;
const DECREMENT_TIME = 1;
const MINIMUM_TIME = 5;

const LastLetter = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [words, setWords] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isGameActive, setIsGameActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('rgb(255,233,143)');
  const [modalVisible, setModalVisible] = useState(true); // Estado para controlar a visibilidade do modal
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isGameActive && timeLeft === 0) {
      handleTimeout();
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isGameActive]);

  useEffect(() => {
    setBackgroundColor(getBackgroundColor());
  }, [currentPlayer, isGameActive]);

  const handleTimeout = () => {
    const winningPlayer = currentPlayer === 1 ? 2 : 1;
    Alert.alert(`Tempo esgotado! Jogador ${winningPlayer} venceu!`);
    setWinner(winningPlayer);
    stopGame();
  };

  const stopGame = () => {
    setIsGameActive(false);
  };

  const startGame = () => {
    resetGame();
    setIsGameActive(true);
    setWinner(null);
  };

  const resetGame = () => {
    setCurrentWord('');
    setWords([]);
    setCurrentPlayer(1);
    setTimeLeft(INITIAL_TIME);
  };

  const handleWordSubmit = () => {
    if (words.includes(currentWord.toLowerCase())) {
      const winningPlayer = currentPlayer === 1 ? 2 : 1;
      Alert.alert('Palavra já enviada! Jogador ' + winningPlayer + ' venceu!');
      setWinner(winningPlayer);
      stopGame();
      return;
    }

    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      if (lastWord[lastWord.length - 1].toLowerCase() !== currentWord[0].toLowerCase()) {
        const winningPlayer = currentPlayer === 1 ? 2 : 1;
        Alert.alert('Palavra inválida! Jogador ' + winningPlayer + ' venceu!');
        setWinner(winningPlayer);
        stopGame();
        return;
      }
    }

    setWords([...words, currentWord.toLowerCase()]);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setCurrentWord('');
    setTimeLeft(Math.max(INITIAL_TIME - words.length * DECREMENT_TIME, MINIMUM_TIME));
    Keyboard.dismiss();
    inputRef.current.focus();
  };

  const getBackgroundColor = () => {
    if (!isGameActive) return 'rgb(255,233,143)';
    return currentPlayer === 1 ? '#ff8ab7' : '#ff9829';
  };

  return (
    
      <View style={[styles.container, { backgroundColor }]}>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Regras do Jogo</Text>
              <Text style={styles.modalText}>
                1. Cada jogador deve digitar uma palavra que comece com a última letra da palavra anterior.
              </Text>
              <Text style={styles.modalText}>
                2. Não é permitido repetir palavras.
              </Text>
              <Text style={styles.modalText}>
                3. O tempo para cada jogada é limitado. Se o tempo acabar, o outro jogador vence.
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Image source={require('../assets/name.png')} style={styles.name} />
        {isGameActive ? (
          <>
            <Text style={styles.subtitle}>Vez do Jogador {currentPlayer}</Text>
            <Text style={styles.timer}>Tempo restante: {timeLeft}s</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite uma palavra"
              value={currentWord}
              onChangeText={setCurrentWord}
              onSubmitEditing={handleWordSubmit}
              editable={isGameActive}
              ref={inputRef}
            />
            <Button title="Enviar" onPress={handleWordSubmit} />
            <FlatList
              data={words}
              renderItem={({ item }) => <Text style={styles.word}>{item}</Text>}
              keyExtractor={(item, index) => index.toString()}
              style={styles.wordList}
            />
          </>
        ) : (
          winner !== null ? (
            <View style={styles.winnerContainer}>
              <Text style={styles.winnerText}>Jogador {winner} venceu!</Text>
              <Button title="Reiniciar Jogo" onPress={startGame} />
            </View>
          ) : (
            <Button title="Iniciar Jogo" onPress={startGame} />
          )
        )}
      </View>
    
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    marginBottom: 25,
    marginTop: 20,
    height: 38,
    width: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF69B4',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#503b0e',
  },
  timer: {
    fontSize: 16,
    marginBottom: 16,
    color: '#503b0e',
  },
  input: {
    height: 40,
    borderColor: '#FF69B4',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '80%',
    backgroundColor: '#ffe8b7',
    borderRadius: 8,
  },
  wordList: {
    marginTop: 16,
    width: '80%',
  },
  word: {
    fontSize: 16,
    padding: 4,
    color: 'black',
  },
  winnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#d64e86',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#FF69B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LastLetter;
