import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, Keyboard } from 'react-native';

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
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
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
    if (!isGameActive) return '#FFFFFF';
    return currentPlayer === 1 ? '#FFDDC1' : '#C1E1FF';
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Jogo de Cadeia de Palavras</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#666',
  },
  timer: {
    fontSize: 16,
    marginBottom: 16,
    color: '#999',
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  wordList: {
    marginTop: 16,
    width: '80%',
  },
  word: {
    fontSize: 16,
    padding: 4,
    color: '#444',
  },
  winnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});

export default LastLetter;
