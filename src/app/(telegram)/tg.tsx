import { useTgAuth } from "@/features/auth/hooks/useTgAuth";
import { View, Text } from "react-native";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from '@/shared/constants/theme';

export default function TgAuthScreen(){
    const {tgInitialized, tgUser, isTgEnvironment} = useTgAuth()

    if (!tgInitialized && isTgEnvironment) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            size='large'
            color='#3390ec'
          />
          <Text style={styles.loadingText}>Подключение к Tg...</Text>
        </View>
      );
    }

    const tg = (window as any).Telegram?.WebApp

    return(
      <View>
        <Text>Start tg</Text>
        <Text>{tg.initDataUnsafe}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  maxButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 24,
    backgroundColor: Colors.background,
    borderRadius: 16,
    maxWidth: 300,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.red,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  altButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  altButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
