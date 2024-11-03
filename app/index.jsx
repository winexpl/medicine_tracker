import { Text, View, ScrollView, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { images } from "@/constants/images"

NativeWindStyleSheet.setOutput({
    web: 'css',
    default: 'native'
})

export default function App() {

    return (
        <SafeAreaView className="bg-primary-back items-center">
            <ScrollView>
                <View style={styles.view}>
                    <Text className="text-3xl text-primary-text">Hisssdsadasd</Text>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        className="w-[130px] h-[84px] items-center justify-center"
                        resizeMode="contain"
                    />
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: "primary-back",
      justifyContent: 'center',
      alignItems: 'center',
      color: ''
    },
    text: {
      color: 'primary-text',
    },
  });