import { useTgAuth } from "@/features/auth/hooks/useTgAuth";
import { View, Text } from "react-native";



export default function TgAuthScreen(){
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js?59';
    script.async = true;

    return(
      <View>
        <Text>{(window as any).Telegram?.WebApp}</Text>
      </View>
    )
}

