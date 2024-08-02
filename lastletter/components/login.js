import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import MaskInput from 'react-native-mask-input';

//pegar dimensão da tela
const { width, height } = Dimensions.get('screen');

const users = [
    {
        username: 'pessoa1',
        pass: '123',
    },
];

export default function Login({ navigation }) {
    const [username, setUsername] = React.useState('');
    const [pass, setPass] = React.useState('');

    const validaUsuario = () => {
        const acharUsuario = users.find((user) => user.username === username && user.pass === pass);
        if (acharUsuario) {
            navigation.navigate('LastLetter', { name: 'Última Letra' });
        } else {
            alert('Usuário ou senha inválidos');
        }
    };

    return (
        <ImageBackground source={require('../assets/bg.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Formulário de cadastro</Text>
                <View style={styles.form}>
                    <MaskInput
                        style={styles.textInput}
                        onChangeText={(masked, unmasked) => setUsername(masked)}
                        value={username}
                        placeholder="Digite seu usuário"
                    />
                    <MaskInput
                        mask={() => [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                        style={styles.textInput}
                        onChangeText={(masked, unmasked) => setPass(masked)}
                        value={pass}
                        placeholder="Digite sua senha"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={validaUsuario}>
                        <Text style={styles.loginText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 209, 235, 0.5)', // Fundo semitransparente para combinar com a imagem de fundo
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold', // Adiciona a mesma propriedade de fonte
        marginBottom: 16,
        color: '#FF69B4', // Rosa escuro
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 1,
    },
    form: {
        width: '100%',
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    textInput: {
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ffe8b7', // Amarelo ouro
        fontSize: 18,
        backgroundColor: '#ffe8b7', // Amarelo claro
    },
    loginButton: {
        backgroundColor: '#ff6347', // Tom mais quente (coral)
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    loginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold', // Adiciona a mesma propriedade de fonte
    },
});
