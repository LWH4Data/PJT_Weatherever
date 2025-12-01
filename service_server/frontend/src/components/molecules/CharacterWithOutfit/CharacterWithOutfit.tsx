import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, AnimatedCharacter } from '../../atoms';

interface CharacterWithOutfitProps {
  width?: number | string;
  height?: number | string;
  message?: string;
}

const CharacterWithOutfit: React.FC<CharacterWithOutfitProps> = ({
  width = "100%",
  height = "100%",
  message,
}) => {
  console.log('🎭 CharacterWithOutfit rendering - Step 3: Testing video playback');
  
  return (
    <View style={styles.container}>
      <View style={[styles.characterContainer, { width, height }]}>
        <AnimatedCharacter width={width} height={height} />
      </View>
      
      {/* {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  characterContainer: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    maxWidth: 250,
  },
  message: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});

export default CharacterWithOutfit;
