'use client';

import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
    title, 
    handlePress, 
    containerStyle, 
    textStyle,
    isLoading
    }) => {
    return(
        <TouchableOpacity 
            activeOpacity={0.4}
            onPress={handlePress}
            className={`bg-primary-text rounded-xl min-h-[55px]
            min-w-[285px] items-center justify-center ${containerStyle}`}>
            <Text className={`text-3xl text-primary-back font-pbold ${textStyle}`}>{title}</Text>
            {isLoading && (
            <ActivityIndicator
                animating={isLoading}
                color="#fff"
                size="small"
                className="ml-2"
            />
        )}
        </TouchableOpacity>
    );
};

export default CustomButton;