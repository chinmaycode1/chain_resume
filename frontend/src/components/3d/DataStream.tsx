import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface StreamData {
  position: [number, number, number];
  chars: string[];
  yOffset: number;
  frameCount: number;
}

export const DataStream = () => {
  const streamsRef = useRef<StreamData[]>([]);

  // Stream positions (circle around card)
  const streamPositions: [number, number, number][] = useMemo(
    () => [
      [-4, 2, -1],
      [4, 2, -1],
      [-3, -2, -1],
      [3, -2, -1],
      [-5, 0, -2],
      [5, 0, -2],
      [0, 3, -2],
      [0, -3, -2],
    ],
    []
  );

  // Initialize streams
  if (streamsRef.current.length === 0) {
    streamsRef.current = streamPositions.map((pos) => ({
      position: pos,
      chars: Array.from({ length: 8 }, () =>
        Math.random().toString(16).substring(2, 3).toUpperCase()
      ),
      yOffset: 0,
      frameCount: 0,
    }));
  }

  useFrame(() => {
    streamsRef.current.forEach((stream) => {
      // Move down
      stream.yOffset -= 0.02;

      // Reset to top when below threshold
      if (stream.yOffset < -3) {
        stream.yOffset = 0;
      }

      // Change random char every 20 frames
      stream.frameCount++;
      if (stream.frameCount >= 20) {
        const randomIndex = Math.floor(Math.random() * stream.chars.length);
        stream.chars[randomIndex] = Math.random().toString(16).substring(2, 3).toUpperCase();
        stream.frameCount = 0;
      }
    });
  });

  return (
    <group>
      {streamsRef.current.map((stream, streamIndex) => (
        <group key={streamIndex} position={stream.position}>
          {stream.chars.map((char, charIndex) => (
            <Text
              key={`${streamIndex}-${charIndex}`}
              position={[0, stream.yOffset - charIndex * 0.3, 0]}
              fontSize={0.15}
              color="#00FF94"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.4}
            >
              {char}
            </Text>
          ))}
        </group>
      ))}
    </group>
  );
};
