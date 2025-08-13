import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../sbClient';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { v5 as uuidv5 } from 'uuid';

const ADMIN_ID = '17974600-c80a-48dd-b8de-4f4529013409';

// Función consistente para generar UUIDs
const firebaseToUUID = (firebaseId) => {
  const namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341'; // Namespace fijo
  return uuidv5(firebaseId, namespace);
};

const ChatScreen = () => {
  const [userUID, setUserUID] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async (uid) => {
    setLoading(true);
    try {
      const convertedUID = firebaseToUUID(uid);
      console.log(`Fetching messages for ${convertedUID} with admin ${ADMIN_ID}`);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${convertedUID},receiver_id.eq.${convertedUID}`)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      console.log('Mensajes cargados:', data);
      
      // Filtrar solo mensajes entre este usuario y el admin
      const filteredMessages = data.filter(msg => 
        (msg.sender_id === convertedUID && msg.receiver_id === ADMIN_ID) ||
        (msg.sender_id === ADMIN_ID && msg.receiver_id === convertedUID)
      );
      
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      Alert.alert('Error', 'No se pudieron cargar los mensajes');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = (uid) => {
    const convertedUID = firebaseToUUID(uid);
    console.log('Configurando suscripción para UID:', convertedUID);

    // Limpia cualquier suscripción existente
    supabase.removeAllChannels();

    const channel = supabase
      .channel(`chat:${convertedUID}:${ADMIN_ID}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${convertedUID},receiver_id.eq.${ADMIN_ID}),and(sender_id.eq.${ADMIN_ID},receiver_id.eq.${convertedUID})`
        },
        (payload) => {
          console.log('Cambio recibido:', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return channel;
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Usuario autenticado:', user.uid);
        setUserUID(user.uid);
      } else {
        Alert.alert('Error', 'Usuario no autenticado');
      }
    });

    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!userUID) return;

      let channel;
      const initChat = async () => {
        await fetchMessages(userUID);
        channel = setupRealtime(userUID);
      };
      
      initChat();

      return () => {
        console.log('Limpiando suscripción');
        if (channel) supabase.removeChannel(channel);
      };
    }, [userUID])
  );

  const sendMessage = async () => {
    if (!text.trim() || !userUID) return;

    try {
      setLoading(true);
      const convertedUID = firebaseToUUID(userUID);
      console.log("Enviando mensaje como:", convertedUID);

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: convertedUID,
          receiver_id: ADMIN_ID,
          message: text,
          sent_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      console.log('Mensaje enviado:', data);
      setText('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender_id === firebaseToUUID(userUID) ? styles.sentContainer : styles.receivedContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender_id === firebaseToUUID(userUID) ? styles.sentBubble : styles.receivedBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender_id === firebaseToUUID(userUID) ? styles.sentText : styles.receivedText
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.timeText,
          item.sender_id === firebaseToUUID(userUID) ? styles.sentTime : styles.receivedTime
        ]}>
          {new Date(item.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => userUID && fetchMessages(userUID)}
        />
      </View>
      
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#8E8E93"
            multiline
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            onPress={sendMessage} 
            style={[styles.sendButton, text.trim().length > 0 ? styles.activeSendButton : null]}
            disabled={text.trim().length === 0}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F5',
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  messageContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 4,
  },
  sentBubble: {
    backgroundColor: '#5DBB63',
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentText: {
    color: '#FFFFFF',
  },
  receivedText: {
    color: '#333333',
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  sentTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTime: {
    color: '#8E8E93',
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F9F5',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
    color: '#333333',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  activeSendButton: {
    backgroundColor: '#5DBB63',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default ChatScreen;

export const colors = {
  forest: '#495948',
  lime: '#66A649',
  olive: '#547326',
  fern: '#5DBB63',
  clay: '#8C5F37',
  sand: '#F2CDA0',
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  background: '#FFFFFF',
  danger: '#A52019',
};

export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  bold: 'Poppins-Bold',
  light: 'Poppins-Light',
  italic: 'Poppins-Italic',
  thin: 'Poppins-Thin',
  black: 'Poppins-Black',
  semiBold: 'Poppins-SemiBold',
  extraBold: 'Poppins-ExtraBold',
};